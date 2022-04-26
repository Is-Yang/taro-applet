import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { FC, useState } from 'react'
import { View, Text, Image, Label, Picker, Input, Button } from '@tarojs/components'
import Navbar from '../../components/Navbar'
import { bg1, statusBarHeight } from '../../utils/common'
import './index.scss'

type videoList = Array<{
  cover: string;
  id: number;
  name: string;
}>

const Page: FC = () => {
  const [ videoList ] = useState<videoList>([
    {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 1,
      name: '内容标题1'
    }, {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 2,
      name: '内容标题2'
    }, {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 3,
      name: '内容标题2'
    }, {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 4,
      name: '内容标题2'
    }, {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 5,
      name: '内容标题2'
    }, {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 6,
      name: '内容标题2'
    }, {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 7,
      name: '内容标题2'
    }, {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 8,
      name: '内容标题2'
    }, {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 9,
      name: '内容标题2'
    }, {
      cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
      id: 10,
      name: '内容标题2'
    }
  ])

  // function toDetail(id) {
  //   console.log(id)
  //   Taro.navigateTo({
  //     url: `/pages/package/detail/index?id=${id}`
  //   })
  // }

  useReachBottom(() => {
    console.log('上拉')
  })

  return (
    <View className='live-play-page' style={{ paddingTop: statusBarHeight + 'px'}}>
      <Image
        src={bg1}
        className='common-bg'
      />

      <Navbar title="直播" isFixed />

      <View className="fixed-wrapper" style={{ marginTop: statusBarHeight + 'px'}}>
        <View className='video-play'></View>

        <View className='screen-box'>
          <View style={{ flex: 1 }}>
            <View className='row'>
              <Label className="label">通道：</Label>
              {/* <Picker mode='date' onChange={onBeginDate} style={{ flex: 1}}>
                <Input className='input-sty' type="text" value={beginTime.date} disabled></Input>
              </Picker> */}
            </View>
          </View>
          <Button className="btn-search">查询</Button>
        </View>
      </View>

      <View className="video-wrapper">
        <View className='video-list'>
          {
            videoList.map(item => (
              <View className='video-item'>
                <Image src={item.cover} className="video-img" mode="aspectFill" />
                <Text className='video-title'>{item.name}</Text>
              </View>
            ))
          }
        </View>
      </View>
    </View>
  )
}

export default Page

