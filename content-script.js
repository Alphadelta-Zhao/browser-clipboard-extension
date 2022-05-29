/**
 * content.js
*/
//页面交互
let isShowTip = true;
let isCopy = true;




if(isCopy){
    
    //如果展示便签选择工具   
    if(isShowTip){
        //去顶选择工具应该展示的位置
        let x = 0 , y = 0;  
        document.addEventListener('pointerup',function(e){
            y = e.pageY;
            x = e.pageX;
        })

        //复制时展示
        let tipPoped = false;
        document.addEventListener('copy', function(e) {
            console.log(x,y);
            let tip = document.createElement("div");
            tip.style.cssText = `
                background-color: red;
                width: 100px;
                height: 100px;
                position: absolute;
                top: ${y}px;
                left: ${x}px;
            `;
            tip.setAttribute("data-extenstion-copytip","copytip");
            document.body.append(tip);
            tipPoped = true;
            console.log("tianjiale",tip)
        })

        //点击外面除去工具
        document.addEventListener('pointerdown',function(e){
            if(tipPoped){
                console.log("?????");
                let tip = document.querySelector('div[data-extenstion-copytip="copytip"]');
                if (e.target == tip){console.log("命中")};
                tip.remove();
                tipPoped = false;
            }
        })
    }
    //存储复制内容
    document.addEventListener('copy', function(e) {
        let copyText = document.getSelection().toString();
        let newData = {
            id: Date.now(),
            content: copyText,
            tag: "default"
        }      
        submitData(newData)
    });
    //存储剪切内容
    document.addEventListener('cut', function(e) {
        let copyText = document.getSelection().toString();
        let newData = {
            id: Date.now(),
            content: copyText,
            tag: "default"
        }      
        submitData(newData)
    });
};



async function submitData(newData){
    let storage = await new Promise((resovle,reject)=>{
            chrome?.storage?.local?.get(['clipData'],function(result){resovle(result.clipData)})
    })
    
    // 为了避免抖动，storage增加一个永远也不会展示的第零项 
    if(storage[storage.length-1].content != newData.content){
        console.log(storage);
        storage.push(newData);
        console.log(storage);
        chrome.storage.local.set({clipData: storage}, function(){}) 
    }
   
}












