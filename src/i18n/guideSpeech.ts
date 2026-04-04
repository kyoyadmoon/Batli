import type { HelperLangCode } from './types';

const EN_GUIDE_SPEECH: Record<string, string> = {
  '請選擇今天想學的生活主題': 'Please choose a topic for today.',
  '已完成目前的學習內容，請選擇新的生活主題': 'You have finished the current lessons. Please choose a new topic.',
  '歡迎來到識字學習': 'Welcome to literacy learning.',
  '歡迎來到注音符號學習': 'Welcome to Zhuyin learning.',
  '我們來學家庭相關的字': 'Let us learn words about family.',
  '我們來學吃東西相關的字': 'Let us learn words about food.',
  '我們來學交通相關的字': 'Let us learn words about transportation.',
  '我們來學數字和時間相關的字': 'Let us learn words about numbers and time.',
  '我們來學身體健康相關的字': 'Let us learn words about health.',
  '我們來學日常用品相關的字': 'Let us learn words about daily items.',
  '我們來學地點相關的字': 'Let us learn words about places.',
  '我們來學動物相關的字': 'Let us learn words about animals.',
  '我們來學家用電器相關的字': 'Let us learn words about home appliances.',
  '我們來學日常活動相關的字': 'Let us learn words about daily activities.',
  '我們來學家具相關的字': 'Let us learn words about furniture.',
  '接下來，聽一聽': 'Next, listen.',
  '接下來，寫一寫': 'Next, write it.',
  '先跳到寫一寫': 'Skip ahead to writing.',
  '現在，請跟著我一起寫': 'Now, write with me.',
  '很好，第一筆': 'Good. First stroke.',
  '寫得很漂亮！': 'Well done.',
  '這個單元學完了，請選擇下一個主題': 'This unit is complete. Please choose the next topic.',
  '注音符號都學完了！來考考看吧': 'You have finished all Zhuyin symbols. Let us try the quiz.',
  '太厲害了！注音測驗完成': 'Excellent. The Zhuyin quiz is complete.',
  '看筆順': 'Show stroke order.',
  '播放筆順': 'Play stroke order.',
  '重播筆順': 'Replay stroke order.',
  '再聽一次': 'Listen again.',
  '上一個': 'Previous.',
  '真棒！': 'Great.',
  '太厲害了！': 'Excellent.',
  '學會了喔！': 'You got it.',
  '很好！': 'Very good.',
  '好棒！': 'Nicely done.',
  '沒關係，再試一次看看': 'That is okay. Try again.',
  '慢慢來，不急': 'Take your time.',
  '再試一次': 'Try again.',
};

export function getGuideSpeechLang(code: HelperLangCode): string {
  return code === 'en' ? 'en-US' : 'zh-TW';
}

export function getGuideSpeechText(code: HelperLangCode, chineseText: string): string {
  if (code !== 'en') return chineseText;
  return EN_GUIDE_SPEECH[chineseText] ?? chineseText;
}
