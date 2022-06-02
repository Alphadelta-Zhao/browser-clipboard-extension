/**
 * content.js
*/
//

console.log("页面脚本开始工作");
toggle();
tip();
let pos = {x:0,y:0,poped:false,popx:0,popy:0};
chrome.runtime.onMessage.addListener("toggle", ()=>toggle());
chrome.runtime.onMessage.addListener("tip", ()=>toggle());

async function toggle(){
    let data = await chrome.storage.local.get(['toggle']);
    if(data.toggle){
        document.addEventListener('copy', copy, true);
        document.addEventListener('cut', copy, true);
    }
    else {
        document.removeEventListener('copy', copy, true);
        document.removeEventListener('cut', copy, true);
    }
}
async function tip(){
    let data = await chrome.storage.local.get(['tip']);
    if(data.tip){      
        document.addEventListener('pointerup', setPos);
        document.addEventListener('copy', tipShow);
        document.addEventListener('pointerdown',tipClose)
    }
    else {
        document.removeEventListener('pointerup', setPos);
        document.removeEventListener('copy', tipShow);
        document.removeEventListener('pointerdown',tipClose)
    }
}

function copy(e){
    let copyText = document.getSelection().toString();
    const newData = {
        id: Date.now(),
        content: copyText,
        tag: "default",
    };
    chrome.runtime.sendMessage(["copy happened",newData], function(response) {
        console.log(response)
    });               
}

function setPos(e){
    pos.y = e.pageY;
    pos.x = e.pageX;
}

async function tipShow(e){
    let {tags} = await chrome.storage.local.get(['tags']);
 
    //
    let tip = document.createElement("div");
    tip.style.cssText = `
        background-color: rgba(22,184,243,0.4);
        padding:5px;
        border-radius:4px;
        border:1px solid navy;
        width: 150px;
        height: 150px;
        position: absolute;
        top: ${pos.y}px;
        left: ${pos.x}px;
        display:flex;
        overflow-y:auto;
        flex-flow:row wrap;
        justify-content:flex-start;
        align-items:flex-start;
        align-content:flex-start;
        z-index:99;
    `;
    tip.setAttribute("data-extenstion-copytip","copytip");
    //
    let title = document.createElement("span");
    title.innerText = "请选择一个标签";
    title.setAttribute("data-extension-copytip-title","copytip");
    title.style.cssText = `
        width:100%;
        height:20px;
        color:hotpink;
        text-align:center;
    `
    tip.append(title);
    //
    for (let tag of tags){
        let tagBox = document.createElement("span");
        tagBox.style.cssText = `
            min-width:25px;
            max-width:60px;
            height:20px;
            font-size:12px;
            margin:2px 2px;
            padding:0px 3px;
            background-color:#eee;
            color:#111;
            border:1px solid black;
            border-radius:5px;
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            cursor:pointer;
            line-height:20px;
        `;
        tagBox.innerText = tag;
        tagBox.setAttribute("data-extension-copytip-box","copytip");
        tagBox.addEventListener("click",tagClick);
        tip.append(tagBox);
    };
    //
    document.body.append(tip);
    pos.poped = true;
    pos.popx = pos.x;
    pos.popy = pos.y;
    console.log("tianjiale",tip)

}
function tipClose(e,done=false){
    if(pos.poped){
        console.log(done);
        let tip = document.querySelector('div[data-extenstion-copytip="copytip"]');
        if(!done){
            console.log(e.pageX);
            console.log(pos.popx);

            if(e.pageX>pos.popx-5&&e.pageX<pos.popx+155&&e.pageY>pos.popy-5&&e.pageY<pos.popy+155)return;
        }
        let arr = document.querySelectorAll('span[data-extension-copytip-box="copytip"]');
        console.log(arr);
        arr.forEach(element => {
            element.removeEventListener("click",tagClick);
        });       
        tip.remove();
        pos.poped = false;
    }
}
function tagClick(e){
    console.log(e);
    console.log(e.target.innerText);
    tipClose(e,true);
    setTag(e.target.innerText);
}
function setTag(tag){
    chrome.runtime.sendMessage(["copy set tag",tag]);
}


    
