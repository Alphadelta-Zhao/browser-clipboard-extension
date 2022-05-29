chrome.runtime.onInstalled.addListener(()=>{
  const tags = ["default"];
  const init = [{
      id: Date.now(),
      content: "",
      tag : tags[0]
  }];
  chrome.storage.local.set({clipData: init}, function() {
      console.log("initialization 50%")
  });
  chrome.storage.local.set({tags}, function() {
      console.log("initialization 100%")
  });
        //ClipItem.tags.splice(1,0,"history","game","study")
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
    console.log(oldValue);
    console.log(newValue);
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request[0] === "copy happened"){
      if(submitData(request[1]))sendResponse("success");
    }
  } 
);

async function submitData(newData){
  let storage = await new Promise((resovle,reject)=>{
          chrome.storage.local.get(['clipData'],function(result){resovle(result.clipData)})
  })  
  // 为了避免抖动，storage增加一个永远也不会展示的第零项 
  if(storage[storage.length-1].content != newData.content){
    console.log("增加复制内容过程")
    console.log(storage);
    storage.push(newData);
    console.log(storage);
    chrome.storage.local.set({clipData: storage}, function(){}) 
    return true;
  }
 
}
