/**
 * @fileoverview Reanet lib
 * @extern
 */


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


/**
 * Hide <template> tag
 */
(()=>{
    let el = newEl('style')
    el.innerHTML=".template{display: none}"
    document.head.appendChild(el)
})


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
 *    <div if="showText()">  <-\ eval "if" to check
 *      Text                    \ need render or not
 *    </div>
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
    const ignoreUpdates = (model, prefix)=>false
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


    function getAndRem(item, key){
        let atr = item.getAttribute(key)
        if(atr) item.removeAttribute(key)
        return atr
    }


    function forItems(item, model){
        let vrAtrs = new VrAttributesItem(item)
        if(vrAtrs.update){
            model.add(vrAtrs)
        }
        if(hasChilds(item)){
            let atr = getAndRem(item, "if")
            if(atr){
                let logicItem = new VrLogicalItem(item, atr)
                model.add(logicItem)
                model = logicItem
            }
            atr = getAndRem(item, "for")
            if(atr){
                model.add(new VrModelDynamicItem(item, atr))
            } else{
                for(let i=0;i<item.childNodes.length;i++){
                    forItems(item.childNodes[i], model)
                }
            }
        } else{
            if(/\S/.test(item.textContent)){
                let vrItem = new VrModelItem(item)
                if(vrItem.update) model.add(vrItem)
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


    /**
     * Groop of other Vr-Elements
     * @constructor
     */
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


    /**
     * Attributes tweaker template
     * @param {*} item 
     * @constructor
     */
    function VrAttributesItem(item){
        if(!item.getAttributeNames)return
        let names = item.getAttributeNames()
        let atrTweakers = []
        for(let i=0;i<names.length;i++){
            let atr = item.getAttribute(names[i])
            let template = new Template(atr)

            if(template.varItems){ //Is valid Template
                template.name = names[i]
                atrTweakers.push(template)
            }
        }
        if(atrTweakers.length>0){
            this.atrTweakers = atrTweakers
            this.update = (model, prefix)=>{
                for(let i=0;i<this.atrTweakers.length;i++){
                    let tweaker = this.atrTweakers[i]
                    if(tweaker.update(model, prefix)){
                        item.setAttribute(tweaker.name, tweaker.text)
                    }
                }
            }
        }
    }


    /**
     * Base string template
     * @param {string} str
     * @constructor
     */
    function Template(str){
        let last = 0
        let ind = str.indexOf("{", last)
        this.text = str

        if(ind>-1){
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
                if(skip)return false

                let text = this.textItems[0]
                for(let i=1;i<this.textItems.length;i++){
                    text = text + (this.varItems[this.varIndexes[i-1]] + this.textItems[i])
                }
                this.text = text
                
                return true
            }
        } else {
            this.update = ignoreUpdates
        }
    }


    /**
     * Base item template
     * @param {*} item 
     * @constructor
     */
    function VrModelItem(item){
        let str = item.textContent.trim()

        let last = 0
        let ind = str.indexOf("{", last)

        if(ind>-1){
            this.item = item
            this.template = new Template(str)

            this.update = (model, prefix)=>{
                if(this.template.update(model, prefix)){
                    this.item.textContent = this.template.text
                }
            }
        }
    }


    /**
     * Template "if" logic
     * @param {*} item 
     * @param {string} atr 
     * @constructor
     */
    function VrLogicalItem(item, atr){
        this.item = item
        this.items = []
        this.func = atr
        item.defDisplay = item.style.display
        item.visable = true

        this.add = (item)=>{
            this.items.push(item)
        }

        this.update = (model, prefix)=>{
            if(eval(this.func)){
                if(!item.visable){
                    item.style.display = item.defDisplay
                    item.visable = true
                }
                for(let i=0;i<this.items.length;i++){
                    this.items[i].update(model, prefix)
                }
            } else{
                if(item.visable){
                    item.style.display = 'none'
                    item.visable = false
                }
            }
            return this
        }
    }


    /**
     * Template "for" loop
     * @param {string} parent 
     * @param {string} forinf 
     * @constructor
     */
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


    /**
     * This compile String template to template installer
     * @param {string} strTemplate 
     * @constructor
     */
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
            vrModel.id = id
            frame.vrModel = vrModel
            return vrModel
        }
    }


    /**
     * Install template to frame
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
     * Destroy template in frame
     * @param {string} id
     * @export
     */
    this.destroy = (id)=>{
        let el = getEl(id)
        if(el){
            if(el.vrModel){
                for (let i = this.placed.length - 1; i >= 0; --i) {
                    if (this.placed[i].id == id) {
                        this.placed.splice(i,1);
                    }
                }
            }
            el.innerHTML = ''
        }
    }


    /**
     * Update all templates
     * @returns 
     * @export
     */
    this.update = ()=>{
        for(let i=0;i<this.placed.length;i++){
            let vr = this.placed[i]
            if(!vr.locked) vr.update(this.model)
        }
        return this
    }


    /**
     * Lock auto-rerender
     * @returns 
     * @export
     */
    this.lock = (target)=> this.state(true, target)


    /**
     * Unlock auto-rerender
     * @returns 
     * @export
     */
    this.unlock = (target)=> this.state(false, target)


    /**
     * Toggle lock state
     * @param {boolean} state 
     * @returns 
     */
    this.state = (state, target)=>{
        if(target){
            getEl(target).vrmodel.locked  = state
        } else{
            this.locked = state
        }
        return this
    }


    /**
     * Update data model and re-render
     * @param {string} key 
     * @param {Object} val 
     * @export
     */
    this.set = (key, val)=>{
        this.model[key] = val
        if(!this.locked) this.update()
        return this
    }


    let temMap = getTemplatesMap()
    for(let key in temMap){
        this.templates[key] = new VrModelBuilder(temMap[key])
    }
}