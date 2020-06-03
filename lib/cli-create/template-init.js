const { error } = require('../cli-shared-utils')
const path = require('path')
const fs = require('fs-extra')


async function templateInit (projectName) {
  // 创建文件夹 复制文件 ok
  await init(projectName, '../../template')
}
async function init(projectName, dir) {
  //
  const src = path.resolve(__dirname, dir);

  const dest = path.resolve(process.cwd(), projectName);

  // 复制模板文件
  await fs.copy(src, dest)
}


module.exports = (...args) => {
  return templateInit(...args).catch(err => {
    error(err)
  })
}
