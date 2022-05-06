import Taro, { usePullDownRefresh, useReachBottom, useReady } from '@tarojs/taro'
import { FC, useState } from 'react'
import { View, Text, Image, Picker, Input, Label, Button } from '@tarojs/components'
import Navbar from '../../components/Navbar'
import { bg1, statusBarHeight, host } from '../../utils/common'
import './index.scss'

const DOMParser = require('xmldom').DOMParser;

type videoList = Array<{
  cover: string;
  CameraID: number;
  FileName: string;
  time: string;
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
  const [ videoList, setVideoList ] = useState<videoList>([])

  const [ beginTime, setBeginTime ] = useState<dateTime>({
    date: '',
    time: ''
  })

  const [ endTime, setEndTime ] = useState<dateTime>({
    date: '',
    time: ''
  })
  const [ cameraOptions, setCameraOptions ] = useState<orgTree>([{
    cameraId: '0',
    name: '请选择'
  }])
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

  function getCamera() {
    let params =
      `<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='http://webservices.video.tisson.com'>
        <soapenv:Body>
          <web:getOrgTree2>
          </web:getOrgTree2>
        </soapenv:Body>
      </soapenv:Envelope>`

    Taro.request({
      url: host,
      method: 'POST',
      data: params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      if (res.statusCode == 200) {
        let dom = new DOMParser().parseFromString(res.data)
        let xmlTree = dom.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent

        if (xmlTree.length > 0) {
          let parser = new DOMParser() //创建文档对象
          let xmldoc = parser.parseFromString(xmlTree, 'text/xml')
          let strResult = xmldoc.getElementsByTagName('Success')[0].childNodes[0].nodeValue;
          if (strResult != '1') return;

          let iNodeCount = parseInt(xmldoc.getElementsByTagName('NodeCount')[0].childNodes[0].nodeValue)
          if (iNodeCount <= 0) {
            Taro.showToast({
              title: '机构树结果为空！',
              icon: 'error'
            });
            return;
          }

          // 解析构造机构树
          const mapOrgTree: any = []
          let nodeList = xmldoc.getElementsByTagName('NodeList')[0].childNodes
          if (nodeList) {
            let iCount = 0
            for (let i = 0; i < nodeList.length; i++) {
              if (nodeList[i].nodeType == 1) {
                let node = nodeList[i].childNodes
                mapOrgTree[iCount] = {}
                mapOrgTree['length'] = mapOrgTree['length'] + 1
                for (let j = 0; j < node.length; j++) {
                  let subNode = node[j]
                  if (subNode.nodeType == 1) {
                    mapOrgTree[iCount][subNode.nodeName] = subNode.textContent
                  }
                }
                iCount++
              }
            }
          }

          let orgType3: any = [{
            cameraId: '0',
            name: '请选择'
          }]
          if (mapOrgTree.length > 0) {
            mapOrgTree.filter(item => {
              if (item.ItemType == '3') {
                orgType3.push({
                  cameraId: item.ItemID,
                  name: item.ItemName
                })
              }
            })
            
            setCameraOptions(orgType3)
          }
        }
      } else {
        Taro.showToast({
          title: '获取目录树服务调用出错！',
          icon: 'error'
        });
      }
    })
  }

  function queryData() {
    if (cameraOptions[cameraIndex].cameraId == '0') {
      Taro.showToast({ 
        title: '请选择通道',
        icon: 'error' 
      });
      return;
    }

    Taro.showLoading({ title: '加载中' });

    let params = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='http://webservices.video.tisson.com'>" +
      '<soapenv:Header/>' +
      '<soapenv:Body>' +
      '<web:getRecordList>' +
      '<web:cameraID>' +
      cameraOptions[cameraIndex].cameraId +
      '</web:cameraID>' +
      '<web:startTime>' +
      (beginTime.date + ' ' + beginTime.time + ':00') +
      '</web:startTime>' +
      '<web:endTime>' +
      (endTime.date + ' ' + endTime.time + ':00') +
      '</web:endTime>' +
      '</web:getRecordList>' +
      '</soapenv:Body>' +
      '</soapenv:Envelope>'

    Taro.request({
      url: host,
      method: 'POST',
      data: params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      if (res.statusCode == 200) {
        Taro.hideLoading();
        let dom = new DOMParser().parseFromString(res.data);
        let xmlResponse = dom.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent;
        if (xmlResponse.length == 0) return;

        let xmlDoc = new DOMParser().parseFromString(xmlResponse, 'text/xml')
        let eSuccess = xmlDoc.getElementsByTagName('ErrorCode')
        if (eSuccess.length > 0) {
            let success = parseInt(eSuccess[0].childNodes[0].textContent)
            if (success == 0) {
                let nodeList = xmlDoc.getElementsByTagName('FileList')[0].childNodes
                if (nodeList) {
                    let iCount = 0
                    let retList: any = []
                    for (let i = 0; i < nodeList.length; i++) {
                        if (nodeList[i].nodeType == 1) {
                            let node = nodeList[i].childNodes
                            retList[iCount] = {}
                            for (let j = 0; j < node.length; j++) {
                                let subNode = node[j]
                                if (subNode.nodeType == 1) {
                                    retList[iCount][subNode.nodeName] = subNode.textContent
                                }
                            }
                            iCount++
                        }
                    }
                    
                    setVideoList(retList);
                  }
            }
        }
      }
    });
  }

  useReady(() => {
    getCamera()
  })

  return (
    <View className='playback-page' style={{ paddingTop: statusBarHeight + 'px'}}>
      <Image
        src={bg1}
        className='common-bg'
      />

      <Navbar title="回放" isFixed />

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
                <Picker mode='date' onChange={onEndDate} start={beginTime.date}>
                  <Input placeholder="请选择" className='input-sty' type="text" value={endTime.date} disabled></Input>
                </Picker>
                <Picker mode='time' onChange={onEndTime}>
                  <Input placeholder="请选择" className='input-sty' type="text" value={endTime.time} style={{ width: '150rpx', marginLeft: '10rpx' }} disabled></Input>
                </Picker>
              </View>
            </View>
            { cameraOptions.length > 0 ?
              <View className='row'>
                <Label className="label">通道：</Label>
                <Picker mode='selector' 
                  range={cameraOptions} 
                  range-key="name"
                  value={cameraIndex}
                  onChange={onSelect} 
                  style={{ flex: 1}}
                >
                  <Input placeholder="请选择" className='input-sty' type="text" value={cameraOptions[cameraIndex].name} disabled></Input>
                </Picker>
              </View>
            : <></>}
          </View>
          <Button onClick={queryData} className="btn-search">定位</Button>
        </View>
      </View>

      <View className="video-wrapper">
        <View className='video-list'>
          {
            videoList.map(item => (
              <View className='video-item'>
                <Image src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" className="video-img" mode="aspectFill" />
                <Text className='video-title'>{item.FileName}</Text>
              </View>
            ))
          }
        </View>
      </View>
    </View>
  )
}

export default Page

