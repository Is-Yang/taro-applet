import Taro from '@tarojs/taro'
import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { View, Button, Image } from '@tarojs/components'
import Navbar from '../../../components/Navbar'
import './index.scss'

const Page: FC = () => {
  const dispatch = useDispatch()
  
  let userInfo = Taro.getStorageSync('userInfo')
  if (userInfo) {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }

  function getPhoneNumber(e) {
    const { errMsg, iv } = e.detail
    if (errMsg == 'getPhoneNumber:ok') {
      Taro.setStorageSync('userInfo', e.detail);
      
      dispatch({
        type: 'SET_USER',
        data: {
          phone: iv
        }
      })
    }

    Taro.switchTab({
      url: '/pages/home/index'
    })
  }

  function getUserInfo() {
    Taro.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
      }
    })
  }

  const bg = require('../../../assets/images/bg02.png');

  return (
    <View className='login-page'>
      <Image
        src={bg}
        className='common-bg'
        style="height: 600rpx"
      />

      <Navbar title="登录" />

      <View className="main-content">
        <View className='title'>花果山超高清小镇8K小程序</View>

        <Button className='wechat-login' open-type='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>微信一键登录</Button>
      </View>
    </View>
  )
}

export default Page

