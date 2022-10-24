import { todo } from '../static/types'
import { getPassedSeconds } from '../utils/functions'

chrome.storage.local.get(['pomoStartTime','pomoAlertTime','pomoStoredTime'],(res)=> {
  chrome.storage.local.set({
    pomoStartTime: 'pomoStartTime' in res? res.pomoStartTime : 0,
    pomoStoredTime: 'pomoStoredTime' in res? res.pomoStoredTime : 0,
    pomoAlertTime: 'pomoAlertTime' in res? res.pomoAlertTime : 25,
  })
})

chrome.alarms.create("TodoListReminder",{
  periodInMinutes: 1,
})

chrome.alarms.create("PomoTimer",{
  periodInMinutes: 1,
})

chrome.alarms.onAlarm.addListener((alarm)=>{  
  if(alarm.name==="PomoTimer") {
    const current = Date.now();
    chrome.storage.local.get(['pomoStartTime', 'pomoAlertTime', 'pomoStoredTime'],function(res){
      if (res.pomoStartTime) {
        const passedSeconds = getPassedSeconds(res.pomoStartTime, res.pomoStoredTime)
        const checkTime = res.pomoAlertTime * 60 - passedSeconds
        if(checkTime > 180){
          chrome.action.setBadgeBackgroundColor({color: [124, 247, 216, 1]});
        } else {
          chrome.action.setBadgeBackgroundColor({color: '#fcaf9a'});
        }        
        chrome.action.setBadgeText({text:`${`${res.pomoAlertTime - Math.ceil(passedSeconds / 60)}`}m`})        
        if (checkTime < 60){
          setTimeout(function(){
            chrome.action.setBadgeText({text:''});
            chrome.notifications.getAll((res)=>console.log(res));
            this.registration.showNotification("Pomodoro Timer",{
              body: `${res.pomoAlertTime} minutes have passed!`,
              icon: "CatalystLogo_128.png"
            })
          },checkTime*1000)          
        }
      } else {
        chrome.action.setBadgeText({text:''});
      }
    })
  }
  if(alarm.name==="TodoListReminder"){    
    chrome.storage.local.get(['todoList'], function (result) {
      if(result.todoList){
        let tempList = [];
        const now = Date.now();
        result.todoList.forEach((todo: todo)=>{
          if(todo.isSetAlert && !todo.alertSend && (Date.parse(`${todo.alertDate} ${todo.alertTime}`) - now > 0)){
            chrome.notifications.getAll((res)=>console.log(res));
            this.registration.showNotification("To do list reminder",{
              body: `The set time of work item "${todo.workContent}" has passed`,
              icon: "CatalystLogo_128.png"
            })
            const tempTodo = {...todo}
            tempTodo.alertSend = true;
            tempList.push(tempTodo)
          } else {
            tempList.push(todo);
          }        
        })
        chrome.storage.local.set({ todoList: tempList });
      }      
    });
  }  
})

chrome.storage.sync.get(['personalization'], (res) => {
  let pronounce = '';
  if (res.personalization) {
    pronounce = res.personalization.pronounce
  } else {
    pronounce = 'zh-TW'
  }
  chrome.runtime.onInstalled.addListener((details) => {
    chrome.contextMenus.create({
      title: `Read these text(s) ${pronounce}`,
      id: "contextMenu1",
      contexts: ["page","selection","link"]
    })
    chrome.contextMenus.onClicked.addListener((e)=>{
      if(e.menuItemId === "contextMenu1"){
        chrome.tts.speak(e.selectionText,{lang:pronounce});
      }
    })
  })
});

