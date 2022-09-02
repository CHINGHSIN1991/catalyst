console.log("backgroundScript running!")

chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    title: "Test Context Menu",
    id: "contextMenu1",
    contexts: ["page","selection","link"]
  })
  chrome.contextMenus.onClicked.addListener((event)=>{
    console.log(event.selectionText);
    chrome.search.query({
      disposition: "NEW_TAB",
      text: event.selectionText,      
    },() => {console.log(window.location.href)})
  })
  console.log(details);
})