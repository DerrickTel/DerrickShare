const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const creator = require('./creator')
const { chalk, error, stopSpinner } = require('../cli-shared-utils')
const validateProjectName = require('validate-npm-package-name')

async function create (projectName, options) {

  const cwd = options.cwd || process.cwd()
  const targetDir = path.resolve(cwd, projectName || '.')

  const result = validateProjectName(projectName)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${projectName}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    exit(1)
  }

  if(fs.existsSync(targetDir)) {
    error('目录已经存在')
    return
  }

  // 选择模板 -> await 内部触发使用规则 -> 安装依赖 -> 初始化git -> 完成
  const { templateType } = await inquirer.prompt([
    {
      name: 'templateType',
      type: 'list',
      message: `选择需要使用的模板?`,
      choices: [
        { name: 'react后台模板', value: 'reactPcAdmin' },
        { name: 'react移动端H5模板', value: 'reactH5Mobile' },
      ]
    }
  ])

  if(!templateType){
    error('未选择模板类型')
    return
  }

  const instance = new creator(projectName, targetDir)
  await instance.create({...options}, templateType)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
  })
}
