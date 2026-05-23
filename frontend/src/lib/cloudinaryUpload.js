import { api } from './api'

/**
 * Upload a file straight from the browser to Cloudinary using a signature
 * the backend generates. The file never touches our Render server — which is
 * what lets large videos work on the free tier.
 *
 * @param {File} file
 * @param {'video'|'image'|'raw'} resourceType
 * @param {(pct:number)=>void} [onProgress]
 * @returns {Promise<{url:string, publicId:string, bytes:number, duration?:number}>}
 */
export async function uploadToCloudinary(file, resourceType, onProgress) {
  // 1. Ask our backend (gold-only) for a signed set of params.
  const { data: sig } = await api.post('/courses/upload-signature', {
    folder: 'courses',
  })

  // 2. POST the file directly to Cloudinary.
  const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`
  const form = new FormData()
  form.append('file', file)
  form.append('api_key', sig.apiKey)
  form.append('timestamp', sig.timestamp)
  form.append('folder', sig.folder)
  form.append('signature', sig.signature)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', endpoint)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const r = JSON.parse(xhr.responseText)
        resolve({
          url: r.secure_url,
          publicId: r.public_id,
          bytes: r.bytes,
          duration: r.duration,
        })
      } else {
        let msg = 'Upload failed.'
        try {
          msg = JSON.parse(xhr.responseText)?.error?.message || msg
        } catch {}
        reject(new Error(msg))
      }
    }
    xhr.onerror = () => reject(new Error('Network error during upload.'))
    xhr.send(form)
  })
}
