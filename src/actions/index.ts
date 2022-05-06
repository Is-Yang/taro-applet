import Taro from '@tarojs/taro'
const DOMParser = require('xmldom').DOMParser;
import { host } from '../utils/common'

export const userInfo = data => {
  return {
    type: 'SET_USER',
    data
  }
}
