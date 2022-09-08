console.log("contentScript running!");
console.log(window.location.href);

// let tabId = 0;
// let todoListContentPort: any
// chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//   console.log(tabs[0]);
//   tabId = tabs[0].id;
//   todoListContentPort = chrome.tabs.connect(tabId,{ name: "todo" });
// });

// console.log(todoListContentPort);

// todoListContentPort.onMessage.addListener(function (res: { msg: string }) {
//   console.log(res)
//   if (res.msg === "update") {
//     console.log("todolist panel update")
//   }
// })