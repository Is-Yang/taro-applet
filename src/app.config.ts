export default defineAppConfig({
  pages: [
    'pages/playback/index',
    'pages/home/index',
    'pages/livePlay/index',
    'pages/login/index'
  ],
  subPackages: [
    {
      root: 'pages/package/',
      pages: [
        'detail/index'
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white',
    navigationStyle: "custom"
  },
  tabBar: {
    color: "#333",
    selectedColor: "#438EF9",
    borderStyle: "black",
    backgroundColor: "#ffffff",
    list: [{
      pagePath: "pages/home/index",
      text: '首页',
      iconPath: 'assets/images/icon_home.png',
      selectedIconPath: 'assets/images/icon_home_cur.png'
    }, {
      pagePath: "pages/livePlay/index",
      text: '直播',
      iconPath: 'assets/images/icon_liveplay.png',
      selectedIconPath: 'assets/images/icon_liveplay_cur.png'
    }, {
      pagePath: "pages/playback/index",
      text: '回放',
      iconPath: 'assets/images/icon_playback.png',
      selectedIconPath: 'assets/images/icon_playback_cur.png'
    }]
  }
})
