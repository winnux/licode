var CryptoJS=CryptoJS||function(g,i){var d={},a=d.lib={},c=a.Base=function(){function e(){}return{extend:function(b){e.prototype=this;var a=new e;b&&a.mixIn(b);a.$super=this;return a},create:function(){var e=this.extend();e.init.apply(e,arguments);return e},init:function(){},mixIn:function(e){for(var b in e)e.hasOwnProperty(b)&&(this[b]=e[b]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.$super.extend(this)}}}(),n=a.WordArray=c.extend({init:function(e,b){e=
this.words=e||[];this.sigBytes=b!=i?b:4*e.length},toString:function(e){return(e||h).stringify(this)},concat:function(e){var b=this.words,a=e.words,f=this.sigBytes,e=e.sigBytes;this.clamp();if(f%4)for(var c=0;c<e;c++)b[f+c>>>2]|=(a[c>>>2]>>>24-8*(c%4)&255)<<24-8*((f+c)%4);else if(65535<a.length)for(c=0;c<e;c+=4)b[f+c>>>2]=a[c>>>2];else b.push.apply(b,a);this.sigBytes+=e;return this},clamp:function(){var e=this.words,b=this.sigBytes;e[b>>>2]&=4294967295<<32-8*(b%4);e.length=g.ceil(b/4)},clone:function(){var e=
c.clone.call(this);e.words=this.words.slice(0);return e},random:function(e){for(var b=[],a=0;a<e;a+=4)b.push(4294967296*g.random()|0);return n.create(b,e)}}),j=d.enc={},h=j.Hex={stringify:function(e){for(var b=e.words,e=e.sigBytes,a=[],c=0;c<e;c++){var f=b[c>>>2]>>>24-8*(c%4)&255;a.push((f>>>4).toString(16));a.push((f&15).toString(16))}return a.join("")},parse:function(e){for(var b=e.length,a=[],c=0;c<b;c+=2)a[c>>>3]|=parseInt(e.substr(c,2),16)<<24-4*(c%8);return n.create(a,b/2)}},m=j.Latin1={stringify:function(b){for(var a=
b.words,b=b.sigBytes,c=[],f=0;f<b;f++)c.push(String.fromCharCode(a[f>>>2]>>>24-8*(f%4)&255));return c.join("")},parse:function(b){for(var a=b.length,c=[],f=0;f<a;f++)c[f>>>2]|=(b.charCodeAt(f)&255)<<24-8*(f%4);return n.create(c,a)}},b=j.Utf8={stringify:function(b){try{return decodeURIComponent(escape(m.stringify(b)))}catch(a){throw Error("Malformed UTF-8 data");}},parse:function(b){return m.parse(unescape(encodeURIComponent(b)))}},f=a.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=n.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=b.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(b){var a=this._data,c=a.words,f=a.sigBytes,h=this.blockSize,j=f/(4*h),j=b?g.ceil(j):g.max((j|0)-this._minBufferSize,0),b=j*h,f=g.min(4*b,f);if(b){for(var d=0;d<b;d+=h)this._doProcessBlock(c,d);d=c.splice(0,b);a.sigBytes-=f}return n.create(d,f)},clone:function(){var b=c.clone.call(this);b._data=this._data.clone();return b},_minBufferSize:0});a.Hasher=f.extend({init:function(){this.reset()},
reset:function(){f.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);this._doFinalize();return this._hash},clone:function(){var b=f.clone.call(this);b._hash=this._hash.clone();return b},blockSize:16,_createHelper:function(b){return function(a,c){return b.create(c).finalize(a)}},_createHmacHelper:function(b){return function(a,c){return p.HMAC.create(b,c).finalize(a)}}});var p=d.algo={};return d}(Math);
(function(){var g=CryptoJS,i=g.lib,d=i.WordArray,i=i.Hasher,a=[],c=g.algo.SHA1=i.extend({_doReset:function(){this._hash=d.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(c,d){for(var h=this._hash.words,g=h[0],b=h[1],f=h[2],i=h[3],e=h[4],k=0;80>k;k++){if(16>k)a[k]=c[d+k]|0;else{var l=a[k-3]^a[k-8]^a[k-14]^a[k-16];a[k]=l<<1|l>>>31}l=(g<<5|g>>>27)+e+a[k];l=20>k?l+((b&f|~b&i)+1518500249):40>k?l+((b^f^i)+1859775393):60>k?l+((b&f|b&i|f&i)-1894007588):l+((b^f^i)-
899497514);e=i;i=f;f=b<<30|b>>>2;b=g;g=l}h[0]=h[0]+g|0;h[1]=h[1]+b|0;h[2]=h[2]+f|0;h[3]=h[3]+i|0;h[4]=h[4]+e|0},_doFinalize:function(){var a=this._data,c=a.words,h=8*this._nDataBytes,d=8*a.sigBytes;c[d>>>5]|=128<<24-d%32;c[(d+64>>>9<<4)+15]=h;a.sigBytes=4*c.length;this._process()}});g.SHA1=i._createHelper(c);g.HmacSHA1=i._createHmacHelper(c)})();
(function(){var g=CryptoJS,i=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(d,a){d=this._hasher=d.create();"string"==typeof a&&(a=i.parse(a));var c=d.blockSize,g=4*c;a.sigBytes>g&&(a=d.finalize(a));for(var j=this._oKey=a.clone(),h=this._iKey=a.clone(),m=j.words,b=h.words,f=0;f<c;f++)m[f]^=1549556828,b[f]^=909522486;j.sigBytes=h.sigBytes=g;this.reset()},reset:function(){var d=this._hasher;d.reset();d.update(this._iKey)},update:function(d){this._hasher.update(d);return this},finalize:function(d){var a=
this._hasher,d=a.finalize(d);a.reset();return a.finalize(this._oKey.clone().concat(d))}})})();var N=N||{};N.authors=["aalonsog@dit.upm.es","prodriguez@dit.upm.es","jcervino@dit.upm.es"];N.version=0.1;N=N||{};
N.Base64=function(){var g,i,d,a,c,n,j,h,m;g="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,+,/".split(",");i=[];for(c=0;c<g.length;c+=1)i[g[c]]=c;n=function(b){d=b;a=0};j=function(){var b;if(!d||a>=d.length)return-1;b=d.charCodeAt(a)&255;a+=1;return b};h=function(){if(!d)return-1;for(;;){if(a>=d.length)return-1;var b=d.charAt(a);a+=1;if(i[b])return i[b];if("A"===b)return 0}};m=function(b){b=b.toString(16);1===b.length&&(b=
"0"+b);return unescape("%"+b)};return{encodeBase64:function(b){var a,c,e;n(b);b="";a=Array(3);c=0;for(e=!1;!e&&-1!==(a[0]=j());)if(a[1]=j(),a[2]=j(),b+=g[a[0]>>2],-1!==a[1]?(b+=g[a[0]<<4&48|a[1]>>4],-1!==a[2]?(b+=g[a[1]<<2&60|a[2]>>6],b+=g[a[2]&63]):(b+=g[a[1]<<2&60],b+="=",e=!0)):(b+=g[a[0]<<4&48],b+="=",b+="=",e=!0),c+=4,76<=c)b+="\n",c=0;return b},decodeBase64:function(b){var a,c;n(b);b="";a=Array(4);for(c=!1;!c&&-1!==(a[0]=h())&&-1!==(a[1]=h());)a[2]=h(),a[3]=h(),b+=m(a[0]<<2&255|a[1]>>4),-1!==
a[2]?(b+=m(a[1]<<4&255|a[2]>>2),-1!==a[3]?b+=m(a[2]<<6&255|a[3]):c=!0):c=!0;return b}}}(N);N=N||{};
N.API=function(g){var i,d;i=function(a,c,i,j,h,m,b){var f,p,e,k,l,o;void 0===h?(f=g.API.params.service,p=g.API.params.key,j=g.API.params.url+j):(f=h.service,p=h.key,j=h.url+j);""===f||""===p?console.log("ServiceID and Key are required!!"):(h=(new Date).getTime(),e=Math.floor(99999*Math.random()),k=h+","+e,l="MAuth realm=http://marte3.dit.upm.es,mauth_signature_method=HMAC_SHA1",""!==m&&""!==b&&(l=l+",mauth_username="+m+",mauth_role="+b,k+=","+m+","+b),m=d(k,p),l=l+",mauth_serviceid="+f+",mauth_cnonce="+e+
",mauth_timestamp="+h+",mauth_signature="+m,o=new XMLHttpRequest,o.onreadystatechange=function(){o.readyState===4&&a(o.responseText)},o.open(c,j,!0),o.setRequestHeader("Authorization",l),o.setRequestHeader("Content-Type","application/json"),o.send(JSON.stringify(i)))};d=function(a,c){var d;d=CryptoJS.HmacSHA1(a,c).toString(CryptoJS.enc.Hex);return g.Base64.encodeBase64(d)};return{params:{service:void 0,key:void 0,url:void 0},init:function(a,c){g.API.params.service=a;g.API.params.key=c;g.API.params.url=
"http://chotis2.dit.upm.es:3000/"},createRoom:function(a,c,d,g){i(function(a){a=JSON.parse(a);c(a)},"POST",{name:a,options:d},"rooms",g)},getRooms:function(a,c){i(a,"GET",void 0,"rooms",c)},getRoom:function(a,c,d){i(c,"GET",void 0,"rooms/"+a,d)},deleteRoom:function(a,c,d){i(c,"DELETE",void 0,"rooms/"+a,d)},createToken:function(a,c,d,g,h){i(g,"POST",void 0,"rooms/"+a+"/tokens",h,c,d)},createService:function(a,c,d,g){i(d,"POST",{name:a,key:c},"services/",g)},getServices:function(a,c){i(a,"GET",void 0,
"services/",c)},getService:function(a,c,d){i(c,"GET",void 0,"services/"+a,d)},deleteService:function(a,c,d){i(c,"DELETE",void 0,"services/"+a,d)},getUsers:function(a,c,d){i(c,"GET",void 0,"rooms/"+a+"/users/",d)},getUser:function(a,c,d,g){i(d,"GET",void 0,"rooms/"+a+"/users/"+c,g)},deleteUser:function(a,c,d){i(d,"DELETE",void 0,"rooms/"+a+"/users/"+c)}}}(N);