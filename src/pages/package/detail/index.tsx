import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Button, Image } from '@tarojs/components'
import './index.scss'

type PageState = {}

export default class Detail extends Component<{}, PageState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='detail-page'>
      </View>
    )
  }
}
