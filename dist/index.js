var ztabs=function(t){function e(i){if(a[i])return a[i].exports;var n=a[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var a={};return e.m=t,e.c=a,e.d=function(t,a,i){e.o(t,a)||Object.defineProperty(t,a,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var a=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(a,"a",a),a},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,a){"use strict";var i=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a])};return function(e,a){function i(){this.constructor=e}t(e,a),e.prototype=null===a?Object.create(a):(i.prototype=a.prototype,new i)}}();Object.defineProperty(e,"__esModule",{value:!0});var n=a(1),o=a(2),s=a(3);e.DefaultOptions={rootSelector:".js-tabs",tabsInitedClass:"js-tabs--inited",tabSelector:".js-tabs__tab",labelSelector:".js-tabs__label",activeTabClass:"js-tabs__tab--active",activeLabelClass:"js-tabs__label--active",beforeTabsChangeStateEvent:"before-tabs-change-state",afterTabsChangeStateEvent:"after-tabs-change-state",tabChangeStateEvent:"tab-change-state",defaultActiveIndexAttr:"data-tabs-active-index",stateStorageKey:"zcomp_tabs_state",autoSaveStateAttr:"data-tabs-auto-save-state",defaultAutoSaveState:!1,hashNavigateAttr:"data-tabs-hash-navigate",defaultHashNavigate:!1};var r=function(t){function e(e,a){var i=t.call(this,e,a)||this;return i._data=[],i._activeIndex=-1,i._id=null,i._autoSaveState=!1,i._hashNavigate=!1,i._id=i.root.getAttribute("id")||null,i._collectTabs(),i.root.addEventListener("click",i._onClick.bind(i)),n.checkBinaryOptionAttr(i.root,i.options.autoSaveStateAttr,i.options.defaultAutoSaveState||!1)&&(i._autoSaveState=!0,i.restoreState()),n.checkBinaryOptionAttr(i.root,i.options.hashNavigateAttr,i.options.defaultHashNavigate||!1)&&(i._hashNavigate=!0,window.addEventListener("hashchange",i._onHashChange.bind(i)),location.hash&&i.activateByHash(location.hash)),i.options.tabsInitedClass&&i.root.classList.add(i.options.tabsInitedClass),i}return i(e,t),Object.defineProperty(e.prototype,"activeIndex",{get:function(){return this._activeIndex},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"tabCount",{get:function(){return this._data.length},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"id",{get:function(){return this._id},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"autoSaveState",{get:function(){return this._autoSaveState},set:function(t){this._autoSaveState=t},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"hashNavigate",{get:function(){return this._hashNavigate},enumerable:!0,configurable:!0}),e.prototype.getTabData=function(t){return t>=0&&t<this._data.length?this._data[t]:null},e.prototype.activateTab=function(t){if(t<0)t=-1;else if(t>=this._data.length)return console.warn("Tabs plugin: no tab with index "+t),!1;if(this.options.beforeTabsChangeStateEvent){var e=new CustomEvent(this.options.beforeTabsChangeStateEvent,{bubbles:!0,cancelable:!0,detail:{oldActiveIndex:this._activeIndex,newActiveIndex:t}});if(!this.root.dispatchEvent(e))return!1}var a=this._activeIndex;if(this._activeIndex=t,this._autoSaveState&&this.saveState(),a>=0&&a<this._data.length){var i=this._data[a];this.options.activeLabelClass&&i.label.classList.remove(this.options.activeLabelClass),this.options.activeTabClass&&i.tab.classList.remove(this.options.activeTabClass),this.options.tabChangeStateEvent&&this._sendEvent(a,a,this.options.tabChangeStateEvent)}if(this._activeIndex>=0){var n=this._data[this._activeIndex];this.options.activeLabelClass&&n.label.classList.add(this.options.activeLabelClass),this.options.activeTabClass&&n.tab.classList.add(this.options.activeTabClass),this.options.tabChangeStateEvent&&this._sendEvent(this._activeIndex,a,this.options.tabChangeStateEvent)}if(this.options.afterTabsChangeStateEvent){var s=new CustomEvent(this.options.afterTabsChangeStateEvent,{bubbles:!0,cancelable:!1,detail:{oldActiveIndex:a,newActiveIndex:this._activeIndex}});this.root.dispatchEvent(s)}var r=this.activeIndex>=0?this._data[this.activeIndex]:null;if(this.hashNavigate&&(location.hash=r&&r.hash?"#"+r.hash:""),o&&r&&r.tab)for(var l=r.tab.querySelectorAll(".js-load"),h=0;h<l.length;++h){var c=o.LoaderFactory.fromRoot(l[h]);c&&c.loadState===o.LoadState.NotLoaded&&c.load()}return!0},e.prototype.getLabelIndex=function(t){for(var e=0;e<this._data.length;++e)if(this._data[e].label==t)return e;return-1},e.prototype.getTabIndex=function(t){for(var e=0;e<this._data.length;++e)if(this._data[e].tab==t)return e;return-1},e.prototype.getHashIndex=function(t){for(var e=0;e<this._data.length;++e)if(this._data[e].hash==t)return e;return-1},e.prototype.activateNextTab=function(t){void 0===t&&(t=!1);var e=this.getNextTabIndex(t,this.activeIndex);return null!=e&&this.activateTab(e)},e.prototype.activatePrevTab=function(t){void 0===t&&(t=!1);var e=this.getPrevTabIndex(t,this.activeIndex);return null!=e&&this.activateTab(e)},e.prototype.getNextTabIndex=function(t,e){return void 0===t&&(t=!1),void 0===e&&(e=null),this.tabCount?(null==e&&(e=this.activeIndex),e>=0&&e+1<this.tabCount?e+1:e<0?0:t?0:null):null},e.prototype.getPrevTabIndex=function(t,e){return void 0===t&&(t=!1),void 0===e&&(e=null),this.tabCount?(null==e&&(e=this.activeIndex),e>0&&e-1<this.tabCount?e-1:e>=this.tabCount?this.tabCount-1:t?this.tabCount-1:null):null},e.prototype.isTabEnabled=function(t){var e=this.getTabData(t);return!!e&&!e.label.matches(":disabled")},e.prototype.exportState=function(){return{activeIndex:this.activeIndex}},e.prototype.saveState=function(){if(this.id&&this.options.stateStorageKey){var t={};try{t=JSON.parse(localStorage.getItem(this.options.stateStorageKey)||"{ }")}catch(t){}t[this.id]=this.exportState(),localStorage.setItem(this.options.stateStorageKey,JSON.stringify(t))}},e.prototype.restoreState=function(){if(this.id&&this.options.stateStorageKey){var t={};try{t=JSON.parse(localStorage.getItem(this.options.stateStorageKey)||"{ }")}catch(t){}if(t[this.id]){var e=t[this.id];"number"==typeof e.activeIndex&&this.activateTab(e.activeIndex)}}},e.prototype.activateByHash=function(t){var e=this.getHashIndex(t);return e!==this.activeIndex&&(e>=0&&this.activateTab(e))},e.prototype._sendEvent=function(t,e,a){var i=this.getTabData(t);if(i){var n=new CustomEvent(a,{bubbles:!0,cancelable:!1,detail:{oldActiveIndex:e,newActiveIndex:this._activeIndex,currentIndex:t,newStateIsActive:t===this._activeIndex}});i.label.dispatchEvent(n),i.tab.dispatchEvent(n)}},e.prototype._collectTabs=function(){if(this.options.labelSelector&&this.options.tabSelector){var t=this.root.querySelectorAll(this.options.labelSelector),e=this.root.querySelectorAll(this.options.tabSelector);t.length!==e.length&&console.warn("Tabs plugin: label count does not match tab count");for(var a=-1,i=0;i<Math.min(t.length,e.length);++i){var n=t[i],o=e[i];this.options.activeLabelClass&&n.classList.contains(this.options.activeLabelClass)?a=i:this.options.activeTabClass&&o.classList.contains(this.options.activeTabClass)&&(a=i);var s=n.getAttribute("id"),r=o.getAttribute("id")||s||"";this._data.push({label:n,tab:o,hash:r})}if(this.options.defaultActiveIndexAttr&&this.root.hasAttribute(this.options.defaultActiveIndexAttr)){var l=+(this.root.getAttribute(this.options.defaultActiveIndexAttr)+"");isNaN(l)||(a=l)}a<0&&this._data.length>0&&(a=0),a>=0&&this.activateTab(a)}else console.error("Tabs plugin: no labelSelector or tabSelector specified in the options")},e.prototype._onClick=function(t){if(t.target&&this.options.labelSelector){var e=s.default(t.target,this.options.labelSelector);if(e){var a=this.getLabelIndex(e);a>=0&&this.isTabEnabled(a)&&(this.activateTab(a),t.preventDefault())}}},e.prototype._onHashChange=function(t){var e=location.hash.slice(1);e&&this._hashNavigate&&this.activateByHash(e)},e}(n.Component);e.Tabs=r,e.TabsFactory=new n.ComponentFactory("tabs",e.DefaultOptions,r)},function(t,e){t.exports=zbase},function(t,e){t.exports=zloader},function(t,e){t.exports=zclosest}]);