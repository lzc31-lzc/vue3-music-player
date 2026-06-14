import Mock from 'mockjs'

Mock.mock('/api/songList', 'get', {
  code: 200,
  message: '获取歌曲列表成功',
  data: [
    {
      id: 1,
      name: '晴天',
      singer: '周杰伦',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      cover: 'https://picsum.photos/300/300?random=10',
      lyric: `[00:00.00]晴天
[00:05.00]故事的小黄花
[00:10.00]从出生那年就飘着
[00:15.00]童年的荡秋千
[00:20.00]随记忆一直晃到现在
[00:25.00]音乐还在继续播放
[00:30.00]旋律慢慢进入心里`
    },
    {
      id: 2,
      name: '夜曲',
      singer: '周杰伦',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      cover: 'https://picsum.photos/300/300?random=11',
      lyric: `[00:00.00]夜曲
[00:05.00]一群嗜血的蚂蚁
[00:10.00]被腐肉所吸引
[00:15.00]我面无表情
[00:20.00]看孤独的风景
[00:25.00]黑夜里的旋律
[00:30.00]安静地循环播放`
    },
    {
      id: 3,
      name: '稻香',
      singer: '周杰伦',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      cover: 'https://picsum.photos/300/300?random=12',
      lyric: `[00:00.00]稻香
[00:05.00]对这个世界如果你有太多的抱怨
[00:10.00]跌倒了就不敢继续往前走
[00:15.00]为什么人要这么的脆弱堕落
[00:20.00]请你打开电视看看
[00:25.00]多少人为生命在努力勇敢地走下去
[00:30.00]我们是不是该知足`
    }
  ]
})