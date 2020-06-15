import React from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  const history = useHistory();

  function handleClick() {
    history.push("/");
  }
  return (
    <div onClick={handleClick}>
      网址打错啦; 点我回首页哦~
    </div>
  )
}