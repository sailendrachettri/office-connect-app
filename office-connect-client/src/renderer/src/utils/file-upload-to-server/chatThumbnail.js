// =======================
// IMAGE THUMBNAIL
// =======================
export const generateImageThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const MAX_WIDTH = 300
      const scale = MAX_WIDTH / img.width

      canvas.width = MAX_WIDTH
      canvas.height = img.height * scale

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          resolve(blob)
        },
        'image/jpeg',
        0.7
      )
    }

    img.onerror = reject
    img.src = url
  })
}
// =======================
// VIDEO THUMBNAIL (FIXED)
// =======================
export const generateVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const blobUrl = URL.createObjectURL(file)
    video.src = blobUrl

    // 1️⃣ Wait for metadata (duration, size)
    video.onloadedmetadata = () => {
      // Seek safely (handle short videos)
      const seekTime = Math.min(1, video.duration / 2)
      video.currentTime = seekTime
    }

    // 2️⃣ Draw frame after seek
    video.onseeked = () => {
      const width = 300
      const scale = video.videoHeight / video.videoWidth

      canvas.width = width
      canvas.height = width * scale

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(blobUrl)
          resolve(blob)
        },
        'image/jpeg',
        0.75
      )
    }

    video.onerror = (e) => {
      URL.revokeObjectURL(blobUrl)
      reject(e)
    }
  })
}

