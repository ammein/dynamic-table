(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";var commonjsGlobal="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function createCommonjsModule(t,e){return t(e={exports:{}},e.exports),e.exports}var dayjs_min=createCommonjsModule(function(t,e){t.exports=function(){var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",u="month",a="quarter",o="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},d={s:c,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),r=t.clone().add(n,u),i=e-r<0,s=t.clone().add(n+(i?-1:1),u);return Number(-(n+(e-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return{M:u,y:o,w:s,d:i,h:r,m:n,s:e,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},l={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},$="en",m={};m[$]=l;var M=function(t){return t instanceof p},y=function(t,e,n){var r;if(!t)return null;if("string"==typeof t)m[t]&&(r=t),e&&(m[t]=e,r=t);else{var i=t.name;m[i]=t,r=i}return n||($=r),r},D=function(t,e,n){if(M(t))return t.clone();var r=e?"string"==typeof e?{format:e,pl:n}:e:{};return r.date=t,new p(r)},g=d;g.l=y,g.i=M,g.w=function(t,e){return D(t,{locale:e.$L,utc:e.$u})};var p=function(){function c(t){this.$L=this.$L||y(t.locale,null,!0)||$,this.parse(t)}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(g.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(h);if(r)return n?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(e)}(t),this.init()},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},d.$utils=function(){return g},d.isValid=function(){return!("Invalid Date"===this.$d.toString())},d.isSame=function(t,e){var n=D(t);return this.startOf(e)<=n&&n<=this.endOf(e)},d.isAfter=function(t,e){return D(t)<this.startOf(e)},d.isBefore=function(t,e){return this.endOf(e)<D(t)},d.$g=function(t,e,n){return g.u(t)?this[e]:this.set(n,t)},d.year=function(t){return this.$g(t,"$y",o)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",n)},d.second=function(t){return this.$g(t,"$s",e)},d.millisecond=function(e){return this.$g(e,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,a){var h=this,f=!!g.u(a)||a,c=g.p(t),d=function(t,e){var n=g.w(h.$u?Date.UTC(h.$y,e,t):new Date(h.$y,e,t),h);return f?n:n.endOf(i)},l=function(t,e){return g.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(e)),h)},$=this.$W,m=this.$M,M=this.$D,y="set"+(this.$u?"UTC":"");switch(c){case o:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var D=this.$locale().weekStart||0,p=($<D?$+7:$)-D;return d(f?M-p:M+(6-p),m);case i:case"date":return l(y+"Hours",0);case r:return l(y+"Minutes",1);case n:return l(y+"Seconds",2);case e:return l(y+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,a){var h,f=g.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[o]=c+"FullYear",h[r]=c+"Hours",h[n]=c+"Minutes",h[e]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],l=f===i?this.$D+(a-this.$W):a;if(f===u||f===o){var $=this.clone().set("date",1);$.$d[d](l),$.init(),this.$d=$.set("date",Math.min(this.$D,$.daysInMonth())).toDate()}else d&&this.$d[d](l);return this.init(),this},d.set=function(t,e){return this.clone().$set(t,e)},d.get=function(t){return this[g.p(t)]()},d.add=function(t,a){var h,f=this;t=Number(t);var c=g.p(a),d=function(e){var n=D(f);return g.w(n.date(n.date()+Math.round(e*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var l=(h={},h[n]=6e4,h[r]=36e5,h[e]=1e3,h)[c]||1,$=this.valueOf()+t*l;return g.w($,this)},d.subtract=function(t,e){return this.add(-1*t,e)},d.format=function(t){var e=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=g.z(this),i=this.$locale(),s=this.$H,u=this.$m,a=this.$M,o=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return g.s(s%12||12,t,"0")},l=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:g.s(a+1,2,"0"),MMM:c(i.monthsShort,a,h,3),MMMM:h[a]||h(this,n),D:this.$D,DD:g.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,o,2),ddd:c(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:g.s(s,2,"0"),h:d(1),hh:d(2),a:l(s,u,!0),A:l(s,u,!1),m:String(u),mm:g.s(u,2,"0"),s:String(this.$s),ss:g.s(this.$s,2,"0"),SSS:g.s(this.$ms,3,"0"),Z:r};return n.replace(f,function(t,e){return e||$[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=g.p(h),l=D(t),$=6e4*(l.utcOffset()-this.utcOffset()),m=this-l,M=g.m(this,l);return M=(c={},c[o]=M/12,c[u]=M,c[a]=M/3,c[s]=(m-$)/6048e5,c[i]=(m-$)/864e5,c[r]=m/36e5,c[n]=m/6e4,c[e]=m/1e3,c)[d]||m,f?M:g.a(M)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,e){if(!t)return this.$L;var n=this.clone();return n.$L=y(t,e,!0),n},d.clone=function(){return g.w(this.toDate(),this)},d.toDate=function(){return new Date(this.$d)},d.toJSON=function(){return this.toISOString()},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return D.prototype=p.prototype,D.extend=function(t,e){return t(e,p,D),D},D.locale=y,D.isDayjs=M,D.unix=function(t){return D(1e3*t)},D.en=m[$],D.Ls=m,D}()}),parseDate=function(t,e){var n=!1;if(e)switch(e){case"ISO_8601":n=t;break;case"RFC_2822":n=dayjs_min(t,"ddd, MM MMM YYYY HH:mm:ss ZZ").format("YYYYMMDD");break;case"MYSQL":n=dayjs_min(t,"YYYY-MM-DD hh:mm:ss").format("YYYYMMDD");break;case"UNIX":n=dayjs_min(t).unix();break;default:n=dayjs_min(t,e).format("YYYYMMDD")}return n};exports.parseDate=parseDate;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var isObject=function(t){return"[object Object]"===Object.prototype.toString.call(t)},isArray=function(t){return Array.isArray(t)},isJson=function(t){var e=!1;try{e=JSON.parse(t)}catch(t){return!1}return!(null===e||!isArray(e)&&!isObject(e))&&e},extend=function(t,e){for(var a in e)if(e.hasOwnProperty(a)){var i=e[a];i&&isObject(i)?(t[a]=t[a]||{},extend(t[a],i)):t[a]=i}return t},each=function(t,e,a){var i;if(isObject(t))for(i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.call(a,t[i],i);else for(i=0;i<t.length;i++)e.call(a,t[i],i)},on=function(t,e,a){t.addEventListener(e,a,!1)},createElement=function(t,e){var a,i=document.createElement(t);if(e&&"object"==typeof e)for(a in e)"html"===a?i.innerHTML=e[a]:i.setAttribute(a,e[a]);return i},flush=function(t,e){if(t instanceof NodeList)each(t,function(t){flush(t,e)});else if(e)for(;t.hasChildNodes();)t.removeChild(t.firstChild);else t.innerHTML=""},button=function(t,e,a){return createElement("li",{class:t,html:'<a href="#" data-page="'+e+'">'+a+"</a>"})},classList={add:function(t,e){t.classList?t.classList.add(e):classList.contains(t,e)||(t.className=t.className.trim()+" "+e)},remove:function(t,e){t.classList?t.classList.remove(e):classList.contains(t,e)&&(t.className=t.className.replace(new RegExp("(^|\\s)"+e.split(" ").join("|")+"(\\s|$)","gi")," "))},contains:function(t,e){if(t)return t.classList?t.classList.contains(e):!!t.className&&!!t.className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))}},sortItems=function(t,e){var a,i;1===e?(a=0,i=t.length):-1===e&&(a=t.length-1,i=-1);for(var s=!0;s;){s=!1;for(var n=a;n!=i;n+=e)if(t[n+e]&&t[n].value>t[n+e].value){var r=t[n],l=t[n+e],o=r;t[n]=l,t[n+e]=o,s=!0}}return t},truncate=function(t,e,a,i,s){var n,r=2*(i=i||2),l=e-i,o=e+i,h=[],d=[];e<4-i+r?o=3+r:e>a-(3-i+r)&&(l=a-(2+r));for(var c=1;c<=a;c++)if(1==c||c==a||c>=l&&c<=o){var p=t[c-1];classList.remove(p,"active"),h.push(p)}return each(h,function(e){var a=e.children[0].getAttribute("data-page");if(n){var i=n.children[0].getAttribute("data-page");if(a-i==2)d.push(t[i]);else if(a-i!=1){var r=createElement("li",{class:"ellipsis",html:'<a href="#">'+s+"</a>"});d.push(r)}}d.push(e),n=e}),d},Rows=function(t,e){return this.dt=t,this.rows=e,this};Rows.prototype.build=function(t){var e=createElement("tr"),a=this.dt.headings;return a.length||(a=t.map(function(){return""})),each(a,function(a,i){var s=createElement("td");t[i]&&t[i].length||(t[i]=""),s.innerHTML=t[i],s.data=t[i],e.appendChild(s)}),e},Rows.prototype.render=function(t){return t},Rows.prototype.add=function(t){if(isArray(t)){var e=this.dt;isArray(t[0])?each(t,function(t){e.data.push(this.build(t))},this):e.data.push(this.build(t)),e.data.length&&(e.hasRows=!0),this.update(),e.columns().rebuild()}},Rows.prototype.remove=function(t){var e=this.dt;isArray(t)?(t.sort(function(t,e){return e-t}),each(t,function(t){e.data.splice(t,1)})):e.data.splice(t,1),e.data.length||(e.hasRows=!1),this.update(),e.columns().rebuild()},Rows.prototype.update=function(){each(this.dt.data,function(t,e){t.dataIndex=e})};var Columns=function(t){return this.dt=t,this};Columns.prototype.swap=function(t){if(t.length&&2===t.length){var e=[];each(this.dt.headings,function(t,a){e.push(a)});var a=t[0],i=t[1],s=e[i];e[i]=e[a],e[a]=s,this.order(e)}},Columns.prototype.order=function(t){var e,a,i,s,n,r,l,o=[[],[],[],[]],h=this.dt;each(t,function(t,i){n=h.headings[t],r="false"!==n.getAttribute("data-sortable"),(e=n.cloneNode(!0)).originalCellIndex=i,e.sortable=r,o[0].push(e),h.hiddenColumns.includes(t)||((a=n.cloneNode(!0)).originalCellIndex=i,a.sortable=r,o[1].push(a))}),each(h.data,function(e,a){i=e.cloneNode(!1),s=e.cloneNode(!1),i.dataIndex=s.dataIndex=a,null!==e.searchIndex&&void 0!==e.searchIndex&&(i.searchIndex=s.searchIndex=e.searchIndex),each(t,function(t){(l=e.cells[t].cloneNode(!0)).data=e.cells[t].data,i.appendChild(l),h.hiddenColumns.includes(t)||((l=e.cells[t].cloneNode(!0)).data=e.cells[t].data,s.appendChild(l))}),o[2].push(i),o[3].push(s)}),h.headings=o[0],h.activeHeadings=o[1],h.data=o[2],h.activeRows=o[3],h.update()},Columns.prototype.hide=function(t){if(t.length){var e=this.dt;each(t,function(t){e.hiddenColumns.includes(t)||e.hiddenColumns.push(t)}),this.rebuild()}},Columns.prototype.show=function(t){if(t.length){var e,a=this.dt;each(t,function(t){(e=a.hiddenColumns.indexOf(t))>-1&&a.hiddenColumns.splice(e,1)}),this.rebuild()}},Columns.prototype.visible=function(t){var e,a=this.dt;return t=t||a.headings.map(function(t){return t.originalCellIndex}),isNaN(t)?isArray(t)&&(e=[],each(t,function(t){e.push(!a.hiddenColumns.includes(t))})):e=!a.hiddenColumns.includes(t),e},Columns.prototype.add=function(t){var e,a=this,i=document.createElement("th");if(!this.dt.headings.length)return this.dt.insert({headings:[t.heading],data:t.data.map(function(t){return[t]})}),void this.rebuild();this.dt.hiddenHeader?i.innerHTML="":t.heading.nodeName?i.appendChild(t.heading):i.innerHTML=t.heading,this.dt.headings.push(i),each(this.dt.data,function(i,s){t.data[s]&&(e=document.createElement("td"),t.data[s].nodeName?e.appendChild(t.data[s]):e.innerHTML=t.data[s],e.data=e.innerHTML,t.render&&(e.innerHTML=t.render.call(a,e.data,e,i)),i.appendChild(e))}),t.type&&i.setAttribute("data-type",t.type),t.format&&i.setAttribute("data-format",t.format),t.hasOwnProperty("sortable")&&(i.sortable=t.sortable,i.setAttribute("data-sortable",!0===t.sortable?"true":"false")),this.rebuild(),this.dt.renderHeader()},Columns.prototype.remove=function(t){isArray(t)?(t.sort(function(t,e){return e-t}),each(t,function(t){this.remove(t)},this)):(this.dt.headings.splice(t,1),each(this.dt.data,function(e){e.removeChild(e.cells[t])})),this.rebuild()},Columns.prototype.sort=function(t,e,a){var i=this,s=this.dt;if(s.hasHeadings&&(t<0||t>s.headings.length))return!1;s.sorting=!0;var n=s.data,r=[],l=[],o=0,h=0,d=s.headings[t],c=function(t){return t},p=[];if("date"===d.getAttribute("data-type")){var u=!1;d.hasAttribute("data-format")&&(u=d.getAttribute("data-format")),p.push(Promise.resolve(require("./date-5b20bb7a.js")).then(function(t){var e=t.parseDate;c=function(t){return e(t,u)}}))}Promise.all(p).then(function(){var p,u;Array.from(n).forEach(function(e){var a=e.cells[t],i=a.hasAttribute("data-content")?a.getAttribute("data-content"):a.innerText,s=c("string"==typeof i?i.replace(/(\$|,|\s|%)/g,""):i);parseFloat(s)==s?l[h++]={value:Number(s),row:e}:r[o++]={value:i,row:e}}),e||(e=classList.contains(d,"asc")?"desc":"asc"),"desc"==e?(p=sortItems(r,-1),u=sortItems(l,-1),classList.remove(d,"asc"),classList.add(d,"desc")):(p=sortItems(l,1),u=sortItems(r,1),classList.remove(d,"desc"),classList.add(d,"asc")),s.lastTh&&d!=s.lastTh&&(classList.remove(s.lastTh,"desc"),classList.remove(s.lastTh,"asc")),s.lastTh=d,n=p.concat(u),s.data=[];var f=[];each(n,function(t,e){s.data.push(t.row),null!==t.row.searchIndex&&void 0!==t.row.searchIndex&&f.push(e)},s),s.searchData=f,i.rebuild(),s.update(),a||s.emit("datatable.sort",t,e)})},Columns.prototype.rebuild=function(){var t,e,a,i,s=this.dt,n=[];s.activeRows=[],s.activeHeadings=[],each(s.headings,function(t,e){t.originalCellIndex=e,t.sortable="false"!==t.getAttribute("data-sortable"),s.hiddenColumns.includes(e)||s.activeHeadings.push(t)},this),each(s.data,function(r,l){t=r.cloneNode(!1),e=r.cloneNode(!1),t.dataIndex=e.dataIndex=l,null!==r.searchIndex&&void 0!==r.searchIndex&&(t.searchIndex=e.searchIndex=r.searchIndex),each(r.cells,function(n){(a=n.cloneNode(!0)).data=n.data,t.appendChild(a),s.hiddenColumns.includes(a.cellIndex)||((i=a.cloneNode(!0)).data=a.data,e.appendChild(i))}),n.push(t),s.activeRows.push(e)}),s.data=n,s.update()};var dataToTable=function(t){var e=!1,a=!1;if((t=t||this.options.data).headings){e=createElement("thead");var i=createElement("tr");each(t.headings,function(t){var e=createElement("th",{html:t});i.appendChild(e)}),e.appendChild(i)}t.data&&t.data.length&&(a=createElement("tbody"),each(t.data,function(e){if(t.headings&&t.headings.length!==e.length)throw new Error("The number of rows do not match the number of headings.");var i=createElement("tr");each(e,function(t){var e=createElement("td",{html:t});i.appendChild(e)}),a.appendChild(i)})),e&&(null!==this.table.tHead&&this.table.removeChild(this.table.tHead),this.table.appendChild(e)),a&&(this.table.tBodies.length&&this.table.removeChild(this.table.tBodies[0]),this.table.appendChild(a))},defaultConfig={sortable:!0,searchable:!0,paging:!0,perPage:10,perPageSelect:[5,10,15,20,25],nextPrev:!0,firstLast:!1,prevText:"&lsaquo;",nextText:"&rsaquo;",firstText:"&laquo;",lastText:"&raquo;",ellipsisText:"&hellip;",ascText:"▴",descText:"▾",truncatePager:!0,pagerDelta:2,scrollY:"",fixedColumns:!0,fixedHeight:!1,header:!0,footer:!1,labels:{placeholder:"Search...",perPage:"{select} entries per page",noRows:"No entries found",info:"Showing {start} to {end} of {rows} entries"},layout:{top:"{select}{search}",bottom:"{info}{pager}"}},DataTable=function(t,e){if(this.initialized=!1,this.options=extend(defaultConfig,e),"string"==typeof t&&(t=document.querySelector(t)),this.initialLayout=t.innerHTML,this.initialSortable=this.options.sortable,this.options.header||(this.options.sortable=!1),null===t.tHead&&(!this.options.data||this.options.data&&!this.options.data.headings)&&(this.options.sortable=!1),t.tBodies.length&&!t.tBodies[0].rows.length&&this.options.data&&!this.options.data.data)throw new Error("You seem to be using the data option, but you've not defined any rows.");this.table=t,this.init()};DataTable.extend=function(t,e){"function"==typeof e?DataTable.prototype[t]=e:DataTable[t]=e},DataTable.prototype.init=function(t){var e=this;if(this.initialized||classList.contains(this.table,"dataTable-table"))return!1;this.options=extend(this.options,t||{}),this.isIE=!!/(msie|trident)/i.test(navigator.userAgent),this.currentPage=1,this.onFirstPage=!0,this.hiddenColumns=[],this.columnRenderers=[],this.selectedColumns=[],this.render(),setTimeout(function(){e.emit("datatable.init"),e.initialized=!0,e.options.plugins&&each(e.options.plugins,function(t,a){e[a]&&"function"==typeof e[a]&&(e[a]=e[a](t,{each:each,extend:extend,classList:classList,createElement:createElement}),t.enabled&&e[a].init&&"function"==typeof e[a].init&&e[a].init())})},10)},DataTable.prototype.render=function(t){var e=this;if(t){switch(t){case"page":this.renderPage();break;case"pager":this.renderPager();break;case"header":this.renderHeader()}return!1}var a=this.options,i="";if(a.data&&dataToTable.call(this),a.ajax){var s=a.ajax,n=new XMLHttpRequest;on(n,"progress",function(t){e.emit("datatable.ajax.progress",t,n)}),on(n,"load",function(t){if(4===n.readyState)if(e.emit("datatable.ajax.loaded",t,n),200===n.status){var a={};a.data=s.load?s.load.call(e,n):n.responseText,a.type="json",s.content&&s.content.type&&(a.type=s.content.type,a=extend(a,s.content)),e.import(a),e.setColumns(!0),e.emit("datatable.ajax.success",t,n)}else e.emit("datatable.ajax.error",t,n)}),on(n,"error",function(t){e.emit("datatable.ajax.error",t,n)}),on(n,"abort",function(t){e.emit("datatable.ajax.abort",t,n)}),this.emit("datatable.ajax.loading",n),n.open("GET","string"==typeof s?a.ajax:a.ajax.url),n.send()}if(this.body=this.table.tBodies[0],this.head=this.table.tHead,this.foot=this.table.tFoot,this.body||(this.body=createElement("tbody"),this.table.appendChild(this.body)),this.hasRows=this.body.rows.length>0,!this.head){var r=createElement("thead"),l=createElement("tr");this.hasRows&&(each(this.body.rows[0].cells,function(){l.appendChild(createElement("th"))}),r.appendChild(l)),this.head=r,this.table.insertBefore(this.head,this.body),this.hiddenHeader=!a.ajax}if(this.headings=[],this.hasHeadings=this.head.rows.length>0,this.hasHeadings&&(this.header=this.head.rows[0],this.headings=[].slice.call(this.header.cells)),a.header||this.head&&this.table.removeChild(this.table.tHead),a.footer?this.head&&!this.foot&&(this.foot=createElement("tfoot",{html:this.head.innerHTML}),this.table.appendChild(this.foot)):this.foot&&this.table.removeChild(this.table.tFoot),this.wrapper=createElement("div",{class:"dataTable-wrapper dataTable-loading"}),i+="<div class='dataTable-top'>",i+=a.layout.top,i+="</div>",a.scrollY.length?i+="<div class='dataTable-container' style='height: "+a.scrollY+"; overflow-Y: auto;'></div>":i+="<div class='dataTable-container'></div>",i+="<div class='dataTable-bottom'>",i+=a.layout.bottom,i=(i+="</div>").replace("{info}",a.paging?"<div class='dataTable-info'></div>":""),a.paging&&a.perPageSelect){var o="<div class='dataTable-dropdown'><label>";o+=a.labels.perPage,o+="</label></div>";var h=createElement("select",{class:"dataTable-selector"});each(a.perPageSelect,function(t){var e=t===a.perPage,i=new Option(t,t,e,e);h.add(i)}),o=o.replace("{select}",h.outerHTML),i=i.replace("{select}",o)}else i=i.replace("{select}","");if(a.searchable){var d="<div class='dataTable-search'><input class='dataTable-input' placeholder='"+a.labels.placeholder+"' type='text'></div>";i=i.replace("{search}",d)}else i=i.replace("{search}","");this.hasHeadings&&this.render("header"),classList.add(this.table,"dataTable-table");var c=createElement("div",{class:"dataTable-pagination"}),p=createElement("ul");c.appendChild(p),i=i.replace(/\{pager\}/g,c.outerHTML),this.wrapper.innerHTML=i,this.container=this.wrapper.querySelector(".dataTable-container"),this.pagers=this.wrapper.querySelectorAll(".dataTable-pagination"),this.label=this.wrapper.querySelector(".dataTable-info"),this.table.parentNode.replaceChild(this.wrapper,this.table),this.container.appendChild(this.table),this.rect=this.table.getBoundingClientRect(),this.data=[].slice.call(this.body.rows),this.activeRows=this.data.slice(),this.activeHeadings=this.headings.slice(),this.update(),a.ajax||this.setColumns(),this.fixHeight(),this.fixColumns(),a.header||classList.add(this.wrapper,"no-header"),a.footer||classList.add(this.wrapper,"no-footer"),a.sortable&&classList.add(this.wrapper,"sortable"),a.searchable&&classList.add(this.wrapper,"searchable"),a.fixedHeight&&classList.add(this.wrapper,"fixed-height"),a.fixedColumns&&classList.add(this.wrapper,"fixed-columns"),this.bindEvents()},DataTable.prototype.renderPage=function(){if(this.hasHeadings&&(flush(this.header,this.isIE),each(this.activeHeadings,function(t){this.header.appendChild(t)},this)),this.hasRows&&this.totalPages){this.currentPage>this.totalPages&&(this.currentPage=1);var t=this.currentPage-1,e=document.createDocumentFragment();each(this.pages[t],function(t){e.appendChild(this.rows().render(t))},this),this.clear(e),this.onFirstPage=1===this.currentPage,this.onLastPage=this.currentPage===this.lastPage}else this.setMessage(this.options.labels.noRows);var a,i=0,s=0,n=0;if(this.totalPages&&(n=(s=(i=this.currentPage-1)*this.options.perPage)+this.pages[i].length,s+=1,a=this.searching?this.searchData.length:this.data.length),this.label&&this.options.labels.info.length){var r=this.options.labels.info.replace("{start}",s).replace("{end}",n).replace("{page}",this.currentPage).replace("{pages}",this.totalPages).replace("{rows}",a);this.label.innerHTML=a?r:""}1==this.currentPage&&this.fixHeight()},DataTable.prototype.renderPager=function(){if(flush(this.pagers,this.isIE),this.totalPages>1){var t="pager",e=document.createDocumentFragment(),a=this.onFirstPage?1:this.currentPage-1,i=this.onlastPage?this.totalPages:this.currentPage+1;this.options.firstLast&&e.appendChild(button(t,1,this.options.firstText)),this.options.nextPrev&&e.appendChild(button(t,a,this.options.prevText));var s=this.links;this.options.truncatePager&&(s=truncate(this.links,this.currentPage,this.pages.length,this.options.pagerDelta,this.options.ellipsisText)),classList.add(this.links[this.currentPage-1],"active"),each(s,function(t){classList.remove(t,"active"),e.appendChild(t)}),classList.add(this.links[this.currentPage-1],"active"),this.options.nextPrev&&e.appendChild(button(t,i,this.options.nextText)),this.options.firstLast&&e.appendChild(button(t,this.totalPages,this.options.lastText)),each(this.pagers,function(t){t.appendChild(e.cloneNode(!0))})}},DataTable.prototype.renderHeader=function(){var t=this;this.labels=[],this.headings&&this.headings.length&&each(this.headings,function(e,a){if(t.labels[a]=e.textContent,classList.contains(e.firstElementChild,"dataTable-sorter")&&(e.innerHTML=e.firstElementChild.innerHTML),e.sortable="false"!==e.getAttribute("data-sortable"),e.originalCellIndex=a,t.options.sortable&&e.sortable){var i=createElement("a",{href:"#",class:"dataTable-sorter",html:e.innerHTML});e.innerHTML="",e.setAttribute("data-sortable",""),e.appendChild(i)}}),this.fixColumns()},DataTable.prototype.bindEvents=function(){var t=this,e=this.options,a=this;if(e.perPageSelect){var i=this.wrapper.querySelector(".dataTable-selector");i&&on(i,"change",function(){e.perPage=parseInt(this.value,10),a.update(),a.fixHeight(),a.emit("datatable.perpage",e.perPage)})}e.searchable&&(this.input=this.wrapper.querySelector(".dataTable-input"),this.input&&on(this.input,"keyup",function(){a.search(this.value)})),on(this.wrapper,"click",function(a){var i=a.target;"a"===i.nodeName.toLowerCase()&&(i.hasAttribute("data-page")?(t.page(i.getAttribute("data-page")),a.preventDefault()):e.sortable&&classList.contains(i,"dataTable-sorter")&&"false"!=i.parentNode.getAttribute("data-sortable")&&(t.columns().sort(t.headings.indexOf(i.parentNode)),a.preventDefault()))}),on(window,"resize",function(){t.rect=t.container.getBoundingClientRect(),t.fixColumns()})},DataTable.prototype.setColumns=function(t){var e=this;t||each(this.data,function(t){each(t.cells,function(t){t.data=t.innerHTML})}),this.options.columns&&this.headings.length&&each(this.options.columns,function(t){isArray(t.select)||(t.select=[t.select]),t.hasOwnProperty("render")&&"function"==typeof t.render&&(e.selectedColumns=e.selectedColumns.concat(t.select),e.columnRenderers.push({columns:t.select,renderer:t.render})),each(t.select,function(a){var i=e.headings[a];t.type&&i.setAttribute("data-type",t.type),t.format&&i.setAttribute("data-format",t.format),t.hasOwnProperty("sortable")&&i.setAttribute("data-sortable",t.sortable),t.hasOwnProperty("hidden")&&!1!==t.hidden&&e.columns().hide([a]),t.hasOwnProperty("sort")&&1===t.select.length&&e.columns().sort(t.select[0],t.sort,!0)})}),this.hasRows&&(each(this.data,function(t,e){t.dataIndex=e,each(t.cells,function(t){t.data=t.innerHTML})}),this.selectedColumns.length&&each(this.data,function(t){each(t.cells,function(a,i){e.selectedColumns.includes(i)&&each(e.columnRenderers,function(s){s.columns.includes(i)&&(a.innerHTML=s.renderer.call(e,a.data,a,t))})})}),this.columns().rebuild()),this.render("header")},DataTable.prototype.destroy=function(){this.table.innerHTML=this.initialLayout,classList.remove(this.table,"dataTable-table"),this.wrapper.parentNode.replaceChild(this.table,this.wrapper),this.initialized=!1},DataTable.prototype.update=function(){classList.remove(this.wrapper,"dataTable-empty"),this.paginate(this),this.render("page"),this.links=[];for(var t=this.pages.length;t--;){var e=t+1;this.links[t]=button(0===t?"active":"",e,e)}this.sorting=!1,this.render("pager"),this.rows().update(),this.emit("datatable.update")},DataTable.prototype.paginate=function(){var t=this.options.perPage,e=this.activeRows;return this.searching&&(e=[],each(this.searchData,function(t){e.push(this.activeRows[t])},this)),this.options.paging?this.pages=e.map(function(a,i){return i%t==0?e.slice(i,i+t):null}).filter(function(t){return t}):this.pages=[e],this.totalPages=this.lastPage=this.pages.length,this.totalPages},DataTable.prototype.fixColumns=function(){if((this.options.scrollY.length||this.options.fixedColumns)&&this.activeHeadings&&this.activeHeadings.length){var t,e=!1;if(this.columnWidths=[],this.table.tHead){if(this.options.scrollY.length&&((e=createElement("thead")).appendChild(createElement("tr")),e.style.height="0px",this.headerTable&&(this.table.tHead=this.headerTable.tHead)),each(this.activeHeadings,function(t){t.style.width=""},this),each(this.activeHeadings,function(t,a){var i=t.offsetWidth,s=i/this.rect.width*100;if(t.style.width=s+"%",this.columnWidths[a]=i,this.options.scrollY.length){var n=createElement("th");e.firstElementChild.appendChild(n),n.style.width=s+"%",n.style.paddingTop="0",n.style.paddingBottom="0",n.style.border="0"}},this),this.options.scrollY.length){var a=this.table.parentElement;if(!this.headerTable){this.headerTable=createElement("table",{class:"dataTable-table"});var i=createElement("div",{class:"dataTable-headercontainer"});i.appendChild(this.headerTable),a.parentElement.insertBefore(i,a)}var s=this.table.tHead;this.table.replaceChild(e,s),this.headerTable.tHead=s,this.headerTable.style.paddingRight=this.headerTable.clientWidth-this.table.clientWidth+"px",a.scrollHeight>a.clientHeight&&(a.style.overflowY="scroll")}}else{t=[],e=createElement("thead");var n=createElement("tr"),r=this.table.tBodies[0].rows[0].cells;each(r,function(){var e=createElement("th");n.appendChild(e),t.push(e)}),e.appendChild(n),this.table.insertBefore(e,this.body);var l=[];each(t,function(t,e){var a=t.offsetWidth,i=a/this.rect.width*100;l.push(i),this.columnWidths[e]=a},this),each(this.data,function(t){each(t.cells,function(t,e){this.columns(t.cellIndex).visible()&&(t.style.width=l[e]+"%")},this)},this),this.table.removeChild(e)}}},DataTable.prototype.fixHeight=function(){this.options.fixedHeight&&(this.container.style.height=null,this.rect=this.container.getBoundingClientRect(),this.container.style.height=this.rect.height+"px")},DataTable.prototype.search=function(t){return!!this.hasRows&&(t=t.toLowerCase(),this.currentPage=1,this.searching=!0,this.searchData=[],t.length?(this.clear(),each(this.data,function(e,a){var i=this,s=this.searchData.includes(e);t.split(" ").reduce(function(t,a){for(var s=!1,n=null,r=0;r<e.cells.length;r++)if(((n=e.cells[r]).hasAttribute("data-content")?n.getAttribute("data-content"):n.textContent).toLowerCase().includes(a)&&i.columns(n.cellIndex).visible()){s=!0;break}return t&&s},!0)&&!s?(e.searchIndex=a,this.searchData.push(a)):e.searchIndex=null},this),classList.add(this.wrapper,"search-results"),this.searchData.length?this.update():(classList.remove(this.wrapper,"search-results"),this.setMessage(this.options.labels.noRows)),void this.emit("datatable.search",t,this.searchData)):(this.searching=!1,this.update(),this.emit("datatable.search",t,this.searchData),classList.remove(this.wrapper,"search-results"),!1))},DataTable.prototype.page=function(t){return t!=this.currentPage&&(isNaN(t)||(this.currentPage=parseInt(t,10)),!(t>this.pages.length||t<0)&&(this.render("page"),this.render("pager"),void this.emit("datatable.page",t)))},DataTable.prototype.sortColumn=function(t,e){this.columns().sort(t,e)},DataTable.prototype.insert=function(t){var e=this,a=[];if(isObject(t)){if(t.headings&&!this.hasHeadings&&!this.hasRows){var i,s=createElement("tr");each(t.headings,function(t){i=createElement("th",{html:t}),s.appendChild(i)}),this.head.appendChild(s),this.header=s,this.headings=[].slice.call(s.cells),this.hasHeadings=!0,this.options.sortable=this.initialSortable,this.render("header"),this.activeHeadings=this.headings.slice()}t.data&&isArray(t.data)&&(a=t.data)}else isArray(t)&&each(t,function(t){var i=[];each(t,function(t,a){var s=e.labels.indexOf(a);s>-1&&(i[s]=t)}),a.push(i)});a.length&&(this.rows().add(a),this.hasRows=!0),this.update(),this.fixColumns()},DataTable.prototype.refresh=function(){this.options.searchable&&(this.input.value="",this.searching=!1),this.currentPage=1,this.onFirstPage=!0,this.update(),this.emit("datatable.refresh")},DataTable.prototype.clear=function(t){this.body&&flush(this.body,this.isIE);var e=this.body;if(this.body||(e=this.table),t){if("string"==typeof t)document.createDocumentFragment().innerHTML=t;e.appendChild(t)}},DataTable.prototype.export=function(t){if(!this.hasHeadings&&!this.hasRows)return!1;var e,a,i,s,n=this.activeHeadings,r=[],l=[];if(!isObject(t))return!1;var o=extend({download:!0,skipColumn:[],lineDelimiter:"\n",columnDelimiter:",",tableName:"myTable",replacer:null,space:4},t);if(o.type){if("txt"!==o.type&&"csv"!==o.type||(r[0]=this.header),o.selection)if(isNaN(o.selection)){if(isArray(o.selection))for(e=0;e<o.selection.length;e++)r=r.concat(this.pages[o.selection[e]-1])}else r=r.concat(this.pages[o.selection-1]);else r=r.concat(this.activeRows);if(r.length){if("txt"===o.type||"csv"===o.type){for(i="",e=0;e<r.length;e++){for(a=0;a<r[e].cells.length;a++)if(!o.skipColumn.includes(n[a].originalCellIndex)&&this.columns(n[a].originalCellIndex).visible()){var h=r[e].cells[a].textContent;(h=(h=(h=(h=(h=h.trim()).replace(/\s{2,}/g," ")).replace(/\n/g,"  ")).replace(/"/g,'""')).replace(/#/g,"%23")).includes(",")&&(h='"'+h+'"'),i+=h+o.columnDelimiter}i=i.trim().substring(0,i.length-1),i+=o.lineDelimiter}i=i.trim().substring(0,i.length-1),o.download&&(i="data:text/csv;charset=utf-8,"+i)}else if("sql"===o.type){for(i="INSERT INTO `"+o.tableName+"` (",e=0;e<n.length;e++)!o.skipColumn.includes(n[e].originalCellIndex)&&this.columns(n[e].originalCellIndex).visible()&&(i+="`"+n[e].textContent+"`,");for(i=i.trim().substring(0,i.length-1),i+=") VALUES ",e=0;e<r.length;e++){for(i+="(",a=0;a<r[e].cells.length;a++)!o.skipColumn.includes(n[a].originalCellIndex)&&this.columns(n[a].originalCellIndex).visible()&&(i+='"'+r[e].cells[a].textContent+'",');i=i.trim().substring(0,i.length-1),i+="),"}i=i.trim().substring(0,i.length-1),i+=";",o.download&&(i="data:application/sql;charset=utf-8,"+i)}else if("json"===o.type){for(a=0;a<r.length;a++)for(l[a]=l[a]||{},e=0;e<n.length;e++)!o.skipColumn.includes(n[e].originalCellIndex)&&this.columns(n[e].originalCellIndex).visible()&&(l[a][n[e].textContent]=r[a].cells[e].textContent);i=JSON.stringify(l,o.replacer,o.space),o.download&&(i="data:application/json;charset=utf-8,"+i)}return o.download&&(o.filename=o.filename||"datatable_export",o.filename+="."+o.type,i=encodeURI(i),(s=document.createElement("a")).href=i,s.download=o.filename,document.body.appendChild(s),s.click(),document.body.removeChild(s)),i}}return!1},DataTable.prototype.import=function(t){var e=!1;if(!isObject(t))return!1;if((t=extend({lineDelimiter:"\n",columnDelimiter:","},t)).data.length||isObject(t.data)){if("csv"===t.type){e={data:[]};var a=t.data.split(t.lineDelimiter);a.length&&(t.headings&&(e.headings=a[0].split(t.columnDelimiter),a.shift()),each(a,function(a,i){e.data[i]=[];var s=a.split(t.columnDelimiter);s.length&&each(s,function(t){e.data[i].push(t)})}))}else if("json"===t.type){var i=isJson(t.data);i&&(e={headings:[],data:[]},each(i,function(t,a){e.data[a]=[],each(t,function(t,i){e.headings.includes(i)||e.headings.push(i),e.data[a].push(t)})}))}isObject(t.data)&&(e=t.data),e&&this.insert(e)}return!1},DataTable.prototype.print=function(){var t=this.activeHeadings,e=this.activeRows,a=createElement("table"),i=createElement("thead"),s=createElement("tbody"),n=createElement("tr");each(t,function(t){n.appendChild(createElement("th",{html:t.textContent}))}),i.appendChild(n),each(e,function(t){var e=createElement("tr");each(t.cells,function(t){e.appendChild(createElement("td",{html:t.textContent}))}),s.appendChild(e)}),a.appendChild(i),a.appendChild(s);var r=window.open();r.document.body.appendChild(a),r.print()},DataTable.prototype.setMessage=function(t){var e=1;this.hasRows?e=this.data[0].cells.length:this.activeHeadings.length&&(e=this.activeHeadings.length),classList.add(this.wrapper,"dataTable-empty"),this.label&&(this.label.innerHTML=""),this.totalPages=0,this.render("pager"),this.clear(createElement("tr",{html:'<td class="dataTables-empty" colspan="'+e+'">'+t+"</td>"}))},DataTable.prototype.columns=function(t){return new Columns(this,t)},DataTable.prototype.rows=function(t){return new Rows(this,t)},DataTable.prototype.on=function(t,e){this.events=this.events||{},this.events[t]=this.events[t]||[],this.events[t].push(e)},DataTable.prototype.off=function(t,e){this.events=this.events||{},t in this.events!=!1&&this.events[t].splice(this.events[t].indexOf(e),1)},DataTable.prototype.emit=function(t){var e=arguments;if(this.events=this.events||{},t in this.events!=!1)for(var a=0;a<this.events[t].length;a++)this.events[t][a].apply(this,Array.prototype.slice.call(e,1))},exports.DataTable=DataTable;


},{"./date-5b20bb7a.js":1}],3:[function(require,module,exports){
"use strict";

var _simpleDatatables = _interopRequireDefault(require("simple-datatables"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

apos.define('dynamic-table-utils', {
  afterConstruct: function afterConstruct(self) {
    // To let others extend it
    self.allListener();
  },
  construct: function construct(self, options) {
    // options.schemas && options.object receives whenever dynamic-table-widgets-editor available
    self.tableDelimiter = options.tableDelimiter ? options.tableDelimiter : ',';
    self.tableEscapeChar = options.tableEscapeChar; // This only allow editorDataTableOptions from server options to be passed on

    if (options.editorDataTableOptions) {
      self.keyOptions = Object.keys(options.editorDataTableOptions).map(function (key) {
        return [key, options.editorDataTableOptions[key]];
      });
      self.originalEditorDataTableOptions = _.cloneDeep(options.editorDataTableOptions);
    }

    self.exists = false;

    self.updateRowsAndColumns = function (object) {
      if (object) {
        self.rowData = object.data;
        self.columnData = object.columns;
      } // Update to options


      self.EditorDataTableOptions.data = self.rowData;
      self.EditorDataTableOptions.columns = self.columnData;
      self.executeRow(self.rowData.length);
      self.executeColumn(self.columnData.length);

      if (self.rowData.length > 0 && self.columnData.length > 0) {
        apos.schemas.findField(self.$form, 'row').val(self.rowData.length);
        apos.schemas.findField(self.$form, 'column').val(self.columnData.length);
      }
    };

    self.resetCustomTable = function () {
      var rowInput = apos.schemas.findFieldset(self.$form, 'row').find('input');
      var columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');
      var dataInput = apos.schemas.findFieldset(self.$form, 'data').find('textarea');

      if (dataInput.val().length > 0) {
        dataInput.val('');
      }

      if (rowInput.val().length > 0) {
        rowInput.val('');
      }

      if (columnInput.val().length > 0) {
        columnInput.val('');
        columnInput.attr('disabled', true);
      }
    };

    self.resetAjaxTable = function () {
      var ajaxOptions = apos.schemas.findFieldset(self.$form, 'ajaxOptions').find('textarea');

      if (ajaxOptions.val().length > 0) {
        ajaxOptions.val('');
      }
    };

    self.resetDataOptions = function () {
      self.rowData = [];
      self.columnData = [];

      if (apos.schemas.dt.vanillaJSTable && apos.schemas.dt.vanillaJSTable.options) {
        delete apos.schemas.dt.vanillaJSTable.options.ajax;
        delete apos.schemas.dt.vanillaJSTable.options.load;
        delete apos.schemas.dt.vanillaJSTable.options.content;
        delete apos.schemas.dt.vanillaJSTable.options.data;
      }

      if (self.EditorDataTableOptions) {
        delete self.EditorDataTableOptions;
        delete self.originalEditorDataTableOptions;
        self.originalEditorDataTableOptions = {};
        self.keyOptions.forEach(function (value, i, arr) {
          self.originalEditorDataTableOptions[value[0]] = value[1];
        });
      }
    };

    self.beforeShowDynamicTable = function ($form, data) {
      // Reset rows & columns
      self.resetDataOptions(); // Get the form DOM

      self.$form = $form; // Can access self.$el & self.$form in here

      self.$row = apos.schemas.findFieldset(self.$form, 'row');
      self.$column = apos.schemas.findFieldset(self.$form, 'column');
      self.$data = apos.schemas.findFieldset(self.$form, 'data');
      self.$tableHTML = self.$form.find('#dynamicTable');
      self.$ajaxOptions = apos.schemas.findFieldset(self.$form, 'ajaxOptions');
      self.$divTable = self.$form.find('.dynamic-table-area');
      self.$id = apos.schemas.findFieldset(self.$form, 'id');
      self.$url = apos.schemas.findFieldset(self.$form, 'url');
      self.$title = apos.schemas.findFieldset(self.$form, 'title');
      var rowInput = self.$row.find('input');
      var columnInput = self.$column.find('input');
      var dataInput = self.$data.find('textarea');
      var ajaxOptions = self.$ajaxOptions.find('textarea'); // Destroy table if exists

      self.destroyTable(); // Disabled first by default

      if (rowInput.length > 0 && rowInput.val().length < 1) {
        columnInput.attr('disabled', true);
      }

      self.$row.on('change', function (e) {
        var num = parseInt(e.currentTarget.querySelector('input').value);

        if (ajaxOptions.val().length > 0) {
          var confirm = window.confirm('You are about to remove your Ajax Input from being used. Are you sure you want to continue ?');

          if (confirm) {
            // Remove ajax options
            delete self.EditorDataTableOptions.ajax;
            delete self.EditorDataTableOptions.columns;
            delete self.EditorDataTableOptions.processed;
            ajaxOptions.val('');
            self.executeRow(num);
          }
        } else {
          self.executeRow(num);
        }
      });
      self.$column.on('change', function (e) {
        var num = parseInt(e.currentTarget.querySelector('input').value);
        self.executeColumn(num);
      });
      self.$ajaxOptions.on('change', function (e) {
        try {
          // Use custom JSON5 to beautifully parse the value without double quotes JSON
          var _options = JSON5.parse(e.currentTarget.querySelector('textarea').value);

          self.executeAjax(_options); // Stringify for better user reading

          ajaxOptions.val(JSON5.parse(JSON.stringify(e.currentTarget.querySelector('textarea').value, undefined, 2)));
        } catch (error) {
          // Stringify for better user reading
          ajaxOptions.val(JSON5.parse(JSON.stringify(e.currentTarget.querySelector('textarea').value, undefined, 2)));
          console.warn(error);
        }
      });
      self.$data.on('change', function (e) {
        try {
          var _data = JSON5.parse(e.currentTarget.querySelector('textarea').value); // Auto Convert Columns Title


          _data.columns = _data.columns.map(function (item, i) {
            if (self.columnData[i] && self.columnData[i].title && item.title !== self.columnData[i].title && item.title && item.sTitle) {
              // Adjust Title
              item.sTitle = item.title;
            } else if (self.columnData[i] && self.columnData[i].sTitle && item.sTitle !== self.columnData[i].sTitle && item.sTitle && item.title) {
              // Adjust Title
              item.title = item.sTitle;
            }

            return item;
          });
          self.updateRowsAndColumns(_data); // Update to inputs

          if (rowInput.length > 0) {
            rowInput.val(_data.data.length);
          }

          if (columnInput.length > 0) {
            columnInput.val(_data.columns.length);
          }

          self.executeRow(_data.data.length);
          self.executeColumn(_data.columns.length);
          self.initTable();
        } catch (e) {
          console.warn(e);
        }
      });
    };

    self.afterShowDynamicTable = function ($form, data) {
      self.$form = $form; // Let everything running on `beforeShow` above and other functions that might needed to run
      // Then call this function to run when everything is populated

      var rowInput = self.$row.find('input');
      var columnInput = self.$column.find('input');
      var ajaxOptions = self.$ajaxOptions.find('textarea');
      var dataInput = self.$data.find('textarea');
      var idInput = self.$id.find('input');
      self.$chooser = apos.schemas.findFieldset(self.$form, '_dynamicTable').data('aposChooser'); // Let change event registered first, then trigger it

      if (rowInput.length > 0 && columnInput.length > 0 && ajaxOptions.length > 0 && rowInput.val().length > 0 && columnInput.val().length > 0 && ajaxOptions.val().length === 0) {
        self.updateRowsAndColumns(JSON5.parse(dataInput.val()));
        self.initTable();
      }

      if (ajaxOptions.length > 0 && ajaxOptions.val().length > 0) {
        // To enable textarea auto resize
        self.$ajaxOptions.trigger('change');
      }

      if (idInput.length > 0 && idInput.val().length === 0) {
        idInput.val(data ? data._id : '');
      }

      if (self.$chooser) {
        self.getJoin(self.$chooser);
      }
    };

    self.mergeOptions = function () {
      self.EditorDataTableOptions = self.EditorDataTableOptions || {};
      Object.assign(self.EditorDataTableOptions, self.originalEditorDataTableOptions);
    };

    self.executeAjax = function (options) {
      self.destroyTable();
      delete self.EditorDataTableOptions.data;
      delete self.EditorDataTableOptions.columns; // Reset Data

      self.rowData = [];
      self.columnData = [];

      if (apos.assets.options.lean) {
        if (options && typeof options.ajax === 'string') {
          options.ajax = {
            url: options.ajax
          };
        } // Bug where it load previous datatable data from other table. Just make this undefined


        options.data = undefined; // Pass to load

        options.ajax.load = options.ajax.load || self.loadLeanDataTables;
      } else {
        // If switch to DataTablesJquery, delete this unnecessary options
        delete options.ajax.load;
        delete options.ajax.content;
      } // Merge Options


      Object.assign(self.EditorDataTableOptions, options);
      self.resetCustomTable();
      self.initTable();
    };

    self.loadLeanDataTables = function (xhr) {
      var constructorDatatable = this;

      if (constructorDatatable.options.ajax && constructorDatatable.options.ajax.dataSrc && constructorDatatable.options.ajax.dataSrc.length > 0 && constructorDatatable.options.ajax.dataSrc !== '') {
        var data = JSON.findNested(constructorDatatable.options.ajax.dataSrc, JSON.parse(xhr.responseText));
      } else {
        // eslint-disable-next-line no-redeclare
        var data = JSON.parse(xhr.responseText);
      }

      var convertData = []; // Loop over the data and style any columns with numbers

      for (var i = 0; i < data.length; i++) {
        var _loop = function _loop(property) {
          // If options.columns
          if (constructorDatatable.options.columns) {
            var filter = constructorDatatable.options.columns.filter(function (val, i) {
              return val.data === property;
            });

            if (filter[0]) {
              // If filter success
              var getDataPos = filter[0].data;
              var getTitle = filter[0].title;

              if (getDataPos.split('.').length > 1 && getDataPos.split('.')[getDataPos.split('.').length - getDataPos.split('.').length] === property) {
                convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = _defineProperty({}, getTitle, !window.isNaN(self.findNested(getDataPos, data[i][property])) ? self.findNested(getDataPos, data[i][property]).toString() : self.findNested(getDataPos, data[i][property])));
              } else {
                convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = _defineProperty({}, getTitle, !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]));
              }
            } else {
              // If filter no success at all
              convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = _defineProperty({}, property, !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]));
            }
          } else {
            // If no options.columns
            convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = _defineProperty({}, property, !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]));
          }
        };

        for (var property in data[i]) {
          _loop(property);
        }
      } // Data must return array of objects


      return JSON.stringify(convertData);
    }; // Thanks to Stephen Wagner (https://stephanwagner.me/auto-resizing-textarea-with-vanilla-javascript)


    self.textareaAutoResize = function (element) {
      element.style.boxSizing = 'border-box';
      var offset = element.offsetHeight - element.clientHeight;
      element.addEventListener('input', function (event) {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + offset + 'px';
      });
    };

    self.executeAutoResize = function (element) {
      var offset = element.offsetHeight - element.clientHeight;
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + offset + 'px';
    }; // Thanks to Dinesh Pandiyan , Source : https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f


    self.findNested = function (path, data) {
      return path.split('.').reduce(function (xs, x) {
        return xs && xs[x] ? xs[x] : null;
      }, data);
    };

    self.executeRow = function (value) {
      var isNaN = window.isNaN(value);
      var columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');

      if (!isNaN && value !== 0) {
        if (columnInput.length > 0 && columnInput.attr('disabled') === 'disabled') {
          columnInput.attr('disabled', false);
        }

        if (self.rowData.length > 0) {
          self.rowData = self.rowData.slice(0, value);
        } // Append Rows


        for (var i = 0; i < value; i++) {
          if (self.rowData[i]) {
            continue;
          }

          self.rowData.push([]);
        } // Trigger change to update value based on active row input


        apos.schemas.findFieldset(self.$form, 'column').trigger('change');
      }

      if (value === 0) {
        if (columnInput.length > 0) {
          columnInput.attr('disabled', true);
        }

        self.destroyTable();
      }
    };

    self.executeColumn = function (value) {
      var isNaN = window.isNaN(value);
      var rowInput = apos.schemas.findFieldset(self.$form, 'row').find('input');
      var columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');

      if (!isNaN && value !== 0) {
        if (self.columnData.length > 0) {
          self.columnData = self.columnData.slice(0, value);
        } // Loop each row to append new data to it


        for (var a = 0; a < value; a++) {
          if (self.columnData[a]) {
            continue;
          }

          self.columnData.push({
            title: 'Header ' + (a + 1)
          });
        } // Reupload data to column change


        for (var row = 0; row < self.rowData.length; row++) {
          for (column = 0; column < self.columnData.length; column++) {
            if (self.rowData[row][column]) {
              continue;
            }

            self.rowData[row].push('untitled');
          } // Delete unecessary rows data based on columns


          if (self.rowData[row].length !== self.columnData.length) {
            apos.notify("Error : Number of rows isn't based on number of columns. Row ".concat(row, " affected"), {
              type: 'error',
              dismiss: true
            });
            self.rowData[row] = self.rowData[row].slice(0, self.columnData.length);
          }
        } // Update to options


        self.EditorDataTableOptions.data = self.rowData;
        self.EditorDataTableOptions.columns = self.columnData;

        if (self.columnData.length > 0) {
          self.initTable();
        }
      }

      if (value === 0) {// Nothing here yet
      }
    };

    self.initTable = function () {
      // Refresh Existing Table
      self.$tableHTML = self.$form.find('table#dynamicTable'); // Safe method. Table may display many

      self.$tableHTML.each(function (i, val) {
        // When table is visible
        if (val.offsetParent !== null) {
          if (apos.assets.options.lean) {
            // Destroy first
            if (apos.schemas.dt.vanillaJSTable) {
              if (!self.EditorDataTableOptions.ajax && apos.schemas.dt.vanillaJSTable.options.ajax) {
                delete apos.schemas.dt.vanillaJSTable.options.ajax;
                delete apos.schemas.dt.vanillaJSTable.options.load;
                delete apos.schemas.dt.vanillaJSTable.options.content;
              } // Always delete data and clear datatables


              delete apos.schemas.dt.vanillaJSTable.options.data;
              apos.schemas.dt.vanillaJSTable.clear();

              try {
                apos.schemas.dt.vanillaJSTable.destroy();
              } catch (e) {// Leave the error alone. Nothing to display
              }
            }

            if (self.EditorDataTableOptions.data && self.EditorDataTableOptions.columns) {
              // Always Convert
              var data = self.EditorDataTableOptions.data;
              var columns = self.EditorDataTableOptions.columns;
              var obj = {
                headings: [],
                data: data
              };
              obj.headings = columns.reduce(function (init, next, i, arr) {
                return init.concat(next.title);
              }, []);
            } // Empty the table for initialization


            var $parent = $(val).parent();
            $parent.empty(); // Append the table clone node

            $parent.append(apos.schemas.dt.getTable.cloneNode());
            apos.schemas.dt.vanillaJSTable = new _simpleDatatables["default"]($parent.find('#dynamicTable').get(0), self.EditorDataTableOptions.ajax ? self.EditorDataTableOptions : {
              data: obj
            });
          } else {
            if ($.fn.DataTable.isDataTable($(self.$tableHTML[i]))) {
              try {
                $(self.$tableHTML[i]).DataTable().clear().destroy();
              } catch (error) {// Leave the error alone. Nothing to display
              }
            } // Delete additional data on options when initialized


            delete self.EditorDataTableOptions.aaData;
            delete self.EditorDataTableOptions.aoColumns; // Bug : DataTable won't appear after destroy and replace schema in viewport

            try {
              // Empty the table for reinitialization
              $(self.$tableHTML[i]).empty(); // Initialize

              $(self.$tableHTML[i]).DataTable(self.EditorDataTableOptions).draw();
            } catch (e) {
              // Empty the table for reinitialization
              var $parent = $(val).parent();
              $parent.empty(); // Append the table clone node

              $parent.append(apos.schemas.dt.getTable.cloneNode()); // Reinitialize & MUST DRAW to start

              $parent.find('#dynamicTable').DataTable(self.EditorDataTableOptions).draw();
            }
          }
        } else {
          // ALways delete the table and append new to it
          var $parent = $(val).parent();
          $parent.empty();
          $parent.append(apos.schemas.dt.getTable.cloneNode());
        }
      }); // Register any DataTablesJS Event

      self.registerTableEvent(self.$tableHTML); // For Schema Auto Insert

      if (self.rowData.length !== 0 && self.columnData.length !== 0) {
        self.convertData();
      }
    };

    self.destroyTable = function () {
      // Refresh Existing Table
      self.$tableHTML = self.$form.find('table#dynamicTable'); // Reset options

      self.resetDataOptions();
      self.mergeOptions(); // Safe method. Table may display many

      self.$tableHTML.each(function (i, val) {
        // When table is visible
        if (val.offsetParent !== null) {
          if (apos.assets.options.lean) {
            // get from schemas extends
            if (apos.schemas.dt.vanillaJSTable) {
              // Always delete data and clear datatables
              delete apos.schemas.dt.vanillaJSTable.options.data;
              apos.schemas.dt.vanillaJSTable.clear();
              apos.schemas.dt.vanillaJSTable.destroy();
              delete apos.schemas.dt.vanillaJSTable;
            }

            delete self.EditorDataTableOptions.ajax;
            delete self.EditorDataTableOptions.data;
            delete self.EditorDataTableOptions.columns;
            $(self.$tableHTML[i]).empty();
          } else {
            if ($.fn.DataTable.isDataTable($(self.$tableHTML[i]))) {
              try {
                $(self.$tableHTML[i]).DataTable().clear().destroy();
              } catch (e) {// Leave the error alone. Nothing to display
              }

              $(self.$tableHTML[i]).empty();
            } // Reset Options


            delete self.EditorDataTableOptions.ajax;
            delete self.EditorDataTableOptions.data;
            delete self.EditorDataTableOptions.aaData;
            delete self.EditorDataTableOptions.columns;
            delete self.EditorDataTableOptions.aoColumns;
          }
        }
      });
    };

    self.convertData = function () {
      var convertData = apos.schemas.findFieldset(self.$form, 'data').find('textarea');

      if (convertData.length > 0) {
        convertData.val(JSON5.stringify({
          data: self.rowData,
          columns: self.columnData
        }, {
          space: 2
        }));
        self.executeAutoResize(convertData.get(0));
      }
    };

    self.getFields = function (query, callback) {
      return $.get('/modules/dynamic-table/get-fields', query, function (data) {
        if (data.status === 'success') {
          return callback(null, data.message);
        }

        return callback(data.message);
      });
    };

    self.updateFields = function (query, callback) {
      return apos.modules['dynamic-table'].api('update-fields', query, function (data) {
        if (data.status === 'success') {
          return callback(null, data.message);
        }

        return callback(data.message);
      });
    };

    self.removeUrls = function (query, callback) {
      return apos.modules['dynamic-table'].api('remove-urls', query, function (data) {
        if (data.status === 'success') {
          return callback(null, data.message);
        }

        return callback(data.message);
      });
    };

    self.getResultAndInitTable = function (ajaxResult) {
      // Loop ajaxResult object
      for (var _i = 0, _Object$keys = Object.keys(ajaxResult); _i < _Object$keys.length; _i++) {
        var property = _Object$keys[_i];

        if (ajaxResult.hasOwnProperty(property)) {
          switch (property) {
            case 'ajaxOptions':
              try {
                self.executeAjax(JSON5.parse(ajaxResult[property]));
              } catch (e) {// Leave the error alone
              }

              break;

            case 'data':
              try {
                self.updateRowsAndColumns(JSON5.parse(ajaxResult[property]));
              } catch (e) {// Leave the error alone
              }

              break;
          }
        }
      } // Start the table


      self.initTable();
    };

    self.beforeSave = function (callback) {
      // Should always return callback null. Because if you put an error to it, it will never be save.
      // We don't want that
      if (self.getChoiceId !== self.getNewChoiceId && self.getChoiceId) {
        // Update previous piece
        return self.removeUrls({
          id: self.getChoiceId,
          url: window.location.pathname
        }, function (err) {
          if (err) {
            apos.utils.warn('Cannot remove url on previous piece');
          } // Update latest piece


          return self.updateFields({
            id: self.getNewChoiceId,
            url: window.location.pathname
          }, function (err) {
            if (err) {
              apos.utils.warn('Unable to update new piece save');
              return callback(null);
            } // reset choice value


            self.getChoiceId = self.getNewChoiceId;
            return callback(null);
          });
        });
      } else if (self.getNewChoiceId && !self.getChoiceId) {
        // Update latest piece
        return self.updateFields({
          id: self.getNewChoiceId,
          url: window.location.pathname
        }, function (err) {
          if (err) {
            apos.utils.warn('Unable to update new piece save');
            return callback(null);
          } // reset choice value


          self.getChoiceId = self.getNewChoiceId;
          return callback(null);
        });
      }

      return callback(null);
    };

    self.allListener = function () {
      apos.on('widgetTrashed', function ($widget) {
        if ($widget.data() && $widget.data().aposWidget === 'dynamic-table') {
          var pieceId = apos.modules['dynamic-table-widgets'].getData($widget).dynamicTableId;
          self.removeUrls({
            id: pieceId,
            url: window.location.pathname
          }, function (err) {
            if (err) {
              return apos.utils.warn('Unable to remove widget location.');
            }

            return apos.utils.log('Successful remove widget location.');
          });
        }
      });
    };

    self.getJoin = function ($chooser) {
      var superAfterManagerSave = $chooser.afterManagerSave;
      var superAfterManagerCancel = $chooser.afterManagerCancel;
      self.getChoiceId = undefined;
      self.getNewChoiceId = undefined; // Destroy table and its options first to avoid DataTablesJQuery Problem

      self.destroyTable();

      if ($chooser.choices.length > 0) {
        self.getChoiceId = $chooser.choices[0].value;
      }

      if (self.getChoiceId) {
        // Get fields first and start
        self.getFields({
          id: self.getChoiceId
        }, function (err, result) {
          if (err) {
            // Reset self.getChoiceId
            self.getChoiceId = undefined;
            return apos.utils.warn('Unable to get the table piece. Are you sure it saves correctly ?');
          }

          return self.getResultAndInitTable(result);
        });
      }

      $chooser.afterManagerSave = function () {
        superAfterManagerSave(); // Refresh Form

        self.$form = $chooser.$choices.parent().parent().parent();
        self.getNewChoiceId = $chooser.choices[0].value; // Destroy table before reinitialization

        self.destroyTable(); // Get field first

        return self.getFields({
          id: self.getNewChoiceId
        }, function (err, result) {
          if (err) {
            return apos.utils.warn('Dynamic Table Piece not found');
          }

          return self.getResultAndInitTable(result);
        });
      };

      $chooser.afterManagerCancel = function () {
        superAfterManagerCancel();
        self.destroyTable();

        if ($chooser.choices.length > 0) {
          self.getChoiceId = $chooser.choices[0].value;
          return self.getFields({
            id: self.getChoiceId
          }, function (err, result) {
            if (err) {
              return apos.utils.warn('Dynamic Table Piece not found');
            }

            return self.getResultAndInitTable(result);
          });
        }
      };
    }; // Any table event is allowed


    self.registerTableEvent = function ($table) {};

    self.changeTabRebuildTable = function (element) {
      if (apos.assets.options.lean) {
        // Destroy first
        if (apos.schemas.dt.vanillaJSTable) {
          if (!apos.schemas.dt.settings.ajax && apos.schemas.dt.vanillaJSTable.options.ajax) {
            delete apos.schemas.dt.vanillaJSTable.options.ajax;
            delete apos.schemas.dt.vanillaJSTable.options.load;
            delete apos.schemas.dt.vanillaJSTable.options.content;
          } // Always delete data and clear datatables


          delete apos.schemas.dt.vanillaJSTable.options.data;
          apos.schemas.dt.vanillaJSTable.clear();

          try {
            apos.schemas.dt.vanillaJSTable.destroy();
          } catch (e) {// Leave the error alone. Nothing to display
          }

          delete apos.schemas.dt.vanillaJSTable;
        } // Always convert


        if (apos.schemas.dt.settings.data && apos.schemas.dt.settings.columns) {
          var data = apos.schemas.dt.settings.data;
          var columns = apos.schemas.dt.settings.columns;
          var obj = {
            headings: [],
            data: data
          };
          obj.headings = columns.reduce(function (init, next, i, arr) {
            return init.concat(next.title);
          }, []);
        } // Empty the table to reinitialization


        $(element).empty(); // Append the table clone node

        $(element).append(apos.schemas.dt.getTable.cloneNode());
        apos.schemas.dt.vanillaJSTable = new _simpleDatatables["default"](element.querySelector('#dynamicTable'), apos.schemas.dt.settings.ajax ? apos.schemas.dt.settings : {
          data: obj
        }); // Apply Event

        self.registerTableEvent(apos.schemas.dt.vanillaJSTable);
      } else {
        // If the table use DataTablesJS, destroy it first
        if ($.fn.DataTable.isDataTable($(element).find('#dynamicTable'))) {
          try {
            $(element).find('#dynamicTable').DataTable().clear().destroy();
          } catch (error) {// Leave the error alone. Nothing to display
          }
        } // Delete additional data on options when initialized


        delete apos.schemas.dt.settings.aaData;
        delete apos.schemas.dt.settings.aoColumns; // Empty the table to reinitialization

        $(element).empty(); // Append the table clone node

        $(element).append(apos.schemas.dt.getTable.cloneNode());

        try {
          // Try if success
          $(element).find('#dynamicTable').DataTable(apos.schemas.dt.settings); // Apply Event

          self.registerTableEvent($(element).find('#dynamicTable'));
        } catch (e) {
          // If not, destroy it ! It will output a console error and the table won't even respond
          // on change input for row & column
          $(element).find('#dynamicTable').DataTable().clear(); // Just remove dataTable class

          $(element).find('#dynamicTable').removeClass('dataTable');
        }
      }
    }; // To always send the data that has schema type of array


    self.arrayFieldsArrange = function (arrayItems, fieldName) {
      // Just pass the array items from rowData & columnData
      var config = {
        delimiter: self.tableDelimiter
      };

      if (self.tableEscapeChar) {
        config.escapeChar = self.tableEscapeChar;
      }

      switch (fieldName) {
        case 'adjustRow':
          for (var row = 0; row < self.rowData.length; row++) {
            // Always replace value and re-edit id
            arrayItems[row] = {
              id: apos.utils.generateId(),
              rowContent: Papa.unparse(self.rowData, {
                newLine: '\r\n',
                quotes: true
              }).split('\r\n').map(function (val) {
                return val.replace(/(",")/g, '|').replace(/(^")|("$)/g, '').replace(/,/g, '","').replace(/\|/g, ',');
              })[row] // Chaining replace due to Papa Unparse bug where '\",\"' is become ',' on very first row
              // While ',' is become '\",\"'
              // So in order to fix that, we have to replace so many string

            };
          }

          break;

        case 'adjustColumn':
          for (var _column = 0; _column < self.columnData.length; _column++) {
            arrayItems[_column] = {
              id: apos.utils.generateId(),
              columnContent: self.columnData[_column].title
            };
          }

          break;

        default:
          // eslint-disable-next-line no-self-assign
          arrayItems = arrayItems;
          break;
      }

      return arrayItems;
    };

    self.updateFromArrayFields = function (arrayItems, fieldName) {
      // Just pass the array items from rowData & columnData
      var config = {
        delimiter: self.tableDelimiter
      };

      if (self.tableEscapeChar) {
        config.escapeChar = self.tableEscapeChar;
      }

      switch (fieldName) {
        case 'adjustRow':
          for (var row = 0; row < arrayItems.length; row++) {
            // Tough parsing but it works !
            self.rowData[row] = Papa.parse(arrayItems[row].rowContent, {
              escapeChar: self.tableEscapeChar || '"',
              transform: function transform(value) {
                var store = value; // Replace the quote value to normal

                store = store.replace(new RegExp("\\\\([\\s\\S])|(".concat(self.tableEscapeChar || '"', ")"), 'g'), '$1');
                return store;
              }
            }).data[0];
          }

          break;

        case 'adjustColumn':
          for (var column = 0; column < arrayItems.length; column++) {
            self.columnData.map(function (value, i, arr) {
              // In Column, there will be an object, so loop it !
              for (var _i2 = 0, _Object$keys2 = Object.keys(value); _i2 < _Object$keys2.length; _i2++) {
                var property = _Object$keys2[_i2];

                if (value.hasOwnProperty(property)) {
                  // Make sure its on same array
                  if (i === column) {
                    value[property] = arrayItems[column].columnContent;
                  }
                }
              }

              return value;
            });
          }

          break;
      }

      if (self.rowData.length > 0 && self.columnData.length > 0) {
        // Update to make convert enabled
        self.updateRowsAndColumns();
      } // If no rowData and ColumnData at all, must be the ajax. If not, just do nothing


      if (self.$ajaxOptions.find('textarea').val().length > 0 && self.rowData.length === 0 && self.columnData.length === 0) {
        self.$ajaxOptions.trigger('change');
      }

      if (self.$ajaxOptions.find('textarea').val().length === 0 && self.rowData.length > 0 && self.columnData.length > 0) {
        self.$ajaxOptions.find('textarea').val('');
      }
    }; // End of Utils

  }
});

},{"simple-datatables":2}]},{},[3]);
