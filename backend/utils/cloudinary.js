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

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer  - raw file bytes
 * @param {'image'|'video'} kind
 * @returns {Promise<{type, url, publicId, width, height}>}
 */
export function uploadToCloudinary(buffer, kind) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: kind === 'video' ? 'video' : 'image',
        folder: 'free-conversations',
      },
      (err, result) => {
        if (err) return reject(err)
        resolve({
          type: kind,
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        })
      }
    )
    stream.end(buffer)
  })
}

/** Delete a media item from Cloudinary by its public id. */
export async function deleteFromCloudinary(publicId, kind) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: kind === 'video' ? 'video' : 'image',
    })
  } catch (err) {
    // Non-fatal — log and continue (the DB record is what matters most)
    console.error('Cloudinary delete failed:', err?.message)
  }
}
