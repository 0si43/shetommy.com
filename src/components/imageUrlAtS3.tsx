import path from 'path'

const bucketName = 'shetommy.com-blog-images'
const hostName = 's3.us-west-1.amazonaws.com'

/// AWS S3に保存した画像のURLを返す
const imageUrlAtS3 = (keyName: string, temporaryUrl: string) => {
  if (!keyName || !temporaryUrl) {
    return ''
  }

  let extension = path.extname(temporaryUrl).split('?')[0]
  // upload時に.jpegとして保存されるため、Notionへのアップロードの拡張子が.jpgだとアクセスできなくなる
  if (extension === '.jpg') {
    extension = '.jpeg'
  }

  return 'https://' + hostName + '/' + bucketName + '/' + keyName + extension
}

export default imageUrlAtS3
