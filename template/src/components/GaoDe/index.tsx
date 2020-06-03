import React, { useEffect } from 'react'
import { MapProps } from 'react-amap';
import { queryString, bdToGd } from '@/utils/util';

interface GaoDeProps extends MapProps {
  style?: object;
  getInstance?: Function;
}

declare global {
  interface Window { AMap: any }
}
export default ({ style, getInstance }: GaoDeProps) => {

  let mapInstance: null | object = null

  useEffect(() => {

    const { longitude, latitude } = queryString();
    const location = bdToGd(longitude, latitude)

    mapInstance = new window.AMap.Map('amap', {
      zoom: 18, // 初始化地图层级
      center: [location.longitude || 116.397428, location.latitude || 39.90923], // 初始化地图中心点
      touchZoomCenter: '1', // 放大缩小中心点不变
    });

    getInstance(mapInstance)

  }, [])

  return (
    <div id="amap" style={style} />
  )
}
