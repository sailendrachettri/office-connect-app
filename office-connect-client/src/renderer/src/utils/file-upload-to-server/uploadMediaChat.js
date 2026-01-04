import { axiosPrivate } from "../../api/api"
import { FILE_MESSAGES_URL } from "../../api/routes_urls"
import { generateImageThumbnail, generateVideoThumbnail } from "./chatThumbnail"

export const uploadMediaChat = async (file, text, selectedFriendProfileId) => {
  try {
    const formData = new FormData()

    // =========================
    // 1️⃣ ORIGINAL FILE
    // =========================
    formData.append('file', file)
    formData.append('receiverId', selectedFriendProfileId)
    formData.append('caption', text || '')

    // =========================
    // 2️⃣ THUMBNAIL (FRONTEND)
    // =========================
    let thumbnailBlob = null

    if (file.type.startsWith('image/')) {
      thumbnailBlob = await generateImageThumbnail(file)
    }

    if (file.type.startsWith('video/')) {
      thumbnailBlob = await generateVideoThumbnail(file)
    }

    if (thumbnailBlob) {
      const thumbFile = new File(
        [thumbnailBlob],
        'thumbnail.jpg',
        { type: 'image/jpeg' }
      )

      formData.append('thumbnail', thumbFile)
    }
    // =========================
    // 3️⃣ UPLOAD
    // =========================
    const res = await axiosPrivate.post(
      FILE_MESSAGES_URL,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    return res
  } catch (error) {
    console.error("❌ not able to upload chat media", error)
    return 'error'
  }
}
