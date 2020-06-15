const { error } = require('../cli-shared-utils')
const path = require('path')
const fs = require('fs-extra')

const methods = {
  'reactPcAdmin': {
    dir: '../../templates/react-pc-admin'
  },
  'reactH5Mobile': {
    dir: '../../templates/react-h5-mobile'
  },
}

async function templateInit (projectName, templateType) {
  // 创建文件夹 复制文件 ok
  await init(projectName, methods[templateType].dir)
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
