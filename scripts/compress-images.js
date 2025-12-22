import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 图片目录
const imagesDir = path.join(__dirname, '../public/images')

// 支持的图片格式
const supportedFormats = ['.png', '.jpg', '.jpeg', '.webp']

// 压缩配置
const compressOptions = {
  png: {
    quality: 80,
    compressionLevel: 9,
    adaptiveFiltering: true
  },
  jpg: {
    quality: 80,
    mozjpeg: true
  },
  webp: {
    quality: 80
  }
}

// 递归获取所有图片文件
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList)
    } else {
      const ext = path.extname(file).toLowerCase()
      if (supportedFormats.includes(ext)) {
        fileList.push(filePath)
      }
    }
  })
  
  return fileList
}

// 压缩单个图片
async function compressImage(filePath) {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ 文件不存在: ${path.relative(imagesDir, filePath)}`)
      return
    }
    
    const ext = path.extname(filePath).toLowerCase()
    const stats = fs.statSync(filePath)
    const originalSize = stats.size
    
    // 读取文件内容
    const inputBuffer = fs.readFileSync(filePath)
    
    let compressedBuffer
    
    if (ext === '.png') {
      compressedBuffer = await sharp(inputBuffer)
        .png({
          quality: 80,
          compressionLevel: 9,
          adaptiveFiltering: true
        })
        .toBuffer()
    } else if (ext === '.jpg' || ext === '.jpeg') {
      compressedBuffer = await sharp(inputBuffer)
        .jpeg({
          quality: 80,
          mozjpeg: true
        })
        .toBuffer()
    } else if (ext === '.webp') {
      compressedBuffer = await sharp(inputBuffer)
        .webp({
          quality: 80
        })
        .toBuffer()
    } else {
      console.log(`跳过不支持格式: ${filePath}`)
      return
    }
    
    const newSize = compressedBuffer.length
    const saved = originalSize - newSize
    const savedPercent = ((saved / originalSize) * 100).toFixed(1)
    
    // 只保存压缩后更小的图片
    if (newSize < originalSize) {
      fs.writeFileSync(filePath, compressedBuffer)
      console.log(`✓ ${path.relative(imagesDir, filePath)}`)
      console.log(`  原始: ${(originalSize / 1024).toFixed(2)} KB → 压缩后: ${(newSize / 1024).toFixed(2)} KB (节省 ${savedPercent}%)`)
      return { originalSize, newSize }
    } else {
      console.log(`- ${path.relative(imagesDir, filePath)} (已是最优大小)`)
      return { originalSize, newSize: originalSize }
    }
  } catch (error) {
    console.error(`✗ 压缩失败: ${path.relative(imagesDir, filePath)}`, error.message)
    return null
  }
}

// 主函数
async function main() {
  console.log('开始压缩图片...\n')
  
  const imageFiles = getAllImageFiles(imagesDir)
  console.log(`找到 ${imageFiles.length} 个图片文件\n`)
  
  let totalOriginalSize = 0
  let totalNewSize = 0
  
  for (const filePath of imageFiles) {
    const stats = fs.statSync(filePath)
    totalOriginalSize += stats.size
    
    const result = await compressImage(filePath)
    if (result) {
      totalNewSize += result.newSize
    } else {
      // 如果压缩失败，使用原始大小
      totalNewSize += stats.size
    }
  }
  
  const totalSaved = totalOriginalSize - totalNewSize
  const totalSavedPercent = ((totalSaved / totalOriginalSize) * 100).toFixed(1)
  
  console.log(`\n压缩完成!`)
  console.log(`总大小: ${(totalOriginalSize / 1024).toFixed(2)} KB → ${(totalNewSize / 1024).toFixed(2)} KB`)
  console.log(`节省: ${(totalSaved / 1024).toFixed(2)} KB (${totalSavedPercent}%)`)
}

main().catch(console.error)

