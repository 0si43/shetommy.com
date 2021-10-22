import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3'

const bucketName = 'shetommy.com-blog-images'

/// AWS S3に保存した画像のパスを返す。キーはブロックID。S3上に存在しない場合はアップロードする
const useS3Resource = async (keyName: string, temporaryUrl: string) => {
  if (!keyName || !temporaryUrl) {
    return ''
  }

  const accessKeyId = process.env.AWS_ACCESSKEY ? process.env.AWS_ACCESSKEY : ''
  const secretAccessKey = process.env.AWS_SECRETACCESSKEY
    ? process.env.AWS_SECRETACCESSKEY
    : ''

  const s3 = new S3Client({
    region: 'us-west-1',
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  })

  console.log(await isImageExist(s3, 'temp.jpeg'))

  //   const hostName = 's3.us-west-1.amazonaws.com'
  //   const url = 'https://' + hostName + '/' + bucketName + '/' + keyName
  //   console.log(url)

  //   const blob = await fetch(url).then((r) => r.blob())
  //   const temp = (await blob.arrayBuffer()) as Uint8Array
  //   const params = {
  //     Bucket: hostName,
  //     Key: 'temp.jpeg',
  //     Body: temp,
  //     ACL: 'public-read',
  //     ContentType: blob.type,
  //   }
  //   await s3.send(new PutObjectCommand(params))
}

const isImageExist = async (client: S3Client, key: string) => {
  if (!client && !key) {
    throw '引数がありません'
  }

  const result = await client.send(
    new ListObjectsCommand({
      Bucket: bucketName,
      Prefix: key,
    })
  )

  return result.Contents?.length ? true : false
}

export default useS3Resource
