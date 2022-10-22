import { todo } from '../static/types' 

chrome.alarms.create("TodoListReminder",{
  periodInMinutes: 1/60,
})

chrome.alarms.create("PomoTimer",{
  periodInMinutes: 1/60,
})

chrome.alarms.onAlarm.addListener((alarm)=>{
  const now = Date.now();
  if(alarm.name==="PomoTimer") {
    chrome.storage.local.get(["passedSeconds","pomoIsRunning","pomoAlertTime"],function(res){
      if (res.pomoIsRunning) {
        let passedSeconds = res.passedSeconds +1
        let pomoIsRunning = true
        if(res.pomoAlertTime * 60 - passedSeconds > 60){
          chrome.action.setBadgeBackgroundColor({color: [124, 247, 216, 1]});
        } else {
          chrome.action.setBadgeBackgroundColor({color: '#fcaf9a'});
        }        
        chrome.action.setBadgeText({text:`${`${res.pomoAlertTime - Math.ceil(res.passedSeconds / 60)}`}:${`${res.passedSeconds % 60 && 60 - res.passedSeconds % 60}`.padStart(2, "0")}`})
        if (passedSeconds > res.pomoAlertTime * 60){
          passedSeconds = 0;
          pomoIsRunning = false
          chrome.action.setBadgeText({text:''});
          chrome.notifications.getAll((res)=>console.log(res));
          this.registration.showNotification("Pomodoro Timer",{
            body: `${res.pomoAlertTime} minutes has padded!`,
            icon: "CatalystLogo_128.png"
          })
        }
        chrome.storage.local.set({passedSeconds,pomoIsRunning})
      } else {
        chrome.action.setBadgeText({text:''});
      }
    })
  }
  if(alarm.name==="TodoListReminder"){
    const now = Date.now();
    chrome.storage.local.get(['todoList'], function (result) {
      if(result.todoList){
        let tempList = [];
        result.todoList.forEach((todo: todo)=>{
          const alertTime = Date.parse(`${todo.alertDate} ${todo.alertTime}`)
          if(todo.isSetAlert && !todo.alertSend && (alertTime - now < 120000)){
            const timeout = (alertTime - now) > 0 ? (alertTime - now) : 0;
            setTimeout(()=>{
              chrome.notifications.getAll((res)=>console.log(res));
              this.registration.showNotification("To do list reminder",{
                body: `The set time of work item "${todo.workContent}" has passed`,
                icon: "CatalystLogo_128.png"
              })              
            },timeout)
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

chrome.storage.local.get(["passedSeconds","pomoIsRunning","pomoAlertTime"],(res)=> {
  chrome.storage.local.set({
    passedSeconds: "passedSeconds" in res? res.passedSeconds : 0,
    pomoIsRunning: "pomoIsRunning" in res? res.pomoIsRunning : false,
    pomoAlertTime: "pomoAlertTime" in res? res.pomoAlertTime : 25
  })
})

chrome.runtime.onInstalled.addListener((details) => {
  console.log(details)
  chrome.contextMenus.create({
    title: "Read these text(s) en-US",
    id: "contextMenu1",
    contexts: ["page","selection","link"]
  })
  chrome.contextMenus.onClicked.addListener((e)=>{
    if(e.menuItemId === "contextMenu1"){
      chrome.tts.speak(e.selectionText,{lang:"en-US"});
      console.log("speak en-US");
    }
  })
})