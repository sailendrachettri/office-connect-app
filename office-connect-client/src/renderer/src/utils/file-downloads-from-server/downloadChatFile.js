import { axiosPrivate } from '../../api/api'
import { DOWNLOAD_FILES_URL } from '../../api/routes_urls'

export const downloadChatFile = async (fileId, fileName = 'file') => {
  const res = await axiosPrivate.get(`${DOWNLOAD_FILES_URL}/${fileId}`, {
    responseType: 'blob',
    onDownloadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log(`Downloading: ${percent}%`)
    }
  })

  const blob = new Blob([res.data], {
    type: res.headers['content-type']
  })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
