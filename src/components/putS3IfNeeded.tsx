import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3'

const bucketName = 'shetommy.com-blog-images'
const accessKeyId = process.env.AWS_ACCESSKEY ? process.env.AWS_ACCESSKEY : ''
const secretAccessKey = process.env.AWS_SECRETACCESSKEY
  ? process.env.AWS_SECRETACCESSKEY
  : ''
const client = new S3Client({
  region: 'us-west-1',
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
})

let blob: Blob
let extension = ''

/// AWS S3に保存した画像のパスを返す。キーはブロックID。S3上に存在しない場合はアップロードする
const putS3IfNeeded = async (keyName: string, temporaryUrl: string) => {
  if (!keyName || !temporaryUrl) {
    return ''
  }

  const result = await getImageAsBinary(temporaryUrl)
  blob = result.blob
  extension = result.extension

  if (!extension) {
    return ''
  }

  if (!(await isImageExist(keyName))) {
    // URLは静的に決定するので、アップロードの成功は待たない
    return await uploadImage(keyName, temporaryUrl)
  }

  return true
}

/// 一時ファイルの画像をバイナリとして取得する。ここで画像のフォーマットがわかる
const getImageAsBinary = async (temporaryUrl: string) => {
  try {
    blob = await fetch(temporaryUrl).then((r) => r.blob())
    return { blob: blob, extension: blob!.type.replace('image/', '') }
  } catch (error) {
    console.log(error)
    return { blob: new Blob(), extension: '' }
  }
}

/// S3上にブロックIDに対応する画像があるか
const isImageExist = async (keyName: string) => {
  if (!client && !keyName) {
    throw '引数がありません'
  }

  const result = await client.send(
    new ListObjectsCommand({
      Bucket: bucketName,
      Prefix: keyName + '.' + extension,
    })
  )

  return result.Contents?.length ? true : false
}

/// S3上に画像をアップロードする
const uploadImage = async (keyName: string, temporaryUrl: string) => {
  try {
    if (!blob) {
      return false
    }
    const buffer = (await blob.arrayBuffer()) as Uint8Array
    const params = {
      Bucket: bucketName,
      Key: keyName + '.' + extension,
      Body: buffer,
      ACL: 'public-read',
      ContentType: blob.type,
    }
    await client.send(new PutObjectCommand(params))
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export default putS3IfNeeded
