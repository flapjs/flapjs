(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{23:function(e,t,r){"use strict";function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return e?(e^16*Math.random()>>e/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,n)}function a(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}function c(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=0,r=0,n=e.length;r<n;r++)t=Math.imul(31,t)+e.charCodeAt(r)|0;return t}function o(e,t,r,n){var a=r-e,c=n-t;return Math.sqrt(a*a+c*c)}function i(e,t,r,n){var a=r-e,c=n-t;return a*a+c*c}function u(e,t,r,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,o=arguments.length>6&&void 0!==arguments[6]?arguments[6]:{x:0,y:0},i=r-e,u=n-t,s=Math.atan2(u,i)+c;return o.x=Math.cos(s)*a,o.y=Math.sin(s)*a,o}function s(e,t,r,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{x:0,y:0};return a.x=e+(r-e)/2,a.y=t+(n-t)/2,a}r.d(t,"g",(function(){return n})),r.d(t,"e",(function(){return a})),r.d(t,"f",(function(){return c})),r.d(t,"a",(function(){return o})),r.d(t,"b",(function(){return i})),r.d(t,"c",(function(){return u})),r.d(t,"d",(function(){return s}))},25:function(e,t,r){"use strict";r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return s}));var n=r(0),a=r.n(n),c=r(1),o=r.n(c),i=a.a.createContext(null);i.Consumer;function u(e){var t=Object(n.useRef)(null),[r,c]=Object(n.useState)({x:0,y:0}),[o,u]=Object(n.useState)(1),s=Object(n.useCallback)((e,t)=>{c({x:-e,y:-t})},[c]);return a.a.createElement(i.Provider,{value:{svgRef:t,pos:r,setPos:c,scale:o,setScale:u,setLookAt:s}},e.children)}function s(){return Object(n.useContext)(i)}u.propTypes={children:o.a.node}},27:function(e,t,r){"use strict";r.d(t,"c",(function(){return i})),r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return s}));var n=r(0),a=r(33),c=r(29),o=r(69);function i(){return Object(n.useContext)(c.d)}function u(){return Object(n.useContext)(c.a)}function s(){var e=Object(c.e)(),t=Object(a.a)(),r=Object(n.useCallback)(e=>t(),[t]);return Object(n.useEffect)(()=>(e&&Object(o.a)(e,r),()=>{e&&Object(o.c)(e,r)}),[e,r]),e}},29:function(e,t,r){"use strict";r.d(t,"d",(function(){return y})),r.d(t,"a",(function(){return h})),r.d(t,"b",(function(){return O})),r.d(t,"e",(function(){return E})),r.d(t,"c",(function(){return w}));var n=r(0),a=r.n(n),c=r(1),o=r.n(c),i=r(23),u=r(67),s=r(58),f=r(68),l=r(69),p=r(70);function d(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function v(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?d(Object(r),!0).forEach((function(t){b(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function b(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var m=new(r(6).a)("GraphContext"),y=a.a.createContext(null),h=a.a.createContext(null),g=a.a.createContext(null);function O(e){var{graphType:t,graphState:r}=e;return a.a.createElement(y.Provider,{value:t},a.a.createElement(j,{graphState:r},e.children))}function j(e){var t,r,c=Object(n.useContext)(y),[o,i]=Object(s.a)((e,t)=>{var r=c.reducer&&c.reducer(e,t);return r||(r=w(c,e,t)),r},e.graphState,!0);return t=o,r=Object(n.useCallback)(()=>{var e=!1;for(var r of Object.values(t)){var n=!1,a=Object.values(r);for(var c of a)if(c.isDirty())for(var o of(n=!0,c.markDirty(!1),c.onUpdate(),Object(f.b)(c)))o.call(void 0,c);if(n)for(var i of(e=!0,Object(p.b)(r)))i.call(void 0,a)}if(e)for(var u of Object(l.b)(t))u.call(void 0,t)},[t]),Object(u.a)(r),a.a.createElement(g.Provider,{value:o},a.a.createElement(h.Provider,{value:i},e.children))}function E(){return Object(n.useContext)(g)}function w(e,t,r){switch(r.type){case"add":var{elementType:n,elementId:a,opts:c}=r,o=v({},t),u=e.getElementTypeKeyForElementType(n),s=u in o?v({},o[u]):{},f=a||Object(i.g)(),l=new n(f,c||{});return s[f]=l,o[u]=s,[o,l];case"delete":var{elementType:p,elementId:d}=r,b=v({},t),y=e.getElementTypeKeyForElementType(p);if(y in b){var h=v({},b[y]),g=h[d];delete h[d],b[y]=h,g.onDestroy(e,b),g.markDead()}return b;case"deleteAll":var{elementType:O,elementIds:j}=r,E=v({},t),w=e.getElementTypeKeyForElementType(O);if(w in E){var T=v({},E[w]);for(var x of j){var P=T[x];delete T[x],E[w]=T,P.onDestroy(e,E),P.markDead()}}return E;case"clear":var{elementType:_}=r,S=v({},t),C=e.getElementTypeKeyForElementType(_);if(C in S){for(var k of Object.values(S[C]))k.onDestroy(e,S),k.markDead();S[C]={}}return S;case"clearAll":var D={};for(var M of Object.keys(t))for(var A of Object.values(t[M]))A.onDestroy(e,D),A.markDead();return D;case"forceUpdate":return v({},t);case"resetState":var{state:F}=r;if(F){for(var I of Object.keys(t))for(var N of Object.values(t[I]))N.onDestroy(e,t),N.markDead();return F}return void m.warn("Trying to resetState to null - skipping...");case"swapProperty":var R=e.getElement(t,r.elementType,r.elementId),G=e.getElement(t,r.targetType||r.elementType,r.targetId),K=R[r.property];return R[r.property]=G[r.property],G[r.property]=K,t}}O.propTypes={children:o.a.node,graphType:o.a.elementType.isRequired,graphState:o.a.object},O.defaultProps={graphState:{}},j.propTypes={children:o.a.node,graphState:o.a.object},j.defaultProps={graphState:{}}},32:function(e,t,r){"use strict";r.d(t,"b",(function(){return u})),r.d(t,"c",(function(){return s})),r.d(t,"a",(function(){return f}));var n=r(0),a=r(68),c=r(70),o=r(29),i=r(27);function u(e){var t=Object(i.c)(),r=Object(o.e)();return t.getElementIds(r,e)}function s(e,t){var r=Object(i.c)(),a=Object(o.e)(),u=r.getElements(a,e);return Object(n.useEffect)(()=>(u&&Object(c.a)(e,t),()=>{u&&Object(c.c)(e,t)}),[a,u,e,t]),u}function f(e,t,r){var c=Object(i.c)(),u=Object(o.e)(),s=c.getElement(u,e,t);return Object(n.useEffect)(()=>(s&&Object(a.a)(s,r),()=>{s&&Object(a.c)(s,r)}),[u,s,t,r]),s}},33:function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var n=r(0);function a(){var[,e]=Object(n.useState)(!1);return Object(n.useCallback)(()=>e(e=>!e),[])}},35:function(e,t,r){"use strict";r.d(t,"a",(function(){return n}));class n{static get serviceVersion(){return"0.0.0"}static get services(){return[]}static get providers(){return[]}static get renders(){return{}}static get slots(){return{}}constructor(e,t){this.loader=e}destroy(){}mount(){}unmount(){}}},38:function(e,t,r){"use strict";r.d(t,"a",(function(){return i})),r.d(t,"b",(function(){return u}));var n=r(0),a=r.n(n),c=r(1),o=r.n(c),i=a.a.createContext();function u(e){var[t,r]=Object(n.useState)(null),c=null,o=null,u=!1;t&&(c=t[0],o=t[1],u=!0);var s=Object(n.useCallback)((e,t)=>{r([e,t])},[r]),f=Object(n.useCallback)(()=>{r(null)},[r]);return a.a.createElement(i.Provider,{value:{elementType:c,elementId:o,isOpen:u,openEditor:s,closeEditor:f,toggleEditor:function(e,r){t?close():open(e,r)}}},e.children)}u.propTypes={children:o.a.node}},48:function(e,t,r){"use strict";r.d(t,"b",(function(){return l.a})),r.d(t,"d",(function(){return l.b})),r.d(t,"a",(function(){return g})),r.d(t,"c",(function(){return O}));var n=r(35),a=r(0),c=r.n(a),o=r(3);function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){s(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function f(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return function(n){return c.a.createElement(t,u(u({},n),r),c.a.createElement(o.a,{name:e}),n.children)}}var l=r(25),p=r(1),d=r.n(p);function v(e){return c.a.createElement(c.a.Fragment,null,e.children)}v.propTypes={children:d.a.node};var b=r(57),m=r.n(b);function y(){return(y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function h(e){var{offsetX:t,offsetY:r,scale:n,childProps:a}=e,o=300*Math.min(Number.MAX_SAFE_INTEGER,Math.max(Number.EPSILON,n)),i=o/2,u="".concat(-i," ").concat(-i," ").concat(o," ").concat(o);return c.a.createElement("svg",y({className:m.a.view+" viewarea "+e.className,viewBox:u},a),c.a.createElement("g",{transform:"translate(".concat(t," ").concat(r,")")},e.children))}function g(e){var{svgRef:t,pos:r,scale:n}=Object(l.b)();return c.a.createElement(h,{className:"viewport",offsetX:r.x,offsetY:r.y,scale:n,childProps:{ref:t}},e.children)}h.propTypes={children:d.a.node,className:d.a.string,offsetX:d.a.number,offsetY:d.a.number,scale:d.a.number,childProps:d.a.object},h.defaultProps={offsetX:0,offsetY:0,scale:1,childProps:{}},g.propTypes={children:d.a.node};class O extends n.a{static get providers(){return[l.a]}static get renders(){return{background:[f("playarea",g)],foreground:[f("viewarea",v)]}}static get serviceVersion(){return"1.0.0"}}},49:function(e,t,r){"use strict";r.d(t,"a",(function(){return s}));var n=r(35),a=r(48),c=r(29),o=r(38),i=r(71),u=r(65);class s extends n.a{static get services(){return[a.c]}static get providers(){return[{component:c.b,props:{graphType:i.a}},o.b]}static get renders(){return{playarea:[],viewarea:[u.a]}}static get serviceVersion(){return"1.0.0"}}s.withGraphType=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;return class extends s{constructor(n,a){super(n,a),a.providers[0].props.graphType=e,t&&a.playarea.unshift({component:t}),r&&(a.viewarea[0].component=r)}}}},50:function(e,t,r){"use strict";function n(e,t,r){if(!(e instanceof SVGGraphicsElement))return[t,r];var n=e.getScreenCTM();return[(t-n.e)/n.a,(r-n.f)/n.d]}function a(e,t,r){var n=e.getScreenCTM();return[t*n.a+n.e,r*n.d+n.f]}r.d(t,"a",(function(){return n})),r.d(t,"b",(function(){return a}))},57:function(e,t,r){e.exports={view:"src-services-view-svg-__SVGPlayground-module__view--3cnUW"}},58:function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));var n=r(0);function a(e,t,r,n,a,c,o){try{var i=e[c](o),u=i.value}catch(e){return void r(e)}i.done?t(u):Promise.resolve(u).then(n,a)}function c(e){return function(){var t=this,r=arguments;return new Promise((function(n,c){var o=e.apply(t,r);function i(e){a(o,n,c,i,u,"next",e)}function u(e){a(o,n,c,i,u,"throw",e)}i(void 0)}))}}function o(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],[a,o]=Object(n.useState)(t);function i(e){return u.apply(this,arguments)}function u(){return(u=c((function*(t){"string"==typeof t&&(t={type:t});var r=yield e(a,t);return Array.isArray(r)?(o(r[0]||a),r[1]):(o(r||a),null)}))).apply(this,arguments)}return Object(n.useEffect)(()=>{r&&o(t)},[r,t,o]),[a,i,o]}},65:function(e,t,r){"use strict";r.d(t,"a",(function(){return y}));var n=r(0),a=r.n(n),c=r(1),o=r.n(c),i=r(85),u=r.n(i),s=r(25),f=r(38),l=r(32),p=r(33),d=r(50),v=r(4),b=r(5);function m(e){return e.preventDefault(),e.stopPropagation(),!1}function y(e){var{className:t,offset:r,onOpen:c}=e,{elementType:o,elementId:i,isOpen:y,closeEditor:h}=Object(n.useContext)(f.a),g=Object(p.a)(),O=Object(l.a)(o,i,g),j=Object(n.useRef)(null),{svgRef:E,pos:w}=Object(s.b)();Object(n.useEffect)(()=>{if(O&&E.current){var e,t=E.current,n=t.getBoundingClientRect(),{x:a,y:c}=w;e="function"==typeof r?r(O):r?{x:O.x+r.x,y:O.y+r.y}:O;var o=Object(d.b)(t,e.x+a,e.y+c),i=-n.left,u=-n.top;j.current&&(i-=j.current.offsetWidth/2,u-=j.current.offsetHeight/2,j.current.style.left="".concat(o[0]+i,"px"),j.current.style.top="".concat(o[1]+u,"px"))}});var T=Object(n.useCallback)(e=>{j.current&&j.current.contains(e.target)||h(e)},[h]),[x,P]=Object(n.useState)(!1);return Object(n.useLayoutEffect)(()=>(y!==x&&(P(y),y&&(document.addEventListener("mousedown",T,!0),c())),()=>{y!==x&&(y||document.removeEventListener("mousedown",T,!0))}),[y,x]),a.a.createElement("dialog",{ref:j,className:"".concat(u.a.container," ").concat(t),open:y,onContextMenu:m},a.a.createElement(v.a,{className:u.a.cancel,iconClass:b.c,onClick:h}),e.children)}y.propTypes={children:o.a.node,className:o.a.string,offset:o.a.oneOfType([o.a.shape({x:o.a.number,y:o.a.number}),o.a.func]),onOpen:o.a.func},y.defaultProps={onOpen:()=>{}}},67:function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var n=r(0);function a(e){Object(n.useEffect)(()=>{var t=requestAnimationFrame((function r(n){t=requestAnimationFrame(r),e(n)}));return()=>{cancelAnimationFrame(t)}},[e])}},68:function(e,t,r){"use strict";r.d(t,"a",(function(){return a})),r.d(t,"c",(function(){return c})),r.d(t,"b",(function(){return o}));var n=Symbol("elementListeners");function a(e,t){n in e||(e[n]=[]),e[n].push(t)}function c(e,t){n in e&&e[n].splice(e[n].indexOf(t),1)}function o(e){return e[n]||[]}},69:function(e,t,r){"use strict";r.d(t,"a",(function(){return a})),r.d(t,"c",(function(){return c})),r.d(t,"b",(function(){return o}));var n=Symbol("stateListeners");function a(e,t){n in e||(e[n]=[]),e[n].push(t)}function c(e,t){n in e&&e[n].splice(e[n].indexOf(t),1)}function o(e){return e[n]||[]}},70:function(e,t,r){"use strict";r.d(t,"a",(function(){return a})),r.d(t,"c",(function(){return c})),r.d(t,"b",(function(){return o}));var n=Symbol("elementTypeListeners");function a(e,t){n in e||(e[n]=[]),e[n].push(t)}function c(e,t){n in e&&e[n].splice(e[n].indexOf(t),1)}function o(e){return e[n]||[]}},71:function(e,t,r){"use strict";r.d(t,"a",(function(){return c}));var n=r(23),a=r(15);class c{constructor(){throw new Error("A graph type cannot be instantiated.")}static get elementTypes(){return{}}static get version(){return"0.0.0"}static reducer(e,t){}static serialize(e,t){for(var[r,n]of Object.entries(this.elementTypes))if(!(r in t)&&r in e){var a={};for(var[c,o]of Object.entries(e[r]))a[c]=n.serialize(o,{});t[r]=a}return t.__metadata__={graphType:this.name,version:this.version},t}static deserialize(e,t){if(!(arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}).forceIgnoreVersion){if(!e||!("__metadata__"in e))throw new Error("Missing metadata.");if(this.name!==e.__metadata__.graphType)throw new Error("Mismatched metadata graph type.");if(!a.a.parse(this.version).canSupportVersion(e.__metadata__.version))throw new Error("Unsupported graph parser version - ".concat(this.version," cannot support ")+e.__metadata__.version)}for(var[r,n]of Object.entries(this.elementTypes))if(r in e){var c={};for(var[o,i]of Object.entries(e[r])){var u=new n(o);c[o]=n.deserialize(u,i)}t[r]=c}return t}static hashCode(e,t){return 0}static getElementTypeKeyForElementType(e){for(var[t,r]of Object.entries(this.elementTypes))if(e===r)return t;return"unknown"}static getElementIds(e,t){return Object.keys(e[this.getElementTypeKeyForElementType(t)]||{})}static getElements(e,t){return Object.values(e[this.getElementTypeKeyForElementType(t)]||{})}static getElement(e,t,r){var n=e[this.getElementTypeKeyForElementType(t)];return n&&r in n?n[r]:null}static findElementWithinRadius(e,t,r,a,c){var o=this.getElements(e,t);if(o){var i=c*c;for(var u of o){if(Object(n.b)(r,a,u.x,u.y)<=i)return u}}return null}static findElementsWithinBox(e,t,r,n,a,c){if(r>a){var o=a;a=r,r=o}if(n>c){var i=c;c=n,n=i}var u=[],s=this.getElements(e,t);if(s)for(var f of s){var{x:l,y:p}=f;r<=l&&l<=a&&n<=p&&p<=c&&u.push(f)}return u}}},85:function(e,t,r){e.exports={container:"src-services-graph-widgets-editor-__GraphElementEditor-module__container--3uenH",cancel:"src-services-graph-widgets-editor-__GraphElementEditor-module__cancel--XqA8q"}}}]);