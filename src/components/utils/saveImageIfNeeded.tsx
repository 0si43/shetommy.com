import fs from 'fs'
import sizeOf from 'image-size'
import type { ExtendNotionBlock } from '../Notion'

export const imagesPath = 'public/blogImages'

export type ImageInfo = { width: number; height: number; extension: string }
export type ImageSizeMap = Record<string, ImageInfo>

/// Notion内の画像は一時ファイル扱いなので、ブロックの画像をpublic/blogImagesに保存する
const saveImageIfNeeded = async (blocksWithChildren: ExtendNotionBlock[]): Promise<ImageSizeMap> => {
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath)
  }

  const imageSizeMap: ImageSizeMap = {}

  await Promise.all(
    blocksWithChildren.map(async (block) => {
      const size = await checkBlock(block)
      if (size) {
        imageSizeMap[block.id] = size
      }
      if (block.has_children) {
        await Promise.all(
          (block.children ?? []).map(async (childBlock) => {
            const childSize = await checkBlock(childBlock)
            if (childSize) {
              imageSizeMap[childBlock.id] = childSize
            }
          })
        )
      }
    })
  )

  return imageSizeMap
}

const checkBlock = async (block: ExtendNotionBlock): Promise<ImageInfo | null> => {
  if (block.type === 'image' && block.image.type == 'file') {
    const blob = await getTemporaryImage(block.image.file.url)

    if (!blob) {
      return null
    }

    const extension = blob.type.replace('image/', '')

    if (!isImageExist(block.id, extension)) {
      const binary = (await blob.arrayBuffer()) as Uint8Array
      const buffer = Buffer.from(binary)
      await saveImage(buffer, block.id, extension)
    }

    const imagePath = `${imagesPath}/${block.id}.${extension}`
    const dimensions = sizeOf(fs.readFileSync(imagePath))
    if (dimensions.width && dimensions.height) {
      return { width: dimensions.width, height: dimensions.height, extension }
    }
  }
  return null
}

/// 一時ファイルの画像をバイナリとして取得する。ここで画像のフォーマットがわかる
const getTemporaryImage = async (url: string) => {
  try {
    const blob = await fetch(url).then((r) => r.blob())
    return blob
  } catch (error) {
    console.log(error)
    return null
  }
}

const isImageExist = (keyName: string, extension: string) => {
  return fs.existsSync(`${imagesPath}/${keyName}.${extension}`)
}

const saveImage = (imageBinary: Uint8Array, keyName: string, extension: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${imagesPath}/${keyName}.${extension}`, imageBinary, (error) => {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

export default saveImageIfNeeded
