const DownloadFile = (urlFile, name, fileType) => {
  const link = document.createElement('a')
  link.download = name.concat('.', fileType)
  link.href = urlFile
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default DownloadFile
