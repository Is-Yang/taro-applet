import { FC, useState } from 'react'
import { useStore } from 'react-redux'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Navbar from '../../components/Navbar'
import { bg1, statusBarHeight } from '../../utils/common'
import './index.scss'


type bannerList = Array<{
  pic: string;
  id: number;
}>

const Page: FC = () => {
  const [ bannerList ] = useState<bannerList>([
    {
      pic: require('../../assets/images/banner01.jpg'),
      id: 1
    }, {
      pic: require('../../assets/images/banner02.jpg'),
      id: 2
    }, {
      pic: require('../../assets/images/banner03.jpg'),
      id: 3
    }, {
      pic: require('../../assets/images/banner04.jpg'),
      id: 4
    }
  ])
  const [ isLogin ] = useState<Boolean>(Taro.getStorageSync('userInfo') ? true : false)

  useDidShow(() => {
    // 未登录
    if (!isLogin) {
      Taro.hideTabBar()
    } else {
      Taro.showTabBar()
    }
  })

  const handleLeft = () => {
    Taro.redirectTo({ url: '/pages/login/index' })
  }

  return (
    <View className='home-page'>
      <Image
        src={bg1}
        className='common-bg'
      />

      <Navbar title="首页" isFixed leftText={ !isLogin ? '登录': '' } onLeft={ handleLeft } />

      <View className='banner-wraper' style={{ marginTop: statusBarHeight + 'px'}}>
        <Swiper
          indicatorColor='#fff'
          indicatorActiveColor='#043af0'
          circular
          indicatorDots
          autoplay
          style={{ height: '400rpx' }}>
          {
            bannerList.map(item => (
              <SwiperItem key={item.id} className="banner-item">
                <Image src={item.pic} className="banner-img" mode="aspectFill" />
              </SwiperItem>
            ))
          }
        </Swiper>
      </View>
      
      <View className='content-wrapper'>
        <Text className='tag'>海珠广场</Text>
        <View className="introduce-box">
          <Text className='title'>项目介绍</Text>
          <View className="info">
            海珠广场位于广州市老城区中心轴线与滨江景观带的交点，是广州唯一的滨江广场。
            它曾充当海珠桥被炸与重修、解放军进城等重大历史事件的见证人角色，
            海珠广场和广州解放纪念像以“珠海丹心”入选羊城新八景。
            俯瞰海珠广场、海珠桥、珠江在侨光路8号华夏酒店9楼顶设置安装一台8K超高清视频摄像机捕捉海珠广场公园、海珠桥、珠江两岸景观直播。
          </View>
        </View>
      </View>
    </View>
  )
}

export default Page
