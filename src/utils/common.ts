import Taro from '@tarojs/taro'

export const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight;
export const bg1 = require('../assets/images/bg01.png');
export const host = 'http://14.23.162.170:8086/TxVideoService/video.ws'