(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{433:function(t,e,n){"use strict";n.d(e,"b",(function(){return l})),n.d(e,"a",(function(){return s}));var o=n(56);function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function a(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function c(t,e,n){return(c="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var o=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=u(t)););return t}(t,e);if(o){var r=Object.getOwnPropertyDescriptor(o,e);return r.get?r.get.call(n):r.value}})(t,e,n||t)}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t,e){return(f=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var l=" ",s="ε",p=function(t){function e(t,n){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),a(this,u(e).call(this,t,n,o))}var n,o,r;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e)}(e,t),n=e,(o=[{key:"setEdgeLabel",value:function(t){"string"==typeof t?c(u(e.prototype),"setEdgeLabel",this).call(this,t):c(u(e.prototype),"setEdgeLabel",this).call(this,s)}}])&&i(n.prototype,o),r&&i(n,r),e}(o.a);e.c=p},435:function(t,e,n){"use strict";function o(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function r(t){var e=[],n=t.getStartNode();e.push(n);for(var o=0;o<e.length;o++){var r=!0,i=!1,a=void 0;try{for(var c,u=t.getEdges()[Symbol.iterator]();!(r=(c=u.next()).done);r=!0){var f=c.value;f._from==e[o]&&(e.includes(f._to)||e.push(f._to))}}catch(t){i=!0,a=t}finally{try{r||null==u.return||u.return()}finally{if(i)throw a}}}return e}var i=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,n,i;return e=t,i=[{key:"applyLayout",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"circle";if("circle"!=e)throw new Error("Invalid layout type");var n=r(t);function o(t){return!n.includes(t)}var i=t.getNodes().filter(o),a=n.length,c=i.length,u=t.getNodes().length,f=Math.max(a,c);if(0!=u){var l;l=a<10&&c<10?f/4*50+30:f/5*40+30;var s=0;if(1==a){var p=2*Math.PI/u,y=!0,b=!1,h=void 0;try{for(var v,g=t.getNodes()[Symbol.iterator]();!(y=(v=g.next()).done);y=!0){var d=v.value;d.y=Math.sin(p*s+Math.PI)*l,d.x=Math.cos(p*s+Math.PI)*l,s+=1}}catch(t){b=!0,h=t}finally{try{y||null==g.return||g.return()}finally{if(b)throw h}}}else{var m=2*Math.PI/a,O=2*Math.PI/c;s=0;var _=!0,w=!1,E=void 0;try{for(var S,M=n[Symbol.iterator]();!(_=(S=M.next()).done);_=!0){var j=S.value;j.y=Math.sin(m*s+Math.PI)*l,j.x=Math.cos(m*s+Math.PI)*l,s+=1}}catch(t){w=!0,E=t}finally{try{_||null==M.return||M.return()}finally{if(w)throw E}}s=0;var P=!0,k=!1,N=void 0;try{for(var C,T=i[Symbol.iterator]();!(P=(C=T.next()).done);P=!0){var x=C.value;x.y=Math.sin(O*s+Math.PI)*(l+100),x.x=Math.cos(O*s+Math.PI)*(l+100),s+=1}}catch(t){k=!0,N=t}finally{try{P||null==T.return||T.return()}finally{if(k)throw N}}}}}}],(n=null)&&o(e.prototype,n),i&&o(e,i),t}();e.a=i},436:function(t,e,n){"use strict";var o=n(38),r=n(142),i=n(9),a=n(438);function c(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var u=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._notifications=[],this._notificationMap=new Map}var e,n,o;return e=t,(n=[{key:"createNotification",value:function(t,e,n,o){return{id:Object(i.f)(),content:t,message:e,tags:n,props:o}}},{key:"pushNotification",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:a.a,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},r=(arguments.length>4&&void 0!==arguments[4]&&arguments[4],this.createNotification(t,e,n,o));this._notificationMap.set(r.id,r),this._notifications.push(r)}},{key:"removeNotification",value:function(t){this._notificationMap.delete(t.id),this._notifications.splice(this._notifications.indexOf(t),1)}},{key:"clearNotifications",value:function(t){if(!(this._notifications.length<=0))if(Array.isArray(t))for(var e=this._notifications.length-1;e>=0;--e){var n=this._notifications[e],o=!0,r=!0,i=!1,a=void 0;try{for(var c,u=t[Symbol.iterator]();!(r=(c=u.next()).done);r=!0){var f=c.value;if(!n.tags.includes(f)){o=!1;break}}}catch(t){i=!0,a=t}finally{try{r||null==u.return||u.return()}finally{if(i)throw a}}o&&(this._notifications.splice(e,1),this._notificationMap.delete(n.id))}else if("string"==typeof t)for(var l=this._notifications.length-1;l>=0;--l){var s=this._notifications[l];s.tags.includes(t)&&(this._notifications.splice(l,1),this._notificationMap.delete(s.id))}else this._notifications.length=0,this._notificationMap.clear()}},{key:"getNotificationById",value:function(t){return this._notificationMap.get(t)}},{key:"countNotifications",value:function(){return this._notifications.length}},{key:"getNotifications",value:function(){return this._notifications}}])&&c(e.prototype,n),o&&c(e,o),t}();function f(t){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function l(t,e){return!e||"object"!==f(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function p(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function y(t,e,n){return e&&p(t.prototype,e),n&&p(t,n),t}function b(t,e){return(b=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var h=function(t){function e(){var t;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(t=l(this,s(e).call(this))).notificationManager=new u,t}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&b(t,e)}(e,t),y(e,null,[{key:"SERVICE_KEY",get:function(){return"notificationService"}}]),y(e,[{key:"reducer",value:function(t,e){switch(e.type){case"push":return t.notificationManager.pushNotification(e.content,e.message,e.tags,e.props,e.replace),{notifications:t.notificationManager.getNotifications(),notificationCount:t.notificationManager.countNotifications()};case"close":return t.notificationManager.removeNotification(e.notification),{notifications:t.notificationManager.getNotifications(),notificationCount:t.notificationManager.countNotifications()};case"clear":return t.notificationManager.clearNotifications(e.tags),{notifications:t.notificationManager.getNotifications(),notificationCount:t.notificationManager.countNotifications()}}}},{key:"onServiceLoad",value:function(t){t.notificationManager=this.notificationManager,t.notificationCount=this.notificationManager.countNotifications(),t.notifications=this.notificationManager.getNotifications()}},{key:"onServiceMount",value:function(t){}},{key:"onServiceUnmount",value:function(t){}},{key:"onServiceUnload",value:function(t){delete t.notificationManager,delete t.notificationCount,delete t.notifications}},{key:"onSessionLoad",value:function(t){}},{key:"onSessionUnload",value:function(t){}}]),e}(o.a);h.INSTANCE=new h,h.CONTEXT=Object(r.a)("NotificationService",h.INSTANCE);e.a=h},437:function(t,e,n){"use strict";var o=n(0),r=n.n(o),i=n(1),a=n.n(i),c=n(445),u=n.n(c),f=n(111);function l(t){var e=t.children||t.content;return e&&Array.isArray(e)?e.map((function(t,e){return r.a.createElement("p",{key:t+":"+e},r.a.createElement(f.a,{entity:t}))})):r.a.createElement("p",null,r.a.createElement(f.a,{entity:e}))}l.propTypes={children:a.a.oneOfType([a.a.string,a.a.arrayOf(a.a.string)]),content:a.a.oneOfType([a.a.string,a.a.arrayOf(a.a.string)])},l.defaultProps={content:""};var s=l;function p(t){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function y(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function b(t,e){return!e||"object"!==p(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function h(t){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function v(t,e){return(v=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var g=function(t){function e(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),b(this,h(e).call(this,t))}var n,o,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&v(t,e)}(e,t),n=e,(o=[{key:"render",value:function(){var t=this.props,e=t.content;return r.a.createElement("section",{className:u.a.container+(t.className?" "+t.className:"")},e&&r.a.createElement(s,{content:e}),t.children,t.notification&&r.a.createElement("button",{onClick:function(e){return t.onClose&&t.onClose(t.notification)}},r.a.createElement(f.a,{entity:"message.action.close"})))}}])&&y(n.prototype,o),i&&y(n,i),e}(r.a.Component);g.propTypes={children:a.a.node,className:a.a.string,notification:a.a.object.isRequired,content:a.a.oneOfType([a.a.string,a.a.arrayOf(a.a.string)]),onClose:a.a.func};e.a=g},438:function(t,e,n){"use strict";var o=n(0),r=n.n(o),i=n(444),a=n.n(i),c=n(437);function u(){return(u=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}e.a=function(t){return r.a.createElement(c.a,u({},t,{className:a.a.container}))}},439:function(t,e,n){"use strict";var o=n(39);function r(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var i=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,n,i;return e=t,(n=[{key:"getDefaultLabel",value:function(t){return t instanceof o.a?this.getDefaultEdgeLabel():this.getDefaultNodeLabel()}},{key:"getLabelFormatter",value:function(t){return t instanceof o.a?this.getEdgeLabelFormatter():this.getNodeLabelFormatter()}},{key:"getDefaultNodeLabel",value:function(){return""}},{key:"getDefaultEdgeLabel",value:function(){return""}},{key:"getNodeLabelFormatter",value:function(){throw new Error("Node label formatting is not supported")}},{key:"getEdgeLabelFormatter",value:function(){throw new Error("Edge label formatting is not supported")}}])&&r(e.prototype,n),i&&r(e,i),t}();e.a=i},440:function(t,e,n){"use strict";var o=n(40),r=n(34);function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function a(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function c(t,e){return!e||"object"!==i(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t,e){return(f=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var l=function(t){function e(t,n){var o;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(o=c(this,u(e).call(this)))._inputController=t,o._graphController=n,o}var n,o,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e)}(e,t),n=e,(o=[{key:"onDblInputEvent",value:function(t){var e=this._inputController,n=this._graphController;if(e.getCurrentTargetType()===r.a){var o=e.getCurrentTargetSource();o.setNodeAccept(!o.getNodeAccept()),n.emitGraphEvent("node-accept-change",{target:o})}}}])&&a(n.prototype,o),i&&a(n,i),e}(o.a);e.a=l},441:function(t,e,n){"use strict";var o=n(0),r=n.n(o),i=n(1),a=n.n(i),c=n(34);function u(t){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function f(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function l(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function p(t,e){return(p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var y=function(t){function e(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),l(this,s(e).call(this,t))}var n,o,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e)}(e,t),n=e,(o=[{key:"render",value:function(){var t=this.props.node,e=this.props.fill,n=this.props.stroke,o=this.props.onMouseOver,i=this.props.onMouseOut,a=this.props.pointerEvents,u=t.getNodeLabel(),f=t.getNodeSize(),l=t.getNodeAccept();return r.a.createElement(r.a.Fragment,null,r.a.createElement(c.b,{position:t,radius:f,label:u,color:e,outline:n,onMouseOver:o?function(e){(e.target.value||(e.target.value={})).source=t,o(e)}:null,onMouseOut:i?function(e){(e.target.value||(e.target.value={})).source=t,i(e)}:null,pointerEvents:a}),l&&r.a.createElement(c.b,{position:t,radius:.7*f,color:"none",outline:n}))}}])&&f(n.prototype,o),i&&f(n,i),e}(r.a.Component);y.propTypes={node:a.a.any,fill:a.a.any,stroke:a.a.any,onMouseOver:a.a.any,onMouseOut:a.a.any,pointerEvents:a.a.any},e.a=y},442:function(t,e,n){"use strict";var o=n(0),r=n.n(o),i=n(1),a=n.n(i),c=n(19),u=n(433);function f(t){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function l(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function s(t,e){return!e||"object"!==f(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function y(t,e){return(y=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var b=function(t){function e(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),s(this,p(e).call(this,t))}var n,o,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&y(t,e)}(e,t),n=e,(o=[{key:"render",value:function(){var t=this.props.edge,e=this.props.stroke,n=this.props.onMouseOver,o=this.props.onMouseOut,i=this.props.pointerEvents,a=t.getStartPoint(),f=t.getEndPoint(),l=t.getCenterPoint(),s=t.getEdgeLabel(),p=t.getEdgeDirection();return r.a.createElement(r.a.Fragment,null,r.a.createElement(c.e,{directed:c.a,from:a,to:f,center:l,label:s.split(u.b).join("\n"),direction:p,color:e,onMouseOver:n?function(e){(e.target.value||(e.target.value={})).source=t,n(e)}:null,onMouseOut:o?function(e){(e.target.value||(e.target.value={})).source=t,o(e)}:null,pointerEvents:i}))}}])&&l(n.prototype,o),i&&l(n,i),e}(r.a.Component);b.propTypes={edge:a.a.any,stroke:a.a.any,onMouseOver:a.a.any,onMouseOut:a.a.any,pointerEvents:a.a.any},e.a=b},444:function(t,e,n){t.exports={container:"src-services-notification-components-messages-__InfoMessage-module__container--2VOXu"}},445:function(t,e,n){t.exports={container:"src-services-notification-components-messages-__DefaultMessage-module__container--2EFAT"}}}]);