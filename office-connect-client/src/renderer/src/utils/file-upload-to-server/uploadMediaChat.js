import { axiosPrivate } from "../../api/api"
import { FILE_MESSAGES_URL } from "../../api/routes_urls"

export const uploadMediaChat = async (file, text, selectedFriendProfileId) => {
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('receiverId', selectedFriendProfileId)
        formData.append('caption', text || '')
    
        const res = await axiosPrivate.post(`${FILE_MESSAGES_URL}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
    
        return res;
    } catch (error) {
        console.error("not able to upload chat media", error);
        return 'error';
    }
  }