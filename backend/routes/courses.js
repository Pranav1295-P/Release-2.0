import express from 'express'
import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'
import CourseComment from '../models/CourseComment.js'
import { requireAuth, requireGold, optionalAuth } from '../middleware/auth.js'
import { getUploadSignature, deleteFromCloudinary } from '../utils/cloudinary.js'
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  razorpayConfigured,
  RAZORPAY_KEY_ID,
} from '../utils/razorpay.js'

const router = express.Router()

const isGold = (u) => Boolean(u && (u.isAdmin || u.verifiedType === 'gold'))

/** Does this user have access to a course's paid content? */
async function hasAccess(user, course) {
  if (!course.price || course.price === 0) return true // free course
  if (isGold(user)) return true // creators always have access
  if (!user) return false
  const e = await Enrollment.findOne({
    user: user._id,
    course: course._id,
    status: 'paid',
  })
  return Boolean(e)
}

/** Strip lecture video/notes URLs unless the viewer has access. */
function shapeCourse(courseDoc, access) {
  const c = courseDoc.toObject ? courseDoc.toObject() : courseDoc
  c.locked = !access
  c.lectures = (c.lectures || []).map((l) => {
    if (access) return l
    // Locked preview — keep meta, hide the actual content.
    return {
      _id: l._id,
      title: l.title,
      description: l.description,
      order: l.order,
      hasVideo: Boolean(l.videoUrl),
      hasNotes: Boolean(l.notesUrl),
      locked: true,
    }
  })
  return c
}

/* ───────────── Cloudinary upload signature (gold only) ─────────────
 * POST /api/courses/upload-signature  Body: { folder? }
 * The browser uses this to upload video/PDF/banner directly to Cloudinary.
 */
router.post('/upload-signature', requireAuth, requireGold, (req, res) => {
  const folder = (req.body?.folder || 'courses').toString()
  res.json(getUploadSignature({ folder }))
})

/* ───────────────────────── LIST (public) ──────────────────────────── */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username verifiedType')
      .lean()
    // For the list we only need meta — never lecture content.
    const shaped = courses.map((c) => ({
      _id: c._id,
      title: c.title,
      description: c.description,
      bannerUrl: c.bannerUrl,
      price: c.price,
      lectureCount: (c.lectures || []).length,
      createdBy: c.createdBy,
      createdAt: c.createdAt,
    }))
    res.json(shaped)
  } catch (err) {
    next(err)
  }
})

/* ─────────────────────── SINGLE COURSE (public) ────────────────────── */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'createdBy',
      'username verifiedType'
    )
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const access = await hasAccess(req.user, course)
    const shaped = shapeCourse(course, access)
    shaped.canManage = isGold(req.user)
    res.json(shaped)
  } catch (err) {
    if (err?.name === 'CastError')
      return res.status(404).json({ message: 'Course not found' })
    next(err)
  }
})

/* ───────────────────── CREATE COURSE (gold only) ───────────────────── */
router.post('/', requireAuth, requireGold, async (req, res, next) => {
  try {
    const { title, description, price, bannerUrl, bannerPublicId } = req.body
    if (!title?.trim()) return res.status(400).json({ message: 'Title required.' })

    const course = await Course.create({
      title: String(title).trim(),
      description: description ? String(description) : '',
      price: Math.max(0, parseInt(price, 10) || 0), // paise
      bannerUrl: bannerUrl || undefined,
      bannerPublicId: bannerPublicId || undefined,
      createdBy: req.user._id,
    })
    await course.populate('createdBy', 'username verifiedType')
    res.status(201).json(course)
  } catch (err) {
    next(err)
  }
})

/* ───────────────────── UPDATE COURSE (gold only) ───────────────────── */
router.put('/:id', requireAuth, requireGold, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const { title, description, price, bannerUrl, bannerPublicId } = req.body
    if (title !== undefined) course.title = String(title).trim()
    if (description !== undefined) course.description = String(description)
    if (price !== undefined) course.price = Math.max(0, parseInt(price, 10) || 0)
    if (bannerUrl !== undefined) {
      // delete the old banner if it's being replaced
      if (course.bannerPublicId && course.bannerPublicId !== bannerPublicId) {
        await deleteFromCloudinary(course.bannerPublicId, 'image')
      }
      course.bannerUrl = bannerUrl
      course.bannerPublicId = bannerPublicId
    }
    await course.save()
    await course.populate('createdBy', 'username verifiedType')
    res.json(course)
  } catch (err) {
    next(err)
  }
})

/* ───────────────────── DELETE COURSE (gold only) ───────────────────── */
router.delete('/:id', requireAuth, requireGold, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    // Clean up Cloudinary assets
    if (course.bannerPublicId) await deleteFromCloudinary(course.bannerPublicId, 'image')
    for (const l of course.lectures || []) {
      if (l.videoPublicId) await deleteFromCloudinary(l.videoPublicId, 'video')
      if (l.notesPublicId) await deleteFromCloudinary(l.notesPublicId, 'raw')
    }
    await CourseComment.deleteMany({ course: course._id })
    await Enrollment.deleteMany({ course: course._id })
    await course.deleteOne()
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

/* ───────────────────── ADD LECTURE (gold only) ─────────────────────── */
router.post('/:id/lectures', requireAuth, requireGold, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const { title, description, videoUrl, videoPublicId, notesUrl, notesPublicId } = req.body
    if (!title?.trim()) return res.status(400).json({ message: 'Lecture title required.' })

    course.lectures.push({
      title: String(title).trim(),
      description: description ? String(description) : '',
      videoUrl: videoUrl || undefined,
      videoPublicId: videoPublicId || undefined,
      notesUrl: notesUrl || undefined,
      notesPublicId: notesPublicId || undefined,
      order: course.lectures.length,
    })
    await course.save()
    await course.populate('createdBy', 'username verifiedType')
    res.status(201).json(course)
  } catch (err) {
    next(err)
  }
})

/* ─────────────────── DELETE LECTURE (gold only) ────────────────────── */
router.delete('/:id/lectures/:lectureId', requireAuth, requireGold, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const lecture = course.lectures.id(req.params.lectureId)
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' })

    if (lecture.videoPublicId) await deleteFromCloudinary(lecture.videoPublicId, 'video')
    if (lecture.notesPublicId) await deleteFromCloudinary(lecture.notesPublicId, 'raw')
    lecture.deleteOne()
    await course.save()
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

/* ─────────────────────────── COMMENTS ──────────────────────────────── */
router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await CourseComment.find({ course: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username verifiedType verifiedUntil')
      .lean()
    res.json(comments)
  } catch (err) {
    if (err?.name === 'CastError') return res.json([])
    next(err)
  }
})

router.post('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    const { body, lectureId } = req.body
    if (!body?.trim()) return res.status(400).json({ message: 'Comment body required.' })
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const comment = await CourseComment.create({
      course: course._id,
      lectureId: lectureId || null,
      author: req.user._id,
      body: String(body).trim(),
    })
    await comment.populate('author', 'username verifiedType verifiedUntil')
    res.status(201).json(comment)
  } catch (err) {
    next(err)
  }
})

/* ─────────────────── ENROLL — create Razorpay order ────────────────── */
router.post('/:id/enroll/create-order', requireAuth, async (req, res, next) => {
  try {
    if (!razorpayConfigured) {
      return res.status(503).json({ message: 'Payments are not configured yet.' })
    }
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })
    if (!course.price || course.price === 0) {
      return res.status(400).json({ message: 'This course is free.' })
    }
    if (await hasAccess(req.user, course)) {
      return res.status(400).json({ message: 'You already have access to this course.' })
    }

    const order = await createRazorpayOrder({
      amount: course.price,
      receipt: `course_${course._id}_${Date.now()}`.slice(0, 40),
      notes: { courseId: String(course._id), userId: String(req.user._id) },
    })

    await Enrollment.create({
      user: req.user._id,
      course: course._id,
      razorpayOrderId: order.id,
      amount: course.price,
      status: 'created',
    })

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      courseTitle: course.title,
    })
  } catch (err) {
    next(err)
  }
})

/* ─────────────────── ENROLL — verify payment ───────────────────────── */
router.post('/:id/enroll/verify', requireAuth, async (req, res, next) => {
  try {
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = req.body
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: 'Missing payment details.' })
    }
    if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
      return res.status(400).json({ message: 'Payment verification failed.' })
    }

    const enrollment = await Enrollment.findOne({
      razorpayOrderId: orderId,
      user: req.user._id,
      course: req.params.id,
    })
    if (!enrollment) return res.status(404).json({ message: 'Order not found.' })

    if (enrollment.status !== 'paid') {
      enrollment.status = 'paid'
      enrollment.razorpayPaymentId = paymentId
      await enrollment.save()
    }

    res.json({ ok: true, enrolled: true })
  } catch (err) {
    next(err)
  }
})

export default router
