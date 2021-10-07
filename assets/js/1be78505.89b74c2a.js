"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9514,6119],{5318:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return p}});var a=n(7378);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),s=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=s(e.components);return a.createElement(i.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),m=s(n),p=r,f=m["".concat(i,".").concat(p)]||m[p]||d[p]||o;return n?a.createElement(f,l(l({ref:t},u),{},{components:n})):a.createElement(f,l({ref:t},u))}));function p(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:r,l[1]=c;for(var s=2;s<o;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3207:function(e,t,n){n.r(t),n.d(t,{default:function(){return ee}});var a=n(7378),r=n(5318),o=n(6028),l=n(29),c=n(8944),i=n(5013),s=n(8245),u=n(5135),d=n(3059),m=n(5773),p=function(e){return a.createElement("svg",(0,m.Z)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))},f=n(1787),b=n(808),h=n(4142),v=n(5626),E=n(1554),g="menuLinkText_qtXE",C=["items"],y=["item"],N=["item","onItemClick","activePath"],_=["item","onItemClick","activePath"],k=function e(t,n){return"link"===t.type?(0,i.isSamePath)(t.href,n):"category"===t.type&&t.items.some((function(t){return e(t,n)}))},S=(0,a.memo)((function(e){var t=e.items,n=(0,b.Z)(e,C);return a.createElement(a.Fragment,null,t.map((function(e,t){return a.createElement(T,(0,m.Z)({key:t,item:e},n))})))}));function T(e){var t=e.item,n=(0,b.Z)(e,y);return"category"===t.type?0===t.items.length?null:a.createElement(Z,(0,m.Z)({item:t},n)):a.createElement(w,(0,m.Z)({item:t},n))}function Z(e){var t,n=e.item,r=e.onItemClick,o=e.activePath,l=(0,b.Z)(e,N),s=n.items,u=n.label,d=n.collapsible,p=k(n,o),f=(0,i.useCollapsible)({initialState:function(){return!!d&&(!p&&n.collapsed)}}),h=f.collapsed,v=f.setCollapsed,E=f.toggleCollapsed;return function(e){var t=e.isActive,n=e.collapsed,r=e.setCollapsed,o=(0,i.usePrevious)(t);(0,a.useEffect)((function(){t&&!o&&n&&r(!1)}),[t,o,n])}({isActive:p,collapsed:h,setCollapsed:v}),a.createElement("li",{className:(0,c.Z)(i.ThemeClassNames.docs.docSidebarItemCategory,"menu__list-item",{"menu__list-item--collapsed":h})},a.createElement("a",(0,m.Z)({className:(0,c.Z)("menu__link",(t={"menu__link--sublist":d,"menu__link--active":d&&p},t[g]=!d,t)),onClick:d?function(e){e.preventDefault(),E()}:void 0,href:d?"#":void 0},l),u),a.createElement(i.Collapsible,{lazy:!0,as:"ul",className:"menu__list",collapsed:h},a.createElement(S,{items:s,tabIndex:h?-1:0,onItemClick:r,activePath:o})))}function w(e){var t=e.item,n=e.onItemClick,r=e.activePath,o=(0,b.Z)(e,_),l=t.href,s=t.label,u=k(t,r);return a.createElement("li",{className:(0,c.Z)(i.ThemeClassNames.docs.docSidebarItemLink,"menu__list-item"),key:s},a.createElement(h.default,(0,m.Z)({className:(0,c.Z)("menu__link",{"menu__link--active":u}),"aria-current":u?"page":void 0,to:l},(0,v.Z)(l)&&{onClick:n},o),(0,v.Z)(l)?s:a.createElement("span",null,s,a.createElement(E.Z,null))))}var P="sidebar_2j-V",I="sidebarWithHideableNavbar_2fMR",O="sidebarHidden_1sUd",x="sidebarLogo_1OGv",M="menu_1Xkn",j="menuWithAnnouncementBar_1DU9",A="collapseSidebarButton_2Hma",B="collapseSidebarButtonIcon_1Kc0";function D(e){var t=e.onClick;return a.createElement("button",{type:"button",title:(0,f.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,f.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,c.Z)("button button--secondary button--outline",A),onClick:t},a.createElement(p,{className:B}))}function F(e){var t,n,r=e.path,o=e.sidebar,l=e.onCollapse,s=e.isHidden,m=function(){var e=(0,i.useAnnouncementBar)().isClosed,t=(0,a.useState)(!e),n=t[0],r=t[1];return(0,u.Z)((function(t){var n=t.scrollY;e||r(0===n)})),n}(),p=(0,i.useThemeConfig)(),f=p.navbar.hideOnScroll,b=p.hideableSidebar,h=(0,i.useAnnouncementBar)().isClosed;return a.createElement("div",{className:(0,c.Z)(P,(t={},t[I]=f,t[O]=s,t))},f&&a.createElement(d.Z,{tabIndex:-1,className:x}),a.createElement("nav",{className:(0,c.Z)("menu thin-scrollbar",M,(n={},n[j]=!h&&m,n))},a.createElement("ul",{className:(0,c.Z)(i.ThemeClassNames.docs.docSidebarMenu,"menu__list")},a.createElement(S,{items:o,activePath:r}))),b&&a.createElement(D,{onClick:l}))}var H=function(e){var t=e.toggleSidebar,n=e.sidebar,r=e.path;return a.createElement("ul",{className:(0,c.Z)(i.ThemeClassNames.docs.docSidebarMenu,"menu__list")},a.createElement(S,{items:n,activePath:r,onItemClick:function(){return t()}}))};function L(e){return a.createElement(i.MobileSecondaryMenuFiller,{component:H,props:e})}var R=a.memo(F),W=a.memo(L);function z(e){var t=(0,s.default)(),n="desktop"===t||"ssr"===t,r="mobile"===t;return a.createElement(a.Fragment,null,n&&a.createElement(R,e),r&&a.createElement(W,e))}var X=n(775),Y=n(6119),q=n(9635),K="backToTopButton_2PbN",U="backToTopButtonShow_7uc0";function V(){var e=(0,a.useRef)(null);return{smoothScrollTop:function(){var t;e.current=(t=null,function e(){var n=document.documentElement.scrollTop;n>0&&(t=requestAnimationFrame(e),window.scrollTo(0,Math.floor(.85*n)))}(),function(){return t&&cancelAnimationFrame(t)})},cancelScrollToTop:function(){return null==e.current?void 0:e.current()}}}var G=function(){var e,t=(0,q.TH)(),n=V(),r=n.smoothScrollTop,o=n.cancelScrollToTop,l=(0,a.useState)(!1),i=l[0],s=l[1];return(0,u.Z)((function(e,t){var n=e.scrollY;if(t){var a=n<t.scrollY;if(a||o(),n<300)s(!1);else if(a){var r=document.documentElement.scrollHeight;n+window.innerHeight<r&&s(!0)}else s(!1)}}),[t]),a.createElement("button",{className:(0,c.Z)("clean-btn",K,(e={},e[U]=i,e)),type:"button",onClick:function(){return r()}},a.createElement("svg",{viewBox:"0 0 24 24",width:"28"},a.createElement("path",{d:"M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z",fill:"currentColor"})))},J={docPage:"docPage_3jyA",docMainContainer:"docMainContainer_28SP",docSidebarContainer:"docSidebarContainer_3jRz",docMainContainerEnhanced:"docMainContainerEnhanced_YA74",docSidebarContainerHidden:"docSidebarContainerHidden_2b_F",collapsedDocSidebar:"collapsedDocSidebar_KeEu",expandSidebarButtonIcon:"expandSidebarButtonIcon_1pq6",docItemWrapperEnhanced:"docItemWrapperEnhanced_2IZb"},Q=n(5361);function $(e){var t,n,o,s=e.currentDocRoute,u=e.versionMetadata,d=e.children,m=u.pluginId,b=u.version,h=s.sidebar,v=h?u.docsSidebars[h]:void 0,E=(0,a.useState)(!1),g=E[0],C=E[1],y=(0,a.useState)(!1),N=y[0],_=y[1],k=(0,a.useCallback)((function(){N&&_(!1),C(!g)}),[N]);return a.createElement(l.Z,{wrapperClassName:i.ThemeClassNames.wrapper.docsPages,pageClassName:i.ThemeClassNames.page.docsDocPage,searchMetadatas:{version:b,tag:(0,i.docVersionSearchTag)(m,b)}},a.createElement("div",{className:J.docPage},a.createElement(G,null),v&&a.createElement("aside",{className:(0,c.Z)(J.docSidebarContainer,(t={},t[J.docSidebarContainerHidden]=g,t)),onTransitionEnd:function(e){e.currentTarget.classList.contains(J.docSidebarContainer)&&g&&_(!0)}},a.createElement(z,{key:h,sidebar:v,path:s.path,onCollapse:k,isHidden:N}),N&&a.createElement("div",{className:J.collapsedDocSidebar,title:(0,f.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,f.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:k,onClick:k},a.createElement(p,{className:J.expandSidebarButtonIcon}))),a.createElement("main",{className:(0,c.Z)(J.docMainContainer,(n={},n[J.docMainContainerEnhanced]=g||!v,n))},a.createElement("div",{className:(0,c.Z)("container padding-top--md padding-bottom--lg",J.docItemWrapper,(o={},o[J.docItemWrapperEnhanced]=g,o))},a.createElement(r.Zo,{components:X.default},d)))))}var ee=function(e){var t=e.route.routes,n=e.versionMetadata,r=e.location,l=t.find((function(e){return(0,q.LX)(r.pathname,e)}));return l?a.createElement(a.Fragment,null,a.createElement(Q.Z,null,a.createElement("html",{className:n.className})),a.createElement($,{currentDocRoute:l,versionMetadata:n},(0,o.Z)(t,{versionMetadata:n}))):a.createElement(Y.default,e)}},6119:function(e,t,n){n.r(t);var a=n(7378),r=n(29),o=n(1787);t.default=function(){return a.createElement(r.Z,{title:(0,o.I)({id:"theme.NotFound.title",message:"Page Not Found"})},a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(o.Z,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(o.Z,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(o.Z,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken."))))))}}}]);