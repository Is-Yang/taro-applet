import Taro, { usePullDownRefresh, useDidHide, useDidShow } from '@tarojs/taro'
import { FC, useState } from 'react'
import { View, Text, Image, Video } from '@tarojs/components'
import Navbar from '../../components/Navbar'
import { bg1, statusBarHeight, host } from '../../utils/common'
import { btoa } from '../../utils/base64.js'
import './index.scss'

const DOMParser = require('xmldom').DOMParser;

type videoList = Array<{
  cover: string;
  id: number;
  name: string;
}>

type orgTree = Array<{
  cameraId: string,
  name: string
}>

const Page: FC = () => {
  const [ videoList, setVideoList ] = useState<videoList>([]);
  const [ videoUrl, setVideoUrl ] = useState<string>('');

  const onSelect = e => {
    queryData(e.id)
  }

  function getCamera() {
    Taro.showLoading({ title: '加载中' });

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
      Taro.hideLoading()
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

          let orgType2: any = []
          if (mapOrgTree.length > 0) {
            mapOrgTree.filter(item => {
              if (item.ItemType == '3') {
                orgType2.push({
                  id: item.ItemID,
                  name: item.ItemName,
                  cover: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
                })
              }
            })
            setVideoList(orgType2)
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

  function queryData(cameraId) {
    Taro.showLoading({ title: '加载中' });

    let params = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='http://webservices.video.tisson.com'>" +
      '<soapenv:Header/>' +
      '<soapenv:Body>' +
      '<web:getRealVideo>' +
      '<web:cameraID>' +
      cameraId +
      '</web:cameraID>' +
      '<web:protocol>H5</web:protocol>' +
      '<web:streamMode>1</web:streamMode>' +
      '</web:getRealVideo>' +
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
        Taro.hideLoading()
        let dom = new DOMParser().parseFromString(res.data);
        let xmlResponse = dom.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
        let xmlDoc = new DOMParser().parseFromString(xmlResponse.data, 'text/xml')
        let eSuccess = xmlDoc.getElementsByTagName('ErrorCode')
        if (eSuccess.length > 0) {
          let success = eSuccess[0].childNodes[0].textContent
          if (parseInt(success) == 0) {
            let eURL = xmlDoc.getElementsByTagName('URL')
            let url = eURL[0].childNodes[0].textContent
            // let eToken = xmlDoc.getElementsByTagName('Token')
            // let token = eToken[0].childNodes[0].textContent
            // if (token == null || token == 'null') token = ''
            doWsVideo(url);
          }
        } else {
          Taro.showToast({
            title: '解析xml遇到未知的数据格式！',
            icon: 'error'
          });
        }
      } else {
        Taro.showToast({
          title: '获取数据出错！',
          icon: 'error'
        });
      }
    })
  }

  function doWsVideo(url) {
    console.log(url);
    wx.connectSocket({
      url: url,
      success() {
        console.log('连接成功');
      }
    })

    // 接收消息
    wx.onSocketMessage((res) => {
      const base64 = `data:image/png;base64,${wx.arrayBufferToBase64(res.data)}`;
      setVideoUrl(base64);
    })

    wx.onSocketError((res) => {
      console.log('websocket 连接打开失败，请检查！');
    })

    wx.onSocketClose((res) => {
      console.log(res);
      console.log('websocket 关闭');
    })
  }

  useDidShow(() => {
    getCamera()
  })

  useDidHide(() => {
    wx.closeSocket();
  })

  return (
    <View className='live-play-page' style={{ paddingTop: statusBarHeight + 'px' }}>
      <Image
        src={bg1}
        className='common-bg'
      />
      <Navbar title="直播" isFixed />

      <View className="fixed-wrapper" style={{ marginTop: statusBarHeight + 'px' }}>
        <View className='video-play'>
          <Image src={videoUrl} style="width: 100%; height: 100%;"></Image>
          {/* <Video id='video'
            src={videoUrl}
            initialTime={0}
            controls={true}
            autoplay={false}
            loop={false}
            muted={false}
            style="width: 100%; height: 100%;"></Video> */}
        </View>
      </View>

      <View className="video-wrapper">
        <View className='video-list'>
          {
            videoList.map(item => (
              <View className='video-item' onClick={ () => onSelect(item) }>
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

