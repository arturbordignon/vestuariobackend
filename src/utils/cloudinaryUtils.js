function extractPublicIdFromImageUrl(url) {
  const parts = url.split("/");
  const fileNameWithExtension = parts.pop();
  const fileName = fileNameWithExtension.split(".")[0];
  const folderPath = parts.pop();
  return `${folderPath}/${fileName}`;
}

module.exports = { extractPublicIdFromImageUrl };
