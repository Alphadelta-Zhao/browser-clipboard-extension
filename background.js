chrome.runtime.onInstalled.addListener((details)=>{ 
  if (details.reason === "install"){
    const tags = ["默认"];
    const init = [{
        id: Date.now(),
        content: "",
        tag : tags[0]
    }];
    chrome.storage.local.set({clipData: init,tags,toggle: true,tip: true});
    return;
  }
})

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse)=> {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    if (request[0] === "copy happened"){
      if(submitData(request[1]))sendResponse("copy success");
    }
    else if (request[0] === "edit item"){
      editDataItem(request[1],request[2]).then(()=>{
        sendResponse("edit content success");
      });
    }
    else if (request[0] === "delete tag"){
      deleteTag(request[1]).then(()=>sendResponse("delete tag success"));
    }
    else if (request[0] === "many change tag"){
      manyChangeTag(request[1],request[2]).then(()=>sendResponse("a"));
    }
    else if (request[0] === "change storage"){
      changeStorage(request[1]).then(()=>{sendResponse("a")});
    }
    else if (request[0] === "copy set tag"){
      copySetTag(request[1],request[2]);
    }
    return true;
    
  } 
);

function getData(){
  return new Promise((resovle,reject)=>{
    chrome.storage.local.get(['clipData'],function(result){resovle(result.clipData)})
  });
} 
function setData(storage){
  return new Promise((resolve,reject)=>{
    chrome.storage.local.set({clipData: storage}, ()=>{
      if (chrome.runtime.lastError)reject(chrome.runtime.lastError);
      resolve(true);
      }
    )
  })
}
async function changeStorage(storage){
  return await setData(storage);
}

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
    return await setData(storage);  
  }
  else return false;
}

async function deleteTag(tag){
  let storage =await getData();
  storage = storage.map(element => {
    let temp = {...element};
    if(element.tag === tag){
      temp.tag = '默认';
      return temp;
    }
    return temp;  
  });
  return await setData(storage);  
}

async function manyChangeTag(ids,tag){
  let storage = await getData();
  storage = storage.map((element) =>{
    let temp = {...element};
    if(ids.indexOf(element.id)!==-1){
      temp.tag = tag;
      return temp;
    }
    return temp;
  });
  return await setData(storage);
}

async function copySetTag(tag,lastCopy){
  let storage = await getData();
  if(storage[storage.length-1].content == lastCopy){
    storage[storage.length-1].tag = tag;
    if(tag=="默认")return;
    setData(storage);
  } 
}




//测试时使用
// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log("下面是存储的改变");
//     console.log(oldValue);
//     console.log(newValue);
//     console.log("上面是存储的改变")
//   }
// });

