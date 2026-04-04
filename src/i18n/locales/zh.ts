import type { HelperWordSet } from '../types';
import { zhUi } from './zh-ui';

export const zh: HelperWordSet = {
  characters: {
    // ─── Family unit ───
    '家': { translation: '家庭、住所' },
    '人': { translation: '人類、人物' },
    '大': { translation: '體積或數量大的' },
    '小': { translation: '體積或數量小的' },
    '好': { translation: '優良的、喜歡' },
    '爸': { translation: '父親' },
    '媽': { translation: '母親' },

    // ─── Food unit ───
    '吃': { translation: '進食、用餐' },
    '飯': { translation: '煮熟的米、餐食' },
    '水': { translation: '液態的水' },
    '茶': { translation: '茶葉泡的飲料' },
    '肉': { translation: '動物的肉' },
    '菜': { translation: '蔬菜、菜餚' },
    '魚': { translation: '水中的魚' },
    '蛋': { translation: '鳥禽的卵' },
    '湯': { translation: '煮的湯水' },
    '甜': { translation: '甜的味道' },

    // ─── Transportation unit ───
    '車': { translation: '交通工具、車輛' },
    '站': { translation: '車站、站立' },
    '路': { translation: '道路' },
    '北': { translation: '北方' },
    '南': { translation: '南方' },
    '出': { translation: '出去、離開' },
    '入': { translation: '進入' },
    '左': { translation: '左邊' },
    '右': { translation: '右邊' },
    '停': { translation: '停止、停下' },

    // ─── Numbers-time unit ───
    '一': { translation: '數字1' },
    '二': { translation: '數字2' },
    '三': { translation: '數字3' },
    '十': { translation: '數字10' },
    '百': { translation: '數字100' },
    '元': { translation: '金錢單位' },
    '月': { translation: '月亮、月份' },
    '日': { translation: '太陽、日子' },
    '今': { translation: '現在、今天' },
    '年': { translation: '年份、歲數' },

    // ─── Health unit ───
    '醫': { translation: '醫療、醫生' },
    '院': { translation: '醫院、院所' },
    '藥': { translation: '藥品、藥物' },
    '痛': { translation: '疼痛、身體不舒服' },
    '頭': { translation: '頭部' },
    '手': { translation: '手部' },
    '眼': { translation: '眼睛' },
    '牙': { translation: '牙齒' },
    '熱': { translation: '溫度高的' },
    '冷': { translation: '溫度低的' },

    // ─── Daily-items unit ───
    '買': { translation: '購買' },
    '賣': { translation: '出售、販賣' },
    '開': { translation: '打開' },
    '關': { translation: '關閉' },
    '電': { translation: '電力、電器' },
    '話': { translation: '說話、話語' },
    '紙': { translation: '紙張' },
    '衣': { translation: '衣服、服裝' },
    '錢': { translation: '金錢、貨幣' },
    '門': { translation: '門戶' },

    // ─── Animals unit ───
    '狗': { translation: '狗、小狗' },
    '貓': { translation: '貓、小貓' },
    '豬': { translation: '豬、家畜' },
    '牛': { translation: '牛、黃牛' },
    '羊': { translation: '羊、綿羊' },
    '雞': { translation: '雞、家禽' },
    '鳥': { translation: '鳥類、小鳥' },
    '馬': { translation: '馬匹' },
    '蟲': { translation: '昆蟲' },

    // ─── Appliances unit ───
    '視': { translation: '看、觀看' },
    '腦': { translation: '腦部、頭腦' },
    '機': { translation: '機器' },
    '洗': { translation: '清洗' },
    '冰': { translation: '冰凍的' },
    '箱': { translation: '箱子' },
    '燈': { translation: '燈具、照明' },
    '扇': { translation: '扇子' },
    '爐': { translation: '爐子、灶' },

    // ─── Places unit ───
    '台': { translation: '台灣的台' },
    '中': { translation: '中間、中心' },
    '市': { translation: '城市、市場' },
    '店': { translation: '商店' },
    '學': { translation: '學習、學校' },
    '公': { translation: '公共的' },
    '園': { translation: '園地、花園' },
    '銀': { translation: '銀色、銀行' },
    '行': { translation: '行走、銀行' },
    '廁': { translation: '廁所' },

    // ─── Common words 1 ───
    '不': { translation: '否定、不是' },
    '了': { translation: '表示完成或改變' },
    '也': { translation: '同樣、也是' },
    '有': { translation: '擁有、存在' },
    '在': { translation: '位於、存在' },
    '那': { translation: '那個、指較遠的' },
    '的': { translation: '表示所屬關係' },
    '和': { translation: '跟、與' },
    '是': { translation: '表示肯定判斷' },
    '這': { translation: '這個、指較近的' },

    // ─── Common words 2 ───
    '可': { translation: '可以、允許' },
    '沒': { translation: '沒有、不曾' },
    '你': { translation: '對方、你' },
    '到': { translation: '到達、抵達' },
    '要': { translation: '想要、需要' },
    '很': { translation: '非常、程度高' },
    '都': { translation: '全部、皆' },
    '就': { translation: '就是、馬上' },
    '給': { translation: '給予、交給' },
    '會': { translation: '能夠、聚會' },
  },

  words: {
    // ─── 家 related words ───
    '家人': { translation: '家庭成員' },
    '回家': { translation: '返回家裡' },
    '家門': { translation: '家的門' },
    '家裡': { translation: '家的裡面' },
    '家庭': { translation: '一家人' },
    '老家': { translation: '故鄉的家' },

    // ─── 人 related words ───
    '大人': { translation: '成年人' },
    '客人': { translation: '來訪的人' },
    // '家人' already defined above
    '人口': { translation: '人的數量' },
    '工人': { translation: '做工的人' },
    '病人': { translation: '生病的人' },

    // ─── 大 related words ───
    // '大人' already defined above
    '大門': { translation: '正門' },
    '大家': { translation: '所有人' },
    '大雨': { translation: '很大的雨' },
    '大象': { translation: '很大的動物' },
    '大衣': { translation: '厚外套' },

    // ─── 小 related words ───
    '小孩': { translation: '小朋友' },
    '小狗': { translation: '狗的幼仔' },
    '小雨': { translation: '很小的雨' },
    '小貓': { translation: '貓的幼仔' },
    '小包': { translation: '小的包包' },
    '小心': { translation: '注意安全' },

    // ─── 好 related words ───
    '你好': { translation: '打招呼' },
    '好吃': { translation: '味道好' },
    '好友': { translation: '好朋友' },
    '好看': { translation: '漂亮的' },
    '好玩': { translation: '有趣的' },
    '好嗎': { translation: '問候語' },

    // ─── 爸 related words ───
    '爸爸': { translation: '父親' },
    '爸媽': { translation: '父母' },
    '老爸': { translation: '爸爸的口語' },
    '爸爸上班': { translation: '爸爸去工作' },
    '爸爸回家': { translation: '爸爸回來了' },
    '爸爸鞋': { translation: '爸爸的鞋子' },

    // ─── 媽 related words ───
    '媽媽': { translation: '母親' },
    // '爸媽' already defined above
    '媽咪': { translation: '媽媽的暱稱' },
    '媽媽煮飯': { translation: '媽媽做飯' },
    '媽媽回家': { translation: '媽媽回來了' },
    '媽媽洗衣': { translation: '媽媽洗衣服' },

    // ─── 吃 related words ───
    '吃飯': { translation: '用餐' },
    '吃麵': { translation: '吃麵條' },
    '吃水果': { translation: '吃水果' },
    '吃菜': { translation: '吃蔬菜' },
    '吃藥': { translation: '服藥' },
    '吃早餐': { translation: '吃早上的飯' },

    // ─── 飯 related words ───
    '白飯': { translation: '白色的米飯' },
    '便當': { translation: '盒裝餐食' },
    '飯糰': { translation: '飯捏成的團' },
    '米飯': { translation: '煮熟的米' },
    '稀飯': { translation: '粥' },
    '炒飯': { translation: '炒過的飯' },

    // ─── 水 related words ───
    '喝水': { translation: '飲水' },
    '熱水': { translation: '熱的水' },
    '開水': { translation: '煮過的水' },
    '冷水': { translation: '冷的水' },
    '水杯': { translation: '裝水的杯子' },
    '水壺': { translation: '裝水的壺' },

    // ─── 茶 related words ───
    '喝茶': { translation: '飲茶' },
    '奶茶': { translation: '加奶的茶' },
    '茶杯': { translation: '喝茶的杯子' },
    '茶葉': { translation: '做茶的葉子' },
    '紅茶': { translation: '紅色的茶' },
    '綠茶': { translation: '綠色的茶' },

    // ─── 肉 related words ───
    '豬肉': { translation: '豬的肉' },
    '雞肉': { translation: '雞的肉' },
    '肉湯': { translation: '肉煮的湯' },
    '牛肉': { translation: '牛的肉' },
    '肉包': { translation: '包肉的包子' },
    '肉鬆': { translation: '酥鬆的肉' },

    // ─── 菜 related words ───
    '青菜': { translation: '綠色蔬菜' },
    '菜單': { translation: '餐廳的菜目' },
    '買菜': { translation: '購買蔬菜' },
    '高麗菜': { translation: '一種蔬菜' },
    '小白菜': { translation: '一種蔬菜' },
    '菜市場': { translation: '賣菜的市場' },

    // ─── 魚 related words ───
    '魚湯': { translation: '魚煮的湯' },
    '小魚': { translation: '小的魚' },
    '烤魚': { translation: '烤過的魚' },
    '魚肉': { translation: '魚的肉' },
    '魚市場': { translation: '賣魚的市場' },
    '魚丸': { translation: '魚做的丸子' },

    // ─── 蛋 related words ───
    '雞蛋': { translation: '雞下的蛋' },
    '蛋餅': { translation: '蛋做的餅' },
    '荷包蛋': { translation: '煎的蛋' },
    '茶葉蛋': { translation: '茶煮的蛋' },
    '蛋花湯': { translation: '蛋做的湯' },
    '蛋糕': { translation: '蛋做的糕點' },

    // ─── 湯 related words ───
    '喝湯': { translation: '飲湯' },
    // '魚湯' already defined above
    '熱湯': { translation: '熱的湯' },
    '菜湯': { translation: '菜煮的湯' },
    // '蛋花湯' already defined above
    '湯匙': { translation: '喝湯的匙' },

    // ─── 甜 related words ───
    '甜點': { translation: '甜的點心' },
    '甜湯': { translation: '甜的湯' },
    '甜甜圈': { translation: '圓形甜食' },
    '甜麵包': { translation: '甜的麵包' },
    '甜水果': { translation: '甜的水果' },
    '甜飲': { translation: '甜的飲料' },

    // ─── 車 related words ───
    '公車': { translation: '公共汽車' },
    '火車': { translation: '鐵路列車' },
    '停車': { translation: '把車停好' },
    '車票': { translation: '搭車的票' },
    '車門': { translation: '車的門' },
    '車站': { translation: '車停的地方' },

    // ─── 站 related words ───
    // '車站' already defined above
    '站牌': { translation: '公車站的牌子' },
    '站好': { translation: '站端正' },
    '站著': { translation: '站立著' },
    '站內': { translation: '車站裡面' },
    '站外': { translation: '車站外面' },

    // ─── 路 related words ───
    '馬路': { translation: '車走的路' },
    '路口': { translation: '路的交叉處' },
    '路線': { translation: '走的路線' },
    '過路': { translation: '穿過馬路' },
    '問路': { translation: '詢問方向' },
    '路邊': { translation: '路的旁邊' },

    // ─── 北 related words ───
    '台北': { translation: '台灣北部城市' },
    '北上': { translation: '往北走' },
    '北風': { translation: '從北方吹的風' },
    '北門': { translation: '北邊的門' },
    '北區': { translation: '北邊的區域' },
    '北車': { translation: '台北車站' },

    // ─── 南 related words ───
    '台南': { translation: '台灣南部城市' },
    '南下': { translation: '往南走' },
    '南門': { translation: '南邊的門' },
    '南部': { translation: '南邊的地區' },
    '南瓜': { translation: '一種瓜類' },
    '南投': { translation: '台灣的縣市' },

    // ─── 出 related words ───
    '出口': { translation: '出去的口' },
    '出門': { translation: '離開家' },
    '出發': { translation: '開始出門' },
    '出站': { translation: '離開車站' },
    '出院': { translation: '離開醫院' },
    '出去': { translation: '往外走' },

    // ─── 入 related words ───
    '入口': { translation: '進去的口' },
    '入內': { translation: '進到裡面' },
    '入座': { translation: '坐下來' },
    '進入': { translation: '進去' },
    '入門': { translation: '初學的' },
    '入場': { translation: '進入場地' },

    // ─── 左 related words ───
    '左邊': { translation: '左面' },
    '左轉': { translation: '往左轉' },
    '左手': { translation: '左邊的手' },
    '左腳': { translation: '左邊的腳' },
    '左門': { translation: '左邊的門' },
    '左上': { translation: '左邊上方' },

    // ─── 右 related words ───
    '右邊': { translation: '右面' },
    '右轉': { translation: '往右轉' },
    '右手': { translation: '右邊的手' },
    '右腳': { translation: '右邊的腳' },
    '右門': { translation: '右邊的門' },
    '右上': { translation: '右邊上方' },

    // ─── 停 related words ───
    // '停車' already defined above
    '停下': { translation: '停止' },
    '暫停': { translation: '暫時停止' },
    '停車場': { translation: '停車的地方' },
    '停站': { translation: '車站停靠' },
    '停好': { translation: '停妥當' },

    // ─── 一 related words ───
    '一個': { translation: '一件' },
    '一天': { translation: '一日' },
    '一月': { translation: '第一個月' },
    '一次': { translation: '一回' },
    '一人': { translation: '一個人' },
    '一樓': { translation: '第一層' },

    // ─── 二 related words ───
    '二人': { translation: '兩個人' },
    '二月': { translation: '第二個月' },
    '二樓': { translation: '第二層' },
    '二十': { translation: '數字20' },
    '星期二': { translation: '一週的第二天' },
    '二百': { translation: '數字200' },

    // ─── 三 related words ───
    '三個': { translation: '三件' },
    '三天': { translation: '三日' },
    '三樓': { translation: '第三層' },
    '三月': { translation: '第三個月' },
    '星期三': { translation: '一週的第三天' },
    '三百': { translation: '數字300' },

    // ─── 十 related words ───
    '十元': { translation: '十塊錢' },
    '十點': { translation: '十點鐘' },
    '十月': { translation: '第十個月' },
    '十天': { translation: '十日' },
    '十樓': { translation: '第十層' },
    '十包': { translation: '十個包裝' },

    // ─── 百 related words ───
    '一百': { translation: '數字100' },
    '百貨': { translation: '百貨商品' },
    '百元': { translation: '一百塊' },
    '百分': { translation: '百分比' },
    '百頁': { translation: '很多頁' },
    '百貨公司': { translation: '大型商場' },

    // ─── 元 related words ───
    // '十元' already defined above
    '元旦': { translation: '新年第一天' },
    // '百元' already defined above
    '二十元': { translation: '二十塊' },
    '五十元': { translation: '五十塊' },
    '一百元': { translation: '一百塊' },

    // ─── 月 related words ───
    // '一月' already defined above
    '月亮': { translation: '夜晚的月' },
    '月曆': { translation: '月份日曆' },
    '五月': { translation: '第五個月' },
    '月餅': { translation: '中秋的餅' },
    '月底': { translation: '月的最後' },

    // ─── 日 related words ───
    '今日': { translation: '今天' },
    '生日': { translation: '出生的日子' },
    '日期': { translation: '日子' },
    '日曆': { translation: '日期表' },
    '星期日': { translation: '一週最後一天' },
    '日出': { translation: '太陽出來' },

    // ─── 今 related words ───
    '今天': { translation: '這一天' },
    '今年': { translation: '這一年' },
    '今晚': { translation: '這天晚上' },
    '今早': { translation: '這天早上' },
    // '今日' already defined above
    '今晨': { translation: '這天清晨' },

    // ─── 年 related words ───
    // '今年' already defined above
    '新年': { translation: '新的一年' },
    '年糕': { translation: '過年吃的糕' },
    '去年': { translation: '上一年' },
    '明年': { translation: '下一年' },
    '年齡': { translation: '歲數' },

    // ─── 醫 related words ───
    '醫生': { translation: '看病的人' },
    '醫院': { translation: '看病的地方' },
    '牙醫': { translation: '治牙的醫生' },
    '中醫': { translation: '中國傳統醫學' },
    '醫藥': { translation: '醫療和藥品' },
    '醫護': { translation: '醫療護理人員' },

    // ─── 院 related words ───
    // '醫院' already defined above
    '院長': { translation: '醫院的主管' },
    '住院': { translation: '住在醫院' },
    // '出院' already defined above
    '院內': { translation: '醫院裡面' },
    '院外': { translation: '醫院外面' },

    // ─── 藥 related words ───
    // '吃藥' already defined above
    '藥局': { translation: '賣藥的店' },
    '藥袋': { translation: '裝藥的袋子' },
    '藥水': { translation: '液態的藥' },
    '藥丸': { translation: '圓形的藥' },
    '藥單': { translation: '藥的清單' },

    // ─── 痛 related words ───
    '頭痛': { translation: '頭部疼痛' },
    '肚子痛': { translation: '腹部疼痛' },
    '腳痛': { translation: '腳部疼痛' },
    '牙痛': { translation: '牙齒疼痛' },
    '手痛': { translation: '手部疼痛' },
    '背痛': { translation: '背部疼痛' },

    // ─── 頭 related words ───
    // '頭痛' already defined above
    '頭髮': { translation: '頭上的毛髮' },
    '頭巾': { translation: '包頭的布' },
    '頭暈': { translation: '頭感覺暈' },
    '頭部': { translation: '頭的部位' },
    '頭頂': { translation: '頭的最上面' },

    // ─── 手 related words ───
    '洗手': { translation: '清洗雙手' },
    '手機': { translation: '行動電話' },
    // '左手' already defined above
    // '右手' already defined above
    '手套': { translation: '包手的套' },
    '手帕': { translation: '擦手的布' },

    // ─── 眼 related words ───
    '眼睛': { translation: '看東西的器官' },
    '眼鏡': { translation: '幫助看清的工具' },
    '眼藥水': { translation: '眼睛用的藥水' },
    '眼科': { translation: '看眼睛的科' },
    '眼淚': { translation: '哭時流的水' },
    '閉眼': { translation: '把眼睛閉起來' },

    // ─── 牙 related words ───
    // '牙醫' already defined above
    '刷牙': { translation: '清潔牙齒' },
    // '牙痛' already defined above
    '牙刷': { translation: '刷牙的工具' },
    '牙膏': { translation: '刷牙用的膏' },
    '牙齒': { translation: '嘴裡的齒' },

    // ─── 熱 related words ───
    '發熱': { translation: '身體變熱' },
    // '熱水' already defined above
    // '熱湯' already defined above
    '熱茶': { translation: '熱的茶' },
    '熱飯': { translation: '熱的飯' },
    '熱天': { translation: '很熱的天氣' },

    // ─── 冷 related words ───
    '冷氣': { translation: '冷的空氣機' },
    // '冷水' already defined above
    '冷天': { translation: '很冷的天氣' },
    '冷飯': { translation: '冷的飯' },
    '冷風': { translation: '冷的風' },
    '冷飲': { translation: '冷的飲料' },

    // ─── 買 related words ───
    '買東西': { translation: '購買物品' },
    // '買菜' already defined above
    '買藥': { translation: '購買藥品' },
    '買水': { translation: '購買飲水' },
    '買票': { translation: '購買票券' },
    '買衣服': { translation: '購買衣服' },

    // ─── 賣 related words ───
    '賣場': { translation: '販賣的場所' },
    '賣菜': { translation: '販賣蔬菜' },
    '賣票': { translation: '販賣票券' },
    '賣魚': { translation: '販賣魚' },
    '賣肉': { translation: '販賣肉' },
    '賣水果': { translation: '販賣水果' },

    // ─── 開 related words ───
    '開門': { translation: '把門打開' },
    // '開水' already defined above
    '開車': { translation: '駕駛車' },
    '開燈': { translation: '把燈打開' },
    '開店': { translation: '開張做生意' },
    '開窗': { translation: '把窗戶打開' },

    // ─── 關 related words ───
    '關門': { translation: '把門關上' },
    '關燈': { translation: '把燈關掉' },
    '關窗': { translation: '把窗關上' },
    '關水': { translation: '把水關掉' },
    '關店': { translation: '結束營業' },
    '關機': { translation: '關掉電源' },

    // ─── 電 related words ───
    '電話': { translation: '通話的工具' },
    '電視': { translation: '看節目的機器' },
    '電燈': { translation: '照明的燈' },
    '電扇': { translation: '吹風的扇' },
    '電梯': { translation: '上下樓的機器' },
    '電池': { translation: '供電的池' },

    // ─── 話 related words ───
    // '電話' already defined above
    '說話': { translation: '開口講' },
    '問話': { translation: '提出問題' },
    '回話': { translation: '回答' },
    '講話': { translation: '說話' },
    '對話': { translation: '互相說話' },

    // ─── 紙 related words ───
    '衛生紙': { translation: '擦拭用的紙' },
    '白紙': { translation: '空白的紙' },
    '紙箱': { translation: '紙做的箱子' },
    '紙袋': { translation: '紙做的袋子' },
    '報紙': { translation: '新聞的紙' },
    '紙杯': { translation: '紙做的杯子' },

    // ─── 衣 related words ───
    '衣服': { translation: '穿的服裝' },
    '雨衣': { translation: '擋雨的衣' },
    '洗衣': { translation: '清洗衣服' },
    '上衣': { translation: '上半身的衣' },
    '毛衣': { translation: '毛線的衣' },
    // '大衣' already defined above

    // ─── 錢 related words ───
    '錢包': { translation: '裝錢的包' },
    '零錢': { translation: '小面額的錢' },
    '找錢': { translation: '找回的錢' },
    '錢袋': { translation: '裝錢的袋' },
    '存錢': { translation: '儲蓄金錢' },
    '花錢': { translation: '使用金錢' },

    // ─── 門 related words ───
    // '大門' already defined above
    '門口': { translation: '門的前面' },
    '門鈴': { translation: '門上的鈴' },
    '門牌': { translation: '門上的號碼' },
    // '開門' already defined above
    '門把': { translation: '門上的把手' },

    // ─── Animals context words ─── (小狗, 小貓, 豬肉, 雞蛋, 魚肉, 馬路 already defined above)
    '牛奶': { translation: '牛產的奶' },
    '綿羊': { translation: '長毛的羊' },
    '小鳥': { translation: '小的鳥' },
    '毛毛蟲': { translation: '蝴蝶的幼蟲' },

    // ─── Appliances context words ─── (電視, 電燈, 電扇, 紙箱, 冷氣 already defined above)
    '電腦': { translation: '處理資料的機器' },
    '洗衣機': { translation: '洗衣服的機器' },
    '洗衣服': { translation: '清洗衣物' },
    '冰箱': { translation: '保鮮食物的電器' },
    '電風扇': { translation: '吹涼風的電器' },
    '微波爐': { translation: '加熱食物的電器' },

    // ─── 台 related words ───
    '台灣': { translation: '我們的國家' },
    // '台北' already defined above
    '台中': { translation: '台灣中部城市' },
    '櫃台': { translation: '服務的台' },
    '月台': { translation: '車站等車處' },
    // '台南' already defined above

    // ─── 中 related words ───
    // '台中' already defined above
    '中午': { translation: '正午' },
    '中心': { translation: '中間的地方' },
    // '中醫' already defined above
    '中間': { translation: '兩邊的中間' },
    '中秋': { translation: '八月十五的節日' },

    // ─── 市 related words ───
    '市場': { translation: '買賣的場所' },
    '台北市': { translation: '台北的城市' },
    '超市': { translation: '超級市場' },
    '市區': { translation: '城市的區域' },
    '夜市': { translation: '晚上的市集' },
    '市民': { translation: '城市的居民' },

    // ─── 店 related words ───
    '商店': { translation: '賣東西的店' },
    '書店': { translation: '賣書的店' },
    '飯店': { translation: '住宿的旅館' },
    '店門': { translation: '店的門' },
    '店員': { translation: '店裡工作的人' },
    '店裡': { translation: '店的裡面' },

    // ─── 學 related words ───
    '學校': { translation: '讀書的地方' },
    '學生': { translation: '讀書的人' },
    '學習': { translation: '學新東西' },
    '學費': { translation: '讀書的費用' },
    '上學': { translation: '去學校' },
    '學會': { translation: '學到了' },

    // ─── 公 related words ───
    '公園': { translation: '公共的園地' },
    // '公車' already defined above
    '公用電話': { translation: '公共電話' },
    '公司': { translation: '工作的公司' },
    '公共': { translation: '大家共用' },
    '公寓': { translation: '集合住宅' },

    // ─── 園 related words ───
    // '公園' already defined above
    '花園': { translation: '種花的園' },
    '園區': { translation: '園地的區域' },
    '動物園': { translation: '看動物的地方' },
    '幼兒園': { translation: '小朋友的學校' },
    '菜園': { translation: '種菜的園' },

    // ─── 銀 related words ───
    '銀行': { translation: '存錢的地方' },
    '銀樓': { translation: '賣金飾的店' },
    '銀幣': { translation: '銀做的硬幣' },
    '銀色': { translation: '銀的顏色' },
    '銀行卡': { translation: '銀行的卡' },
    '銀髮': { translation: '白色頭髮' },

    // ─── 行 related words ───
    // '銀行' already defined above
    '行人': { translation: '走路的人' },
    '行李': { translation: '旅行的東西' },
    '行走': { translation: '走路' },
    '行程': { translation: '旅行安排' },
    '行號': { translation: '商號' },

    // ─── 廁 related words ───
    '廁所': { translation: '上廁所的地方' },
    '男廁': { translation: '男生廁所' },
    '女廁': { translation: '女生廁所' },
    '公廁': { translation: '公共廁所' },
    '廁紙': { translation: '廁所用的紙' },
    '廁門': { translation: '廁所的門' },

    // ─── 不 related words ───
    '不要': { translation: '不想要' },
    '不好': { translation: '不好的' },
    '不行': { translation: '不可以' },
    '不可': { translation: '不允許' },
    '不對': { translation: '不正確' },

    // ─── 了 related words ───
    '好了': { translation: '已經好了' },
    '了解': { translation: '明白、理解' },
    '走了': { translation: '離開了' },
    '到了': { translation: '已經到達' },
    '吃了': { translation: '已經吃過' },

    // ─── 也 related words ───
    '也是': { translation: '同樣是' },
    '也好': { translation: '那也可以' },
    '也要': { translation: '同樣要' },
    '也會': { translation: '同樣會' },

    // ─── 有 related words ───
    '有人': { translation: '有人在' },
    '有名': { translation: '出名的' },
    '有心': { translation: '有心意' },
    '沒有': { translation: '不存在、沒有' },
    '所有': { translation: '全部的' },

    // ─── 在 related words ───
    '在家': { translation: '人在家裡' },
    '不在': { translation: '不在此處' },
    '現在': { translation: '此刻、目前' },
    '在外': { translation: '在外面' },
    '在地': { translation: '當地的' },

    // ─── 那 related words ───
    '那個': { translation: '那一個' },
    '那邊': { translation: '那一邊' },
    '那裡': { translation: '那個地方' },
    '那天': { translation: '那一天' },

    // ─── 的 related words ───
    '我的': { translation: '屬於我的' },
    '你的': { translation: '屬於你的' },
    '好的': { translation: '沒問題' },
    '大的': { translation: '比較大的' },
    '真的': { translation: '是真實的' },

    // ─── 和 related words ───
    '和好': { translation: '重新和好' },
    '和氣': { translation: '態度友善' },
    '和平': { translation: '沒有衝突' },
    '和睦': { translation: '相處融洽' },

    // ─── 是 related words ─── ('也是' defined above under 也)
    '是的': { translation: '對、沒錯' },
    '就是': { translation: '正是如此' },
    '但是': { translation: '不過、可是' },
    '是非': { translation: '對與錯' },

    // ─── 這 related words ───
    '這個': { translation: '這一個' },
    '這裡': { translation: '這個地方' },
    '這邊': { translation: '這一邊' },
    '這次': { translation: '這一次' },
    '這陣': { translation: '這段時間' },

    // ─── 可 related words ───
    '可以': { translation: '允許、能夠' },
    '可能': { translation: '有可能' },
    '可怕': { translation: '令人害怕' },
    '可惜': { translation: '令人惋惜' },
    '可愛': { translation: '惹人喜愛' },

    // ─── 沒 related words ───
    '沒事': { translation: '沒什麼事' },
    '沒關係': { translation: '不要緊' },
    '沒問題': { translation: '沒有問題' },

    // ─── 你 related words ─── ('你好' defined in Family section, '你的' defined under 的)
    '你們': { translation: '你們大家' },
    '給你': { translation: '給予你' },

    // ─── 到 related words ───
    '到底': { translation: '究竟、終究' },
    '到時': { translation: '屆時' },
    '周到': { translation: '考慮周全' },
    '報到': { translation: '簽到、報名' },

    // ─── 要 related words ───
    '要去': { translation: '想去、準備去' },
    '要緊': { translation: '重要、嚴重' },
    '主要': { translation: '最重要的' },
    '需要': { translation: '必須要有' },

    // ─── 很 related words ───
    '很好': { translation: '非常好' },
    '很多': { translation: '數量很多' },
    '很大': { translation: '非常大' },
    '很快': { translation: '非常快' },
    '很忙': { translation: '非常忙碌' },

    // ─── 都 related words ───
    '都好': { translation: '全部都好' },
    '都是': { translation: '全部都是' },
    '都有': { translation: '全部都有' },
    '都要': { translation: '全部都要' },

    // ─── 就 related words ───
    '就好': { translation: '這樣就好' },
    '就近': { translation: '在附近' },
    '就醫': { translation: '去看醫生' },
    '成就': { translation: '成果、成績' },

    // ─── 給 related words ───
    '給錢': { translation: '付錢' },
    '交給': { translation: '轉交' },
    '送給': { translation: '贈送' },

    // ─── 會 related words ─── ('學會' defined in Activities section)
    '不會': { translation: '不能夠' },
    '開會': { translation: '舉行會議' },
    '再會': { translation: '再見' },
    '社會': { translation: '人群的集合體' },
  },
  ui: zhUi,
};
