<template>
    <div id="cap">
        <div id="window">
            <h2 id="title">修改标签</h2>
            <div id="changeShow">
                <span>{{item.tag}}</span>
                <i class="iconfont icon-forward"></i>
                <span>{{tagToBe}}</span>
            </div>
            <div id="tagsShow">
                <span :class="state" @click="tagBtn(tag)" v-for="(tag,index) of total" :key="index">{{tag}}</span>
            </div>
            <div id="control">
                <i @click="addTag" class="iconfont icon-plus-square">增加</i>
                <i @click="deleteTag" class="iconfont icon-minus-square">删除</i>
                <i @click="cancelDelete" style="color:red" v-show="state == 'dele-mode'">取消删除</i>
            </div>
            <div id="confirmBar">
                <i @click="confirm" class="iconfont icon-circle-check">确认</i>
                <i @click="cancel" class="iconfont icon-circle-close">取消</i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Tag",
    props: {
        total: {
            default: ["default"]
        },
        item: {
            
        }
    },
    data() {
        return {
            current: {
                ...this.item
            },
            tagToBe: "_",
            state: "normal"
        }
    },
    methods: {
        // changeTag(newTag) {
        //     
        // }, 被迫取消，使用会产生 Cannot read property '_wrapper' of undefined in Vue.JS 的奇怪bug
        addTag() {
            let newTag = prompt("请输入新的标签名称");
            if(newTag===null)return;
            newTag=newTag.trim();
            if (this.total.indexOf(newTag)!==-1){alert("标签存在重名，请重新添加");return}
            else if (newTag==""){alert("标签不能为空，请重新输入");return}
            else if (newTag.length>10){alert("标签长度过长，请重新输入")}
            this.$bus.$emit("addTag",newTag);
        },
        deleteTag(){
            this.state = "dele-mode"
        },
        cancelDelete(){
            this.state = "normal"
        },
        tagBtn(tag){
            if(this.state==="normal"){
                this.current.tag = tag;
                this.tagToBe = tag;
            }
            if(this.state==="dele-mode"){
                if(tag === "default"){alert("抱歉，不能删除默认标签");return}
                const check = confirm(`请确定是否要删除标签：${tag} 使用该标签的所有记录会被修改为默认标签`);
                if(check !== true)return;
                this.state = "normal";
                this.$bus.$emit("deleteTag",tag)
            }
        },
        confirm() {
            const data = {
                edited: true,
                oldItem: this.item,
                newItem: this.current
            };
            this.$bus.$emit("tagPageCallback", data)
        },
        cancel() {
            const data = {
                edited: !1
            };
            this.$bus.$emit("tagPageCallback", data)
        }
    }   
}
</script>

<style lang="less" scoped>
i {
    vertical-align: middle;
    cursor: pointer;
}
@zimablue:#5bc2e7;
.windowPlace(){
    position: absolute;
    top: 0;
    right: 0;
    bottom: 150px;
    left: 0;
    margin: auto;
}
#cap {
    width: 100%;
    height: 100%;
    background-color: rgba(91,194,231,.5);
    position: absolute;
    overflow: hidden;
    top: 0;
    #window {
        .windowPlace;
        padding: 15px;
        width: 280px;
        height: 280px;
        background-color: #f0f8ff;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: center;
        #title {
            flex: 0 0 30px;
            line-height: 30px;
            background-color: #5bc2e7;
            width: 100%;
            color: #eee;
            text-align: center;
        }
        #changeShow {
            flex: 0 0 20px;
            width: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
                color: hotpink;
            }
            span {
                margin: 0px 5px;
            }
        }
        #tagsShow {
            flex: 6;
            overflow-y: auto;
            display: flex;
            flex-flow: row wrap;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            align-content: flex-start;
            span {
                height: 30px;
                line-height: 18px;
                border: 1px solid navy;
                border-radius: 14px;
                min-width: 30px;
                padding: 5px;
                text-align: center;
                margin: 2px;
                cursor: pointer;
                &:hover {
                    background-color: hotpink;
                    color: #ddd;
                }
                &:active {
                    transform: translate(-2px,2px)
                }
            }
        }
        #control {
            flex: 1;
            display: flex;
            width: 100%;
            justify-content: flex-start;
            i {
                color: coral;
                zoom:.9;
                vertical-align: middle 
            }
        }
        #confirmBar {
            flex: 1;
            width: 100%;
            display: flex;
            justify-content: space-around;
            i {
                background-color: pink;
                border: 2px solid navy;
                width: 90px;
                padding: 0 5px;
                border-radius: 40px;
                color: navy;
                font-size: 20px;
                text-align: center;
                &:hover {
                    background-color: hotpink;
                    color: #eee;
                }
            }
        }


    }
.normal {
    background-color: #fffacd;
    border: 1px solid navy;
}
.dele-mode {
    background-color: red;
    color: #eee;
}
}
</style>