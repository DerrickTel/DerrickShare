import React, { useContext } from 'react';
import styles from './index.module.less'
import { TodosDispatch } from './index'

import CHECK from './check.png';

export default ({ 
  rowData,
}: any) => {

  const { dispatch, id } = useContext(TodosDispatch);
  const distance = (long: string) => (
    <>{long}米 &nbsp;| &nbsp;</>
  )

  return (
    <div
      onClick={() => {
        const [longitude, latitude] = rowData.location.split(',')
        dispatch({
          type: 'setId',
          id: rowData.id
        })
        dispatch({
          type: 'setSelect_POI',
          select_POI: {
            city: rowData.cityname,
            name: rowData.name,
            // 高德如果为空是空数组
            address: rowData.address.length > 0 ? rowData.address : '',
            longitude,
            latitude,
            province: rowData.pname,
          }
        })
        dispatch({
          type: 'setMapCenter',
          mapCenter: { longitude, latitude }
        })
      }}
      key={rowData.id}
      className={styles.item}
    >
      <p className={styles.title}>
        {rowData.name}
        {id === rowData.id && <span className={styles.now}>当前定位</span>}
      </p>
      <p className={styles.desc}>
        <span>
          {rowData.distance && distance(rowData.distance)}
        </span>
        {rowData.address}
      </p>
      {id === rowData.id && <img className={styles.check} src={CHECK} alt="" />}
    </div>
  )
}