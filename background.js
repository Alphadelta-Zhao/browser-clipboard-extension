chrome.runtime.onInstalled.addListener((details)=>{ 
  if (details.reason === "install"){
    const tags = ["default"];
    const init = [{
        id: Date.now(),
        content: "",
        tag : tags[0]
    }];
    chrome.storage.local.set({clipData: init}, function() {});
    chrome.storage.local.set({tags}, function() {});
    return;
  }
  console.log("更新完成");
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log("下面是存储的改变");
    console.log(oldValue);
    console.log(newValue);
    console.log("上面是存储的改变")
  }
});

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse)=> {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request[0] === "copy happened"){
      if(submitData(request[1]))sendResponse("copy success");
    }
    else if (request[0] === "edit item"){
      editDataItem(request[1],request[2]).then(()=>{
        sendResponse("edit content success");
      });
    }
    return true;
  } 
);

async function submitData(newData){
  let storage = await getData();
  // 为了避免抖动，storage增加一个永远也不会展示的第零项 
  if(storage[storage.length-1].content != newData.content){
    storage.push(newData);
    chrome.storage.local.set({clipData: storage}, function(){}) 
    return true;
  }
}

async function editDataItem(oldData,newData){ 
  let storage = await getData();
  let index = storage.findIndex(i=>{if(i.id===oldData.id)return true});
  if(index !=-1){
    storage.splice(index,1,newData);
    return await new Promise((resolve,reject)=>{
      chrome.storage.local.set({clipData: storage}, ()=>{
        if (chrome.runtime.lastError)reject(chrome.runtime.lastError);
        resolve(true);
        }
      )
    })
  }
  else return false;
}

function getData(){
  return new Promise((resovle,reject)=>{
    chrome.storage.local.get(['clipData'],function(result){resovle(result.clipData)})
  });
} 

