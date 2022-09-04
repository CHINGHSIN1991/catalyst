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

chrome.alarms.create("TodoListReminder",{
  periodInMinutes: 1/12,
})

chrome.alarms.onAlarm.addListener((alarm)=>{
  const now = Date.now();
  if(alarm.name="TodoListReminder"){
    chrome.storage.sync.get(['todoList'], function (result) {
      // console.log(result.todoList);
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
            // console.log(tempTodo)
            tempList.push(tempTodo)
            // console.log(todo.workContent);
          } else {
            tempList.push(todo)
          }        
        })
        chrome.storage.sync.set({ todoList: tempList }, function () {
          // console.log("set");
        });
      }
      
    });
  }  
})
// chrome.runtime.onInstalled.addListener((details) => {
//   chrome.contextMenus.create({
//     title: "Test Context Menu",
//     id: "contextMenu1",
//     contexts: ["page","selection","link"]
//   })
//   chrome.contextMenus.onClicked.addListener((event)=>{
//     console.log(event.selectionText);
//     chrome.search.query({
//       disposition: "NEW_TAB",
//       text: event.selectionText,      
//     },() => {})
//   })
//   console.log(details);
// })





