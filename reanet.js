/**
 * @fileoverview Reanet lib
 * @extern
 */
// goog.provide('reanet');


/**Network Utilites start*/
/**
 * @param {string} url 
 * @param {Function} func
 * @export
 */
function get(url,func){
    send('GET',url,null,func)
}

/**
 * @param {string} url 
 * @returns
 * @export
 */
function syncGet(url){
    let x=new XMLHttpRequest();x.open('GET',url,false);x.send();
    return x.responseText;
}

/**
 * @param {string} url 
 * @param {string} data 
 * @param {Function} func
 * @export
 */
function post(url,data,func){
    send('POST',url,data,func)
}


function send(m,u,d,f,a=1){
    let request=new XMLHttpRequest();
    request.open(m,u,a)
    request.send(d)
    request.onload=()=>{
        f(request.responseText)
    }
}
/**Network Utilites end*/

/**
 * @param {string} id 
 * @returns
 * @export
 */
function getEl(id){
    return document.getElementById(id)
}

/**
 * @param {string} sig 
 * @returns
 * @export
 */
function newEl(sig){
    return document.createElement(sig)
}
/**End Default Te4hno Utilites */


/**Reanet, main frontend te4hno lib
 *
 * ------------- REANET USAGE -----------------------
 * <template name="main">  <-\ Reanet template
 *                            \ write this in html
 *    <script>
 *      console.log("Example") <-\ This called when
 *    </script>                   \ Reanet created
 *    <div>
 *      {data.obj}    <-\ Get data from Reanet`s model
 *                       \ model["data"]["obj"]
 *    </div>
 *    <div for="var:data">  <-\ loop for objects in data
 *      {var.obj}              \ assigns "var" value 
 *    </div>                    \ data[cursor] at iteration
 * </template>
 * 
 * <div id="frame"></div>  <-\ Marker to install template
 *
 * const reanet = new Reanet({data:{obj: "value"}})
 * reanet.placeTo("frame", "main") <-\ Install tempalate
 *                                    \ "main" to "frame"
 * 
 * reanet.set("data", {obj: "value2"}) <-\ Update data
 *                                        \ and view
 * reanet.lock() <-\ Use to lock auto update view
 *                  \ use reanet.unlock() to unlock
 * 
 * ------------END REANET USAGE ---------------------
 */

/**
 * @constructor
 * @final
 * @export
 */
function Reanet(defmodel={}){
    const hasChilds = item => item.childNodes && item.childNodes.length
    const ignoreUpdates = (model, prefix)=>{}
    const parser = new DOMParser()

    this.templates = {}
    this.model = defmodel
    this.placed = []
    this.locked = false


    function filterNodes(elms){
        let items = []
        for(let i=0;i<elms.length;i++){
            let item = elms[i]
            if(item.nodeName == "#text"){
                if(/\S/.test(item.textContent))
                    items.push(item)
            } else{
                if(hasChilds(item) || !/\S/.test(item.innerHTML)){
                    items.push(item)
                }
            }

        }
        return items
    }


    function getTemplatesMap(){
        let tms = document.getElementsByTagName("template")
        let templates = {}
        for(let i = 0;i<tms.length;i++){
            templates[tms[i].getAttribute("name")] = tms[i].innerHTML
        }
        return templates
    }


    function toHtml(strelm){
        let html = parser.parseFromString(strelm, "text/html")
        return {scripts: html.scripts, nodes: filterNodes(html.body.childNodes)}
    }


    function cloneNodes(src){
        let copy = []
        for(let i=0;i<src.length;i++){
            copy.push(src[i].cloneNode(true))
        }
        return copy
    }


    function forItems(item, model){
        if(hasChilds(item)){
            let atr = item.getAttribute("for")
            if(atr){
                model.add(new VrModelDynamicItem(item, atr))
            } else{
                for(let i=0;i<item.childNodes.length;i++){
                    forItems(item.childNodes[i], model)
                }
            }
        } else{
            if(/\S/.test(item.textContent)){
                model.add(new VrModelItem(item))
            }
        }
    }


    function getRec(src, key){
        let keys = key.split(".")
        let cursor = 0;
        for(;cursor<keys.length;cursor++){
            if(!src)return undefined
            src = src[keys[cursor]]
        }
        return src
    }

    /**@constructor*/
    function VrModel(){
        this.items = []

        this.update = (model, prefix)=>{
            for(let i=0;i<this.items.length;i++){
                this.items[i].update(model, prefix)
            }
            return this
        }


        this.add = (item)=>{
            this.items.push(item)
        }
    }


    /**@constructor*/
    function VrModelItem(item){
        let str = item.textContent.trim()

        let last = 0
        let ind = str.indexOf("{", last)

        if(ind>-1){
            this.item = item
            this.textItems = []
            this.varItems = {}
            this.varIndexes = []

            while (true){
                ind = str.indexOf("{", last)
                if(ind == -1){
                    this.textItems.push(str.substring(last))
                    break
                }
                this.textItems.push(str.substring(last, ind))
                let ind2 = str.indexOf("}", ind)
                let res = str.substring(ind+1, ind2)
                this.varItems[res] = res
                this.varIndexes.push(res)
                last = ind2+1
            }


            this.update = (model, prefix)=>{
                let skip = true
                for(let key in this.varItems){
                    let curent = getRec(prefix?getRec(model,prefix):model, key)
                    if(curent==undefined)curent = key
                    if(this.varItems[key] != curent){
                        skip = false
                        this.varItems[key] = curent
                    }
                }
                if(skip)return

                let text = this.textItems[0]
                for(let i=1;i<this.textItems.length;i++){
                    text = text + (this.varItems[this.varIndexes[i-1]] + this.textItems[i])
                }
                this.item.textContent = text

            }
        } else {
            this.update = ignoreUpdates
        }
    }

    /**@constructor*/
    function VrModelDynamicItem(parent, forinf){
        this.parent = parent
        this.curData = {}
        this.templateNodes = filterNodes(cloneNodes(parent.childNodes))
        forinf = forinf.split(":")
        this.forKey = forinf[1]
        this.forVar = forinf[0]
        this.parent.innerHTML = ""

        
        this.getOrCreate = (num)=>{
            if(num in this.curData){
                return this.curData[num]
            } else{
                let nodes = cloneNodes(this.templateNodes)
                let vrModel = new VrModel()
                vrModel.allNodes = nodes
                vrModel.placed = false

                for(let i=0;i<nodes.length;i++){
                    forItems(nodes[i], vrModel)
                }

                this.curData[num] = vrModel
                return vrModel
            }
        }


        this.update = (model, forVar)=>{
            let objects = model[this.forKey]
            if(objects){
                let temp, j, i
                for(i=0;i<objects.length;i++){
                    let prev = model[this.forVar]
                    model[this.forVar] = objects[i]

                    temp = this.getOrCreate(i);

                    temp.update(model, null)
                    model[this.forVar] = prev
                }

                for(i=0;i<objects.length;i++){
                    temp = this.curData[i]
                    if(!temp.placed){
                        temp.placed = true
                        for(j=0;j<temp.allNodes.length;j++){
                            this.parent.appendChild(temp.allNodes[j])
                        }
                    }
                }
                let max = Object.keys(this.curData).length
                for(;i<max;i++){
                    temp = this.curData[i]
                    if(temp.placed){
                        for(j=0;j<temp.allNodes.length;j++){
                            this.parent.removeChild(temp.allNodes[j])
                        }
                        temp.placed = false
                    }
                }
            }
        }
    }

    /**@constructor*/
    function VrModelBuilder(strTemplate){
        let html = toHtml(strTemplate)
        this.nodes = html.nodes

        if(html.scripts){
            for(let i=0;i<html.scripts.length;i++){
                eval(html.scripts[i].textContent)
            }
        }


        this.cloneNodes = ()=>{
            return cloneNodes(this.nodes)
        }


        this.placeTo = (id, model)=>{
            let vrModel = new VrModel()
            let frame = getEl(id)
            let nodes = this.cloneNodes()
            let i
            if(model){
                for(i=0;i<nodes.length;i++) {
                    forItems(nodes[i], vrModel)
                }
                vrModel.update(model, null)
                for(i=0;i<nodes.length;i++) {
                    frame.appendChild(nodes[i])
                }
            } else{
                for(i=0;i<nodes.length;i++){
                    forItems(nodes[i], vrModel)
                    frame.appendChild(nodes[i])
                }
            }
            return vrModel
        }
    }

    /**
     * @param {string} id 
     * @param {string} template 
     * @returns 
     * @export
     */
    this.placeTo = (id, template)=>{
        let placed = this.templates[template].placeTo(id, this.model)
        this.placed.push(placed)
        return this
    }

    /**
     * @returns 
     * @export
     */
    this.update = ()=>{
        if(!this.locked){
            for(let i=0;i<this.placed.length;i++){
                this.placed[i].update(this.model)
            }
        }
        return this
    }

    /**
     * @returns 
     * @export
     */
    this.lock = ()=>{
        this.locked = true
        return this
    }

    /**
     * @returns 
     * @export
     */
    this.unlock = ()=>{
        this.locked = false
        return this
    }

    /**
     * @param {string} key 
     * @param {Object} val 
     * @export
     */
    this.set = (key, val)=>{
        this.model[key] = val
        this.update()
    }


    let temMap = getTemplatesMap()
    for(let key in temMap){
        this.templates[key] = new VrModelBuilder(temMap[key])
    }
}