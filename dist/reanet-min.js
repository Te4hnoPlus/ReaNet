var p=this||self;function r(f,k){f=f.split(".");var h=p;f[0]in h||"undefined"==typeof h.execScript||h.execScript("var "+f[0]);for(var l;f.length&&(l=f.shift());)f.length||void 0===k?h[l]&&h[l]!==Object.prototype[l]?h=h[l]:h=h[l]={}:h[l]=k};r("get",function(f,k){y("GET",f,null,k)});function z(f){let k=new XMLHttpRequest;k.open("GET",f,!1);k.send();return k.responseText}r("syncGet",z);r("post",function(f,k,h){y("POST",f,k,h)});function y(f,k,h,l){let q=new XMLHttpRequest;q.open(f,k,1);q.send(h);q.onload=()=>l(q.responseText)}function A(f){return document.getElementById(f)}r("getEl",A);function B(f){return document.createElement(f)}r("newEl",B);let E=B("style");E.innerHTML="template{display:none}";document.head.appendChild(E);
const J=new function(){function f(){this.g=[];this.i=(a,c)=>{for(let b=0;b<this.g.length;b++)this.g[b].i(a,c)};this.add=a=>{this.g.push(a)}}function k(a){let c=a.getAttributeNames(),b=[];for(let d=0;d<c.length;d++){var e=a.getAttribute(c[d]);e=new h(e);e.g&&(e.n=c[d],b.push(e))}0<b.length?(this.g=b,this.i=(d,g)=>{for(let m=0;m<this.g.length;m++){let n=this.g[m];n.i(d,g)&&a.setAttribute(n.n,n.v)}}):this.i=t}function h(a){var c=0,b=a.indexOf("{",c);this.v=a;if(-1<b){this.h=[];this.g={};for(this.l=[];;){b=
a.indexOf("{",c);if(-1==b){this.h.push(a.substring(c));break}this.h.push(a.substring(c,b));c=a.indexOf("}",b);b=a.substring(b+1,c);this.g[b]=b;this.l.push(b);c+=1}this.i=(e,d)=>{let g=!0;for(let m in this.g){let n=w(d?w(e,d):e,m);void 0==n&&(n=m);this.g[m]!=n&&(g=!1,this.g[m]=n)}if(g)return!1;e=this.h[0];for(d=1;d<this.h.length;d++)e+=this.g[this.l[d-1]]+this.h[d];this.v=e;return!0}}else this.i=t}function l(a){let c=a.textContent.trim();-1<c.indexOf("{",0)?(this.h=a,this.g=new h(c),this.i=(b,e)=>
{this.g.i(b,e)&&(this.h.textContent=this.g.v)}):this.i=t}function q(a,c){this.g=[];this.h=c;a.B=a.style.display;a.u=!0;this.add=b=>{this.g.push(b)};this.i=(b,e)=>{if(eval(this.h)){a.u||(a.style.display=a.B,a.u=!0);for(let d=0;d<this.g.length;d++)this.g[d].i(b,e)}else a.u&&(a.style.display="none",a.u=!1)}}function F(a,c){this.h=a;this.g={};this.F=C(u(a.childNodes));c=c.split(":");this.o=c[1];this.l=c[0];this.h.innerHTML="";this.D=b=>{if(b in this.g)return this.g[b];let e=u(this.F),d=new f;d.m=e;d.j=
!1;for(let g=0;g<e.length;g++)v(e[g],d);return this.g[b]=d};this.i=b=>{var e=w(b,this.o);if(e){let d,g;for(g=0;g<e.length;g++){let m=b[this.l];b[this.l]=e[g];d=this.D(g);d.i(b,void 0);b[this.l]=m}for(g=0;g<e.length;g++)if(d=this.g[g],!d.j)for(d.j=!0,b=0;b<d.m.length;b++)this.h.appendChild(d.m[b]);for(e=Object.keys(this.g).length;g<e;g++)if(d=this.g[g],d.j){for(b=0;b<d.m.length;b++)this.h.removeChild(d.m[b]);d.j=!1}}}}function G(a){a=H(a);this.s=a.s;if(a.A)for(let c=0;c<a.A.length;c++)eval(a.A[c].textContent);
this.placeTo=(c,b)=>{let e=A(c);b=D(u(this.s),e,b);b.id=c;return e.G=b}}const t=()=>!1,I=new DOMParser;this.h={};this.g={};this.j=[];this.l=!1;let C=a=>{let c=[];for(let b=0;b<a.length;b++){let e=a[b];(e.childNodes&&e.childNodes.length||"#text"!=e.nodeName||/\S/.test(e.textContent))&&c.push(e)}return c},H=a=>{a=I.parseFromString(a,"text/html");return{A:a.scripts,s:C(a.body.childNodes)}},u=a=>{let c=[];for(let b=0;b<a.length;b++)c.push(a[b].cloneNode(!0));return c},x=(a,c)=>{let b=a.getAttribute(c);
b&&a.removeAttribute(c);return b},v=(a,c)=>{if(a.getAttributeNames){var b=new k(a);b.i&&c.add(b);if(b=x(a,"if"))b=new q(a,b),c.add(b),c=b;if(b=x(a,"sub"))return D(u(this.h[b].s),a,c)}if(a.childNodes&&a.childNodes.length)if(b=x(a,"for"))c.add(new F(a,b));else for(b=0;b<a.childNodes.length;b++)v(a.childNodes[b],c);else/\S/.test(a.textContent)&&(a=new l(a),a.i!=t&&c.add(a))},w=(a,c)=>{c=c.split(".");let b=0;for(;b<c.length;b++){if(!a)return;a=a[c[b]]}return a},D=(a,c,b)=>{let e=new f,d;if(b){for(d=0;d<
a.length;d++)v(a[d],e);e.i(b,void 0);for(d=0;d<a.length;d++)c.appendChild(a[d])}else for(d=0;d<a.length;d++)v(a[d],e),c.appendChild(a[d]);return e};this.placeTo=(a,c)=>{a=this.h[c].placeTo(a,this.g);this.j.push(a);return this};this.destroy=a=>{let c=A(a);if(c){if(c.G)for(let b=this.j.length-1;0<=b;--b)this.j[b].id==a&&this.j.splice(b,1);c.innerHTML=""}};this.update=()=>{for(let a=0;a<this.j.length;a++){let c=this.j[a];c.C||c.i(this.g)}return this};this.lock=a=>this.o(!0,a);this.unlock=a=>this.o(!1,
a);this.o=(a,c)=>{c?A(c).H.C=a:this.l=a;return this};this.set=(a,c)=>{this.g[a]=c;this.l||this.update();return this};this.load=(a,c)=>{this.h[a]=new G(c)};this.model=a=>this.g=a;this.get=a=>this.g[a];this.netload=(a,c)=>this.load(a,z(c));this.label=(a,c)=>{let b=new Proxy({},{get:(e,d)=>a(d)});return c?this.set(c,a):b}};r("reanet",J);
