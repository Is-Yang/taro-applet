import { combineReducers } from 'redux'
import Taro from '@tarojs/taro'

type userType = {
  phone: String
}

let userInfo = Taro.getStorageSync('userInfo');
const USER_STATE: userType = {
  phone: userInfo.iv || ''
}

function user(state = USER_STATE, action) {
  switch (action.type) {
    case 'SET_USER':
      const { phone } = action.data
      return { ... state, phone: phone }
    default:
      return state
  }
}

const app = combineReducers({
  user
})

export default app;

