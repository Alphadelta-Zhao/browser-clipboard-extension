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