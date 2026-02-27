/**
 * PWA用アイコン (icon-192.png / icon-512.png) を public/ に生成する。
 * テーマカラー #f97316 の単色画像です。
 * 実行: node scripts/generate-pwa-icons.cjs
 */
const { PNG } = require('pngjs')
const fs = require('fs')
const path = require('path')

const THEME_R = 249
const THEME_G = 115
const THEME_B = 22
const A = 255

const publicDir = path.join(__dirname, '..', 'public')
const sizes = [192, 512]

function createIcon(size) {
  const data = Buffer.alloc(size * size * 4)
  for (let i = 0; i < size * size * 4; i += 4) {
    data[i] = THEME_R
    data[i + 1] = THEME_G
    data[i + 2] = THEME_B
    data[i + 3] = A
  }
  const png = { width: size, height: size, data }
  return PNG.sync.write(png)
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

for (const size of sizes) {
  const filename = `icon-${size}.png`
  const outPath = path.join(publicDir, filename)
  fs.writeFileSync(outPath, createIcon(size))
  console.log('Generated:', outPath)
}

console.log('Done.')
