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
// VIDEO THUMBNAIL
// =======================
export const generateVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    video.preload = 'metadata'
    video.muted = true
    video.src = URL.createObjectURL(file)

    video.onloadeddata = () => {
      video.currentTime = 1
    }

    video.onseeked = () => {
      canvas.width = 300
      canvas.height = (video.videoHeight / video.videoWidth) * 300

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(video.src)
          resolve(blob)
        },
        'image/jpeg',
        0.7
      )
    }

    video.onerror = reject
  })
}
