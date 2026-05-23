import { v2 as cloudinary } from 'cloudinary'

/**
 * Cloudinary handles image + video hosting.
 *
 * Env vars needed:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Get these from https://cloudinary.com → Dashboard.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
)

// Map our internal "kind" to Cloudinary's resource_type.
//   image / video → media types
//   raw           → arbitrary files (PDFs, etc.) served as-is
function resourceTypeFor(kind) {
  if (kind === 'video') return 'video'
  if (kind === 'raw' || kind === 'pdf') return 'raw'
  return 'image'
}

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer  - raw file bytes
 * @param {'image'|'video'|'raw'} kind
 * @param {object} [opts]  - { folder, publicId }
 *   For raw files (PDFs), pass a publicId that INCLUDES the extension
 *   (e.g. "reports/ab12.pdf") so the delivered URL ends in .pdf and the
 *   browser renders it inline.
 * @returns {Promise<{type, url, publicId, bytes, width, height}>}
 */
export function uploadToCloudinary(buffer, kind, opts = {}) {
  const resource_type = resourceTypeFor(kind)
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type,
        folder: opts.folder || 'free-conversations',
        ...(opts.publicId ? { public_id: opts.publicId } : {}),
      },
      (err, result) => {
        if (err) return reject(err)
        resolve({
          type: kind,
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        })
      }
    )
    stream.end(buffer)
  })
}

/**
 * Generate a signature so the BROWSER can upload a file directly to
 * Cloudinary (bypassing our server — important for large videos that would
 * otherwise time out / exhaust memory on Render's free tier).
 *
 * The client posts to https://api.cloudinary.com/v1_1/<cloud>/<type>/upload
 * with: file, api_key, timestamp, folder, signature.
 */
export function getUploadSignature({ folder = 'courses' } = {}) {
  const timestamp = Math.round(Date.now() / 1000)
  // Only the params we sign must be sent by the client (besides file + api_key).
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  )
  return {
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  }
}

/** Delete an asset from Cloudinary by its public id. */
export async function deleteFromCloudinary(publicId, kind) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceTypeFor(kind),
    })
  } catch (err) {
    // Non-fatal — log and continue (the DB record is what matters most)
    console.error('Cloudinary delete failed:', err?.message)
  }
}
