console.log("backgroundScript running!")

const todoListPort = chrome.runtime.connect({ name: "todo" });
console.log(todoListPort);
todoListPort.onMessage.addListener((res)=>{
  console.log(res);
})

interface todo {
  workContent: string;
  isDone: boolean;
  id: number;
  isSetAlert: boolean;
  alertDate?: string;
  alertTime?: string;
  alertSend?: boolean;
}

chrome.alarms.create("TodoListReminder",{
  periodInMinutes: 1/12,
})

chrome.alarms.onAlarm.addListener((alarm)=>{
  const now = Date.now();
  if(alarm.name="TodoListReminder"){
    chrome.storage.sync.get(['todoList'], function (result) {
      if(result.todoList){
        let tempList = [];
        result.todoList.forEach((todo: todo)=>{
          if(todo.isSetAlert && !todo.alertSend && Date.parse(`${todo.alertDate} ${todo.alertTime}`)<now){
            this.registration.showNotification("To do list reminder",{
              body: `The set time of work item "${todo.workContent}" has passed`,
              icon: "CatalystLogo_128.png"
            })
            const tempTodo = {...todo}
            tempTodo.alertSend = true;
            console.log(tempTodo)
            tempList.push(tempTodo)
            console.log(todo.workContent);
            todoListPort.postMessage({msg: "update"})
          } else {
            tempList.push(todo);
          }        
        })
        chrome.storage.sync.set({ todoList: tempList }, function () {
          console.log("set");
        });
      }
      
    });
  }  
})

chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    title: "Read these text(s) (English)",
    id: "contextMenu1",
    contexts: ["page","selection"]
  })
  chrome.contextMenus.onClicked.addListener((e)=>{
    if(e.menuItemId === "contextMenu1"){
      chrome.tts.speak(e.selectionText,{lang:"en-US"})
    }
  })
  console.log(details);
})




const langusgeList = [
  {"LangCultureName": "af-ZA", "DisplayName": "南非荷蘭語 - 南非"},
  {"LangCultureName": "sq-AL", "DisplayName": "阿爾巴尼亞人 - 阿爾巴尼亞"},
  {"LangCultureName": "ar-DZ", "DisplayName": "阿拉伯語 - 阿爾及利亞"},
  {"LangCultureName": "ar-BH", "DisplayName": "阿拉伯語 - 巴林"},
  {"LangCultureName": "ar-EG", "DisplayName": "阿拉伯語 - 埃及"},
  {"LangCultureName": "ar-IQ", "DisplayName": "阿拉伯語 - 伊拉克"},
  {"LangCultureName": "ar-JO", "DisplayName": "阿拉伯語 - 約旦"},
  {"LangCultureName": "ar-KW", "DisplayName": "阿拉伯語 - 科威特"},
  {"LangCultureName": "ar-LB", "DisplayName": "阿拉伯語 - 黎巴嫩"},
  {"LangCultureName": "ar-LY", "DisplayName": "阿拉伯語 - 利比亞"},
  {"LangCultureName": "ar-MA", "DisplayName": "阿拉伯語 - 摩洛哥"},
  {"LangCultureName": "ar-OM", "DisplayName": "阿拉伯語 - 阿曼"},
  {"LangCultureName": "ar-QA", "DisplayName": "阿拉伯語 - 卡塔爾"},
  {"LangCultureName": "ar-SA", "DisplayName": "阿拉伯語 - 沙特阿拉伯"},
  {"LangCultureName": "ar-SY", "DisplayName": "阿拉伯語 - 敘利亞"},
  {"LangCultureName": "ar-TN", "DisplayName": "阿拉伯語 - 突尼斯"},
  {"LangCultureName": "ar-AE", "DisplayName": "阿拉伯語 - 阿拉伯聯合酋長國"},
  {"LangCultureName": "ar-YE", "DisplayName": "阿拉伯語 - 也門"},
  {"LangCultureName": "hy-AM", "DisplayName": "亞美尼亞 - 亞美尼亞"},
  {"LangCultureName": "Cy-az-AZ", "DisplayName": "阿塞拜疆（西里爾） - 阿塞拜疆"},
  {"LangCultureName": "Lt-az-AZ", "DisplayName": "阿塞拜疆（拉丁） - 阿塞拜疆"},
  {"LangCultureName": "eu-ES", "DisplayName": "巴斯克語 - 巴斯克語"},
  {"LangCultureName": "be-BY", "DisplayName": "白俄羅斯 - 白俄羅斯"},
  {"LangCultureName": "bg-BG", "DisplayName": "保加利亞 - 保加利亞"},
  {"LangCultureName": "ca-ES", "DisplayName": "加泰羅尼亞語 - 加泰羅尼語"},
  {"LangCultureName": "zh-CN", "DisplayName": "中文 - 中國"},
  {"LangCultureName": "zh-HK", "DisplayName": "中文 - 香港特別行政區"},
  {"LangCultureName": "zh-MO", "DisplayName": "中文 - 澳門特別行政區"},
  {"LangCultureName": "zh-SG", "DisplayName": "中文 - 新加坡"},
  {"LangCultureName": "zh-TW", "DisplayName": "中文 - 台灣"},
  {"LangCultureName": "zh-CHS", "DisplayName": "簡體中文）"},
  {"LangCultureName": "zh-CHT", "DisplayName": "繁體中文）"},
  {"LangCultureName": "hr-HR", "DisplayName": "克羅地亞 - 克羅地亞"},
  {"LangCultureName": "cs-CZ", "DisplayName": "捷克 - 捷克共和國"},
  {"LangCultureName": "da-DK", "DisplayName": "丹麥語 - 丹麥語"},
  {"LangCultureName": "div-MV", "DisplayName": "Dhivehi - 馬爾地夫"},
  {"LangCultureName": "nl-BE", "DisplayName": "荷蘭 - 比利時"},
  {"LangCultureName": "nl-NL", "DisplayName": "荷蘭 - 荷蘭"},
  {"LangCultureName": "en-AU", "DisplayName": "英文 - 澳大利亞"},
  {"LangCultureName": "en-BZ", "DisplayName": "英語 - 伯利茲"},
  {"LangCultureName": "en-CA", "DisplayName": "英文 - 加拿大"},
  {"LangCultureName": "en-CB", "DisplayName": "英語 - 加勒比"},
  {"LangCultureName": "en-IE", "DisplayName": "英語 - 愛爾蘭"},
  {"LangCultureName": "en-JM", "DisplayName": "英語 - 牙買加"},
  {"LangCultureName": "en-NZ", "DisplayName": "英語 - 新西蘭"},
  {"LangCultureName": "en-PH", "DisplayName": "英語 - 菲律賓"},
  {"LangCultureName": "en-ZA", "DisplayName": "英文 - 南非"},
  {"LangCultureName": "en-TT", "DisplayName": "英文 - 特立尼達和多巴哥"},
  {"LangCultureName": "en-GB", "DisplayName": "英文 - 英國"},
  {"LangCultureName": "en-US", "DisplayName": "美國英語"},
  {"LangCultureName": "en-ZW", "DisplayName": "英語 - 津巴布韋"},
  {"LangCultureName": "et-EE", "DisplayName": "愛沙尼亞語 - 愛沙尼亞"},
  {"LangCultureName": "fo-FO", "DisplayName": "法羅群島 - 法羅群島"},
  {"LangCultureName": "fa-IR", "DisplayName": "波斯 - 伊朗"},
  {"LangCultureName": "fi-FI", "DisplayName": "芬蘭 - 芬蘭"},
  {"LangCultureName": "fr-BE", "DisplayName": "法語 - 比利時"},
  {"LangCultureName": "fr-CA", "DisplayName": "法語 - 加拿大"},
  {"LangCultureName": "fr-FR", "DisplayName": "法國 - 法國"},
  {"LangCultureName": "fr-LU", "DisplayName": "法語 - 盧森堡"},
  {"LangCultureName": "fr-MC", "DisplayName": "法語 - 摩納哥"},
  {"LangCultureName": "fr-CH", "DisplayName": "法語 - 瑞士"},
  {"LangCultureName": "gl-ES", "DisplayName": "加利西亞人 - 加利西亞人"},
  {"LangCultureName": "ka-GE", "DisplayName": "格魯吉亞 - 格魯吉亞"},
  {"LangCultureName": "de-AT", "DisplayName": "德國 - 奧地利"},
  {"LangCultureName": "de-DE", "DisplayName": "德國 - 德國"},
  {"LangCultureName": "de-LI", "DisplayName": "德語 - 列支敦士登"},
  {"LangCultureName": "de-LU", "DisplayName": "德國 - 盧森堡"},
  {"LangCultureName": "de-CH", "DisplayName": "德國 - 瑞士"},
  {"LangCultureName": "el-GR", "DisplayName": "希臘 - 希臘"},
  {"LangCultureName": "gu-IN", "DisplayName": "古吉拉特文 - 印度"},
  {"LangCultureName": "he-IL", "DisplayName": "希伯來語 - 以色列"},
  {"LangCultureName": "hi-IN", "DisplayName": "印地文 - 印度"},
  {"LangCultureName": "hu-HU", "DisplayName": "匈牙利 - 匈牙利"},
  {"LangCultureName": "is-IS", "DisplayName": "冰島 - 冰島"},
  {"LangCultureName": "id-ID", "DisplayName": "印尼 - 印尼"},
  {"LangCultureName": "it-IT", "DisplayName": "意大利 - 意大利"},
  {"LangCultureName": "it-CH", "DisplayName": "意大利語 - 瑞士"},
  {"LangCultureName": "ja-JP", "DisplayName": "日文 - 日本"},
  {"LangCultureName": "kn-IN", "DisplayName": "卡納達 - 印度"},
  {"LangCultureName": "kk-KZ", "DisplayName": "哈薩克斯坦"},
  {"LangCultureName": "kok-IN", "DisplayName": "康卡尼 - 印度"},
  {"LangCultureName": "ko-KR", "DisplayName": "韓國 - 韓國"},
  {"LangCultureName": "ky-KZ", "DisplayName": "吉爾吉斯斯坦 - 哈薩克斯坦"},
  {"LangCultureName": "lv-LV", "DisplayName": "拉脫維亞 - 拉脫維亞"},
  {"LangCultureName": "lt-LT", "DisplayName": "立陶宛立陶宛"},
  {"LangCultureName": "mk-MK", "DisplayName": "馬其頓（FYROM）"},
  {"LangCultureName": "ms-BN", "DisplayName": "馬來文 - 文萊"},
  {"LangCultureName": "ms-MY", "DisplayName": "馬來文 - 馬來西亞"},
  {"LangCultureName": "mr-IN", "DisplayName": "馬拉地 - 印度"},
  {"LangCultureName": "mn-MN", "DisplayName": "蒙古 - 蒙古"},
  {"LangCultureName": "nb-NO", "DisplayName": "挪威語（Bokmål） - 挪威"},
  {"LangCultureName": "nn-NO", "DisplayName": "挪威（尼諾斯克） - 挪威"},
  {"LangCultureName": "pl-PL", "DisplayName": "波蘭語 - 波蘭語"},
  {"LangCultureName": "pt-BR", "DisplayName": "葡萄牙語 - 巴西"},
  {"LangCultureName": "pt-PT", "DisplayName": "葡萄牙 - 葡萄牙"},
  {"LangCultureName": "pa-IN", "DisplayName": "旁遮普邦 - 印度"},
  {"LangCultureName": "ro-RO", "DisplayName": "羅馬尼亞語 - 羅馬尼亞"},
  {"LangCultureName": "ru-RU", "DisplayName": "俄羅斯 - 俄羅斯"},
  {"LangCultureName": "sa-IN", "DisplayName": "梵文 - 印度"},
  {"LangCultureName": "Cy-sr-SP", "DisplayName": "塞爾維亞語（塞爾維亞語） - 塞爾維亞語"},
  {"LangCultureName": "Lt-sr-SP", "DisplayName": "塞爾維亞（拉丁） - 塞爾維亞"},
  {"LangCultureName": "sk-SK", "DisplayName": "斯洛伐克語 - 斯洛伐克"},
  {"LangCultureName": "sl-SI", "DisplayName": "斯洛文尼亞語 - 斯洛維尼亞"},
  {"LangCultureName": "es-AR", "DisplayName": "西班牙語 - 阿根廷"},
  {"LangCultureName": "es-BO", "DisplayName": "西班牙語 - 玻利維亞"},
  {"LangCultureName": "es-CL", "DisplayName": "西班牙語 - 智利"},
  {"LangCultureName": "es-CO", "DisplayName": "西班牙 - 哥倫比亞"},
  {"LangCultureName": "es-CR", "DisplayName": "西班牙語 - 哥斯達黎加"},
  {"LangCultureName": "es-DO", "DisplayName": "西班牙語 - 多米尼加共和國"},
  {"LangCultureName": "es-EC", "DisplayName": "西班牙語 - 厄瓜多爾"},
  {"LangCultureName": "es-SV", "DisplayName": "西班牙語 - 薩爾瓦多"},
  {"LangCultureName": "es-GT", "DisplayName": "西班牙語 - 危地馬拉"},
  {"LangCultureName": "es-HN", "DisplayName": "西班牙語 - 洪都拉斯"},
  {"LangCultureName": "es-MX", "DisplayName": "西班牙語 - 墨西哥"},
  {"LangCultureName": "es-NI", "DisplayName": "西班牙語 - 尼加拉瓜"},
  {"LangCultureName": "es-PA", "DisplayName": "西班牙語 - 巴拿馬"},
  {"LangCultureName": "es-PY", "DisplayName": "西班牙語 - 巴拉圭"},
  {"LangCultureName": "es-PE", "DisplayName": "西班牙語 - 秘魯"},
  {"LangCultureName": "es-PR", "DisplayName": "西班牙語 - 波多黎各"},
  {"LangCultureName": "es-ES", "DisplayName": "西班牙語 - 西班牙"},
  {"LangCultureName": "es-UY", "DisplayName": "西班牙語 - 烏拉圭"},
  {"LangCultureName": "es-VE", "DisplayName": "西班牙語 - 委內瑞拉"},
  {"LangCultureName": "sw-KE", "DisplayName": "斯瓦希里語 - 肯尼亞"},
  {"LangCultureName": "sv-FI", "DisplayName": "瑞典語 - 芬蘭語"},
  {"LangCultureName": "sv-SE", "DisplayName": "瑞典語 - 瑞典語"},
  {"LangCultureName": "syr-SY", "DisplayName": "敘利亞 - 敘利亞"},
  {"LangCultureName": "ta-IN", "DisplayName": "泰米爾語 - 印度"},
  {"LangCultureName": "tt-RU", "DisplayName": "韃靼 - 俄羅斯"},
  {"LangCultureName": "te-IN", "DisplayName": "泰盧固語 - 印度"},
  {"LangCultureName": "th-TH", "DisplayName": "泰國 - 泰國"},
  {"LangCultureName": "tr-TR", "DisplayName": "土耳其 - 土耳其"},
  {"LangCultureName": "uk-UA", "DisplayName": "烏克蘭 - 烏克蘭"},
  {"LangCultureName": "ur-PK", "DisplayName": "烏爾都語 - 巴基斯坦"},
  {"LangCultureName": "Cy-uz-UZ", "DisplayName": "烏茲別克語（西里爾文） - 烏茲別克斯坦"},
  {"LangCultureName": "Lt-uz-UZ", "DisplayName": "烏茲別克語（拉丁語） - 烏茲別克斯坦"},
  {"LangCultureName": "vi-VN", "DisplayName": "越南 - 越南"}
]




