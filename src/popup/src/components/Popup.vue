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
                    <span class="index" title="点击选中">{{index+1}}</span>
                    <span class="content" :title="item.content">{{item.content}}</span>
                    <span @click="showTagPage(item)" class="tag" title="点击修改标签">{{item.tag}}</span>
                    <span class="control">
                        <i title="复制" @click="copyItem(item)" class="iconfont icon-fuzhi"></i>
                        <i title="编辑" @click="editItem(item)" class="iconfont icon-bianji"></i>
                        <i title="删除" @click="deleteItem(item)" class="iconfont icon-shanchu1"></i>
                    </span>
                </li>
            </ul>            
        </div>
        <button @click="debug">debug</button>

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
            itemForTagPage: null
        }
    },
    computed:{
        showBoard() {
            //测试的时候用 正式版本删除
            if ("" == this.clipBoard)
                return [{
                    id: 1,
                    content: "asafdafs",
                    tag: "default"
                }, {
                    id: 2,
                    content: "asafdafs",
                    tag: "default"
                }, {
                    id: 3,
                    content: "asafdafs",
                    tag: "default"
                }];
            //确定显示内容
            let t = this.clipBoard.slice(1, this.clipBoard.length).filter((t=>-1 !== t.content.indexOf(this.keyValue)));
            if (this.isIndexDate) {
                let e = Date.parse(this.dateStart) + 60 * (new Date).getTimezoneOffset() * 1e3
                  , a = Date.parse(this.dateEnd) + 60 * (new Date).getTimezoneOffset() * 1e3 + 864e5;
                t = t.filter((t=>t.id >= e && t.id < a))
            }
            this.isIndexTag && this.selectTag && (t = t.filter((t=>t.tag == this.selectTag)));
            return t.reverse()
        },
    },
    methods: {
        debug(){
            console.log(this.clipBoard);
            console.log(this.clipTags)
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
            this.clipBoard.splice(this.clipBoard.indexOf(item), 1)
        },
        copyItem(item) {
            let e = item.content;
            navigator.clipboard.writeText(e).then()
        },
        editItem(item) {
            const oldContent = item.content
              , newContent = prompt("", `${oldContent}`);
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
        setItem(oldItem, newItem) {
            chrome.runtime.sendMessage(["edit item", oldItem, newItem], (response=>{
                "edit content success" === response && this.getClipBoard()
            }))
        },
        deleteTag(tag) {
            this.clipBoard.forEach(element => {
              if(element.tag === tag){
                    element.tag = "default";
                }  
            });
            this.clipTags.splice(this.clipTags.indexOf(tag),1);
            this.setTags();
        },

        // 标签编辑页

        showTagPage(item) {
            this.itemForTagPage = item,
            this.tagEditPage = true,
            this.$bus.$on("tagPageCallback", this.tagPageCallback);
            this.$bus.$on("addTag",(newTag)=>{
                this.clipTags.push(newTag);
                this.setTags();
            });
            this.$bus.$on("deleteTag",this.deleteTag)
        },
        tagPageCallback(data) {
            this.tagEditPage = false,
            data.edited && data.oldItem.tag !== data.newItem.tag && this.setItem(data.oldItem, data.newItem),
            this.$bus.$off("tagPageCallback");
            this.$bus.$off("addTag");
            this.$bus.$off("deleteTag")
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
        border: 1px solid #000;
        position: relative;
        #head {
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
            width: 396px;
            margin: 0px auto;
            ul {
                width: 100%;
                height: 500px;
                list-style: none;
                overflow-y: auto;
                li {
                    margin: 0 2px;
                    height: 20px;
                    line-height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: stretch;
                    .index {
                        text-align: center;
                        line-height: 14px;
                        flex: 0 0 18px;
                        border: 2px solid navy;
                        border-radius: 50%;
                        margin: 0 3px;
                        font-size: 12px;
                        &[selected] {
                            background-color: navy;
                            color: #faebd7
                        }
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
    }
</style>