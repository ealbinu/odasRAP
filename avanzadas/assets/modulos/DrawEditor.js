Vue.component('DrawEditor', {
    props: [
        'imgbg', //imagen de fondo
    ],
    data () {
        return {
            canvas: null,
            ctx: null,
            canvas: null,
            ctx: null,
            tools: ['brush', 'text'], //'move'
            currentTool: 'brush',
            colors: ['#5EB246', '#005093', '#EB8B2E', '#DB3E34', '#444', '#fff'],
            currentcolor: '#5EB246',
            sizes: [10, 6, 2],
            currentBrushSize: 6,
            scope: null,
            realSize: {width:750, height: 1020},
            currentSize: {width:0, height: 0},
            inputTextOn: false,
            inputText: '',
            inputTextPoint: {x:0, y:0},
            inputTextPointScreen: {x:0, y:0},
            saved: false,
            firstAction: false,
            selectedShape: null,
            activeTextItem: null,
        }
    },
    template: `
        <div class="draw-editor" :style="'width:'+realSize.width+'px; height:'+realSize.height+'px;'">
            <canvas class="drawEditorCanvas " ref="canvas" id="drawEditorCanvas" @mousedown="mouseDown" @touchstart="mouseDown"></canvas>
            
            <!--<div class="inputText" v-if="inputTextOn && currentTool=='text' && currentcolor!='#fff'" :style="'border-color:'+currentcolor+'; left:'+inputTextPointScreen.x+'px; top:'+inputTextPointScreen.y+'px; margin-top:-'+(returnTextSize)+'px;'">-->
            <div class="inputText" v-if="inputTextOn && currentTool=='text' && currentcolor!='#fff'">
                <div class="row">
                <button class="button" :style="'background-color:'+currentcolor+';'" @click="cancelText"><img src="aimg/close.svg"></button>
                    <!--<input ref="inputTextInput" v-model="inputText" :style="'background-color:'+currentcolor+';' + ' font-size:'+returnTextSize+'px;' " @input="modText" v-on:keyup="modText" />-->
                    <input ref="inputTextInput" v-bind:value="inputText" :style="'background-color:'+currentcolor+';' + ' font-size:'+returnTextSize+'px;' " @input="modText" v-on:input="inputText= $event.target.value" />
                    <button :disabled="inputText.length<1" class="button" :style="'background-color:'+currentcolor+';'" @click="createText"><img src="aimg/ok.svg"></button>
                </div>
            </div>
            
            <div class="botonera" :style="'background-color:'+currentcolor+';'">
                <div class="tools row wrap">
                    <div v-for="to in tools" :style="'background-color:'+currentcolor+';'" :class="'tool tool_'+to + ' ' + (to==currentTool ? 'on':'off')" @click="setTool($event, to)"></div>
                </div>
                <div class="colors">
                    <div v-for="col in colors" class="color" :style="'background-color:'+col+';'" @click="setColor($event, col)"></div>
                </div>
                <div class="sizes row wrap">
                    <div v-for="sz in sizes" :style="'background-color:'+currentcolor+';'" :class="'size size_'+sz + ' ' + (sz==currentBrushSize ? 'on':'off')" @click="setSize($event, sz)"></div>
                </div>
                <div class="buttons row wrap">
                    <button class="button limpiar" @click="cleanCanvas(this)"></button>
                    <button class="button finalizar" @click="downloadCanvas(this)" v-if="firstAction"></button>
                </div>
            

            </div>
        </div>
    `,
    computed: {
        returnTextSize(){
            if(this.currentBrushSize==10){ return 28 }
            if(this.currentBrushSize==6){ return 20 }
            if(this.currentBrushSize==2){ return 15 }
        },
        rowdirection() {
            if(this.inputTextPointScreen.x > this.currentSize.width/2){
                return 'invert'
            } else {
                return 'normal'
            }
        },
    },
    watch: {
        inputText () {
            this.modText()
            console.log('changed')
        }
    },
    methods: {
        setColor(e, col){
            s_select.play()
            this.currentcolor = col
            app.particleAnimation(e, null, null, 60, col)
            if(this.currentTool=='text'){this.modText()}
        },
        setSize(e, sz){
            s_select.play()
            this.currentBrushSize = sz
            app.particleAnimation(e, null, null, 60)
            if(this.currentTool=='text'){this.modText()}
        },
        setTool(e, to){
            s_select.play()
            this.currentTool = to
            app.particleAnimation(e, null, null, 60)
        },
        initCanvas () {
            this.canvas = this.$refs.canvas
            //this.canvas = this.$refs.canvas
            var parentEl = document.getElementsByClassName('draw-editor')[0]
            parentEl.appendChild(this.canvas)
            //parentEl.appendChild(this.canvas)
            var _this = this
            setTimeout(function () {
                _this.updateCanvas()
                _this.ctx = _this.canvas.getContext('2d')
                //_this.ctx = _this.canvas.getContext('2d')
                
                var background = new Image()
                background.crossOrigin = 'anonymous'
                background.onload = function () {
                    _this.realSize = {width: background.width, height: background.height }
                    _this.updateCanvas()
                    //_this.ctx.drawImage(background, 0, 0)
                    document.getElementsByClassName('draw-editor')[0].classList.add('imgloaded')
                    _this.paperStart(background)
                }
                
                background.src = _this.imgbg
                
            }, 500)
        },
        scalePreserveAspectRatio(imgW,imgH,maxW,maxH){
            return(Math.min((maxW/imgW),(maxH/imgH)));
        },
        updateCanvas () {
            var parentEl = document.getElementsByClassName('draw-editor')[0]
/*
            this.canvas.width = parentEl.clientWidth
            this.canvas.height = parentEl.clientHeight
            this.canvas.style.width = parentEl.clientWidth + 'px'
            this.canvas.style.height = parentEl.clientHeight + 'px'
*/
            this.canvas.width = this.realSize.width
            this.canvas.height = this.realSize.height
            this.canvas.style.width = this.realSize.width + 'px'
            this.canvas.style.height = this.realSize.height + 'px'



            this.canvas.getContext('2d').scale(1, 1)
            
            /*
            this.canvas.width = parentEl.clientWidth
            this.canvas.height = parentEl.clientHeight
            this.canvas.style.width = parentEl.clientWidth + 'px'
            this.canvas.style.height = parentEl.clientHeight + 'px'
            this.canvas.getContext('2d').scale(1, 1)
            */
        },
        downloadCanvas () {
            var file = this.canvas.toDataURL("image/jpeg", 0.8)

            /*
            this.canvas.toBlob(function(blob) {
                saveAs(blob, "imagen.png")
            })
            */
            let fwIt = 0
           let speedpart = 30
           var fw = setInterval(function () {
                fwIt++
                app.particleAnimation({clientX:window.innerWidth/(Math.random()*4), clientY:window.innerHeight/(Math.random()*4)}, 30, null, null)
                if(fwIt == speedpart) {
                    clearInterval(fw)
                }
            }, 100)
            var endData = JSON.stringify({screen: [file]})
            window.top.postMessage(endData, "*")

            this.saved = true
            s_win.play()
        },
        cleanCanvas(){
            s_error.play()
            this.scope.project.activeLayer.removeChildren()
        },
        pathCreate(scope) {
            scope.activate()
            return new paper.Path({
                strokeColor: this.currentcolor,
                strokeJoin: 'round',
                strokeWidth: this.currentBrushSize
            })
        },
        createTool(scope) {
            scope.activate()
            return new paper.Tool()
        },
        getRealPos (event) {
            let bounding = event.event.target.getBoundingClientRect()
            let touchEV = event.event.touches ? event.event.touches[0] : event.event
            if(!touchEV){
                return false
            }

            const drawEObj = document.getElementsByClassName('draw-editor')[0]
            this.currentSize = {width: drawEObj.clientWidth, height: drawEObj.clientHeight, }
            //Exponente para calcular responsive
            let Xmult = this.realSize.width / bounding.width
            let Ymult = this.realSize.height / bounding.height
            //Detección en tiempo real del scroll, tamaño de caja y posición del evento
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
            let rw = touchEV.pageX - bounding.left
            let rh = touchEV.pageY - bounding.top

            let realPos= { x: rw*Xmult, y: (rh*Ymult)-(scrollTop*Ymult)} //(rh*Ymult) - (scrollTop*Ymult)

            return realPos
        },
        createInputText(point, event){
            //var touchEV = event.event.touches ? event.event.touches[0] : event.event
            this.inputTextOn = true
            this.inputTextPoint = point
            if(this.activeTextItem != null) {
                this.activeTextItem.point = this.inputTextPoint
            }
            //this.inputTextPointScreen = {x: touchEV.pageX, y: touchEV.pageY}
            this.inputTextPointScreen = {x:point.x, y:point.y-40}
            var _this = this
            setTimeout(function(){_this.$refs.inputTextInput.focus()},100)
        },
        modText () {
            if(this.activeTextItem == null) {
                this.activeTextItem = new paper.PointText(this.inputTextPoint)
            } else {
            }
            this.activeTextItem.fillColor = this.currentcolor
            this.activeTextItem.fontSize = this.returnTextSize
            this.activeTextItem.content = this.inputText
        },
        cancelText() {
            this.activeTextItem.content = ''
            this.inputTextOn = false
            this.inputText = ''
            this.activeTextItem = null
        },
        createText() {
            /*
            var txt = new paper.PointText(this.inputTextPoint)
            txt.fillColor = this.currentcolor
            txt.fontSize = this.returnTextSize
            txt.content = this.inputText
            */
            this.inputTextOn = false
            this.inputText = ''
            this.activeTextItem = null
            if(!this.firstAction) { this.firstAction = true}
        },

        mouseDown() {
            // in order to access functions in nested tool
            let self = this
            // create drawing tool
            this.tool = this.createTool(this.scope)
            
            //TEST !!!!! ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            /*
            self.path = self.pathCreate(self.scope)
            self.path.add({x:0, y:0})
            self.path.add({x:375, y:255})
            self.path.add({x:375, y:765})
            self.path.add({x:750, y:1020})
            */
            //TEST !!!!! ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            if(!this.firstAction) { this.firstAction = true}


            this.tool.onMouseDown = (event) => {
                    var realPos = self.getRealPos(event)
                    if(!realPos){
                        return false
                    }
                    var hitResult = this.scope.project.hitTest(realPos, {
                        segments: true,
                        stroke: true,
                        fill: true,
                        tolerance: 50
                    })
                    if(hitResult && self.currentcolor=='#fff'){ if(hitResult.type=="stroke" || hitResult.type == "fill"){ hitResult.item.remove() } }


                    /* mover */
                    if(hitResult && self.currentTool == 'move' ){ console.log(hitResult.type)}
                    if(hitResult && self.currentTool == 'move' ){ if(hitResult.type=="stroke" || hitResult.type == "fill"){ self.selectedShape = hitResult.item }  }



                    if(self.currentcolor!='#fff' && self.currentTool=='brush'){
                        // init path
                        self.path = self.pathCreate(self.scope)
                        // add point to path
                        self.path.add(realPos)



                    } else if(self.currentcolor!='#fff' && self.currentTool == 'text'){
                        self.createInputText(realPos, event)
                    }
            }
            this.tool.onMouseDrag = (event) => {
                var realPos = self.getRealPos(event)
                if(!realPos){
                    return false
                }
                var hitResult = this.scope.project.hitTest(realPos, {
                    segments: true,
                    stroke: true,
                    fill: true,
                    tolerance: 5
                })
                if(hitResult && self.currentcolor=='#fff'){ if(hitResult.type=="stroke"){ hitResult.item.remove() } }
                if(self.currentcolor!='#fff' && self.currentTool=='brush' ){
                    self.path.add(realPos)
                }

                if(hitResult && self.currentTool == 'move' ){ if(hitResult.type=="stroke" || hitResult.type == "fill"){ self.selectedShape = hitResult.item }  }
                if(self.selectedShape){
                    self.selectedShape.position = event.point
                }
                else if(self.currentcolor!='#fff' && self.currentTool == 'text'){
                    self.createInputText(realPos, event)
                }
                //app.particleAnimation(event.event, 1, 2000, 10, self.currentcolor)

            }
            this.tool.onMouseUp = (event) => {
                var realPos = self.getRealPos(event)
                if(!realPos){
                    return false
                }
                // line completed
                if(self.currentcolor!='#fff' && self.currentTool=='brush'){
                    self.path.simplify(10)
                    self.path.add(realPos)
                    if(!this.firstAction) { this.firstAction = true}
                }


                self.selectedShape = null

            }
        },
        paperStart(bgimg){
            /* paperjs */
            this.scope = new paper.PaperScope()
            this.scope.setup(this.canvas)
            var rasterbg = new paper.Raster(bgimg, this.scope.view.center)
            rasterbg.width = this.currentSize.width
            rasterbg.height = this.currentSize.height
            //rasterbg.position = this.scope.view.center
            new paper.Layer()
            this.updateCanvas()
        }
    },
    mounted () {
        this.initCanvas()
    }
})

/*
    <draw-editor :imgbg="url"></draw-editor>
*/




