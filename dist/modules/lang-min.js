var a=this||self;reanet.lang=new d;var e=reanet.lang,g=["reanet","lang"],k=a;g[0]in k||"undefined"==typeof k.execScript||k.execScript("var "+g[0]);for(var l;g.length&&(l=g.shift());)g.length||void 0===e?k[l]&&k[l]!==Object.prototype[l]?k=k[l]:k=k[l]={}:k[l]=e;
function d(){this.g={j:{}};this.i={};this.h=this.g.def;this.proxy=new Proxy({},{get:(c,b)=>this.h[b]});this.setSrc=(c,b)=>{this.i[c]=b};this.set=(c,b)=>{this.g[c]=b};this.use=c=>{reanet.get("lang")||reanet.lock().set("lang",this.proxy).unlock();let b=this.g[c];if(b)this.h=b;else{let h=this.i[c];if(h){get(h,f=>{f=eval(f);this.g[c]=f;this.h=b;reanet.update()});return}this.h=this.g.def}reanet.update()}};
