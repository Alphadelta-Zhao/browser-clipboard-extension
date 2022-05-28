(function(){"use strict";var t={57:function(t,e,n){n(6992),n(8674),n(9601),n(7727);var a=n(8935),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("PopUp",{attrs:{msg:"Welcome to Your Vue.js App"}})],1)},r=[],o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"popup"}},[n("p",{staticClass:"word"},[t._v(" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum soluta blanditiis assumenda sapiente nemo ipsam quaerat, unde nisi accusamus pariatur esse cumque similique aperiam magnam nesciunt excepturi suscipit in id. ")]),n("form",{attrs:{action:"#"}},[n("label",{attrs:{for:"key"}},[t._v("搜索")]),n("input",{directives:[{name:"model",rawName:"v-model.lazy.trim",value:t.keyValue,expression:"keyValue",modifiers:{lazy:!0,trim:!0}}],attrs:{id:"key",type:"text"},domProps:{value:t.keyValue},on:{change:function(e){t.keyValue=e.target.value.trim()},blur:function(e){return t.$forceUpdate()}}}),n("button",{attrs:{type:"button"},on:{click:function(e){t.isIndexDate=!t.isIndexDate}}},[t._v("选择日期")]),n("button",{attrs:{type:"button"},on:{click:function(e){t.isIndexTag=!t.isIndexTag}}},[t._v("选择标签")]),n("div",{directives:[{name:"show",rawName:"v-show",value:t.isIndexDate,expression:"isIndexDate"}]},[n("label",{attrs:{for:"start"}},[t._v("开始日期")]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.dateStart,expression:"dateStart"}],attrs:{type:"date",id:"start",placeholder:"dateStart"},domProps:{value:t.dateStart},on:{input:function(e){e.target.composing||(t.dateStart=e.target.value)}}}),n("label",{attrs:{for:"end"}},[t._v("结束日期")]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.dateEnd,expression:"dateEnd"}],attrs:{type:"date",id:"end"},domProps:{value:t.dateEnd},on:{input:function(e){e.target.composing||(t.dateEnd=e.target.value)}}})]),n("div",{directives:[{name:"show",rawName:"v-show",value:t.isIndexTag,expression:"isIndexTag"}]},[n("label",{attrs:{for:"tagselect"}},[t._v("标签")]),n("select",{directives:[{name:"model",rawName:"v-model",value:t.selectTag,expression:"selectTag"}],attrs:{name:"",id:"tagselect"},on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.selectTag=e.target.multiple?n:n[0]}}},[n("option",{attrs:{value:""}},[t._v("请选择一个标签，进行筛选")]),t._l(t.clipTags,(function(e,a){return n("option",{key:a,domProps:{value:e}},[t._v(t._s(e))])}))],2)])]),n("ul",t._l(t.showBoard,(function(e,a){return n("li",{key:e.id,staticClass:"itemshow"},[n("span",[t._v(t._s(a))]),n("span",[t._v(t._s(e.content))]),n("span",[t._v(t._s(e.tag))]),n("button",{attrs:{type:"button",id:"delete"},on:{click:function(n){return t.deleteItem(n,e)}}},[t._v("删除")])])})),0)])},s=[],u=n(7906),c=n(6198),l=(n(7327),n(1539),n(7042),n(561),n(7041),{name:"PopUp",data:function(){function t(){var t=new Date,e=t.getFullYear(),n=t.getMonth()>8?t.getMonth()+1:"0"+(t.getMonth()+1),a=t.getDate()>9?t.getDate():"0"+t.getDate();return e+"-"+n+"-"+a}return{initialized:!1,clipBoard:"",clipTags:"",keyValue:"",selectTag:"",dateStart:t(),dateEnd:t(),isIndexDate:!1,isIndexTag:!1}},computed:{showBoard:function(){var t=this;if(console.log("01"),console.log(this.clipBoard),""!=this.clipBoard&&this.initialized){console.log("02"),console.log(this.clipBoard);var e=this.clipBoard.slice(1,this.clipBoard.length).filter((function(e){return-1!==e.content.indexOf(t.keyValue)}));if(this.isIndexDate){var n=Date.parse(this.dateStart)+60*(new Date).getTimezoneOffset()*1e3,a=Date.parse(this.dateEnd)+60*(new Date).getTimezoneOffset()*1e3+864e5;e=e.filter((function(t){return t.id>=n&&t.id<a}))}return this.isIndexTag&&this.selectTag&&(e=e.filter((function(e){return e.tag==t.selectTag}))),e}}},methods:{deleteItem:function(t,e){this.clipBoard.splice(this.clipBoard.indexOf(e),1),this.setClipBoard()},getClipBoard:function(){var t=this;return(0,c.Z)((0,u.Z)().mark((function e(){return(0,u.Z)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,new Promise((function(t){chrome.storage.local.get(["clipData"],(function(e){t(e.clipData)}))}));case 2:t.clipBoard=e.sent;case 3:case"end":return e.stop()}}),e)})))()},getTags:function(){var t=this;return(0,c.Z)((0,u.Z)().mark((function e(){return(0,u.Z)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,new Promise((function(t){chrome.storage.local.get(["tags"],(function(e){t(e.tags)}))}));case 2:t.clipTags=e.sent;case 3:case"end":return e.stop()}}),e)})))()},setClipBoard:function(){chrome.storage.local.set({clipData:this.clipBoard},(function(){}))},setTags:function(){chrome.storage.local.set({clipData:this.clipTags},(function(){}))},init:function(){var t=this,e=new Promise((function(e){t.getClipBoard(),t.getTags(),e(),console.log("初始化已经完成"),console.log(t.clipBoard)}));e.then((function(){return t.initialized=!0}))}},created:function(){this.init()}}),d=l,p=n(1001),f=(0,p.Z)(d,o,s,!1,null,null,null),v=f.exports,m={name:"App",components:{PopUp:v}},g=m,h=(0,p.Z)(g,i,r,!1,null,null,null),w=h.exports;a.Z.config.productionTip=!1,new a.Z({render:function(t){return t(w)}}).$mount("#app")}},e={};function n(a){var i=e[a];if(void 0!==i)return i.exports;var r=e[a]={exports:{}};return t[a](r,r.exports,n),r.exports}n.m=t,function(){var t=[];n.O=function(e,a,i,r){if(!a){var o=1/0;for(l=0;l<t.length;l++){a=t[l][0],i=t[l][1],r=t[l][2];for(var s=!0,u=0;u<a.length;u++)(!1&r||o>=r)&&Object.keys(n.O).every((function(t){return n.O[t](a[u])}))?a.splice(u--,1):(s=!1,r<o&&(o=r));if(s){t.splice(l--,1);var c=i();void 0!==c&&(e=c)}}return e}r=r||0;for(var l=t.length;l>0&&t[l-1][2]>r;l--)t[l]=t[l-1];t[l]=[a,i,r]}}(),function(){n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,{a:e}),e}}(),function(){n.d=function(t,e){for(var a in e)n.o(e,a)&&!n.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:e[a]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={143:0};n.O.j=function(e){return 0===t[e]};var e=function(e,a){var i,r,o=a[0],s=a[1],u=a[2],c=0;if(o.some((function(e){return 0!==t[e]}))){for(i in s)n.o(s,i)&&(n.m[i]=s[i]);if(u)var l=u(n)}for(e&&e(a);c<o.length;c++)r=o[c],n.o(t,r)&&t[r]&&t[r][0](),t[r]=0;return n.O(l)},a=self["webpackChunkpopup"]=self["webpackChunkpopup"]||[];a.forEach(e.bind(null,0)),a.push=e.bind(null,a.push.bind(a))}();var a=n.O(void 0,[998],(function(){return n(57)}));a=n.O(a)})();
//# sourceMappingURL=app-legacy.99244ef5.js.map