import type { HelperWordSet } from '../types';
import { enUi } from './en-ui';

export const en: HelperWordSet = {
  characters: {
    // Family
    '家': { translation: 'home; family' },
    '人': { translation: 'person; people' },
    '大': { translation: 'big; large' },
    '小': { translation: 'small; little' },
    '好': { translation: 'good; well' },
    '爸': { translation: 'dad; father' },
    '媽': { translation: 'mom; mother' },

    // Food
    '吃': { translation: 'eat' },
    '飯': { translation: 'rice; meal' },
    '水': { translation: 'water' },
    '茶': { translation: 'tea' },
    '肉': { translation: 'meat' },
    '菜': { translation: 'vegetable; dish' },
    '魚': { translation: 'fish' },
    '蛋': { translation: 'egg' },
    '湯': { translation: 'soup' },
    '甜': { translation: 'sweet' },

    // Transportation
    '車': { translation: 'car; vehicle' },
    '站': { translation: 'station; stop' },
    '路': { translation: 'road; way' },
    '北': { translation: 'north' },
    '南': { translation: 'south' },
    '出': { translation: 'exit; go out' },
    '入': { translation: 'enter' },
    '左': { translation: 'left' },
    '右': { translation: 'right' },
    '停': { translation: 'stop' },

    // Numbers-time
    '一': { translation: 'one' },
    '二': { translation: 'two' },
    '三': { translation: 'three' },
    '十': { translation: 'ten' },
    '百': { translation: 'hundred' },
    '元': { translation: 'dollar; yuan' },
    '月': { translation: 'month; moon' },
    '日': { translation: 'day; sun' },
    '今': { translation: 'today; now' },
    '年': { translation: 'year' },

    // Health
    '醫': { translation: 'medical; doctor' },
    '院': { translation: 'hospital; institute' },
    '藥': { translation: 'medicine' },
    '痛': { translation: 'pain; ache' },
    '頭': { translation: 'head' },
    '手': { translation: 'hand' },
    '眼': { translation: 'eye' },
    '牙': { translation: 'tooth' },
    '熱': { translation: 'hot; fever' },
    '冷': { translation: 'cold' },

    // Daily-items
    '買': { translation: 'buy' },
    '賣': { translation: 'sell' },
    '開': { translation: 'open; turn on' },
    '關': { translation: 'close; turn off' },
    '電': { translation: 'electric; electricity' },
    '話': { translation: 'speech; words' },
    '紙': { translation: 'paper' },
    '衣': { translation: 'clothes' },
    '錢': { translation: 'money' },
    '門': { translation: 'door; gate' },

    // Animals
    '狗': { translation: 'dog' },
    '貓': { translation: 'cat' },
    '豬': { translation: 'pig' },
    '牛': { translation: 'cow; ox' },
    '羊': { translation: 'sheep; goat' },
    '雞': { translation: 'chicken' },
    '鳥': { translation: 'bird' },
    '馬': { translation: 'horse' },
    '蟲': { translation: 'insect; bug' },

    // Appliances
    '視': { translation: 'watch; view' },
    '腦': { translation: 'brain' },
    '機': { translation: 'machine' },
    '洗': { translation: 'wash' },
    '冰': { translation: 'ice; frozen' },
    '箱': { translation: 'box; case' },
    '燈': { translation: 'lamp; light' },
    '扇': { translation: 'fan' },
    '爐': { translation: 'stove; oven' },

    // Places
    '台': { translation: 'Taiwan' },
    '中': { translation: 'center; middle' },
    '市': { translation: 'city; market' },
    '店': { translation: 'shop; store' },
    '學': { translation: 'study; learn' },
    '公': { translation: 'public' },
    '園': { translation: 'park; garden' },
    '銀': { translation: 'silver; bank' },
    '行': { translation: 'walk; bank' },
    '廁': { translation: 'toilet' },

    // Common words 1
    '不': { translation: 'not; no' },
    '了': { translation: '(completed action)' },
    '也': { translation: 'also; too' },
    '有': { translation: 'have; exist' },
    '在': { translation: 'at; in' },
    '那': { translation: 'that' },
    '的': { translation: "'s; of" },
    '和': { translation: 'and; with' },
    '是': { translation: 'is; am; are' },
    '這': { translation: 'this' },

    // Common words 2
    '可': { translation: 'can; may' },
    '沒': { translation: 'not; without' },
    '你': { translation: 'you' },
    '到': { translation: 'arrive; to' },
    '要': { translation: 'want; need' },
    '很': { translation: 'very' },
    '都': { translation: 'all; every' },
    '就': { translation: 'then; just' },
    '給': { translation: 'give; to' },
    '會': { translation: 'can; will' },
  },

  words: {
    // 家
    '家人': { translation: 'family members' },
    '回家': { translation: 'go home' },
    '家門': { translation: 'front door' },
    '家裡': { translation: 'at home' },
    '家庭': { translation: 'family; household' },
    '老家': { translation: 'hometown' },

    // 人
    '大人': { translation: 'adult' },
    '客人': { translation: 'guest' },
    '人口': { translation: 'population' },
    '工人': { translation: 'worker' },
    '病人': { translation: 'patient' },

    // 大
    '大門': { translation: 'main gate' },
    '大家': { translation: 'everyone' },
    '大雨': { translation: 'heavy rain' },
    '大象': { translation: 'elephant' },
    '大衣': { translation: 'overcoat' },

    // 小
    '小孩': { translation: 'child' },
    '小狗': { translation: 'puppy' },
    '小雨': { translation: 'light rain' },
    '小貓': { translation: 'kitten' },
    '小包': { translation: 'small bag' },
    '小心': { translation: 'be careful' },

    // 好
    '你好': { translation: 'hello' },
    '好吃': { translation: 'delicious' },
    '好友': { translation: 'good friend' },
    '好看': { translation: 'good-looking' },
    '好玩': { translation: 'fun' },
    '好嗎': { translation: 'how are you?' },

    // 爸
    '爸爸': { translation: 'dad' },
    '爸媽': { translation: 'parents' },
    '老爸': { translation: 'old man; dad' },
    '爸爸上班': { translation: 'dad goes to work' },
    '爸爸回家': { translation: 'dad comes home' },
    '爸爸鞋': { translation: "dad's shoes" },

    // 媽
    '媽媽': { translation: 'mom' },
    '媽咪': { translation: 'mommy' },
    '媽媽煮飯': { translation: 'mom cooks' },
    '媽媽回家': { translation: 'mom comes home' },
    '媽媽洗衣': { translation: 'mom does laundry' },

    // 吃
    '吃飯': { translation: 'eat; have a meal' },
    '吃麵': { translation: 'eat noodles' },
    '吃水果': { translation: 'eat fruit' },
    '吃菜': { translation: 'eat vegetables' },
    '吃藥': { translation: 'take medicine' },
    '吃早餐': { translation: 'eat breakfast' },

    // 飯
    '白飯': { translation: 'white rice' },
    '便當': { translation: 'lunch box' },
    '飯糰': { translation: 'rice ball' },
    '米飯': { translation: 'cooked rice' },
    '稀飯': { translation: 'congee; porridge' },
    '炒飯': { translation: 'fried rice' },

    // 水
    '喝水': { translation: 'drink water' },
    '熱水': { translation: 'hot water' },
    '開水': { translation: 'boiled water' },
    '冷水': { translation: 'cold water' },
    '水杯': { translation: 'water cup' },
    '水壺': { translation: 'water bottle; kettle' },

    // 茶
    '喝茶': { translation: 'drink tea' },
    '奶茶': { translation: 'milk tea' },
    '茶杯': { translation: 'tea cup' },
    '茶葉': { translation: 'tea leaves' },
    '紅茶': { translation: 'black tea' },
    '綠茶': { translation: 'green tea' },

    // 肉
    '豬肉': { translation: 'pork' },
    '雞肉': { translation: 'chicken' },
    '肉湯': { translation: 'meat soup' },
    '牛肉': { translation: 'beef' },
    '肉包': { translation: 'meat bun' },
    '肉鬆': { translation: 'dried pork floss' },

    // 菜
    '青菜': { translation: 'greens' },
    '菜單': { translation: 'menu' },
    '買菜': { translation: 'buy groceries' },
    '高麗菜': { translation: 'cabbage' },
    '小白菜': { translation: 'bok choy' },
    '菜市場': { translation: 'wet market' },

    // 魚
    '魚湯': { translation: 'fish soup' },
    '小魚': { translation: 'small fish' },
    '烤魚': { translation: 'grilled fish' },
    '魚肉': { translation: 'fish meat' },
    '魚市場': { translation: 'fish market' },
    '魚丸': { translation: 'fish ball' },

    // 蛋
    '雞蛋': { translation: 'chicken egg' },
    '蛋餅': { translation: 'egg pancake' },
    '荷包蛋': { translation: 'fried egg' },
    '茶葉蛋': { translation: 'tea egg' },
    '蛋花湯': { translation: 'egg drop soup' },
    '蛋糕': { translation: 'cake' },

    // 湯
    '喝湯': { translation: 'drink soup' },
    '熱湯': { translation: 'hot soup' },
    '菜湯': { translation: 'vegetable soup' },
    '湯匙': { translation: 'spoon' },

    // 甜
    '甜點': { translation: 'dessert' },
    '甜湯': { translation: 'sweet soup' },
    '甜甜圈': { translation: 'donut' },
    '甜麵包': { translation: 'sweet bread' },
    '甜水果': { translation: 'sweet fruit' },
    '甜飲': { translation: 'sweet drink' },

    // 車
    '公車': { translation: 'bus' },
    '火車': { translation: 'train' },
    '停車': { translation: 'parking' },
    '車票': { translation: 'ticket' },
    '車門': { translation: 'car door' },
    '車站': { translation: 'station' },

    // 站
    '站牌': { translation: 'bus stop sign' },
    '站好': { translation: 'stand properly' },
    '站著': { translation: 'standing' },
    '站內': { translation: 'inside the station' },
    '站外': { translation: 'outside the station' },

    // 路
    '馬路': { translation: 'road' },
    '路口': { translation: 'intersection' },
    '路線': { translation: 'route' },
    '過路': { translation: 'cross the road' },
    '問路': { translation: 'ask for directions' },
    '路邊': { translation: 'roadside' },

    // 北
    '台北': { translation: 'Taipei' },
    '北上': { translation: 'go north' },
    '北風': { translation: 'north wind' },
    '北門': { translation: 'north gate' },
    '北區': { translation: 'north district' },
    '北車': { translation: 'Taipei Main Station' },

    // 南
    '台南': { translation: 'Tainan' },
    '南下': { translation: 'go south' },
    '南門': { translation: 'south gate' },
    '南部': { translation: 'southern area' },
    '南瓜': { translation: 'pumpkin' },
    '南投': { translation: 'Nantou' },

    // 出
    '出口': { translation: 'exit' },
    '出門': { translation: 'go out' },
    '出發': { translation: 'depart' },
    '出站': { translation: 'exit station' },
    '出院': { translation: 'leave hospital' },
    '出去': { translation: 'go outside' },

    // 入
    '入口': { translation: 'entrance' },
    '入內': { translation: 'enter' },
    '入座': { translation: 'take a seat' },
    '進入': { translation: 'enter' },
    '入門': { translation: 'beginner' },
    '入場': { translation: 'admission' },

    // 左
    '左邊': { translation: 'left side' },
    '左轉': { translation: 'turn left' },
    '左手': { translation: 'left hand' },
    '左腳': { translation: 'left foot' },
    '左門': { translation: 'left door' },
    '左上': { translation: 'upper left' },

    // 右
    '右邊': { translation: 'right side' },
    '右轉': { translation: 'turn right' },
    '右手': { translation: 'right hand' },
    '右腳': { translation: 'right foot' },
    '右門': { translation: 'right door' },
    '右上': { translation: 'upper right' },

    // 停
    '停下': { translation: 'stop' },
    '暫停': { translation: 'pause' },
    '停車場': { translation: 'parking lot' },
    '停站': { translation: 'stop at station' },
    '停好': { translation: 'parked properly' },

    // 一
    '一個': { translation: 'one piece' },
    '一天': { translation: 'one day' },
    '一月': { translation: 'January' },
    '一次': { translation: 'one time' },
    '一人': { translation: 'one person' },
    '一樓': { translation: 'first floor' },

    // 二
    '二人': { translation: 'two people' },
    '二月': { translation: 'February' },
    '二樓': { translation: 'second floor' },
    '二十': { translation: 'twenty' },
    '星期二': { translation: 'Tuesday' },
    '二百': { translation: 'two hundred' },

    // 三
    '三個': { translation: 'three pieces' },
    '三天': { translation: 'three days' },
    '三樓': { translation: 'third floor' },
    '三月': { translation: 'March' },
    '星期三': { translation: 'Wednesday' },
    '三百': { translation: 'three hundred' },

    // 十
    '十元': { translation: 'ten dollars' },
    '十點': { translation: "ten o'clock" },
    '十月': { translation: 'October' },
    '十天': { translation: 'ten days' },
    '十樓': { translation: 'tenth floor' },
    '十包': { translation: 'ten packs' },

    // 百
    '一百': { translation: 'one hundred' },
    '百貨': { translation: 'department store' },
    '百元': { translation: 'one hundred dollars' },
    '百分': { translation: 'percent' },
    '百頁': { translation: 'many pages' },
    '百貨公司': { translation: 'department store' },

    // 元
    '元旦': { translation: "New Year's Day" },
    '二十元': { translation: 'twenty dollars' },
    '五十元': { translation: 'fifty dollars' },
    '一百元': { translation: 'one hundred dollars' },

    // 月
    '月亮': { translation: 'moon' },
    '月曆': { translation: 'monthly calendar' },
    '五月': { translation: 'May' },
    '月餅': { translation: 'moon cake' },
    '月底': { translation: 'end of month' },

    // 日
    '今日': { translation: 'today' },
    '生日': { translation: 'birthday' },
    '日期': { translation: 'date' },
    '日曆': { translation: 'calendar' },
    '星期日': { translation: 'Sunday' },
    '日出': { translation: 'sunrise' },

    // 今
    '今天': { translation: 'today' },
    '今年': { translation: 'this year' },
    '今晚': { translation: 'tonight' },
    '今早': { translation: 'this morning' },
    '今晨': { translation: 'this morning' },

    // 年
    '新年': { translation: 'New Year' },
    '年糕': { translation: 'rice cake' },
    '去年': { translation: 'last year' },
    '明年': { translation: 'next year' },
    '年齡': { translation: 'age' },

    // 醫
    '醫生': { translation: 'doctor' },
    '醫院': { translation: 'hospital' },
    '牙醫': { translation: 'dentist' },
    '中醫': { translation: 'Chinese medicine' },
    '醫藥': { translation: 'medical' },
    '醫護': { translation: 'medical staff' },

    // 院
    '院長': { translation: 'director' },
    '住院': { translation: 'hospitalized' },
    '院內': { translation: 'inside hospital' },
    '院外': { translation: 'outside hospital' },

    // 藥
    '藥局': { translation: 'pharmacy' },
    '藥袋': { translation: 'medicine bag' },
    '藥水': { translation: 'liquid medicine' },
    '藥丸': { translation: 'pill' },
    '藥單': { translation: 'prescription' },

    // 痛
    '頭痛': { translation: 'headache' },
    '肚子痛': { translation: 'stomachache' },
    '腳痛': { translation: 'leg pain' },
    '牙痛': { translation: 'toothache' },
    '手痛': { translation: 'hand pain' },
    '背痛': { translation: 'backache' },

    // 頭
    '頭髮': { translation: 'hair' },
    '頭巾': { translation: 'headscarf' },
    '頭暈': { translation: 'dizzy' },
    '頭部': { translation: 'head area' },
    '頭頂': { translation: 'top of head' },

    // 手
    '洗手': { translation: 'wash hands' },
    '手機': { translation: 'cellphone' },
    '手套': { translation: 'gloves' },
    '手帕': { translation: 'handkerchief' },

    // 眼
    '眼睛': { translation: 'eyes' },
    '眼鏡': { translation: 'glasses' },
    '眼藥水': { translation: 'eye drops' },
    '眼科': { translation: 'ophthalmology' },
    '眼淚': { translation: 'tears' },
    '閉眼': { translation: 'close eyes' },

    // 牙
    '刷牙': { translation: 'brush teeth' },
    '牙刷': { translation: 'toothbrush' },
    '牙膏': { translation: 'toothpaste' },
    '牙齒': { translation: 'teeth' },

    // 熱
    '發熱': { translation: 'fever' },
    '熱茶': { translation: 'hot tea' },
    '熱飯': { translation: 'hot rice' },
    '熱天': { translation: 'hot day' },

    // 冷
    '冷氣': { translation: 'air conditioning' },
    '冷天': { translation: 'cold day' },
    '冷飯': { translation: 'cold rice' },
    '冷風': { translation: 'cold wind' },
    '冷飲': { translation: 'cold drink' },

    // 買
    '買東西': { translation: 'go shopping' },
    '買藥': { translation: 'buy medicine' },
    '買水': { translation: 'buy water' },
    '買票': { translation: 'buy tickets' },
    '買衣服': { translation: 'buy clothes' },

    // 賣
    '賣場': { translation: 'store; mart' },
    '賣菜': { translation: 'sell vegetables' },
    '賣票': { translation: 'sell tickets' },
    '賣魚': { translation: 'sell fish' },
    '賣肉': { translation: 'sell meat' },
    '賣水果': { translation: 'sell fruit' },

    // 開
    '開門': { translation: 'open the door' },
    '開車': { translation: 'drive' },
    '開燈': { translation: 'turn on light' },
    '開店': { translation: 'open a shop' },
    '開窗': { translation: 'open window' },

    // 關
    '關門': { translation: 'close the door' },
    '關燈': { translation: 'turn off light' },
    '關窗': { translation: 'close window' },
    '關水': { translation: 'turn off water' },
    '關店': { translation: 'close shop' },
    '關機': { translation: 'power off' },

    // 電
    '電話': { translation: 'telephone' },
    '電視': { translation: 'television' },
    '電燈': { translation: 'electric light' },
    '電扇': { translation: 'electric fan' },
    '電梯': { translation: 'elevator' },
    '電池': { translation: 'battery' },

    // 話
    '說話': { translation: 'speak' },
    '問話': { translation: 'ask a question' },
    '回話': { translation: 'reply' },
    '講話': { translation: 'talk' },
    '對話': { translation: 'dialogue' },

    // 紙
    '衛生紙': { translation: 'tissue paper' },
    '白紙': { translation: 'blank paper' },
    '紙箱': { translation: 'cardboard box' },
    '紙袋': { translation: 'paper bag' },
    '報紙': { translation: 'newspaper' },
    '紙杯': { translation: 'paper cup' },

    // 衣
    '衣服': { translation: 'clothes' },
    '雨衣': { translation: 'raincoat' },
    '洗衣': { translation: 'do laundry' },
    '上衣': { translation: 'top; shirt' },
    '毛衣': { translation: 'sweater' },

    // 錢
    '錢包': { translation: 'wallet' },
    '零錢': { translation: 'change' },
    '找錢': { translation: 'give change' },
    '錢袋': { translation: 'money pouch' },
    '存錢': { translation: 'save money' },
    '花錢': { translation: 'spend money' },

    // 門
    '門口': { translation: 'doorway' },
    '門鈴': { translation: 'doorbell' },
    '門牌': { translation: 'door number' },
    '門把': { translation: 'door handle' },

    // Animals context words (小狗, 小貓, 豬肉, 雞蛋, 魚肉, 馬路 already defined above)
    '牛奶': { translation: 'milk' },
    '綿羊': { translation: 'sheep' },
    '小鳥': { translation: 'little bird' },
    '毛毛蟲': { translation: 'caterpillar' },

    // Appliances context words (電視, 電燈, 電扇, 紙箱, 冷氣 already defined above)
    '電腦': { translation: 'computer' },
    '洗衣機': { translation: 'washing machine' },
    '洗衣服': { translation: 'do laundry' },
    '冰箱': { translation: 'refrigerator' },
    '電風扇': { translation: 'electric fan' },
    '微波爐': { translation: 'microwave oven' },

    // 台
    '台灣': { translation: 'Taiwan' },
    '台中': { translation: 'Taichung' },
    '櫃台': { translation: 'counter' },
    '月台': { translation: 'platform' },

    // 中
    '中午': { translation: 'noon' },
    '中心': { translation: 'center' },
    '中間': { translation: 'middle' },
    '中秋': { translation: 'Mid-Autumn Festival' },

    // 市
    '市場': { translation: 'market' },
    '台北市': { translation: 'Taipei City' },
    '超市': { translation: 'supermarket' },
    '市區': { translation: 'downtown' },
    '夜市': { translation: 'night market' },
    '市民': { translation: 'citizen' },

    // 店
    '商店': { translation: 'shop' },
    '書店': { translation: 'bookstore' },
    '飯店': { translation: 'hotel' },
    '店門': { translation: 'shop door' },
    '店員': { translation: 'shop clerk' },
    '店裡': { translation: 'inside the shop' },

    // 學
    '學校': { translation: 'school' },
    '學生': { translation: 'student' },
    '學習': { translation: 'study; learn' },
    '學費': { translation: 'tuition' },
    '上學': { translation: 'go to school' },
    '學會': { translation: 'learned' },

    // 公
    '公園': { translation: 'park' },
    '公用電話': { translation: 'public phone' },
    '公司': { translation: 'company' },
    '公共': { translation: 'public' },
    '公寓': { translation: 'apartment' },

    // 園
    '花園': { translation: 'garden' },
    '園區': { translation: 'campus' },
    '動物園': { translation: 'zoo' },
    '幼兒園': { translation: 'kindergarten' },
    '菜園': { translation: 'vegetable garden' },

    // 銀
    '銀行': { translation: 'bank' },
    '銀樓': { translation: 'jewelry store' },
    '銀幣': { translation: 'silver coin' },
    '銀色': { translation: 'silver color' },
    '銀行卡': { translation: 'bank card' },
    '銀髮': { translation: 'silver hair' },

    // 行
    '行人': { translation: 'pedestrian' },
    '行李': { translation: 'luggage' },
    '行走': { translation: 'walk' },
    '行程': { translation: 'itinerary' },
    '行號': { translation: 'business name' },

    // 廁
    '廁所': { translation: 'toilet; restroom' },
    '男廁': { translation: "men's room" },
    '女廁': { translation: "women's room" },
    '公廁': { translation: 'public restroom' },
    '廁紙': { translation: 'toilet paper' },
    '廁門': { translation: 'restroom door' },

    // ===== 不 =====
    '不要': { translation: "don't" },
    '不好': { translation: 'not good; bad' },
    '不行': { translation: "can't; not allowed" },
    '不可': { translation: 'must not' },
    '不對': { translation: 'incorrect; wrong' },

    // ===== 了 =====
    '好了': { translation: 'done; ready' },
    '了解': { translation: 'understand' },
    '走了': { translation: 'left; gone' },
    '到了': { translation: 'arrived' },
    '吃了': { translation: 'ate; have eaten' },

    // ===== 也 =====
    '也是': { translation: 'also is' },
    '也好': { translation: 'alright; fine too' },
    '也要': { translation: 'also want' },
    '也會': { translation: 'also can' },

    // ===== 有 =====
    '有人': { translation: 'someone' },
    '有名': { translation: 'famous' },
    '有心': { translation: 'thoughtful' },
    '沒有': { translation: "don't have; no" },
    '所有': { translation: 'all; every' },

    // ===== 在 =====
    '在家': { translation: 'at home' },
    '不在': { translation: 'not here; absent' },
    '現在': { translation: 'now' },
    '在外': { translation: 'outside' },
    '在地': { translation: 'local' },

    // ===== 那 =====
    '那個': { translation: 'that one' },
    '那邊': { translation: 'over there' },
    '那裡': { translation: 'there' },
    '那天': { translation: 'that day' },

    // ===== 的 =====
    '我的': { translation: 'my; mine' },
    '你的': { translation: 'your; yours' },
    '好的': { translation: 'okay; good' },
    '大的': { translation: 'the big one' },
    '真的': { translation: 'really; true' },

    // ===== 和 =====
    '和好': { translation: 'reconcile' },
    '和氣': { translation: 'friendly; amiable' },
    '和平': { translation: 'peace' },
    '和睦': { translation: 'harmonious' },

    // ===== 是 ===== ('也是' defined above under 也)
    '是的': { translation: 'yes; correct' },
    '就是': { translation: 'exactly; precisely' },
    '但是': { translation: 'but; however' },
    '是非': { translation: 'right and wrong' },

    // ===== 這 =====
    '這個': { translation: 'this one' },
    '這裡': { translation: 'here' },
    '這邊': { translation: 'this side; over here' },
    '這次': { translation: 'this time' },
    '這陣': { translation: 'right now' },

    // ===== 可 =====
    '可以': { translation: 'can; okay' },
    '可能': { translation: 'maybe; possible' },
    '可怕': { translation: 'scary' },
    '可惜': { translation: 'what a pity' },
    '可愛': { translation: 'cute' },

    // ===== 沒 ===== ('沒有' defined above under 有)
    '沒事': { translation: "it's nothing" },
    '沒關係': { translation: "it doesn't matter" },
    '沒問題': { translation: 'no problem' },

    // ===== 你 ===== ('你好' defined in Family section, '你的' defined under 的)
    '你們': { translation: 'you all' },
    '給你': { translation: 'give you; for you' },

    // ===== 到 ===== ('到了' defined above under 了)
    '到底': { translation: 'after all; exactly' },
    '到時': { translation: 'when the time comes' },
    '周到': { translation: 'thoughtful; thorough' },
    '報到': { translation: 'check in; report' },

    // ===== 要 =====
    '要去': { translation: 'going to go' },
    '要緊': { translation: 'important; urgent' },
    '主要': { translation: 'main; primary' },
    '需要': { translation: 'need; require' },

    // ===== 很 =====
    '很好': { translation: 'very good' },
    '很多': { translation: 'a lot; many' },
    '很大': { translation: 'very big' },
    '很快': { translation: 'very fast' },
    '很忙': { translation: 'very busy' },

    // ===== 都 =====
    '都好': { translation: 'all good; either is fine' },
    '都是': { translation: 'all are' },
    '都有': { translation: 'all have' },
    '都要': { translation: 'all want; want everything' },

    // ===== 就 ===== ('就是' defined above under 是)
    '就好': { translation: 'that will do' },
    '就近': { translation: 'nearby' },
    '就醫': { translation: 'see a doctor' },
    '成就': { translation: 'achievement' },

    // ===== 給 ===== ('給你' defined above under 你)
    '給錢': { translation: 'pay; give money' },
    '交給': { translation: 'hand over to' },
    '送給': { translation: 'give as a gift' },

    // ===== 會 ===== ('學會' defined in Activities section)
    '不會': { translation: "can't; won't" },
    '開會': { translation: 'have a meeting' },
    '再會': { translation: 'goodbye' },
    '社會': { translation: 'society' },
  },
  ui: enUi,
};
