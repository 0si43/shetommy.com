import fs from 'fs'
import type { ExtendNotionBlock } from '../Notion'

export const imagesPath = 'public/blogImages'

/// Notion内の画像は一時ファイル扱いなので、ブロックの画像をpublic/blogImagesに保存する
/// 拡張子がjpeg, pngでわかれているとパスの取得時に判定が必要になるので、.pngで統一する
const saveImageIfNeeded = async (blocksWithChildren: ExtendNotionBlock[]) => {
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath)
  }

  blocksWithChildren.forEach(async (block) => {
    checkBlock(block)
    if (block.has_children) {
      block.children?.forEach((block) => checkBlock(block))
    }
  })
}

const checkBlock = async (block: ExtendNotionBlock) => {
  if (block.type === 'image' && block.image.type == 'file') {
    const blob = await getTemporaryImage(block.image.file.url)

    if (!blob) {
      return ''
    }

    const extension = blob.type.replace('image/', '')

    if (!isImageExist(block.id)) {
      const binary = (await blob.arrayBuffer()) as Uint8Array
      const buffer = Buffer.from(binary)
      saveImage(buffer, block.id)
    }
  }
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

const saveImage = (imageBinary: Uint8Array, keyName: string) => {
  fs.writeFile(imagesPath + '/' + keyName + '.png', imageBinary, (error) => {
    if (error) {
      console.log(error)
      throw error
    }
  })
}

export default saveImageIfNeeded
