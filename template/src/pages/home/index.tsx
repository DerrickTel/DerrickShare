import React from 'react'
import HelloWorld from '@/components/HelloWorld'
import styles from './index.module.less'

export default () => {
  return (
    <>
      <div className={styles.notTransformTestModule}>
        cssModule-class不被转化-我是首页
      </div>
      <div className={styles.testModule}>
        cssModule-class被转化-我是首页
      </div>
      <HelloWorld />
    </>
  )
}