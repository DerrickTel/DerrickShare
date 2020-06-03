import React, { useReducer, useEffect, useState } from 'react'

import GaoDe from '@/components/GaoDe'
import { queryString, bdToGd, gdToBd } from '@/utils/util';
import jsBridge from '@/utils/jsbridge'
import QueryString from 'qs';
import { reducer, initialState } from './reducer'
import List from './List'
import Mark from './Mark'
import styles from './index.module.less'

import POSITION from './position.png'

export const TodosDispatch = React.createContext(null);

let gaoDeMap: any = null

const location = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const [markUp, setMarkUp] = useState(false)

  const init = () => {

    gaoDeMap.on('touchend', mapMoveend);

    gaoDeMap.on('touchstart', mapMovestart);

    gaoDeMap.on('complete', () => {
      const { longitude, latitude } = queryString();
      if (longitude && latitude) {
        dispatch({
          type: 'setCenter',
          center: {
            ...bdToGd(longitude, latitude)
          }
        })
      } else {
        dispatch({
          type: 'setCenter',
          center: {
            longitude: 116.397428, latitude: 39.90923
          }
        })
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (state.mapCenter) {
      const { longitude, latitude } = state.mapCenter
      gaoDeMap.setCenter([longitude, latitude])
    }

  }, [state.mapCenter])

  const mapMoveend = () => {
    setMarkUp(false)
    const { lng, lat } = gaoDeMap.getCenter()
    dispatch({
      type: 'setCenter',
      center: {
        longitude: lng,
        latitude: lat,
      }
    })
  }

  const back = () => {
    const { longitude, latitude } = queryString();
    dispatch({
      type: 'setMapCenter',
      mapCenter: {
        ...bdToGd(longitude, latitude)
      }
    })

    dispatch({
      type: 'setCenter',
      center: {
        ...bdToGd(longitude, latitude)
      }
    })
  }

  const mapMovestart = () => {
    setMarkUp(true)
  }

  const send = async () => {
    const { returnUrl } = queryString()
    const { select_POI: { longitude, latitude, ...rest } = {} } = state
    const params = { ...rest, ...gdToBd(longitude, latitude) }

    // 网页版
    if (returnUrl) {

      const query = QueryString.stringify(params)
      if (returnUrl.includes('?')) {
        window.location.replace(`${returnUrl}&${query}`)
      } else {
        window.location.replace(`${returnUrl}?${query}`)
      }

    } else {
      jsBridge.callHandler('select_POI', params)
    }
  }

  const getInstance = (instance: object) => {
    gaoDeMap = instance
  }

  return (
    <TodosDispatch.Provider value={{ dispatch, id: state.id }}>
      <div className={styles.container}>
        <GaoDe
          style={{ height: '60%' }}
          getInstance={getInstance}
        />
        <List center={state.center} />
        <Mark markUp={markUp} />
        <div onClick={send} className={styles.send}>确定</div>
        <img onClick={back} className={styles.position} src={POSITION} alt="" />
      </div>
    </TodosDispatch.Provider>
  )
}

export default location