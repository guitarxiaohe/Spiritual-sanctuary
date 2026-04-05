export const AVATARS: string[] = [
  '🦊',
  '🐱',
  '🐶',
  '🐼',
  '🐨',
  '🦁',
  '🐯',
  '🐮',
  '🐷',
  '🐸',
  '🐵',
  '🐔',
  '🐧',
  '🐦',
  '🦆',
  '🦅',
  '🦉',
  '🦋',
  '🐌',
  '🐛',
  '🦀',
  '🐙',
  '🦕',
  '🦖',
  '🐳',
  '🐋',
  '🐬',
  '🐟',
  '🦈',
  '🐊',
  '🐅',
  '🐆',
]

export const NICKNAMES: string[] = [
  '小狐狸',
  '小猫咪',
  '小狗狗',
  '大熊猫',
  '考拉君',
  '狮子王',
  '小老虎',
  '牛牛',
  '小猪猪',
  '青蛙王子',
  '美猴王',
  '小鸡仔',
  '企鹅宝宝',
  '小鸟儿',
  '小黄鸭',
  '老鹰',
  '猫头鹰',
  '小蝴蝶',
  '小蜗牛',
  '毛毛虫',
  '小螃蟹',
  '章鱼哥',
  '恐龙妹',
  '霸王龙',
  '大鲸鱼',
  '小蓝鲸',
  '海豚音',
  '小鱼儿',
  '大白鲨',
  '鳄鱼先生',
  '小豹子',
  '花豹',
  '匿名用户',
  '路过的',
  '陌生人',
  '倾听者',
  '故事人',
  '夜猫子',
  '早起鸟',
  '潜水员',
]

export function getRandomAvatar(): string {
  const index = Math.floor(Math.random() * AVATARS.length)
  return AVATARS[index] ?? '🐱'
}

export function getRandomNickname(): string {
  const index = Math.floor(Math.random() * NICKNAMES.length)
  return NICKNAMES[index] ?? '匿名用户'
}

export function getRandomIdentity() {
  return {
    avatar: getRandomAvatar(),
    nickname: getRandomNickname(),
  }
}
