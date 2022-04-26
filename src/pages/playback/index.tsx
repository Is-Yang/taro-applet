import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { FC, useState } from 'react'
import { View, Text, Image, Picker, Input, Label, Button } from '@tarojs/components'
import Navbar from '../../components/Navbar'
import { bg1, statusBarHeight } from '../../utils/common'
import './index.scss'

type videoList = Array<{
  cover: string;
  id: number;
  name: string;
}>

type dateTime = {
  date: string;
  time: string;
}

type orgTree = Array<{
  cameraId: string,
  name: string
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

  const [ beginTime, setBeginTime ] = useState<dateTime>({
    date: '',
    time: ''
  })

  const [ endTime, setEndTime ] = useState<dateTime>({
    date: '',
    time: ''
  })
  const [ cameraOptions, setCameraOptions ] = useState<orgTree>([
    {
      cameraId: '6532',
      name: '新意新石业2'
    }, {
      cameraId: '5679',
      name: '金骏广场-塔吊2'
    }
  ])
  const [ cameraIndex, setCameraIndex ] = useState<number>(0)

  const onBeginTime = e => {
    setBeginTime({
      time: e.detail.value,
      date: beginTime.date
    })
  }

  const onBeginDate = e => {
    setBeginTime({
      time: beginTime.time,
      date: e.detail.value
    })
  }

  const onEndDate = e => {
    setEndTime({
      time: endTime.time,
      date: e.detail.value
    })
  }

  const onEndTime = e => {
    setEndTime({
      time: e.detail.value,
      date: endTime.date
    })
  }

  const onSelect = e => {
    setCameraIndex(Number(e.detail.value))
  }

  useReachBottom(() => {
    console.log('上拉')
  })

  return (
    <View className='playback-page' style={{ paddingTop: statusBarHeight + 'px'}}>
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
              <Label className="label">开始时间：</Label>
              <View className="time-sty">
                <Picker mode='date' onChange={onBeginDate}>
                  <Input placeholder="请选择" className='input-sty' type="text" value={beginTime.date} disabled></Input>
                </Picker>
                <Picker mode='time' onChange={onBeginTime}>
                  <Input placeholder="请选择" className='input-sty' value={beginTime.time}  style={{ width: '150rpx', marginLeft: '10rpx' }} disabled></Input>
                </Picker>
              </View>
            </View>
            <View className='row'>
              <Label className="label">结束时间：</Label>
              <View className="time-sty">
                <Picker mode='date' onChange={onEndDate}>
                  <Input placeholder="请选择" className='input-sty' type="text" value={endTime.date} disabled></Input>
                </Picker>
                <Picker mode='time' onChange={onEndTime}>
                  <Input placeholder="请选择" className='input-sty' type="text" value={endTime.time} style={{ width: '150rpx', marginLeft: '10rpx' }} disabled></Input>
                </Picker>
              </View>
            </View>
            <View className='row'>
              <Label className="label">通道：</Label>
              <Picker mode='selector' 
                range={cameraOptions} 
                range-key="name"
                value={cameraOptions[cameraIndex].cameraId}
                onChange={onSelect} 
                style={{ flex: 1}}
              >
                <Input placeholder="请选择" className='input-sty' type="text" value={cameraOptions[cameraIndex].name} disabled></Input>
              </Picker>
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

