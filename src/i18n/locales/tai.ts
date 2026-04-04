import type { HelperWordSet } from '../types';
import { taiUi } from './tai-ui';

export const tai: HelperWordSet = {
  characters: {
    // Family
    '家': { translation: '厝', pronunciation: 'tshù' },
    '人': { translation: '人', pronunciation: 'lâng' },
    '大': { translation: '大', pronunciation: 'tuā' },
    '小': { translation: '細', pronunciation: 'sè' },
    '好': { translation: '好', pronunciation: 'hó' },
    '爸': { translation: '爸', pronunciation: 'pâ' },
    '媽': { translation: '媽', pronunciation: 'má' },

    // Food
    '吃': { translation: '食', pronunciation: 'tsia̍h' },
    '飯': { translation: '飯', pronunciation: 'pn̄g' },
    '水': { translation: '水', pronunciation: 'tsuí' },
    '茶': { translation: '茶', pronunciation: 'tê' },
    '肉': { translation: '肉', pronunciation: 'bah' },
    '菜': { translation: '菜', pronunciation: 'tshài' },
    '魚': { translation: '魚', pronunciation: 'hî' },
    '蛋': { translation: '卵', pronunciation: 'nn̄g' },
    '湯': { translation: '湯', pronunciation: 'thng' },
    '甜': { translation: '甜', pronunciation: 'tinn' },

    // Transportation
    '車': { translation: '車', pronunciation: 'tshia' },
    '站': { translation: '站', pronunciation: 'tsām' },
    '路': { translation: '路', pronunciation: 'lōo' },
    '北': { translation: '北', pronunciation: 'pak' },
    '南': { translation: '南', pronunciation: 'lâm' },
    '出': { translation: '出', pronunciation: 'tshut' },
    '入': { translation: '入', pronunciation: 'ji̍p' },
    '左': { translation: '左', pronunciation: 'tsó' },
    '右': { translation: '右', pronunciation: 'iū' },
    '停': { translation: '停', pronunciation: 'thîng' },

    // Numbers-time
    '一': { translation: '一', pronunciation: 'it' },
    '二': { translation: '二', pronunciation: 'jī' },
    '三': { translation: '三', pronunciation: 'sann' },
    '十': { translation: '十', pronunciation: 'tsa̍p' },
    '百': { translation: '百', pronunciation: 'pah' },
    '元': { translation: '箍', pronunciation: 'khoo' },
    '月': { translation: '月', pronunciation: 'gue̍h' },
    '日': { translation: '日', pronunciation: 'ji̍t' },
    '今': { translation: '今', pronunciation: 'kin' },
    '年': { translation: '年', pronunciation: 'nî' },

    // Health
    '醫': { translation: '醫', pronunciation: 'i' },
    '院': { translation: '院', pronunciation: 'īnn' },
    '藥': { translation: '藥', pronunciation: 'io̍h' },
    '痛': { translation: '疼', pronunciation: 'thiànn' },
    '頭': { translation: '頭', pronunciation: 'thâu' },
    '手': { translation: '手', pronunciation: 'tshiú' },
    '眼': { translation: '目', pronunciation: 'ba̍k' },
    '牙': { translation: '齒', pronunciation: 'khí' },
    '熱': { translation: '燒', pronunciation: 'sio' },
    '冷': { translation: '冷', pronunciation: 'líng' },

    // Daily-items
    '買': { translation: '買', pronunciation: 'bé' },
    '賣': { translation: '賣', pronunciation: 'bē' },
    '開': { translation: '開', pronunciation: 'khui' },
    '關': { translation: '關', pronunciation: 'kuainn' },
    '電': { translation: '電', pronunciation: 'tiān' },
    '話': { translation: '話', pronunciation: 'uē' },
    '紙': { translation: '紙', pronunciation: 'tsuá' },
    '衣': { translation: '衫', pronunciation: 'sann' },
    '錢': { translation: '錢', pronunciation: 'tsînn' },
    '門': { translation: '門', pronunciation: 'mn̂g' },

    // Animals
    '狗': { translation: '狗', pronunciation: 'káu' },
    '貓': { translation: '貓', pronunciation: 'niau' },
    '豬': { translation: '豬', pronunciation: 'ti' },
    '牛': { translation: '牛', pronunciation: 'gû' },
    '羊': { translation: '羊', pronunciation: 'iûnn' },
    '雞': { translation: '雞', pronunciation: 'ke' },
    '鳥': { translation: '鳥', pronunciation: 'tsiáu' },
    '馬': { translation: '馬', pronunciation: 'bé' },
    '蟲': { translation: '蟲', pronunciation: 'thâng' },

    // Appliances
    '視': { translation: '視', pronunciation: 'sī' },
    '腦': { translation: '腦', pronunciation: 'náu' },
    '機': { translation: '機', pronunciation: 'ki' },
    '洗': { translation: '洗', pronunciation: 'sé' },
    '冰': { translation: '冰', pronunciation: 'ping' },
    '箱': { translation: '箱', pronunciation: 'siunn' },
    '燈': { translation: '燈', pronunciation: 'ting' },
    '扇': { translation: '扇', pronunciation: 'sìnn' },
    '爐': { translation: '灶', pronunciation: 'tsàu' },

    // Places
    '台': { translation: '台', pronunciation: 'Tâi' },
    '中': { translation: '中', pronunciation: 'tiong' },
    '市': { translation: '市', pronunciation: 'tshī' },
    '店': { translation: '店', pronunciation: 'tiàm' },
    '學': { translation: '學', pronunciation: 'o̍h' },
    '公': { translation: '公', pronunciation: 'kong' },
    '園': { translation: '園', pronunciation: 'hn̂g' },
    '銀': { translation: '銀', pronunciation: 'gîn' },
    '行': { translation: '行', pronunciation: 'hâng' },
    '廁': { translation: '便所', pronunciation: 'piān-sóo' },

    // Common words 1
    '不': { translation: '毋', pronunciation: 'm̄' },
    '了': { translation: '了', pronunciation: 'liáu' },
    '也': { translation: '嘛', pronunciation: 'mā' },
    '有': { translation: '有', pronunciation: 'ū' },
    '在': { translation: '佇', pronunciation: 'tī' },
    '那': { translation: '彼', pronunciation: 'hit' },
    '的': { translation: '的', pronunciation: 'ê' },
    '和': { translation: '佮', pronunciation: 'kah' },
    '是': { translation: '是', pronunciation: 'sī' },
    '這': { translation: '這', pronunciation: 'tse' },

    // Common words 2
    '可': { translation: '可', pronunciation: 'khó' },
    '沒': { translation: '無', pronunciation: 'bô' },
    '你': { translation: '你', pronunciation: 'lí' },
    '到': { translation: '到', pronunciation: 'kàu' },
    '要': { translation: '欲', pronunciation: 'beh' },
    '很': { translation: '真', pronunciation: 'tsin' },
    '都': { translation: '攏', pronunciation: 'lóng' },
    '就': { translation: '就', pronunciation: 'tō' },
    '給': { translation: '予', pronunciation: 'hōo' },
    '會': { translation: '會', pronunciation: 'ē' },
  },

  words: {
    // ===== 家 =====
    '家人': { translation: '厝內人', pronunciation: 'tshù-lāi-lâng' },
    '回家': { translation: '轉去厝', pronunciation: 'tńg-khì-tshù' },
    '家門': { translation: '厝門', pronunciation: 'tshù-mn̂g' },
    '家裡': { translation: '厝內', pronunciation: 'tshù-lāi' },
    '家庭': { translation: '家庭', pronunciation: 'ka-tîng' },
    '老家': { translation: '老厝', pronunciation: 'lāu-tshù' },

    // ===== 人 =====
    '大人': { translation: '大人', pronunciation: 'tuā-lâng' },
    '客人': { translation: '人客', pronunciation: 'lâng-kheh' },
    // '家人' already defined above
    '人口': { translation: '人口', pronunciation: 'jîn-kháu' },
    '工人': { translation: '工人', pronunciation: 'kang-lâng' },
    '病人': { translation: '病人', pronunciation: 'pēnn-lâng' },

    // ===== 大 =====
    // '大人' already defined above
    '大門': { translation: '大門', pronunciation: 'tuā-mn̂g' },
    '大家': { translation: '逐家', pronunciation: 'ta̍k-ke' },
    '大雨': { translation: '大雨', pronunciation: 'tuā-hōo' },
    '大象': { translation: '象', pronunciation: 'tshiūnn' },
    '大衣': { translation: '大衫', pronunciation: 'tuā-sann' },

    // ===== 小 =====
    '小孩': { translation: '囡仔', pronunciation: 'gín-á' },
    '小狗': { translation: '狗仔', pronunciation: 'káu-á' },
    '小雨': { translation: '小雨', pronunciation: 'sió-hōo' },
    '小貓': { translation: '貓仔', pronunciation: 'niau-á' },
    '小包': { translation: '小包', pronunciation: 'sió-pau' },
    '小心': { translation: '細膩', pronunciation: 'sè-jī' },

    // ===== 好 =====
    '你好': { translation: '你好', pronunciation: 'lí-hó' },
    '好吃': { translation: '好食', pronunciation: 'hó-tsia̍h' },
    '好友': { translation: '好朋友', pronunciation: 'hó-pîng-iú' },
    '好看': { translation: '好看', pronunciation: 'hó-khuànn' },
    '好玩': { translation: '好耍', pronunciation: 'hó-sńg' },
    '好嗎': { translation: '好無', pronunciation: 'hó--bô' },

    // ===== 爸 =====
    '爸爸': { translation: '阿爸', pronunciation: 'a-pâ' },
    '爸媽': { translation: '爸母', pronunciation: 'pâ-bú' },
    '老爸': { translation: '老爸', pronunciation: 'lāu-pē' },
    '爸爸上班': { translation: '阿爸上班', pronunciation: 'a-pâ siōng-pan' },
    '爸爸回家': { translation: '阿爸轉來', pronunciation: 'a-pâ tńg--lâi' },
    '爸爸鞋': { translation: '阿爸鞋', pronunciation: 'a-pâ ê' },

    // ===== 媽 =====
    '媽媽': { translation: '阿母', pronunciation: 'a-bú' },
    // '爸媽' already defined above
    '媽咪': { translation: '阿母', pronunciation: 'a-bú' },
    '媽媽煮飯': { translation: '阿母煮飯', pronunciation: 'a-bú tsú-pn̄g' },
    '媽媽回家': { translation: '阿母轉來', pronunciation: 'a-bú tńg--lâi' },
    '媽媽洗衣': { translation: '阿母洗衫', pronunciation: 'a-bú sé-sann' },

    // ===== 吃 =====
    '吃飯': { translation: '食飯', pronunciation: 'tsia̍h-pn̄g' },
    '吃麵': { translation: '食麵', pronunciation: 'tsia̍h-mī' },
    '吃水果': { translation: '食果子', pronunciation: 'tsia̍h-kué-tsí' },
    '吃菜': { translation: '食菜', pronunciation: 'tsia̍h-tshài' },
    '吃藥': { translation: '食藥仔', pronunciation: 'tsia̍h-io̍h-á' },
    '吃早餐': { translation: '食早頓', pronunciation: 'tsia̍h-tsá-tǹg' },

    // ===== 飯 =====
    '白飯': { translation: '白飯', pronunciation: 'pe̍h-pn̄g' },
    '便當': { translation: '便當', pronunciation: 'piān-tong' },
    '飯糰': { translation: '飯糰', pronunciation: 'pn̄g-thuân' },
    '米飯': { translation: '米飯', pronunciation: 'bí-pn̄g' },
    '稀飯': { translation: '糜', pronunciation: 'muê' },
    '炒飯': { translation: '炒飯', pronunciation: 'tshá-pn̄g' },

    // ===== 水 =====
    '喝水': { translation: '啉水', pronunciation: 'lim-tsuí' },
    '熱水': { translation: '燒水', pronunciation: 'sio-tsuí' },
    '開水': { translation: '滾水', pronunciation: 'kún-tsuí' },
    '冷水': { translation: '冷水', pronunciation: 'líng-tsuí' },
    '水杯': { translation: '水杯', pronunciation: 'tsuí-pue' },
    '水壺': { translation: '水壺', pronunciation: 'tsuí-hôo' },

    // ===== 茶 =====
    '喝茶': { translation: '啉茶', pronunciation: 'lim-tê' },
    '奶茶': { translation: '奶茶', pronunciation: 'ling-tê' },
    '茶杯': { translation: '茶甌', pronunciation: 'tê-au' },
    '茶葉': { translation: '茶葉', pronunciation: 'tê-hio̍h' },
    '紅茶': { translation: '紅茶', pronunciation: 'âng-tê' },
    '綠茶': { translation: '綠茶', pronunciation: 'li̍k-tê' },

    // ===== 肉 =====
    '豬肉': { translation: '豬肉', pronunciation: 'ti-bah' },
    '雞肉': { translation: '雞肉', pronunciation: 'ke-bah' },
    '肉湯': { translation: '肉湯', pronunciation: 'bah-thng' },
    '牛肉': { translation: '牛肉', pronunciation: 'gû-bah' },
    '肉包': { translation: '肉包', pronunciation: 'bah-pau' },
    '肉鬆': { translation: '肉鬆', pronunciation: 'bah-sang' },

    // ===== 菜 =====
    '青菜': { translation: '青菜', pronunciation: 'tshenn-tshài' },
    '菜單': { translation: '菜單', pronunciation: 'tshài-tuann' },
    '買菜': { translation: '買菜', pronunciation: 'bé-tshài' },
    '高麗菜': { translation: '高麗菜', pronunciation: 'ko-lê-tshài' },
    '小白菜': { translation: '小白菜', pronunciation: 'sió-pe̍h-tshài' },
    '菜市場': { translation: '菜市仔', pronunciation: 'tshài-tshī-á' },

    // ===== 魚 =====
    '魚湯': { translation: '魚湯', pronunciation: 'hî-thng' },
    '小魚': { translation: '魚仔', pronunciation: 'hî-á' },
    '烤魚': { translation: '烘魚', pronunciation: 'hang-hî' },
    '魚肉': { translation: '魚肉', pronunciation: 'hî-bah' },
    '魚市場': { translation: '魚市仔', pronunciation: 'hî-tshī-á' },
    '魚丸': { translation: '魚丸', pronunciation: 'hî-uân' },

    // ===== 蛋 =====
    '雞蛋': { translation: '雞卵', pronunciation: 'ke-nn̄g' },
    '蛋餅': { translation: '卵餅', pronunciation: 'nn̄g-piánn' },
    '荷包蛋': { translation: '荷包卵', pronunciation: 'hô-pau-nn̄g' },
    '茶葉蛋': { translation: '茶卵', pronunciation: 'tê-nn̄g' },
    '蛋花湯': { translation: '卵花湯', pronunciation: 'nn̄g-hue-thng' },
    '蛋糕': { translation: '雞卵糕', pronunciation: 'ke-nn̄g-ko' },

    // ===== 湯 =====
    '喝湯': { translation: '啉湯', pronunciation: 'lim-thng' },
    // '魚湯' already defined above
    '熱湯': { translation: '燒湯', pronunciation: 'sio-thng' },
    '菜湯': { translation: '菜湯', pronunciation: 'tshài-thng' },
    // '蛋花湯' already defined above
    '湯匙': { translation: '湯匙', pronunciation: 'thng-sî' },

    // ===== 甜 =====
    '甜點': { translation: '甜點', pronunciation: 'tinn-tiám' },
    '甜湯': { translation: '甜湯', pronunciation: 'tinn-thng' },
    '甜甜圈': { translation: '甜甜圈', pronunciation: 'tinn-tinn-khuan' },
    '甜麵包': { translation: '甜麵包', pronunciation: 'tinn-mī-pau' },
    '甜水果': { translation: '甜果子', pronunciation: 'tinn-kué-tsí' },
    '甜飲': { translation: '甜飲料', pronunciation: 'tinn-ím-liāu' },

    // ===== 車 =====
    '公車': { translation: '公車', pronunciation: 'kong-tshia' },
    '火車': { translation: '火車', pronunciation: 'hué-tshia' },
    '停車': { translation: '停車', pronunciation: 'thîng-tshia' },
    '車票': { translation: '車票', pronunciation: 'tshia-phiò' },
    '車門': { translation: '車門', pronunciation: 'tshia-mn̂g' },
    '車站': { translation: '車站', pronunciation: 'tshia-tsām' },

    // ===== 站 =====
    // '車站' already defined above
    '站牌': { translation: '站牌', pronunciation: 'tsām-pâi' },
    '站好': { translation: '站好', pronunciation: 'khiā-hó' },
    '站著': { translation: '站咧', pronunciation: 'khiā--leh' },
    '站內': { translation: '站內', pronunciation: 'tsām-lāi' },
    '站外': { translation: '站外', pronunciation: 'tsām-guā' },

    // ===== 路 =====
    '馬路': { translation: '馬路', pronunciation: 'bé-lōo' },
    '路口': { translation: '路口', pronunciation: 'lōo-kháu' },
    '路線': { translation: '路線', pronunciation: 'lōo-suànn' },
    '過路': { translation: '過路', pronunciation: 'kuè-lōo' },
    '問路': { translation: '問路', pronunciation: 'mn̄g-lōo' },
    '路邊': { translation: '路邊', pronunciation: 'lōo-pinn' },

    // ===== 北 =====
    '台北': { translation: '台北', pronunciation: 'Tâi-pak' },
    '北上': { translation: '北上', pronunciation: 'pak-siōng' },
    '北風': { translation: '北風', pronunciation: 'pak-hong' },
    '北門': { translation: '北門', pronunciation: 'pak-mn̂g' },
    '北區': { translation: '北區', pronunciation: 'pak-khu' },
    '北車': { translation: '台北車站', pronunciation: 'Tâi-pak tshia-tsām' },

    // ===== 南 =====
    '台南': { translation: '台南', pronunciation: 'Tâi-lâm' },
    '南下': { translation: '南下', pronunciation: 'lâm-hā' },
    '南門': { translation: '南門', pronunciation: 'lâm-mn̂g' },
    '南部': { translation: '南部', pronunciation: 'lâm-pōo' },
    '南瓜': { translation: '金瓜', pronunciation: 'kim-kue' },
    '南投': { translation: '南投', pronunciation: 'Lâm-tâu' },

    // ===== 出 =====
    '出口': { translation: '出口', pronunciation: 'tshut-kháu' },
    '出門': { translation: '出門', pronunciation: 'tshut-mn̂g' },
    '出發': { translation: '出發', pronunciation: 'tshut-huat' },
    '出站': { translation: '出站', pronunciation: 'tshut-tsām' },
    '出院': { translation: '出院', pronunciation: 'tshut-īnn' },
    '出去': { translation: '出去', pronunciation: 'tshut-khì' },

    // ===== 入 =====
    '入口': { translation: '入口', pronunciation: 'ji̍p-kháu' },
    '入內': { translation: '入內', pronunciation: 'ji̍p-lāi' },
    '入座': { translation: '入座', pronunciation: 'ji̍p-tsō' },
    '進入': { translation: '入去', pronunciation: 'ji̍p-khì' },
    '入門': { translation: '入門', pronunciation: 'ji̍p-mn̂g' },
    '入場': { translation: '入場', pronunciation: 'ji̍p-tiûnn' },

    // ===== 左 =====
    '左邊': { translation: '左手邊', pronunciation: 'tsó-tshiú-pîng' },
    '左轉': { translation: '左轉', pronunciation: 'tsó-tsuán' },
    '左手': { translation: '左手', pronunciation: 'tsó-tshiú' },
    '左腳': { translation: '左腳', pronunciation: 'tsó-kha' },
    '左門': { translation: '左門', pronunciation: 'tsó-mn̂g' },
    '左上': { translation: '左上', pronunciation: 'tsó-siōng' },

    // ===== 右 =====
    '右邊': { translation: '右手邊', pronunciation: 'iū-tshiú-pîng' },
    '右轉': { translation: '右轉', pronunciation: 'iū-tsuán' },
    '右手': { translation: '右手', pronunciation: 'iū-tshiú' },
    '右腳': { translation: '右腳', pronunciation: 'iū-kha' },
    '右門': { translation: '右門', pronunciation: 'iū-mn̂g' },
    '右上': { translation: '右上', pronunciation: 'iū-siōng' },

    // ===== 停 =====
    // '停車' already defined above
    '停下': { translation: '停落來', pronunciation: 'thîng--lo̍h-lâi' },
    '暫停': { translation: '暫停', pronunciation: 'tsiām-thîng' },
    '停車場': { translation: '停車場', pronunciation: 'thîng-tshia-tiûnn' },
    '停站': { translation: '停站', pronunciation: 'thîng-tsām' },
    '停好': { translation: '停好', pronunciation: 'thîng-hó' },

    // ===== 一 =====
    '一個': { translation: '一个', pronunciation: 'tsi̍t-ê' },
    '一天': { translation: '一工', pronunciation: 'tsi̍t-kang' },
    '一月': { translation: '一月', pronunciation: 'tsi̍t-gue̍h' },
    '一次': { translation: '一擺', pronunciation: 'tsi̍t-pái' },
    '一人': { translation: '一人', pronunciation: 'tsi̍t-lâng' },
    '一樓': { translation: '一樓', pronunciation: 'tsi̍t-lâu' },

    // ===== 二 =====
    '二人': { translation: '兩人', pronunciation: 'nn̄g-lâng' },
    '二月': { translation: '二月', pronunciation: 'jī-gue̍h' },
    '二樓': { translation: '二樓', pronunciation: 'jī-lâu' },
    '二十': { translation: '二十', pronunciation: 'jī-tsa̍p' },
    '星期二': { translation: '拜二', pronunciation: 'pài-jī' },
    '二百': { translation: '二百', pronunciation: 'jī-pah' },

    // ===== 三 =====
    '三個': { translation: '三个', pronunciation: 'sann-ê' },
    '三天': { translation: '三工', pronunciation: 'sann-kang' },
    '三樓': { translation: '三樓', pronunciation: 'sann-lâu' },
    '三月': { translation: '三月', pronunciation: 'sann-gue̍h' },
    '星期三': { translation: '拜三', pronunciation: 'pài-sann' },
    '三百': { translation: '三百', pronunciation: 'sann-pah' },

    // ===== 十 =====
    '十元': { translation: '十箍', pronunciation: 'tsa̍p-khoo' },
    '十點': { translation: '十點', pronunciation: 'tsa̍p-tiám' },
    '十月': { translation: '十月', pronunciation: 'tsa̍p-gue̍h' },
    '十天': { translation: '十工', pronunciation: 'tsa̍p-kang' },
    '十樓': { translation: '十樓', pronunciation: 'tsa̍p-lâu' },
    '十包': { translation: '十包', pronunciation: 'tsa̍p-pau' },

    // ===== 百 =====
    '一百': { translation: '一百', pronunciation: 'tsi̍t-pah' },
    '百貨': { translation: '百貨', pronunciation: 'pah-huè' },
    '百元': { translation: '百箍', pronunciation: 'pah-khoo' },
    '百分': { translation: '百分', pronunciation: 'pah-hun' },
    '百頁': { translation: '百頁', pronunciation: 'pah-ia̍h' },
    '百貨公司': { translation: '百貨公司', pronunciation: 'pah-huè-kong-si' },

    // ===== 元 =====
    // '十元' already defined above
    '元旦': { translation: '元旦', pronunciation: 'guân-tàn' },
    // '百元' already defined above
    '二十元': { translation: '二十箍', pronunciation: 'jī-tsa̍p-khoo' },
    '五十元': { translation: '五十箍', pronunciation: 'gōo-tsa̍p-khoo' },
    '一百元': { translation: '一百箍', pronunciation: 'tsi̍t-pah-khoo' },

    // ===== 月 =====
    // '一月' already defined above
    '月亮': { translation: '月娘', pronunciation: 'gue̍h-niû' },
    '月曆': { translation: '月曆', pronunciation: 'gue̍h-li̍k' },
    '五月': { translation: '五月', pronunciation: 'gōo-gue̍h' },
    '月餅': { translation: '月餅', pronunciation: 'gue̍h-piánn' },
    '月底': { translation: '月底', pronunciation: 'gue̍h-té' },

    // ===== 日 =====
    '今日': { translation: '今仔日', pronunciation: 'kin-á-ji̍t' },
    '生日': { translation: '生日', pronunciation: 'senn-ji̍t' },
    '日期': { translation: '日期', pronunciation: 'ji̍t-kî' },
    '日曆': { translation: '日曆', pronunciation: 'ji̍t-li̍k' },
    '星期日': { translation: '拜日', pronunciation: 'pài-ji̍t' },
    '日出': { translation: '日出', pronunciation: 'ji̍t-tshut' },

    // ===== 今 =====
    '今天': { translation: '今仔日', pronunciation: 'kin-á-ji̍t' },
    '今年': { translation: '今年', pronunciation: 'kin-nî' },
    '今晚': { translation: '今暗', pronunciation: 'kin-àm' },
    '今早': { translation: '今仔早', pronunciation: 'kin-á-tsá' },
    // '今日' already defined above
    '今晨': { translation: '今仔早', pronunciation: 'kin-á-tsá' },

    // ===== 年 =====
    // '今年' already defined above
    '新年': { translation: '新年', pronunciation: 'sin-nî' },
    '年糕': { translation: '甜粿', pronunciation: 'tinn-kué' },
    '去年': { translation: '舊年', pronunciation: 'kū-nî' },
    '明年': { translation: '明年', pronunciation: 'mê-nî' },
    '年齡': { translation: '歲數', pronunciation: 'huè-siàu' },

    // ===== 醫 =====
    '醫生': { translation: '醫生', pronunciation: 'i-sing' },
    '醫院': { translation: '醫院', pronunciation: 'i-īnn' },
    '牙醫': { translation: '齒科', pronunciation: 'khí-kho' },
    '中醫': { translation: '中醫', pronunciation: 'tiong-i' },
    '醫藥': { translation: '醫藥', pronunciation: 'i-io̍h' },
    '醫護': { translation: '醫護', pronunciation: 'i-hōo' },

    // ===== 院 =====
    // '醫院' already defined above
    '院長': { translation: '院長', pronunciation: 'īnn-tiúnn' },
    '住院': { translation: '住院', pronunciation: 'tsū-īnn' },
    // '出院' already defined above
    '院內': { translation: '院內', pronunciation: 'īnn-lāi' },
    '院外': { translation: '院外', pronunciation: 'īnn-guā' },

    // ===== 藥 =====
    // '吃藥' already defined above
    '藥局': { translation: '藥局', pronunciation: 'io̍h-ki̍k' },
    '藥袋': { translation: '藥袋仔', pronunciation: 'io̍h-tē-á' },
    '藥水': { translation: '藥水', pronunciation: 'io̍h-tsuí' },
    '藥丸': { translation: '藥丸', pronunciation: 'io̍h-uân' },
    '藥單': { translation: '藥單', pronunciation: 'io̍h-tuann' },

    // ===== 痛 =====
    '頭痛': { translation: '頭疼', pronunciation: 'thâu-thiànn' },
    '肚子痛': { translation: '腹肚疼', pronunciation: 'pak-tóo-thiànn' },
    '腳痛': { translation: '腳疼', pronunciation: 'kha-thiànn' },
    '牙痛': { translation: '齒疼', pronunciation: 'khí-thiànn' },
    '手痛': { translation: '手疼', pronunciation: 'tshiú-thiànn' },
    '背痛': { translation: '腰脊疼', pronunciation: 'io-tsiah-thiànn' },

    // ===== 頭 =====
    // '頭痛' already defined above
    '頭髮': { translation: '頭毛', pronunciation: 'thâu-mn̂g' },
    '頭巾': { translation: '頭巾', pronunciation: 'thâu-kun' },
    '頭暈': { translation: '頭眩', pronunciation: 'thâu-hîn' },
    '頭部': { translation: '頭部', pronunciation: 'thâu-pōo' },
    '頭頂': { translation: '頭殼頂', pronunciation: 'thâu-khak-tíng' },

    // ===== 手 =====
    '洗手': { translation: '洗手', pronunciation: 'sé-tshiú' },
    '手機': { translation: '手機仔', pronunciation: 'tshiú-ki-á' },
    // '左手' already defined above
    // '右手' already defined above
    '手套': { translation: '手套', pronunciation: 'tshiú-thò' },
    '手帕': { translation: '手巾仔', pronunciation: 'tshiú-kun-á' },

    // ===== 眼 =====
    '眼睛': { translation: '目睭', pronunciation: 'ba̍k-tsiu' },
    '眼鏡': { translation: '目鏡', pronunciation: 'ba̍k-kiànn' },
    '眼藥水': { translation: '目藥水', pronunciation: 'ba̍k-io̍h-tsuí' },
    '眼科': { translation: '目科', pronunciation: 'ba̍k-kho' },
    '眼淚': { translation: '目屎', pronunciation: 'ba̍k-sái' },
    '閉眼': { translation: '瞌目', pronunciation: 'kheh-ba̍k' },

    // ===== 牙 =====
    // '牙醫' already defined above
    '刷牙': { translation: '洗齒', pronunciation: 'sé-khí' },
    // '牙痛' already defined above
    '牙刷': { translation: '齒抿', pronunciation: 'khí-bín' },
    '牙膏': { translation: '齒膏', pronunciation: 'khí-ko' },
    '牙齒': { translation: '齒', pronunciation: 'khí' },

    // ===== 熱 =====
    '發熱': { translation: '發燒', pronunciation: 'huat-sio' },
    // '熱水' already defined above
    // '熱湯' already defined above
    '熱茶': { translation: '燒茶', pronunciation: 'sio-tê' },
    '熱飯': { translation: '燒飯', pronunciation: 'sio-pn̄g' },
    '熱天': { translation: '熱天', pronunciation: 'jua̍h-thinn' },

    // ===== 冷 =====
    '冷氣': { translation: '冷氣', pronunciation: 'líng-khì' },
    // '冷水' already defined above
    '冷天': { translation: '寒天', pronunciation: 'kuânn-thinn' },
    '冷飯': { translation: '冷飯', pronunciation: 'líng-pn̄g' },
    '冷風': { translation: '寒風', pronunciation: 'kuânn-hong' },
    '冷飲': { translation: '冷飲', pronunciation: 'líng-ím' },

    // ===== 買 =====
    '買東西': { translation: '買物件', pronunciation: 'bé-mi̍h-kiānn' },
    // '買菜' already defined above
    '買藥': { translation: '買藥仔', pronunciation: 'bé-io̍h-á' },
    '買水': { translation: '買水', pronunciation: 'bé-tsuí' },
    '買票': { translation: '買票', pronunciation: 'bé-phiò' },
    '買衣服': { translation: '買衫', pronunciation: 'bé-sann' },

    // ===== 賣 =====
    '賣場': { translation: '賣場', pronunciation: 'bē-tiûnn' },
    '賣菜': { translation: '賣菜', pronunciation: 'bē-tshài' },
    '賣票': { translation: '賣票', pronunciation: 'bē-phiò' },
    '賣魚': { translation: '賣魚', pronunciation: 'bē-hî' },
    '賣肉': { translation: '賣肉', pronunciation: 'bē-bah' },
    '賣水果': { translation: '賣果子', pronunciation: 'bē-kué-tsí' },

    // ===== 開 =====
    '開門': { translation: '開門', pronunciation: 'khui-mn̂g' },
    // '開水' already defined above
    '開車': { translation: '駛車', pronunciation: 'sái-tshia' },
    '開燈': { translation: '開燈', pronunciation: 'khui-ting' },
    '開店': { translation: '開店', pronunciation: 'khui-tiàm' },
    '開窗': { translation: '開窗仔', pronunciation: 'khui-thang-á' },

    // ===== 關 =====
    '關門': { translation: '關門', pronunciation: 'kuainn-mn̂g' },
    '關燈': { translation: '關燈', pronunciation: 'kuainn-ting' },
    '關窗': { translation: '關窗仔', pronunciation: 'kuainn-thang-á' },
    '關水': { translation: '關水', pronunciation: 'kuainn-tsuí' },
    '關店': { translation: '關店', pronunciation: 'kuainn-tiàm' },
    '關機': { translation: '關機', pronunciation: 'kuainn-ki' },

    // ===== 電 =====
    '電話': { translation: '電話', pronunciation: 'tiān-uē' },
    '電視': { translation: '電視', pronunciation: 'tiān-sī' },
    '電燈': { translation: '電燈', pronunciation: 'tiān-ting' },
    '電扇': { translation: '電扇', pronunciation: 'tiān-sìnn' },
    '電梯': { translation: '電梯', pronunciation: 'tiān-thui' },
    '電池': { translation: '電池', pronunciation: 'tiān-tî' },

    // ===== 話 =====
    // '電話' already defined above
    '說話': { translation: '講話', pronunciation: 'kóng-uē' },
    '問話': { translation: '問話', pronunciation: 'mn̄g-uē' },
    '回話': { translation: '回話', pronunciation: 'huê-uē' },
    '講話': { translation: '講話', pronunciation: 'kóng-uē' },
    '對話': { translation: '對話', pronunciation: 'tuì-uē' },

    // ===== 紙 =====
    '衛生紙': { translation: '衛生紙', pronunciation: 'uē-sing-tsuá' },
    '白紙': { translation: '白紙', pronunciation: 'pe̍h-tsuá' },
    '紙箱': { translation: '紙箱', pronunciation: 'tsuá-siunn' },
    '紙袋': { translation: '紙袋仔', pronunciation: 'tsuá-tē-á' },
    '報紙': { translation: '報紙', pronunciation: 'pò-tsuá' },
    '紙杯': { translation: '紙杯', pronunciation: 'tsuá-pue' },

    // ===== 衣 =====
    '衣服': { translation: '衫褲', pronunciation: 'sann-khòo' },
    '雨衣': { translation: '雨衫', pronunciation: 'hōo-sann' },
    '洗衣': { translation: '洗衫', pronunciation: 'sé-sann' },
    '上衣': { translation: '頂衫', pronunciation: 'tíng-sann' },
    '毛衣': { translation: '毛衫', pronunciation: 'mn̂g-sann' },
    // '大衣' already defined above

    // ===== 錢 =====
    '錢包': { translation: '錢包仔', pronunciation: 'tsînn-pau-á' },
    '零錢': { translation: '零星錢', pronunciation: 'lân-san-tsînn' },
    '找錢': { translation: '找錢', pronunciation: 'tshuē-tsînn' },
    '錢袋': { translation: '錢袋仔', pronunciation: 'tsînn-tē-á' },
    '存錢': { translation: '存錢', pronunciation: 'tsûn-tsînn' },
    '花錢': { translation: '開錢', pronunciation: 'khai-tsînn' },

    // ===== 門 =====
    // '大門' already defined above
    '門口': { translation: '門口', pronunciation: 'mn̂g-kháu' },
    '門鈴': { translation: '門鈴', pronunciation: 'mn̂g-lîng' },
    '門牌': { translation: '門牌', pronunciation: 'mn̂g-pâi' },
    // '開門' already defined above
    '門把': { translation: '門鈕仔', pronunciation: 'mn̂g-liú-á' },

    // ===== 台 =====
    '台灣': { translation: '台灣', pronunciation: 'Tâi-uân' },
    // '台北' already defined above
    '台中': { translation: '台中', pronunciation: 'Tâi-tiong' },
    '櫃台': { translation: '櫃台', pronunciation: 'kuī-tâi' },
    '月台': { translation: '月台', pronunciation: 'gue̍h-tâi' },
    // '台南' already defined above

    // ===== 中 =====
    // '台中' already defined above
    '中午': { translation: '中晝', pronunciation: 'tiong-tàu' },
    '中心': { translation: '中心', pronunciation: 'tiong-sim' },
    // '中醫' already defined above
    '中間': { translation: '中間', pronunciation: 'tiong-kan' },
    '中秋': { translation: '中秋', pronunciation: 'tiong-tshiu' },

    // ===== 市 =====
    '市場': { translation: '市場', pronunciation: 'tshī-tiûnn' },
    '台北市': { translation: '台北市', pronunciation: 'Tâi-pak-tshī' },
    '超市': { translation: '超市', pronunciation: 'tshiau-tshī' },
    '市區': { translation: '市區', pronunciation: 'tshī-khu' },
    '夜市': { translation: '夜市', pronunciation: 'iā-tshī' },
    '市民': { translation: '市民', pronunciation: 'tshī-bîn' },

    // ===== 店 =====
    '商店': { translation: '店仔', pronunciation: 'tiàm-á' },
    '書店': { translation: '冊店', pronunciation: 'tsheh-tiàm' },
    '飯店': { translation: '飯店', pronunciation: 'pn̄g-tiàm' },
    '店門': { translation: '店門', pronunciation: 'tiàm-mn̂g' },
    '店員': { translation: '店員', pronunciation: 'tiàm-uân' },
    '店裡': { translation: '店內', pronunciation: 'tiàm-lāi' },

    // ===== 學 =====
    '學校': { translation: '學校', pronunciation: 'ha̍k-hāu' },
    '學生': { translation: '學生', pronunciation: 'ha̍k-sing' },
    '學習': { translation: '學習', pronunciation: 'ha̍k-si̍p' },
    '學費': { translation: '學費', pronunciation: 'ha̍k-huì' },
    '上學': { translation: '上學', pronunciation: 'siōng-ha̍k' },
    '學會': { translation: '學會', pronunciation: 'o̍h-ē' },

    // ===== 公 =====
    '公園': { translation: '公園', pronunciation: 'kong-hn̂g' },
    // '公車' already defined above
    '公用電話': { translation: '公用電話', pronunciation: 'kong-iōng tiān-uē' },
    '公司': { translation: '公司', pronunciation: 'kong-si' },
    '公共': { translation: '公共', pronunciation: 'kong-kiōng' },
    '公寓': { translation: '公寓', pronunciation: 'kong-gū' },

    // ===== 園 =====
    // '公園' already defined above
    '花園': { translation: '花園', pronunciation: 'hue-hn̂g' },
    '園區': { translation: '園區', pronunciation: 'hn̂g-khu' },
    '動物園': { translation: '動物園', pronunciation: 'tōng-bu̍t-hn̂g' },
    '幼兒園': { translation: '幼兒園', pronunciation: 'iù-jî-hn̂g' },
    '菜園': { translation: '菜園', pronunciation: 'tshài-hn̂g' },

    // ===== 銀 =====
    '銀行': { translation: '銀行', pronunciation: 'gîn-hâng' },
    '銀樓': { translation: '銀樓', pronunciation: 'gîn-lâu' },
    '銀幣': { translation: '銀幣', pronunciation: 'gîn-pè' },
    '銀色': { translation: '銀色', pronunciation: 'gîn-sik' },
    '銀行卡': { translation: '銀行卡', pronunciation: 'gîn-hâng-khah' },
    '銀髮': { translation: '銀髮', pronunciation: 'gîn-huat' },

    // ===== 行 =====
    // '銀行' already defined above
    '行人': { translation: '行人', pronunciation: 'hîng-jîn' },
    '行李': { translation: '行李', pronunciation: 'hîng-lí' },
    '行走': { translation: '行路', pronunciation: 'kiânn-lōo' },
    '行程': { translation: '行程', pronunciation: 'hîng-tîng' },
    '行號': { translation: '行號', pronunciation: 'hâng-hō' },

    // ===== 廁 =====
    '廁所': { translation: '便所', pronunciation: 'piān-sóo' },
    '男廁': { translation: '查埔便所', pronunciation: 'tsa-poo piān-sóo' },
    '女廁': { translation: '查某便所', pronunciation: 'tsa-bóo piān-sóo' },
    '公廁': { translation: '公共便所', pronunciation: 'kong-kiōng piān-sóo' },
    '廁紙': { translation: '便所紙', pronunciation: 'piān-sóo-tsuá' },
    '廁門': { translation: '便所門', pronunciation: 'piān-sóo-mn̂g' },

    // ===== Animals context words ===== (小狗, 小貓, 豬肉, 雞蛋, 魚肉, 馬路 already defined above)
    '牛奶': { translation: '牛奶', pronunciation: 'gû-ling' },
    '綿羊': { translation: '綿羊', pronunciation: 'mî-iûnn' },
    '小鳥': { translation: '鳥仔', pronunciation: 'tsiáu-á' },
    '毛毛蟲': { translation: '毛毛蟲', pronunciation: 'moo-moo-thâng' },

    // ===== Appliances context words ===== (電視, 電燈, 電扇, 紙箱, 冷氣 already defined above)
    '電腦': { translation: '電腦', pronunciation: 'tiān-náu' },
    '洗衣機': { translation: '洗衫機', pronunciation: 'sé-sann-ki' },
    '洗衣服': { translation: '洗衫', pronunciation: 'sé-sann' },
    '冰箱': { translation: '冰箱', pronunciation: 'ping-siunn' },
    '電風扇': { translation: '電風', pronunciation: 'tiān-hong' },
    '微波爐': { translation: '微波爐', pronunciation: 'bî-pho-lôo' },

    // ===== 不 =====
    '不要': { translation: '毋通', pronunciation: 'm̄-thang' },
    '不好': { translation: '毋好', pronunciation: 'm̄-hó' },
    '不行': { translation: '袂使', pronunciation: 'bē-sái' },
    '不可': { translation: '毋可', pronunciation: 'm̄-khó' },
    '不對': { translation: '毋著', pronunciation: 'm̄-tio̍h' },

    // ===== 了 =====
    '好了': { translation: '好矣', pronunciation: 'hó--ah' },
    '了解': { translation: '了解', pronunciation: 'liáu-kái' },
    '走了': { translation: '走矣', pronunciation: 'tsáu--ah' },
    '到了': { translation: '到矣', pronunciation: 'kàu--ah' },
    '吃了': { translation: '食矣', pronunciation: 'tsia̍h--ah' },

    // ===== 也 =====
    '也是': { translation: '嘛是', pronunciation: 'mā-sī' },
    '也好': { translation: '嘛好', pronunciation: 'mā-hó' },
    '也要': { translation: '嘛欲', pronunciation: 'mā-beh' },
    '也會': { translation: '嘛會', pronunciation: 'mā-ē' },

    // ===== 有 =====
    '有人': { translation: '有人', pronunciation: 'ū-lâng' },
    '有名': { translation: '有名', pronunciation: 'ū-miâ' },
    '有心': { translation: '有心', pronunciation: 'ū-sim' },
    '沒有': { translation: '無', pronunciation: 'bô' },
    '所有': { translation: '所有', pronunciation: 'sóo-ū' },

    // ===== 在 =====
    '在家': { translation: '佇厝', pronunciation: 'tī-tshù' },
    '不在': { translation: '無佇咧', pronunciation: 'bô-tī-leh' },
    '現在': { translation: '這馬', pronunciation: 'tsit-má' },
    '在外': { translation: '佇外口', pronunciation: 'tī-guā-kháu' },
    '在地': { translation: '在地', pronunciation: 'tsāi-tē' },

    // ===== 那 =====
    '那個': { translation: '彼个', pronunciation: 'hit-ê' },
    '那邊': { translation: '彼爿', pronunciation: 'hit-pîng' },
    '那裡': { translation: '彼位', pronunciation: 'hit-uī' },
    '那天': { translation: '彼日', pronunciation: 'hit-ji̍t' },

    // ===== 的 =====
    '我的': { translation: '我的', pronunciation: 'guá-ê' },
    '你的': { translation: '你的', pronunciation: 'lí-ê' },
    '好的': { translation: '好的', pronunciation: 'hó--ê' },
    '大的': { translation: '大的', pronunciation: 'tuā--ê' },
    '真的': { translation: '真的', pronunciation: 'tsin--ê' },

    // ===== 和 =====
    '和好': { translation: '和好', pronunciation: 'hô-hó' },
    '和氣': { translation: '和氣', pronunciation: 'hô-khì' },
    '和平': { translation: '和平', pronunciation: 'hô-pîng' },
    '和睦': { translation: '和睦', pronunciation: 'hô-bo̍k' },

    // ===== 是 ===== ('也是' defined above under 也)
    '是的': { translation: '是的', pronunciation: 'sī--ê' },
    '就是': { translation: '就是', pronunciation: 'tō-sī' },
    '但是': { translation: '但是', pronunciation: 'tān-sī' },
    '是非': { translation: '是非', pronunciation: 'sī-hui' },

    // ===== 這 =====
    '這個': { translation: '這个', pronunciation: 'tsit-ê' },
    '這裡': { translation: '這位', pronunciation: 'tsit-uī' },
    '這邊': { translation: '這爿', pronunciation: 'tsit-pîng' },
    '這次': { translation: '這擺', pronunciation: 'tsit-pái' },
    '這陣': { translation: '這陣', pronunciation: 'tsit-tsūn' },

    // ===== 可 =====
    '可以': { translation: '會使', pronunciation: 'ē-sái' },
    '可能': { translation: '可能', pronunciation: 'khó-lîng' },
    '可怕': { translation: '可怕', pronunciation: 'khó-phànn' },
    '可惜': { translation: '可惜', pronunciation: 'khó-sioh' },
    '可愛': { translation: '古錐', pronunciation: 'kóo-tsui' },

    // ===== 沒 =====
    '沒事': { translation: '無代誌', pronunciation: 'bô-tāi-tsì' },
    '沒關係': { translation: '無要緊', pronunciation: 'bô-iàu-kín' },
    '沒問題': { translation: '無問題', pronunciation: 'bô-būn-tê' },

    // ===== 你 ===== ('你好' defined in Family section, '你的' defined under 的)
    '你們': { translation: '恁', pronunciation: 'lín' },
    '給你': { translation: '予你', pronunciation: 'hōo-lí' },

    // ===== 到 =====
    '到底': { translation: '到底', pronunciation: 'tàu-té' },
    '到時': { translation: '到時', pronunciation: 'kàu-sî' },
    '周到': { translation: '周到', pronunciation: 'tsiu-tàu' },
    '報到': { translation: '報到', pronunciation: 'pò-tàu' },

    // ===== 要 =====
    '要去': { translation: '欲去', pronunciation: 'beh-khì' },
    '要緊': { translation: '要緊', pronunciation: 'iàu-kín' },
    '主要': { translation: '主要', pronunciation: 'tsú-iàu' },
    '需要': { translation: '需要', pronunciation: 'su-iàu' },

    // ===== 很 =====
    '很好': { translation: '真好', pronunciation: 'tsin-hó' },
    '很多': { translation: '真濟', pronunciation: 'tsin-tsē' },
    '很大': { translation: '真大', pronunciation: 'tsin-tuā' },
    '很快': { translation: '真緊', pronunciation: 'tsin-kín' },
    '很忙': { translation: '真無閒', pronunciation: 'tsin-bô-îng' },

    // ===== 都 =====
    '都好': { translation: '攏好', pronunciation: 'lóng-hó' },
    '都是': { translation: '攏是', pronunciation: 'lóng-sī' },
    '都有': { translation: '攏有', pronunciation: 'lóng-ū' },
    '都要': { translation: '攏欲', pronunciation: 'lóng-beh' },

    // ===== 就 =====
    '就好': { translation: '就好', pronunciation: 'tō-hó' },
    '就近': { translation: '就近', pronunciation: 'tsiū-kīn' },
    '就醫': { translation: '就醫', pronunciation: 'tsiū-i' },
    '成就': { translation: '成就', pronunciation: 'sîng-tsiū' },

    // ===== 給 =====
    '給錢': { translation: '予錢', pronunciation: 'hōo-tsînn' },
    '交給': { translation: '交予', pronunciation: 'kau-hōo' },
    '送給': { translation: '送予', pronunciation: 'sàng-hōo' },

    // ===== 會 ===== ('學會' defined in Activities section)
    '不會': { translation: '袂', pronunciation: 'bē' },
    '開會': { translation: '開會', pronunciation: 'khui-huē' },
    '再會': { translation: '再會', pronunciation: 'tsài-huē' },
    '社會': { translation: '社會', pronunciation: 'siā-huē' },
  },
  ui: taiUi,
};
