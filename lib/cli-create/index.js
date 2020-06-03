const fs = require('fs-extra')
const path = require('path')
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

  const instance = new creator(projectName, targetDir)
  await instance.create({...options})
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
  })
}
