import fs from 'fs'
import sizeOf from 'image-size'
import type { ExtendNotionBlock } from '../Notion'

export const imagesPath = 'public/blogImages'

/// Notion内の画像は一時ファイル扱いなので、ブロックの画像をpublic/blogImagesに保存する
/// 拡張子がjpeg, pngでわかれているとパスの取得時に判定が必要になるので、.pngで統一する
const saveImageIfNeeded = async (blocksWithChildren: ExtendNotionBlock[]): Promise<Record<string, { width: number; height: number }>> => {
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath)
  }

  const imageSizeMap: Record<string, { width: number; height: number }> = {}

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

const checkBlock = async (block: ExtendNotionBlock): Promise<{ width: number; height: number } | null> => {
  if (block.type === 'image' && block.image.type == 'file') {
    const blob = await getTemporaryImage(block.image.file.url)

    if (!blob) {
      return null
    }

    const extension = blob.type.replace('image/', '')

    if (!isImageExist(block.id)) {
      const binary = (await blob.arrayBuffer()) as Uint8Array
      const buffer = Buffer.from(binary)
      await saveImage(buffer, block.id)
    }

    const imagePath = imagesPath + '/' + block.id + '.png'
    const dimensions = sizeOf(fs.readFileSync(imagePath))
    if (dimensions.width && dimensions.height) {
      return { width: dimensions.width, height: dimensions.height }
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

const isImageExist = (keyName: string) => {
  return fs.existsSync(imagesPath + '/' + keyName + '.png')
}

const saveImage = (imageBinary: Uint8Array, keyName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(imagesPath + '/' + keyName + '.png', imageBinary, (error) => {
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
