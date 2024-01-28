function fileSizeLimiter(allowedSize) {
  return (req, res, next) => {
    const files = req.files
    const fileOverLimit = []
    Object.keys(files).forEach((key) => {
      if (files[key].size > allowedSize) fileOverLimit.push(files[key].name)
    })

    if (fileOverLimit.length > 0) {
      const properVerb = filesOverLimit.length > 1 ? 'are' : 'is'

      const sentence =
        `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(
          ',',
          ', '
        )

      const message =
        filesOverLimit.length < 3
          ? sentence.replace(',', ' and')
          : sentence.replace(/,(?=[^,]*$)/, ' and')

      return res.status(413).json({ status: 'error', message })
    }
    next()
  }
}

module.exports = fileSizeLimiter
