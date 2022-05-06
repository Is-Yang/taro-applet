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
  title: string,
  content: string
}>

const Page: FC = () => {
  const [ bannerList ] = useState<bannerList>([
    {
      pic: require('../../assets/images/banner01.jpg'),
      id: 1,
      title: '海珠广场',
      content: `海珠广场位于广州市老城区中心轴线与滨江景观带的交点，是广州唯一的滨江广场。
      它曾充当海珠桥被炸与重修、解放军进城等重大历史事件的见证人角色，
      海珠广场和广州解放纪念像以“珠海丹心”入选羊城新八景。
      俯瞰海珠广场、海珠桥、珠江在侨光路8号华夏酒店9楼顶设置安装一台8K超高清视频摄像机捕捉海珠广场公园、海珠桥、珠江两岸景观直播。`
    }, {
      pic: require('../../assets/images/banner02.jpg'),
      id: 2,
      title: '珠江新城',
      content: `珠江新城位于广州天河区，是广州唯一的滨江广场。
      它曾充当海珠桥被炸与重修、解放军进城等重大历史事件的见证人角色，
      海珠广场和广州解放纪念像以“珠海丹心”入选羊城新八景。
      俯瞰海珠广场、海珠桥、珠江在侨光路8号华夏酒店9楼顶设置安装一台8K超高清视频摄像机捕捉海珠广场公园、海珠桥、珠江两岸景观直播。`
    }
  ])
  const [ isLogin ] = useState<Boolean>(Taro.getStorageSync('userInfo') ? true : false)
  const [ currentIndex, setCurrentIndex] = useState<number>(0);

  useDidShow(() => {
    // 未登录
    if (!isLogin) {
      Taro.hideTabBar()
    } else {
      Taro.showTabBar()
    }
  })

  const handleLeft = () => {
    Taro.redirectTo({ url: '/pages/package/login/index' })
  }

  const changeSwiper = (e) => {
    setCurrentIndex(e.detail.current);
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
          onChange={changeSwiper}
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
        <Text className='tag'>
          { bannerList[currentIndex].title }
        </Text>
        <View className="introduce-box">
          <Text className='title'>项目介绍</Text>
          <View className="info">
          { bannerList[currentIndex].content }
          </View>
        </View>
      </View>
    </View>
  )
}

export default Page
