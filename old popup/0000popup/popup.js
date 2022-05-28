//呈现

Vue.config.productionTip = false;
const vm = new Vue({
    el:"#root",
    data(){
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()>8?date.getMonth()+1:"0"+(date.getMonth()+1);
        let day = date.getDate()>9?date.getDate():"0"+date.getDate();
        let dateToday =year + "-" + month + "-" + day; 
        let clipBoard = [{id:1,content:"123",tag:"default",constructor:{tags:"45664"}},{id:2,content:"123",tag:"default"}]       
        // if(chrome.storage){
        //     clipBoard = chrome.storage.local.get(['clipItems'], function(result) {
        //         console.log('Value has given to vm ');
        //         return result;
        //     }); 
        // }
        return{
            clipBoard,
            clipTags:clipBoard[0].constructor.tags,
            keyValue:"",
            selectTag:"",
            dateStart:dateToday,
            dateEnd:dateToday,
            isIndexDate:false,
            isIndexTag:false
        }
    },
    computed: {
        showBoard(){
            let arr = this.clipBoard.slice(1,this.clipBoard.length).filter((item)=>{
               return item.content.indexOf(this.keyValue) !== -1;
            })
            if(this.isIndexDate){
                let checkTime1 = Date.parse(this.dateStart)+new Date().getTimezoneOffset()*60*1000;
                let checkTime2 = Date.parse(this.dateEnd)+new Date().getTimezoneOffset()*60*1000+24*60*60*1000;
                arr = arr.filter((item)=>{
                    return item.id >= checkTime1 && item.id < checkTime2;
                })    
            }
            if(this.isIndexTag&&this.selectTag){
                arr = arr.filter((item)=>{
                    return item.tag == this.selectTag;
                })    
            }
            return arr;
        }
    },
    methods: {
        deleteItem(event,item){
            clipBoard.splice(clipBoard.indexOf(item),1);
            // chrome.storage.local.set({clipItems: clipBoard}, function() {
            //     console.log('Value is set to ' + clipBoard);
            // });
        }
    }
})