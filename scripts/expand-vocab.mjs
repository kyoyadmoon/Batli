import fs from 'fs';
import path from 'path';

const VOCAB_DIR = path.resolve('src/data/vocabulary');

// Helper to inject characters into the TS files
function appendCharacters(fileName, newChars) {
  const filePath = path.join(VOCAB_DIR, fileName);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Find the highest existing order
  let currentMaxOrder = -1;
  const orderMatches = [...content.matchAll(/order:\s*(\d+)/g)];
  for (const match of orderMatches) {
    const o = parseInt(match[1], 10);
    if (o > currentMaxOrder) currentMaxOrder = o;
  }

  const themeMatch = content.match(/imageRef:\s*'\/images\/vocab\/([^\/]+)\//);
  const theme = themeMatch ? themeMatch[1] : fileName.replace('.ts', '');

  let injections = '';
  newChars.forEach((ch, index) => {
    const order = currentMaxOrder + 1 + index;
    // VERY simple pinyin approximation for imageRef placeholders
    const pinyin = ch.pinyin || 'placeholder';
    injections += `    {
      character: '${ch.c}',
      zhuyin: '${ch.z}',
      pronunciation: '${ch.c}',
      imageRef: '/images/vocab/${theme}/${pinyin}.webp',
      order: ${order},
      contextWord: '${ch.w}',
      contextPronunciation: '${ch.w}',
    },
`;
  });

  // insert before the closing bracket of characters array  "],\n}"
  content = content.replace(/  \],\n\} as const;/, injections + '  ],\n} as const;');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${fileName} with ${newChars.length} new characters.`);
}

// 1. Animals (+10)
appendCharacters('animals.ts', [
  { c: '鴨', z: 'ㄧㄚ', pinyin: 'ya', w: '鴨子' },
  { c: '鵝', z: 'ㄜˊ', pinyin: 'e', w: '天鵝' },
  { c: '鼠', z: 'ㄕㄨˇ', pinyin: 'shu', w: '老鼠' },
  { c: '兔', z: 'ㄊㄨˋ', pinyin: 'tu', w: '兔子' },
  { c: '蛇', z: 'ㄕㄜˊ', pinyin: 'she', w: '小蛇' },
  { c: '猴', z: 'ㄏㄡˊ', pinyin: 'hou', w: '猴子' },
  { c: '蛙', z: 'ㄨㄚ', pinyin: 'wa', w: '青蛙' },
  { c: '蝦', z: 'ㄒㄧㄚ', pinyin: 'xia', w: '蝦子' },
  { c: '蟹', z: 'ㄒㄧㄝˋ', pinyin: 'xie', w: '螃蟹' },
  { c: '蚊', z: 'ㄨㄣˊ', pinyin: 'wen', w: '蚊子' },
]);

// 2. Appliances (+10)
appendCharacters('appliances.ts', [
  { c: '電', z: 'ㄉㄧㄢˋ', pinyin: 'dian', w: '電風扇' },
  { c: '話', z: 'ㄏㄨㄚˋ', pinyin: 'hua', w: '電話' },
  { c: '鐘', z: 'ㄓㄨㄥ', pinyin: 'zhong', w: '時鐘' },
  { c: '錶', z: 'ㄅㄧㄠˇ', pinyin: 'biao', w: '手錶' },
  { c: '鍋', z: 'ㄍㄨㄛ', pinyin: 'guo', w: '電鍋' },
  { c: '氣', z: 'ㄑㄧˋ', pinyin: 'qi', w: '冷氣' },
  { c: '網', z: 'ㄨㄤˇ', pinyin: 'wang', w: '網路' },
  { c: '線', z: 'ㄒㄧㄢˋ', pinyin: 'xian', w: '電線' },
  { c: '烘', z: 'ㄏㄨㄥ', pinyin: 'hong', w: '烘乾' },
  { c: '烤', z: 'ㄎㄠˇ', pinyin: 'kao', w: '烤箱' },
]);

// 3. Daily Items (+10)
appendCharacters('daily-items.ts', [
  { c: '鎖', z: 'ㄙㄨㄛˇ', pinyin: 'suo', w: '門鎖' },
  { c: '匙', z: 'ㄔˊ', pinyin: 'chi', w: '鑰匙' },
  { c: '筆', z: 'ㄅㄧˇ', pinyin: 'bi', w: '鉛筆' },
  { c: '書', z: 'ㄕㄨ', pinyin: 'shu', w: '看書' },
  { c: '桌', z: 'ㄓㄨㄛ', pinyin: 'zhuo', w: '桌子' },
  { c: '椅', z: 'ㄧˇ', pinyin: 'yi', w: '椅子' },
  { c: '床', z: 'ㄔㄨㄤˊ', pinyin: 'chuang', w: '起床' },
  { c: '杯', z: 'ㄅㄟ', pinyin: 'bei', w: '杯子' },
  { c: '碗', z: 'ㄨㄢˇ', pinyin: 'wan', w: '飯碗' },
  { c: '盤', z: 'ㄆㄢˊ', pinyin: 'pan', w: '盤子' },
]);

// 4. Family (+13)
appendCharacters('family.ts', [
  { c: '哥', z: 'ㄍㄜ', pinyin: 'ge', w: '哥哥' },
  { c: '姊', z: 'ㄐㄧㄝˇ', pinyin: 'jie', w: '姊姊' },
  { c: '弟', z: 'ㄉㄧˋ', pinyin: 'di', w: '弟弟' },
  { c: '妹', z: 'ㄇㄟˋ', pinyin: 'mei', w: '妹妹' },
  { c: '公', z: 'ㄍㄨㄥ', pinyin: 'gong', w: '阿公' },
  { c: '嬤', z: 'ㄇㄚˋ', pinyin: 'ma', w: '阿嬤' },
  { c: '孫', z: 'ㄙㄨㄣ', pinyin: 'sun', w: '孫子' },
  { c: '叔', z: 'ㄕㄨˊ', pinyin: 'shu', w: '叔叔' },
  { c: '伯', z: 'ㄅㄛˊ', pinyin: 'bo', w: '阿伯' },
  { c: '姨', z: 'ㄧˊ', pinyin: 'yi', w: '阿姨' },
  { c: '舅', z: 'ㄐㄧㄡˋ', pinyin: 'jiu', w: '舅舅' },
  { c: '男', z: 'ㄋㄢˊ', pinyin: 'nan', w: '男生' },
  { c: '女', z: 'ㄋㄩˇ', pinyin: 'nǚ', w: '女生' },
]);

// 5. Food (+10)
appendCharacters('food.ts', [
  { c: '麵', z: 'ㄇㄧㄢˋ', pinyin: 'mian', w: '吃麵' },
  { c: '果', z: 'ㄍㄨㄛˇ', pinyin: 'guo', w: '水果' },
  { c: '餅', z: 'ㄅㄧㄥˇ', pinyin: 'bing', w: '餅乾' },
  { c: '糖', z: 'ㄊㄤˊ', pinyin: 'tang', w: '吃糖' },
  { c: '鹽', z: 'ㄧㄢˊ', pinyin: 'yan', w: '加鹽' },
  { c: '油', z: 'ㄧㄡˊ', pinyin: 'you', w: '加油' },
  { c: '奶', z: 'ㄋㄞˇ', pinyin: 'nai', w: '牛奶' },
  { c: '豆', z: 'ㄉㄡˋ', pinyin: 'dou', w: '豆腐' },
  { c: '蔥', z: 'ㄘㄨㄥ', pinyin: 'cong', w: '青蔥' },
  { c: '蒜', z: 'ㄙㄨㄢˋ', pinyin: 'suan', w: '大蒜' },
]);

// 6. Health (+10)
appendCharacters('health.ts', [
  { c: '腳', z: 'ㄐㄧㄠˇ', pinyin: 'jiao', w: '腳痛' },
  { c: '鼻', z: 'ㄅㄧˊ', pinyin: 'bi', w: '鼻子' },
  { c: '耳', z: 'ㄦˇ', pinyin: 'er', w: '耳朵' },
  { c: '口', z: 'ㄎㄡˇ', pinyin: 'kou', w: '嘴口' },
  { c: '心', z: 'ㄒㄧㄣ', pinyin: 'xin', w: '小心' },
  { c: '血', z: 'ㄒㄧㄝˇ', pinyin: 'xie', w: '流血' },
  { c: '汗', z: 'ㄏㄢˋ', pinyin: 'han', w: '流汗' },
  { c: '病', z: 'ㄅㄧㄥˋ', pinyin: 'bing', w: '生病' },
  { c: '傷', z: 'ㄕㄤ', pinyin: 'shang', w: '受傷' },
  { c: '咳', z: 'ㄎㄜˊ', pinyin: 'ke', w: '咳嗽' },
]);

// 7. Numbers Time (+4, because 1-10 + 6 = 16)
appendCharacters('numbers-time.ts', [
  { c: '千', z: 'ㄑㄧㄢ', pinyin: 'qian', w: '一千' },
  { c: '萬', z: 'ㄨㄢˋ', pinyin: 'wan', w: '一萬' },
  { c: '點', z: 'ㄉㄧㄢˇ', pinyin: 'dian', w: '十點' },
  { c: '分', z: 'ㄈㄣ', pinyin: 'fen', w: '五分' },
]);

// 8. Places (+10)
appendCharacters('places.ts', [
  { c: '所', z: 'ㄙㄨㄛˇ', pinyin: 'suo', w: '廁所' },
  { c: '局', z: 'ㄐㄩˊ', pinyin: 'ju', w: '郵局' },
  { c: '校', z: 'ㄒㄧㄠˋ', pinyin: 'xiao', w: '學校' },
  { c: '廠', z: 'ㄔㄤˇ', pinyin: 'chang', w: '工廠' },
  { c: '街', z: 'ㄐㄧㄝ', pinyin: 'jie', w: '逛街' },
  { c: '道', z: 'ㄉㄠˋ', pinyin: 'dao', w: '道路' },
  { c: '橋', z: 'ㄑㄧㄠˊ', pinyin: 'qiao', w: '過橋' },
  { c: '村', z: 'ㄘㄨㄣ', pinyin: 'cun', w: '農村' },
  { c: '區', z: 'ㄑㄩ', pinyin: 'qu', w: '市區' },
  { c: '港', z: 'ㄍㄤˇ', pinyin: 'gang', w: '海港' },
]);

// 9. Transportation (+10)
appendCharacters('transportation.ts', [
  { c: '船', z: 'ㄔㄨㄢˊ', pinyin: 'chuan', w: '坐船' },
  { c: '飛', z: 'ㄈㄟ', pinyin: 'fei', w: '飛機' },
  { c: '東', z: 'ㄉㄨㄥ', pinyin: 'dong', w: '東邊' },
  { c: '西', z: 'ㄒㄧ', pinyin: 'xi', w: '西邊' },
  { c: '前', z: 'ㄑㄧㄢˊ', pinyin: 'qian', w: '前面' },
  { c: '後', z: 'ㄏㄡˋ', pinyin: 'hou', w: '後面' },
  { c: '上', z: 'ㄕㄤˋ', pinyin: 'shang', w: '上車' },
  { c: '下', z: 'ㄒㄧㄚˋ', pinyin: 'xia', w: '下車' },
  { c: '快', z: 'ㄎㄨㄞˋ', pinyin: 'kuai', w: '很快' },
  { c: '慢', z: 'ㄇㄢˋ', pinyin: 'man', w: '很慢' },
]);
