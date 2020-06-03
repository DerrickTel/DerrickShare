import React, { useState, useEffect, useRef, useContext } from 'react';
import { ListView, SearchBar } from 'antd-mobile';
import throttle from "lodash/throttle";
import { placeAround, inputTips } from '@/api';
import Item from './Item'
import { TodosDispatch } from './index'

import styles from './index.module.less'

interface ListProps {
  center?: {
    longitude: number;
    latitude: number;
  };
}

export default ({ center }: ListProps) => {

  const { dispatch } = useContext(TodosDispatch);

  const origin = new ListView.DataSource({
    rowHasChanged: (row1: any, row2: any) => row1 !== row2,
  });

  const [listHeight, setListHeight] = useState('50vh')

  const [onSearch, setOnSearch] = useState(false)

  const [loading, setLoading] = useState(false)

  const [originData, setOriginData] = useState([])

  const [page, setPage] = useState(1)

  const searchBarRef = useRef(null);

  // 计算高度
  useEffect(() => {
    const searchBarHeight = searchBarRef.current.offsetHeight
    const windowHeight = document.body.clientHeight
    setListHeight(`${windowHeight / 10 * 4 - searchBarHeight}px`)
  }, [])

  const getListByCenter = async () => {
    const { longitude, latitude } = center || {}
    setDataSource(dataSource.cloneWithRows([]))
    setLoading(true)
    setPage(1)
    const { pois } = await placeAround({
      page: 1,
      location: `${longitude},${latitude}`
    })
    if (pois) {
      const POIList = pois.filter((val: any) => val.id.length > 0)

      const [lng, lat] = POIList[0].location.split(',')
      dispatch({
        type: 'setSelect_POI',
        select_POI: {
          city: POIList[0].cityname,
          address: POIList[0].address,
          name: POIList[0].name,
          province: POIList[0].pname,
          longitude: lng,
          latitude: lat,
        }
      })
      dispatch({
        type: 'setId',
        id: POIList[0].id
      })
      setLoading(false)
      setOriginData(POIList)
      setDataSource(dataSource.cloneWithRows(POIList))
    }
  }

  useEffect(() => {
    getListByCenter()
  }, [center && center.longitude, center && center.latitude])

  const [dataSource, setDataSource] = useState(origin)

  // 节流
  const onChange = throttle(async (keywords: string) => {
    if (keywords) {
      const { tips } = await inputTips({
        keywords
      })
      if (tips) {
        const list = tips.filter((val: { id?: string }) => val.id.length > 0)
        setDataSource(dataSource.cloneWithRows(list))
      }
    }

  }, 300)

  const onEndReached = async () => {
    if (!onSearch) {
      const { longitude = 116.397428, latitude = 39.90923 } = center || {}
      setLoading(true)
      const { pois } = await placeAround({
        page: page + 1,
        location: `${longitude},${latitude}`
      })
      if (pois) {
        setLoading(false)
        setPage(page + 1)
        setOriginData([...originData, ...pois])
        setDataSource(dataSource.cloneWithRows([...originData, ...pois]))
      }
    }

  }

  const onFouces = () => {
    setOnSearch(true)
  }

  const onBlur = () => {
    setOnSearch(false)
  }

  return (
    <div>
      <div
        ref={searchBarRef}
      >
        <SearchBar
          placeholder="输入地址搜搜"
          onChange={onChange}
          onSubmit={onChange}
          onFocus={onFouces}
          onBlur={onBlur}
        />
      </div>
      <ListView
        style={{ height: listHeight }}
        className={`${styles.list}`}
        dataSource={dataSource}
        onEndReached={onEndReached}
        renderRow={(rowData) => <Item rowData={rowData} />}
        pageSize={10}
        renderFooter={() => (
          <div style={{ padding: 10, textAlign: 'center' }}>
            {loading ? '加载中...' : '没有更多了T_T'}
          </div>
        )}
      />
    </div>
  )
}