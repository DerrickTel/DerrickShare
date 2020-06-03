import React from 'react'
import styles from './index.module.less'

import MARK from './mark.png';

interface Mark {
  markUp?: boolean;
}

export default ({ markUp }: Mark) => {
  return (
    <img
      className={`${styles.mark} ${!markUp || styles.markUp}`}
      src={MARK}
      alt=""
    />
  )
}