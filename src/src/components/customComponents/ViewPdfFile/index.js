const ViewPdfFile = url => {
  if (url !== null && url !== undefined) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
}

export default ViewPdfFile
