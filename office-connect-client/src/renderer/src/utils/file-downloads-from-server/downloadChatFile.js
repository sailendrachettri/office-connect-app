import { DOWNLOAD_FILES_URL } from "../../api/routes_urls";

export const downloadChatFile = (fileId) => {
  const url = `${DOWNLOAD_FILES_URL}/${fileId}`;

  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener"; // security
  document.body.appendChild(link);
  // link.click();
  document.body.removeChild(link);
};
