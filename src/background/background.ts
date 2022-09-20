
console.log("backgroundScript running!")

// const todoListPort = chrome.runtime.connect({ name: "todo" });
// console.log(todoListPort);
// todoListPort.onMessage.addListener((res)=>{
//   console.log(res);
// })


// const clientId = process.env.CLIENT_ID
// const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`
// const nonce = Math.random().toString(36).substring(2, 15)

// chrome.action.onClicked.addListener(function() {
//   const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

//   authUrl.searchParams.set('client_id', clientId);
//   authUrl.searchParams.set('response_type', 'id_token');
//   authUrl.searchParams.set('redirect_uri', redirectUri);
//   // Add the OpenID scope. Scopes allow you to access the user’s information.
//   authUrl.searchParams.set('scope', 'openid profile email');
//   authUrl.searchParams.set('nonce', nonce);
//   // Show the consent screen after login.
//   authUrl.searchParams.set('prompt', 'consent');

//   chrome.identity.launchWebAuthFlow(
//     {
//       url: authUrl.href,
//       interactive: true,
//     },
//     (redirectUrl) => {
//       if (redirectUrl) {
//         // The ID token is in the URL hash
//         const urlHash = redirectUrl.split('#')[1];
//         const params = new URLSearchParams(urlHash);
//         const jwt = params.get('id_token');

//         // Parse the JSON Web Token
//         const base64Url = jwt.split('.')[1];
//         const base64 = base64Url.replace('-', '+').replace('_', '/');
//         const token = JSON.parse(atob(base64));

//         console.log('token', token);
//       }
//     },
//   );
// });



////////////////////////////
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

chrome.alarms.create("PomoTimer",{
  periodInMinutes: 1/60,
})

chrome.alarms.onAlarm.addListener((alarm)=>{
  const now = Date.now();
  if(alarm.name==="PomoTimer") {
    chrome.storage.local.get(["passedSeconds","pomoIsRunning","pomoAlertTime"],(res)=>{
      if (res.pomoIsRunning) {
        let passedSeconds = res.passedSeconds +1
        let pomoIsRunning = true
        console.log('po'+res.pomoAlertTime)
        if (passedSeconds > res.pomoAlertTime * 60){
          passedSeconds = 0;
          pomoIsRunning = false
          this.registration.showNotification("Pomodoro Timer",{
            body: `${res.pomoAlertTime} minutes has padded!`,
            icon: "CatalystLogo_128.png"
          })          
        }
        chrome.storage.local.set({passedSeconds,pomoIsRunning})
      }
    })
  }
  if(alarm.name==="TodoListReminder"){
    chrome.storage.sync.get(['todoList'], function (result) {
      if(result.todoList){
        let tempList = [];
        result.todoList.forEach((todo: todo)=>{
          if(todo.isSetAlert && !todo.alertSend && (Date.parse(`${todo.alertDate} ${todo.alertTime}`)<now)){
            this.registration.showNotification("To do list reminder",{
              body: `The set time of work item "${todo.workContent}" has passed`,
              icon: "CatalystLogo_128.png"
            })
            const tempTodo = {...todo}
            tempTodo.alertSend = true;
            console.log(tempTodo)
            tempList.push(tempTodo)
            console.log(todo.workContent);
            // todoListPort.postMessage({msg: "update"})
          } else {
            tempList.push(todo);
          }        
        })
        chrome.storage.sync.set({ todoList: tempList }, function () {
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
