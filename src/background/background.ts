
console.log("backgroundScript running!")

interface todo {
  workContent: string;
  isDone: boolean;
  id: number;
  isSetAlert: boolean;
  alertDate?: string;
  alertTime?: string;
  alertSend?: boolean;
}

chrome.runtime.onInstalled.addListener((details) => {
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
  console.log(details);
})

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
    chrome.storage.local.get(['todoList'], function (result) {
      if(result.todoList){
        let tempList = [];
        result.todoList.forEach((todo: todo)=>{
          if(todo.isSetAlert && !todo.alertSend && (Date.parse(`${todo.alertDate} ${todo.alertTime}`)<now)){
            console.log(this);
            this.registration.showNotification("To do list reminder",{
              body: `The set time of work item "${todo.workContent}" has passed`,
              icon: "CatalystLogo_128.png"
            })
            const tempTodo = {...todo}
            tempTodo.alertSend = true;
            tempList.push(tempTodo)
            // todoListPort.postMessage({msg: "update"})
          } else {
            tempList.push(todo);
          }        
        })
        chrome.storage.local.set({ todoList: tempList }, function () {
          // console.log("set");
        });
      }
      
    });
  }  
})

chrome.storage.local.get(["passedSeconds","pomoIsRunning","pomoAlertTime"],(res)=> {
  chrome.storage.local.set({
    passedSeconds: "passedSeconds" in res? res.passedSeconds : 0,
    pomoIsRunning: "pomoIsRunning" in res? res.pomoIsRunning : false,
    pomoAlertTime: "pomoAlertTime" in res? res.pomoAlertTime : 1
  })
})


