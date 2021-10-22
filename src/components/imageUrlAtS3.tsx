import path from 'path'

const bucketName = 'shetommy.com-blog-images'
const hostName = 's3.us-west-1.amazonaws.com'

/// AWS S3に保存した画像のURLを返す
const imageUrlAtS3 = (keyName: string, temporaryUrl: string) => {
  if (!keyName || !temporaryUrl) {
    return ''
  }

  return (
    'https://' +
    hostName +
    '/' +
    bucketName +
    '/' +
    keyName +
    path.extname(temporaryUrl).split('?')[0]
  )
}

export default imageUrlAtS3
