/**
 * 获取资源路径（支持 GitHub Pages 子路径部署）
 */
function getAssetPath(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const base = import.meta.env.BASE_URL || '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const fullPath = base + cleanPath
  return fullPath.replace(/([^:]\/)\/+/g, '$1')
}

export const stories = [
  {
    id: 1,
    name: '李佳欣',
    location: '陕西某村',
    title: '周一之约：剪刀下的温情',
    intro: '在陕西的一个小村庄里，李佳欣女士受到李富贵故事的启发，决定将每周一设为"益剪日"，为村里的老人免费理发。她用一把剪刀，剪出了老人的精神，也剪出了社区的温暖。',
    coverImage: getAssetPath('/images/lifugui/cover.png'),
    coordinates: { x: '30%', y: '40%' },
    tag: '周一义剪',
    sections: [
      {
        type: 'text-image',
        title: '初心：学习李富贵的温暖行动',
        content: '李佳欣女士听说了李富贵为老人免费理发的故事，深受感动。她发现村里的留守老人们因为行动不便或经济原因，很少理发。看着他们日渐苍老的面容，她决定学习李富贵的做法，每周一专门为老人免费理发，让老人们能够体面地生活。',
        image: getAssetPath('/images/lifugui/section1.png')
      },
      {
        type: 'gallery',
        title: '周一义剪现场',
        media: [
          { 
            type: 'image', 
            src: getAssetPath('/images/lifugui/step1.png'), 
            caption: '精心修剪：李佳欣女士耐心地为每一位老人理发' 
          },
          { 
            type: 'image', 
            src: getAssetPath('/images/lifugui/step2.png'), 
            caption: '温馨时刻：老人们脸上洋溢着满足的笑容' 
          },
          { 
            type: 'image', 
            src: getAssetPath('/images/lifugui/step3.png'), 
            caption: '细心打理：每一剪都倾注了满满的爱意' 
          },
          { 
            type: 'image', 
            src: getAssetPath('/images/lifugui/step4.png'), 
            caption: '共进午餐：理发后，大家一起享用简单的午餐' 
          },
          { 
            type: 'image', 
            src: getAssetPath('/images/lifugui/step5.png'), 
            caption: '社区温暖：越来越多的老人和志愿者加入这个温暖的大家庭' 
          }
        ]
      },
      {
        type: 'impact',
        title: '从一个人到一群人',
        content: '李佳欣女士学习李富贵的义举感动了社区，现在每周一都有志愿者前来帮忙，有的协助理发，有的准备饭菜，有的陪伴老人聊天。这个小小的理发服务，成了社区最温暖的地方。',
        images: [getAssetPath('/images/lifugui/step5.png')]
      }
    ],
    quote: '"我受到李富贵的启发，也想为老人们做点什么。理发只是开始，陪伴才是最重要的。"',
    stats: { 
      volunteers: 12, 
      elders: 25, 
      haircuts: 500 
    }
  },
  {
    id: 2,
    name: '李佳欣',
    location: '陕西某村',
    title: '中午做饭：一餐饭的温暖',
    intro: '剪完发后，李佳欣女士学习李富贵的做法，为老人们准备午餐。她用日复一日的家常饭菜，叩响了留守老人的心门，也唤醒了整个社区的善意。从清晨的菜市场到中午的厨房，她用最朴素的行动，诠释了什么是"邻里守望"。',
    coverImage: getAssetPath('/images/lifugui/zuofan1.png'),
    coordinates: { x: '65%', y: '50%' },
    tag: '中午做饭',
    sections: [
      {
        type: 'text-image',
        title: '缘起：学习李富贵的温暖行动',
        content: '在陕西的一个小村庄里，李佳欣女士看到李富贵为老人做饭的故事，深受启发。她注意到村里的留守老人们常常因为行动不便，难以准备一日三餐。看着他们日渐消瘦的身影，她决定学习李富贵的做法。每周一剪完发后，她为老人们准备午餐，从最初为一位老人做饭，到后来服务整个村子的留守老人，这条路一走就是三年。',
        image: getAssetPath('/images/lifugui/zuofan1.png')
      },
      {
        type: 'gallery',
        title: '中午做饭的温暖时光',
        media: [
          { 
            type: 'image', 
            src: getAssetPath('/images/lifugui/zuofan1.png'), 
            caption: '清晨采购：天刚亮，李佳欣女士就来到菜市场，精心挑选新鲜蔬菜' 
          },
          { 
            type: 'image', 
            src: getAssetPath('/images/lifugui/zuofan2.png'), 
            caption: '细心洗切：回到家中，认真清洗每一片菜叶' 
          },
          { 
            type: 'video', 
            src: getAssetPath('/videos/lifugui/cooking.mp4'), 
            poster: getAssetPath('/images/lifugui/zuofan3.png'), 
            caption: '公益一天VLOG~~~' 
          },
          { 
            type: 'image', 
            src: getAssetPath('/images/lifugui/zuofan3.png'), 
            caption: '精心烹制：用心烹饪，确保营养均衡、软糯适口' 
          },
          { 
            type: 'image', 
            src: getAssetPath('/images/lifugui/zuofan4.png'), 
            caption: '共进午餐：剪完发后，大家一起享用温暖的午餐，聊聊天，感受家的温暖' 
          }
        ]
      },
      {
        type: 'impact',
        title: '涟漪效应',
        content: '李佳欣女士学习李富贵的行动感染了村里的年轻人，越来越多的志愿者加入这个温暖的行动。从最初的一个人，到现在15人的志愿者团队，服务范围也从8位老人扩展到整个社区。',
        images: [getAssetPath('/images/lifugui/zuofan4.png')]
      }
    ],
    quote: '"我受到李富贵的启发，也想为老人们做点什么。我没做什么大事，只是不想让他们觉得被忘了。"',
    stats: { 
      volunteers: 15, 
      elders: 8, 
      meals: 2000 
    }
  }
]
