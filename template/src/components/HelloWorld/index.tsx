import React from 'react'
import './index.less'

export default () => (
  <>
    <div className="notTransformNotModule">
      class不被转化-我是首页
    </div>
    <div className="notModule">
      class被转化-我是首页
    </div>
  </>
)