import { FC, memo } from "react";
import { View, Text } from "@tarojs/components";
import { statusBarHeight } from '../../utils/common'

import "./index.scss";
type Props = {
  title: String;
  leftText?: String;
  rightText?: String;
  isFixed?: Boolean;
  onRight?: () => void;
  onLeft?: () => void;
};

const CTitle: FC<Props> = ({ title, leftText, isFixed, rightText, onLeft, onRight }) => {
  const topBar: any = {
    paddingTop: statusBarHeight + 'px',
    position: isFixed ? 'fixed' : 'relative'
  }


  return (
    <View className="page-navbar" style={topBar}>
      { leftText ? <Text className="left-full" onClick={onLeft}>{leftText}</Text> : <Text></Text> }
      <Text>{title}</Text>
      { rightText ? <Text className="right-full" onClick={onRight}>{rightText}</Text> : <Text></Text>}
    </View>
  );
};

export default memo(CTitle, (oldProps, newProps) => {
  return oldProps.title === newProps.title;
});