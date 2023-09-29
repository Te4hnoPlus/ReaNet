# Te4hno ReaNet Library
Docks in progress...
## ReaNet`s template
```html
<template name="main">
    <script>
        console.log("Hello World!");
    </script>
    <div for="data:data">
        <div class="test">
            {data.obj} {text}
            <div class="test2">
                {data.obj2}
            </div>
            <div class="{ba}" onclick='onclick1()'>
                CLICK
            </div>
        </div>
        TEXT
    </div>
</template>
```
## Marker to install template
```html
<div id="frame" class="test"></div>
```

## JavaScript
```js
let dataset = {
    data:[{obj:"TEXT"},{obj:"TEXT2"}],
    ba:"testclass"
}
const reanet = new Reanet(data)
reanet.placeTo("frame", "main")
```
## Update Templates
```js 
//update data and re-render
reanet.set("text","Example")
//or manually
dataset["text"] = "Example"
reanet.update()

reanet.lock() // to lock auto re-render
reanet.unlock() //enable automatic rendering again
```
#
## Compile With Google Clouse Compiler
1) install `npm`
2) install `Google Clouse Compiler` `(optional)`
3) run `compile.bat`
#