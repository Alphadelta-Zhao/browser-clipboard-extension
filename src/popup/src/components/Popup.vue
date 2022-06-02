<template>
    <div id="popup">
        <div id="head">
            <section id="searchBar">
                <span id="search">
                    <label for="find">
                        <i class="iconfont icon-sousuo"></i>
                    </label>
                    <input id="find" type="text" v-model.lazy.trim="keyValue">
                </span>
                <span class="toggle" @click="isIndexDate=!isIndexDate" title="开启日期检索"><i class="iconfont icon-riqi1"></i></span>
                <span class="toggle" @click="isIndexTag=!isIndexTag" title="开启标签检索"><i class="iconfont icon-biaoqian1"></i></span>
            </section>

            <section v-show="isIndexDate" id="dateBar">
                <span>
                    <label for="dateStart">开始</label>
                    <input type="date" id="dateStart" v-model="dateStart">
                </span>
                <span>
                    <label for="dateEnd">结束</label>
                    <input type="date" id="dateEnd" v-model="dateEnd">
                </span>            
            </section>

            <section v-show="isIndexTag" id="tagBar">
                <select id="tagSelector" v-model="selectTag">
                    <option value="">请选择一个标签</option>
                    <option v-for="(tag,index) of clipTags" :key="index" :value="tag">{{tag}}</option>
                </select>
            </section>

        </div>

        <div id="container">
            <div id="menu">
            </div>
            <ul>
                <li v-for="(item,index) of showBoard" :key="item.id">
                    <span :ref = "item.id" @click="selectItem(item.id)" class="index" title="点击选中">{{index+1}}</span>
                    <span @click="selectItem(item.id)" class="content" :title="item.content">{{item.content}}</span>
                    <span @click="showTagPage(item)" class="tag" title="点击修改标签">{{item.tag}}</span>
                    <span class="control">
                        <i title="复制" @click="copyItem(item)" class="iconfont icon-fuzhi"></i>
                        <i title="编辑" @click="editItem(item)" class="iconfont icon-bianji"></i>
                        <i title="删除" @click="deleteItem(item)" class="iconfont icon-shanchu1"></i>
                    </span>
                </li>
            </ul>            
        </div>
        <div id="select">
            <span id="func">
                <div>批量操作</div>
                <i title="批量复制" @click="copyAll" class="iconfont icon-fuzhi"></i>
                <i title="批量标签" @click="changeTagAll" class="iconfont icon-biaoqian1"></i>
                <i title="批量删除" @click="deleteAll" class="iconfont icon-shanchu1"></i>
            </span>
            <span class="btn" @click="selectAll">全选</span>
            <span class="btn" @click="removeAll">解除</span>
        </div>
        <button v-if="debug_mode" @click="debug">debug</button>
        <tags v-if="tagEditPage" :total="clipTags" :item="itemForTagPage"></tags>
    </div>
</template>

<script>
import Tags from './Tags.vue';
export default{
  components: { Tags },
    name: "IndexHead",
    data(){
        return {
            //核心数据
            clipBoard: "",
            clipTags: ["default", "1sfsd", "2dfsf", "3fafas", "default", "1sfsd", "2dfsf", "3fafas", "default", "1sfsd", "2dfsf", "3fafas"],
            //检索词
            keyValue: "",
            //日期检索
            dateStart: this.getToday(),
            dateEnd: this.getToday(),
            isIndexDate: false,
            //标签检索
            isIndexTag: false,
            selectTag: "",
            //标签编辑页相关
            tagEditPage: false,
            tagPageMode: "piece",
            itemForTagPage: {
                id: 0,
                tag: "-",
                content: ""
            },
            //选择相关
            selectIds:[],
            //debug
            debug_mode: false,
        }
    },
    computed:{
        showBoard() {
            //测试的时候用 正式版本删除
            /*
            if ("" == this.clipBoard)return [{id: 1,content: "4",tag: "default"}, {id: 2,content: "a5",tag: "default"}, {id: 3,content: "a6",tag: "default"}];
            */
            //确定显示内容
            if ("" == this.clipBoard)return;
            let t = [];
            try{
                t = this.clipBoard.slice(1, this.clipBoard.length).filter((t=>-1 !== t.content.indexOf(this.keyValue)));
            }catch(err){
                console.error(err);
                return;
            }
            if (this.isIndexDate) {
                let e = Date.parse(this.dateStart) + 60 * (new Date).getTimezoneOffset() * 1e3
                  , a = Date.parse(this.dateEnd) + 60 * (new Date).getTimezoneOffset() * 1e3 + 864e5;
                t = t.filter((t=>t.id >= e && t.id < a))
            }
            this.isIndexTag && this.selectTag && (t = t.filter((t=>t.tag == this.selectTag)));
            //排除的解除选中
            let arr = t.map((item)=>{return item.id});
            this.showBoardRemoveSelect(arr);
            return t.reverse()
        },
    },
    methods: {
        debug(){
            console.log(this.clipBoard);
            console.log(this.clipTags);
            console.log(this.selectIds);
        },
        //获取当前日期
        getToday() {
            let t = new Date
              , e = t.getFullYear()
              , a = t.getMonth() > 8 ? t.getMonth() + 1 : "0" + (t.getMonth() + 1)
              , n = t.getDate() > 9 ? t.getDate() : "0" + t.getDate();
            return e + "-" + a + "-" + n
        },
        //单条修改
        deleteItem(item) {
            this.clipBoard.splice(this.clipBoard.indexOf(item), 1);
            this.setClipBoard();
        },
        copyItem(item) {
            let e = item.content;
            navigator.clipboard.writeText(e).then()
        },
        editItem(item) {
            const oldContent = item.content
              , newContent = prompt("", `${oldContent}`);
            if(newContent===null)return;
            if (newContent !== oldContent) {
                let newItem = {
                    id: item.id,
                    content: newContent,
                    tag: item.tag
                };
                this.setItem(item, newItem)
            }
        },

        //与后台交互

        async getClipBoard() {
            this.clipBoard = await new Promise((t=>{
                chrome.storage.local.get(["clipData"], (function(e) {t(e.clipData)}))
            }))
        },
        async getTags() {
            this.clipTags = await new Promise((t=>{
                chrome.storage.local.get(["tags"], (function(e) {t(e.tags)}))
            }))
        },
        setTags() {chrome.storage.local.set({tags: this.clipTags})},
        setClipBoard() {chrome.storage.local.set({clipData: this.clipBoard})},
        setItem(oldItem, newItem) {
            return new Promise ((resolve)=>{
                chrome.runtime.sendMessage(["edit item", oldItem, newItem], (response=>{
                    if("edit content success" === response){
                        this.getClipBoard();
                        resolve(true);
                    } 
                }))
            })
        },
        deleteTag(tag) {
            chrome.runtime.sendMessage(["delete tag", tag], (response=>{
                "delete tag success" === response && this.getClipBoard()
            }))
            this.clipTags.splice(this.clipTags.indexOf(tag),1);
            this.setTags();
        },

        // 标签编辑页

        showTagPage(item) {
            if(this.tagPageMode == "piece"){
                this.itemForTagPage = item;
            }
            if(this.tagPageMode == "all"){
                this.itemForTagPage.tag = "";
            }
            this.tagEditPage = true;
            this.$bus.$on("tagPageCallback", this.tagPageCallback);
            this.$bus.$on("addTag",(newTag)=>{
                this.clipTags.push(newTag);
                this.setTags();
            });
            this.$bus.$on("deleteTag",this.deleteTag)
            
        },
        tagPageCallback(data) {
            this.tagEditPage = false;
            if(this.tagPageMode == "piece"){
                data.edited && data.oldItem.tag !== data.newItem.tag && this.setItem(data.oldItem, data.newItem);
            }
            if(this.tagPageMode == "all"){
                if(data.edited){
                    if(data.newItem.tag != ""){
                        chrome.runtime.sendMessage(["many change tag",this.selectIds,data.newItem.tag],
                        (response)=>response=="a"&&this.getClipBoard());
                    }    
                }
                this.tagPageMode = "piece";
            }          
            this.$bus.$off("tagPageCallback");
            this.$bus.$off("addTag");
            this.$bus.$off("deleteTag")
        },

        //选择相关 -- 基础
        selectCheck(id){
            let index = this.selectIds.indexOf(id);
            if(index == -1)return false;
            else return true;
        },
        selectAdd(id){
            this.selectIds.push(id);
        },
        selectRemove(id){
            this.selectIds.splice(this.selectIds.indexOf(id),1)
        },
        selectChange(id){
            if(this.selectCheck(id))this.selectRemove(id);
            else this.selectAdd(id);
        },
        selectItem(id){
            this.$refs[id][0].classList.toggle("selected");
            this.selectChange(id)
        },            
        showBoardRemoveSelect(arr){
            let temp = this.selectIds.map((id)=>{
                if(arr.indexOf(id)===-1)return id;
                return -1;
            });
            for (let id of temp){
                if(id!=-1)this.selectRemove(id);
            }
        },
        //选择相关 --进一步 
        selectAll(){
            let arr = this.showBoard.map((item)=>item.id);
            arr.forEach((id)=>{
                if(!this.selectCheck(id)){
                    this.selectAdd(id);
                    this.$refs[id][0].classList.toggle("selected");
                }
            })
        },
        removeAll(){
            const arr = this.selectIds.map(id=>id);
            arr.forEach(id=>{this.selectRemove(id);this.$refs[id][0].classList.toggle("selected");});
            this.selectIds = [];
        },
        copyAll(){
            let text = "";
            let index = -1;
            this.selectIds.forEach(id => {
                index = this.showBoard.findIndex((item)=>{
                    if(item.id===id)return true;               
                })
                text += this.showBoard[index].content;
                text +="\n";
            })
            navigator.clipboard.writeText(text);
        },
        deleteAll(){
            let check = confirm("请确认将删除所有选定的记录");
            if(check !== true)return;
            let temp = this.clipBoard.map(item => {
                let mid = {...item};
                let index = this.selectIds.indexOf(item.id);
                if(index!=-1){
                    return 0;
                }
                return mid;    
            });
            let temp2 = [temp[0]];
            for (let i=1;i<temp.length;i++){
                if(temp[i]!=0)temp2.push(temp[i]);
            };
            chrome.runtime.sendMessage(["change storage",temp2],
                (response)=>response=="a"&&this.getClipBoard()); 
        },
        changeTagAll(){
            this.tagPageMode = "all";
            this.showTagPage();
        }


    },
    created() {
        this.getClipBoard(),
        this.getTags()
    }
}
</script>

<style lang="less" scoped>
    i {
        vertical-align: middle
    }
    input,select {
        outline: 0;
        border: 0;
        background-color: inherit;
    }

    @zimablue:#5bc2e7;
    .flex-center(){
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #popup {
        width: 400px;
        height: 500px;
        border: 1px solid #000;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        #head {
            flex:0;
            margin: 0 auto;
            width: 396px;
            display: flex;
            flex-flow: column wrap;
            background-color: snow;
            #searchBar {
                height: 30px;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                padding: 0 5px;
                background-color: @zimablue;
                border-radius: 14px;
                font-weight: 900;
                #search {
                    .flex-center;
                    flex: 12;
                    height: 24px;
                    background-color: #faeddc;
                    border-radius: 12px;                   
                    overflow: hidden;
                    label {
                        padding: 0 4px;
                        i {color: navy;}
                    }
                    input {flex: 1}
                }
                .toggle {
                    flex: 1;
                    height: 24px;
                    cursor: pointer;
                    color: snow;
                    .flex-center;
                    &:active {
                        transform: translateY(3px)
                    }
                }
            }
            #dateBar {
                .flex-center;
                width: 100%;
                color: @zimablue;
                font-weight: 600;
                height: 24px;
                span {
                    .flex-center;
                    input {
                        background-color: #faebd7;
                        color: #333;
                        margin: 3px;
                        border-radius: 10px;
                        text-align: center;
                    }
                }
            }
            #tagBar{
                .flex-center;
                width: 100%;
                height: 24px;
                select {
                    margin: 3px;
                    border-radius: 10px;
                    background-color: #faebd7;
                    color: #333;
                    text-align: center
                }
            }
        }
        #container {
            flex:5;
            width: 396px;
            margin: 0px auto;
            overflow-y: auto;
            ul {
                width: 100%;
                list-style: none;
                li {
                    margin: 0 2px;
                    height: 20px;
                    line-height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: stretch;                    
                    .index {
                        cursor: pointer;
                        text-align: center;
                        line-height: 14px;
                        flex: 0 0 18px;
                        border: 2px solid navy;
                        border-radius: 50%;
                        margin: 0 3px;
                        font-size: 12px;    
                    }
                    .selected {
                        background-color: navy !important;
                        color: #faebd7 !important
                        }
                    .content {
                        flex: 4;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;                       
                    }
                    .tag {
                        flex: 1;
                        text-align: center;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        color: navy;
                        cursor: pointer;
                        &:hover {
                            background-color: #5bc2e7;
                            color: #eee;
                        }
                    }
                    .control {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        i {
                            cursor: pointer;
                            color: #ffdab9;
                            &:hover {
                                color: hotpink
                            }
                            &:active {
                                color: red;
                                zoom:1.2
                            }
                        }
                    }
                }
            }
        }
        #select {
            flex: 0 0 30px;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            background: #5bc2e7;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px; 
            #func {
                width: 150px;
                display: flex;
                justify-content: space-around;
                align-items: baseline;
                font-weight: 500;
                color: #faeddc;
                font-size: 16px;
                i {
                    zoom: 1.1;
                    font-weight: 700;
                    
                    }
                }
            i {
                cursor: pointer;
                &:hover {
                    color: pink;
                }
                &:active {
                    zoom: 0.9;
                    color: hotpink;
                }
            }
            .btn {
                background-color: #faeddc;
                border: 2px solid navy;
                width: 60px;
                padding: 0 5px;
                margin: 0px 5px;
                border-radius: 30px;
                color: navy;
                font-size: 16px;
                text-align: center;
                &:hover {
                    background-color: hotpink;
                    color: #eee;
                }
                &:click{
                    transform: translateY(3px);
                }
            }
            
        }
    }
</style>


let time = document.querySelectorAll("div.duration");
time = Array.from(time);
let all2 = time.reduce((pre,ele,index)=>{
    if(index==199){return pre+91};
    return pre+Number(ele.innerText.slice(0,2))
    },0)
function test(n){     
    let a = time.reduce((pre,ele,index)=>{
        if(index>=n){return pre};
        return pre+Number(ele.innerText.slice(0,2));
        },0)
    console.log(a);
    console.log(a/all2);
    }

