var bubba=function(a,b){var c=bubba.resolve(a,b||"/"),d=bubba.modules[c];if(!d)throw new Error("Failed to resolve module "+a+", tried "+c);var e=d._cached?d._cached:d();return e};bubba.paths=[],bubba.modules={},bubba.extensions=[".js",".coffee"],bubba._core={assert:!0,events:!0,fs:!0,path:!0,vm:!0},bubba.resolve=function(){return function(a,b){function g(a){if(bubba.modules[a])return a;for(var b=0;b<bubba.extensions.length;b++){var c=bubba.extensions[b];if(bubba.modules[a+c])return a+c}}function h(a){a=a.replace(/\/+$/,"");var b=a+"/package.json";if(bubba.modules[b]){var d=bubba.modules[b](),e=d.browserify;if(typeof e=="object"&&e.main){var f=g(c.resolve(a,e.main));if(f)return f}else if(typeof e=="string"){var f=g(c.resolve(a,e));if(f)return f}else if(d.main){var f=g(c.resolve(a,d.main));if(f)return f}}return g(a+"/index")}function i(a,b){var c=j(b);for(var d=0;d<c.length;d++){var e=c[d],f=g(e+"/"+a);if(f)return f;var i=h(e+"/"+a);if(i)return i}var f=g(a);if(f)return f}function j(a){var b;a==="/"?b=[""]:b=c.normalize(a).split("/");var d=[];for(var e=b.length-1;e>=0;e--){if(b[e]==="node_modules")continue;var f=b.slice(0,e+1).join("/")+"/node_modules";d.push(f)}return d}b||(b="/");if(bubba._core[a])return a;var c=bubba.modules.path(),d=b||".";if(a.match(/^(?:\.\.?\/|\/)/)){var e=g(c.resolve(d,a))||h(c.resolve(d,a));if(e)return e}var f=i(a,d);if(f)return f;throw new Error("Cannot find module '"+a+"'")}}(),bubba.alias=function(a,b){var c=bubba.modules.path(),d=null;try{d=bubba.resolve(a+"/package.json","/")}catch(e){d=bubba.resolve(a,"/")}var f=c.dirname(d),g=(Object.keys||function(a){var b=[];for(var c in a)b.push(c);return b})(bubba.modules);for(var h=0;h<g.length;h++){var i=g[h];if(i.slice(0,f.length+1)===f+"/"){var j=i.slice(f.length);bubba.modules[b+j]=bubba.modules[f+j]}else i===f&&(bubba.modules[b]=bubba.modules[f])}},bubba.define=function(a,b){var c=bubba._core[a]?"":bubba.modules.path().dirname(a),d=function(a){return bubba(a,c)};d.resolve=function(a){return bubba.resolve(a,c)},d.modules=bubba.modules,d.define=bubba.define;var e={exports:{}};bubba.modules[a]=function(){return bubba.modules[a]._cached=e.exports,b.call(e.exports,d,e,e.exports,c,a),bubba.modules[a]._cached=e.exports,e.exports}},typeof process=="undefined"&&(process={}),process.nextTick||(process.nextTick=function(){var a=[],b=typeof window!="undefined"&&window.postMessage&&window.addEventListener;return b&&window.addEventListener("message",function(b){if(b.source===window&&b.data==="browserify-tick"){b.stopPropagation();if(a.length>0){var c=a.shift();c()}}},!0),function(c){b?(a.push(c),window.postMessage("browserify-tick","*")):setTimeout(c,0)}}()),process.title||(process.title="browser"),process.binding||(process.binding=function(a){if(a==="evals")return bubba("vm");throw new Error("No such module")}),process.cwd||(process.cwd=function(){return"."}),bubba.define("path",function(a,b,c,d,e){function f(a,b){var c=[];for(var d=0;d<a.length;d++)b(a[d],d,a)&&c.push(a[d]);return c}function g(a,b){var c=0;for(var d=a.length;d>=0;d--){var e=a[d];e=="."?a.splice(d,1):e===".."?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c--;c)a.unshift("..");return a}var h=/^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;c.resolve=function(){var a="",b=!1;for(var c=arguments.length;c>=-1&&!b;c--){var d=c>=0?arguments[c]:process.cwd();if(typeof d!="string"||!d)continue;a=d+"/"+a,b=d.charAt(0)==="/"}return a=g(f(a.split("/"),function(a){return!!a}),!b).join("/"),(b?"/":"")+a||"."},c.normalize=function(a){var b=a.charAt(0)==="/",c=a.slice(-1)==="/";return a=g(f(a.split("/"),function(a){return!!a}),!b).join("/"),!a&&!b&&(a="."),a&&c&&(a+="/"),(b?"/":"")+a},c.join=function(){var a=Array.prototype.slice.call(arguments,0);return c.normalize(f(a,function(a,b){return a&&typeof a=="string"}).join("/"))},c.dirname=function(a){var b=h.exec(a)[1]||"",c=!1;return b?b.length===1||c&&b.length<=3&&b.charAt(1)===":"?b:b.substring(0,b.length-1):"."},c.basename=function(a,b){var c=h.exec(a)[2]||"";return b&&c.substr(-1*b.length)===b&&(c=c.substr(0,c.length-b.length)),c},c.extname=function(a){return h.exec(a)[3]||""}}),bubba.define("/lib/qrcode-draw.js",function(a,b,c,d,e){function i(){}var f=a("./qrcode.js"),g=a("./qrcapacitytable.js").QRCapacityTable,h=f.QRCode;c.QRCodeDraw=i,c.QRVersionCapacityTable=g,c.QRErrorCorrectLevel=f.QRErrorCorrectLevel,c.QRCode=f.QRCode,i.prototype={scale:4,defaultMargin:20,marginScaleFactor:5,Array:typeof Uint32Array=="undefined"?Uint32Array:Array,errorBehavior:{length:"trim"},color:{dark:"black",light:"white"},defaultErrorCorrectLevel:f.QRErrorCorrectLevel.H,QRErrorCorrectLevel:f.QRErrorCorrectLevel,draw:function(a,b,c,d){var e,g,h=Array.prototype.slice.call(arguments);d=h.pop(),a=h.shift(),b=h.shift(),c=h.shift()||{};if(typeof d!="function")throw new Error("callback bubbad");typeof c!="object"&&(c.errorCorrectLevel=c),this.QRVersion(b,c.errorCorrectLevel||this.QRErrorCorrectLevel.H,c.version,function(a,c,d,f){b=c,e=d,g=a,errorCorrectLevel=f}),this.scale=c.scale||this.scale,this.margin=c.margin||this.scale*2;if(!e){d(g,a);return}try{var i=new f.QRCode(e,errorCorrectLevel),j=this.scale||4,k=a.getContext("2d"),l=0;i.addData(b),i.make();var m=this.marginWidth(),n=m;l=this.dataWidth(i)+m*2,this.resetCanvas(a,k,l);for(var o=0,p=i.getModuleCount();o<p;o++){var q=m;for(var r=0,s=i.getModuleCount();r<s;r++)i.isDark(o,r)?(k.fillStyle=this.color.dark,k.fillRect(q,n,j,j)):this.color.light&&(k.fillStyle=this.color.light,k.fillRect(q,n,j,j)),q+=j;n+=j}}catch(t){g=t}d(g,a,l)},drawBitArray:function(a){var b=Array.prototype.slice.call(arguments),c=b.pop(),a=b.shift(),d=b.shift(),e=b.shift()||{};if(typeof c!="function")throw new Error("callback bubbad as last argument");c=arguments[arguments.length-1],arguments.length>2&&(d=arguments[2]),this.QRVersion(a,d,(e||{}).version,function(b,c,e,f){a=c,level=e,error=b,d=f});if(!level){c(error,[],0);return}try{var g=new f.QRCode(level,d),h=this.scale||4,i=0,j,k=0,l=0;g.addData(a),g.make(),i=this.dataWidth(g,1),j=new this.Array(i*i);for(var m=0,n=g.getModuleCount();m<n;m++)for(var o=0,p=g.getModuleCount();o<p;o++)g.isDark(m,o)?j[k]=1:j[k]=0,k++}catch(q){error=q,console.log(q.stack)}c(error,j,i)},QRVersion:function(a,b,c,d){var e=a.length,f,b=this.QRErrorCorrectLevel[b]||this.defaultErrorCorrectLevel,h=[1,0,3,2],i=["L","M","Q","H"],j=0,k=!1;typeof c!="undefined"&&c!==null&&(k=!0);if(k)console.log("SPECIFIED VERSION! ",c),j=g[c][h[b]];else{for(var l=0,m=g.length;l<m;l++){j=g[l][h[b]];if(e<g[l][h[b]]){c=l+1;break}}c||(c=g.length-1)}return j<e&&(this.errorBehavior.length=="trim"?(a=a.substr(0,j),level=g.length):f=new Error("input string too long for error correction "+i[h[b]]+" max length "+j+" for qrcode version "+c)),d&&d(f,a,c,b),c},marginWidth:function(){var a=this.defaultMargin;return this.scale=this.scale||4,this.scale*this.marginScaleFactor>a&&(a=this.scale*this.marginScaleFactor),a},dataWidth:function(a,b){return a.getModuleCount()*(b||this.scale||4)},resetCanvas:function(a,b,c){b.clearRect(0,0,a.width,a.height),a.style||(a.style={}),a.style.height=a.height=c,a.style.width=a.width=c,this.color.light?(b.fillStyle=this.color.light,b.fillRect(0,0,a.width,a.height)):b.clearRect(0,0,a.width,a.height)}}}),bubba.define("/lib/qrcode.js",function(a,b,c,d,e){function g(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=new f}function h(a){this.mode=i.MODE_8BIT_BYTE,this.data=a}function o(a,b){if(a.length==undefined)throw new Error(a.length+"/"+b);var c=0;while(c<a.length&&a[c]==0)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function p(a,b){this.totalCount=a,this.dataCount=b}function q(){this.buffer=new Array,this.length=0}c.QRCode=g;var f=typeof Uint32Array=="undefined"?Uint32Array:Array;g.prototype={addData:function(a){var b=new h(a);this.dataList.push(b),this.dataCache=null},isDark:function(a,b){if(a<0||this.moduleCount<=a||b<0||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,b){this.moduleCount=this.typeNumber*4+17,this.modules=new f(this.moduleCount);for(var c=0;c<this.moduleCount;c++){this.modules[c]=new f(this.moduleCount);for(var d=0;d<this.moduleCount;d++)this.modules[c][d]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(a,b),this.typeNumber>=7&&this.setupTypeNumber(a),this.dataCache==null&&(this.dataCache=g.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,b)},setupPositionProbePattern:function(a,b){for(var c=-1;c<=7;c++){if(a+c<=-1||this.moduleCount<=a+c)continue;for(var d=-1;d<=7;d++){if(b+d<=-1||this.moduleCount<=b+d)continue;0<=c&&c<=6&&(d==0||d==6)||0<=d&&d<=6&&(c==0||c==6)||2<=c&&c<=4&&2<=d&&d<=4?this.modules[a+c][b+d]=!0:this.modules[a+c][b+d]=!1}}},getBestMaskPattern:function(){var a=0,b=0;for(var c=0;c<8;c++){this.makeImpl(!0,c);var d=l.getLostPoint(this);if(c==0||a>d)a=d,b=c}return b},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++){if(this.modules[a][6]!=null)continue;this.modules[a][6]=a%2==0}for(var b=8;b<this.moduleCount-8;b++){if(this.modules[6][b]!=null)continue;this.modules[6][b]=b%2==0}},setupPositionAdjustPattern:function(){var a=l.getPatternPosition(this.typeNumber);a=a||"";for(var b=0;b<a.length;b++)for(var c=0;c<a.length;c++){var d=a[b],e=a[c];if(this.modules[d][e]!=null)continue;for(var f=-2;f<=2;f++)for(var g=-2;g<=2;g++)f==-2||f==2||g==-2||g==2||f==0&&g==0?this.modules[d+f][e+g]=!0:this.modules[d+f][e+g]=!1}},setupTypeNumber:function(a){var b=l.getBCHTypeNumber(this.typeNumber);for(var c=0;c<18;c++){var d=!a&&(b>>c&1)==1;this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3]=d}for(var c=0;c<18;c++){var d=!a&&(b>>c&1)==1;this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)]=d}},setupTypeInfo:function(a,b){var c=this.errorCorrectLevel<<3|b,d=l.getBCHTypeInfo(c);for(var e=0;e<15;e++){var f=!a&&(d>>e&1)==1;e<6?this.modules[e][8]=f:e<8?this.modules[e+1][8]=f:this.modules[this.moduleCount-15+e][8]=f}for(var e=0;e<15;e++){var f=!a&&(d>>e&1)==1;e<8?this.modules[8][this.moduleCount-e-1]=f:e<9?this.modules[8][15-e-1+1]=f:this.modules[8][15-e-1]=f}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,b){var c=-1,d=this.moduleCount-1,e=7,f=0;for(var g=this.moduleCount-1;g>0;g-=2){g==6&&g--;for(;;){for(var h=0;h<2;h++)if(this.modules[d][g-h]==null){var i=!1;f<a.length&&(i=(a[f]>>>e&1)==1);var j=l.getMask(b,d,g-h);j&&(i=!i),this.modules[d][g-h]=i,e--,e==-1&&(f++,e=7)}d+=c;if(d<0||this.moduleCount<=d){d-=c,c=-c;break}}}}},g.PAD0=236,g.PAD1=17,g.createData=function(a,b,c){var d=p.getRSBlocks(a,b),e=new q;for(var f=0;f<c.length;f++){var h=c[f];e.put(h.mode,4),e.put(h.getLength(),l.getLengthInBits(h.mode,a)),h.write(e)}var i=0;for(var f=0;f<d.length;f++)i+=d[f].dataCount;if(e.getLengthInBits()>i*8)throw new Error("code length overflow. ("+e.getLengthInBits()+">"+i*8+")");e.getLengthInBits()+4<=i*8&&e.put(0,4);while(e.getLengthInBits()%8!=0)e.putBit(!1);for(;;){if(e.getLengthInBits()>=i*8)break;e.put(g.PAD0,8);if(e.getLengthInBits()>=i*8)break;e.put(g.PAD1,8)}return g.createBytes(e,d)},g.createBytes=function(a,b){var c=0,d=0,e=0,g=new f(b.length),h=new f(b.length);for(var i=0;i<b.length;i++){var j=b[i].dataCount,k=b[i].totalCount-j;d=Math.max(d,j),e=Math.max(e,k),g[i]=new f(j);for(var m=0;m<g[i].length;m++)g[i][m]=255&a.buffer[m+c];c+=j;var n=l.getErrorCorrectPolynomial(k),p=new o(g[i],n.getLength()-1),q=p.mod(n);h[i]=new f(n.getLength()-1);for(var m=0;m<h[i].length;m++){var r=m+q.getLength()-h[i].length;h[i][m]=r>=0?q.get(r):0}}var s=0;for(var m=0;m<b.length;m++)s+=b[m].totalCount;var t=new f(s),u=0;for(var m=0;m<d;m++)for(var i=0;i<b.length;i++)m<g[i].length&&(t[u++]=g[i][m]);for(var m=0;m<e;m++)for(var i=0;i<b.length;i++)m<h[i].length&&(t[u++]=h[i][m]);return t},h.prototype={getLength:function(a){return this.data.length},write:function(a){for(var b=0;b<this.data.length;b++)a.put(this.data.charCodeAt(b),8)}};var i={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},j=c.QRErrorCorrectLevel={L:1,M:0,Q:3,H:2},k={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},l={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){var b=a<<10;while(l.getBCHDigit(b)-l.getBCHDigit(l.G15)>=0)b^=l.G15<<l.getBCHDigit(b)-l.getBCHDigit(l.G15);return(a<<10|b)^l.G15_MASK},getBCHTypeNumber:function(a){var b=a<<12;while(l.getBCHDigit(b)-l.getBCHDigit(l.G18)>=0)b^=l.G18<<l.getBCHDigit(b)-l.getBCHDigit(l.G18);return a<<12|b},getBCHDigit:function(a){var b=0;while(a!=0)b++,a>>>=1;return b},getPatternPosition:function(a){return l.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case k.PATTERN000:return(b+c)%2==0;case k.PATTERN001:return b%2==0;case k.PATTERN010:return c%3==0;case k.PATTERN011:return(b+c)%3==0;case k.PATTERN100:return(Math.floor(b/2)+Math.floor(c/3))%2==0;case k.PATTERN101:return b*c%2+b*c%3==0;case k.PATTERN110:return(b*c%2+b*c%3)%2==0;case k.PATTERN111:return(b*c%3+(b+c)%2)%2==0;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){var b=new o([1],0);for(var c=0;c<a;c++)b=b.multiply(new o([1,m.gexp(c)],0));return b},getLengthInBits:function(a,b){if(1<=b&&b<10)switch(a){case i.MODE_NUMBER:return 10;case i.MODE_ALPHA_NUM:return 9;case i.MODE_8BIT_BYTE:return 8;case i.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(b<27)switch(a){case i.MODE_NUMBER:return 12;case i.MODE_ALPHA_NUM:return 11;case i.MODE_8BIT_BYTE:return 16;case i.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(b<41))throw new Error("type:"+b);switch(a){case i.MODE_NUMBER:return 14;case i.MODE_ALPHA_NUM:return 13;case i.MODE_8BIT_BYTE:return 16;case i.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){var b=a.getModuleCount(),c=0;for(var d=0;d<b;d++)for(var e=0;e<b;e++){var f=0,g=a.isDark(d,e);for(var h=-1;h<=1;h++){if(d+h<0||b<=d+h)continue;for(var i=-1;i<=1;i++){if(e+i<0||b<=e+i)continue;if(h==0&&i==0)continue;g==a.isDark(d+h,e+i)&&f++}}f>5&&(c+=3+f-5)}for(var d=0;d<b-1;d++)for(var e=0;e<b-1;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++;if(j==0||j==4)c+=3}for(var d=0;d<b;d++)for(var e=0;e<b-6;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;e<b;e++)for(var d=0;d<b-6;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);var k=0;for(var e=0;e<b;e++)for(var d=0;d<b;d++)a.isDark(d,e)&&k++;var l=Math.abs(100*k/b/b-50)/5;return c+=l*10,c}},m={glog:function(a){if(a<1)throw new Error("glog("+a+")");return m.LOG_TABLE[a]},gexp:function(a){while(a<0)a+=255;while(a>=256)a-=255;return m.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)};for(var n=0;n<8;n++)m.EXP_TABLE[n]=1<<n;for(var n=8;n<256;n++)m.EXP_TABLE[n]=m.EXP_TABLE[n-4]^m.EXP_TABLE[n-5]^m.EXP_TABLE[n-6]^m.EXP_TABLE[n-8];for(var n=0;n<255;n++)m.LOG_TABLE[m.EXP_TABLE[n]]=n;o.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){var b=new Array(this.getLength()+a.getLength()-1);for(var c=0;c<this.getLength();c++)for(var d=0;d<a.getLength();d++)b[c+d]^=m.gexp(m.glog(this.get(c))+m.glog(a.get(d)));return new o(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;var b=m.glog(this.get(0))-m.glog(a.get(0)),c=new Array(this.getLength());for(var d=0;d<this.getLength();d++)c[d]=this.get(d);for(var d=0;d<a.getLength();d++)c[d]^=m.gexp(m.glog(a.get(d))+b);return(new o(c,0)).mod(a)}},p.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],p.getRSBlocks=function(a,b){var c=p.getRsBlockTable(a,b);if(c==undefined)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);var d=c.length/3,e=new Array;for(var f=0;f<d;f++){var g=c[f*3+0],h=c[f*3+1],i=c[f*3+2];for(var j=0;j<g;j++)e.push(new p(h,i))}return e},p.getRsBlockTable=function(a,b){switch(b){case j.L:return p.RS_BLOCK_TABLE[(a-1)*4+0];case j.M:return p.RS_BLOCK_TABLE[(a-1)*4+1];case j.Q:return p.RS_BLOCK_TABLE[(a-1)*4+2];case j.H:return p.RS_BLOCK_TABLE[(a-1)*4+3];default:return undefined}},q.prototype={get:function(a){var b=Math.floor(a/8);return(this.buffer[b]>>>7-a%8&1)==1},put:function(a,b){for(var c=0;c<b;c++)this.putBit((a>>>b-c-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}}}),bubba.define("/lib/qrcapacitytable.js",function(a,b,c,d,e){c.QRCapacityTable=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]]}),bubba.define("/qrcodeclient.js",function(a,b,c,d,e){var f=a("./lib/qrcode-draw.js");typeof window!="undefined"&&(window.QRCodeLib=f)}),bubba("/qrcodeclient.js");
