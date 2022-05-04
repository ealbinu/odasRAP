Vue.component('drag', {
    props: [
        'dropzone', // item sobre el que se hace drop
        'dragsound', // sonido al iniciar drag
        'dropsound', // sonido al ser soltado
        'isoksound', // sonido al ser soltado
        'data', // valor a comparar
        'returnIfError', //regresa si error
        'returnToPosition', // regresa aunque haya drop
        'stayInDrop', // se queda al hacer drop
        'stayIfOk', // se queda (deshabilita) si en drop es ok
        'dropzoneOkClass', // coloca clase al dropzone si es ok
        'dropzoneErrorClass', // coloca clase al dropzone si es error
        'dragOkClass', // coloca clase al drag si es ok
        'dragErrorClass', // coloca clase al drag si es error
        'particleColor', // color de particulas
        'initclass', // class de inicio  ::::   "txt" 
        'dragLine', // Aparece una linea desde la ubicación inicial hasta donde se suelta, 
        'appendToDropzone', // Se añade al contenedor del dropzone,
        'appendClone', // Se añade al contenedor del dropzone un clon del contenido
        'disableok', //Deshabilita la acumulación de 'oks'
        'returnToLastPosition', //Actualiza la posición por la última con Drop (ok o error)
        'singleDetection', // Sólo detectar el primer dropzone
        'noErrorSound', //No reproduce sonido de error,
        'noOkSound', //No reproduce sonido de ok,
        'noReturnOnDrop', //No regresa aunque sea "error"
        'noAnimations', //Ninguna animación
        'undroppable', // Se puede "sacar" del dropzone y resta los droptimes
        'extval', // no-return-on-drop no-animations no-ok-sound no-error-sound disableok undroppable
        'isfalse', // Regresa como ok si esta en falso (externalValidation)
        'c' //color based on css variables
    ],
    data() {
        return {
            posx: 0,
            posy: 0,
            dragPosX: 0,
            dragPosY: 0,
            draggable: null,
            canvas: null,
            ctx: null,
            lastPosition: {x:0, y:0},
            dropzonesDetected: 0,
            isItOk: false,
            clonedIn: [],
            dragoks: 0,
            oktimes: 0,
            state: 'unset',
            csscolors: [
                '#5fa7a3', //extra
                '#5EB246', // 1
                '#005093', // 2
                '#00A9CB',
                '#EB8B2E',
                '#5EB246',
                '#DB3E34',
                '#F460AB',
                '#A6881F',
                '#C75980'
            ]
        }
    },
    //:style="'left:'+x+'%; top:'+y+'%;'"
    template: `
        <div ref="drag" :class="'drag ' + (initclass!=undefined?initclass:'')" :oktimes="oktimes">
            <slot></slot>
        </div>
    `,

    methods: {

        init () {
            var _this = this
            _this.posx = _this.$refs.drag.offsetLeft
            _this.posy = _this.$refs.drag.offsetTop

            _this.$refs.drag.children[0].classList.add('animate__animated')


            _this.draggable = Draggable.create(_this.$refs.drag, {
                type: 'x,y',
                bounds: '.activity',
                onDragStart: function(e) { _this.DragStart(e) },
                onDrag: function(e) { _this.Drag(e) },
                onDragEnd: function(e) { _this.DragEnd(e) },
                onPress:function(){
                    _this.lastPosition.x = this.x;
                    _this.lastPosition.y = this.y; 
                  },
            })
            _this.dragLineFnInit()
        },
        DragStart (e) {
            var _this = this
            _this.$emit('dragstarted')
            app.particleAnimation(e, null, null, null, _this.csscolors[_this.c] || _this.particleColor)
            _this.setClassAnimation('start')
            s_select.play()
            _this.playDragSound()
            _this.dragPosX = e.clientX + window.scrollX
            _this.dragPosY = e.clientY + window.scrollY
            _this.dropzonesDetected = 0
            if(_this.undroppable != undefined || _this.extval != undefined) {
                _this.undroppableFn()

            }

        },
        Drag (e) {
            var _this = this
            _this.HitTestFn(e, false)
            _this.dragLineFn(e)
        },
        DragEnd (e) {
            var _this = this
            app.particleAnimation(e, null, null, null, _this.csscolors[_this.c] || _this.particleColor)
            _this.HitTestFn(e, true)
            _this.playDropSound()
        },
        playDragSound(){
            if(this.dragsound){
                var sound = new Howl({ src: [this.dragsound] })
                sound.play()
            }
        },
        playDropSound(){
            if(this.dropsound){
                var _this = this
                var sound = new Howl({
                     src: [this.dropsound],
                     onend: function () {
                        _this.$emit('dropsoundCompleted')
                     }
                })
                sound.play()
            }
        },
        setClassAnimation(name) {
            var _this = this
            var theclass
            switch(name) {
                case 'start':
                    theclass = 'animate__rubberBand'
                    break
                case 'error':
                    theclass = 'animate__wobble'
                    break
                case 'ok':
                    theclass = 'animate__flash'
                    break
            }
            if(_this.$refs.drag.children[0]){
                _this.$refs.drag.children[0].classList.add(theclass)
            }
            setTimeout(function () {
                if(_this.$refs.drag.children[0]){
                    _this.$refs.drag.children[0].classList.remove(theclass)
                }
            }, 1000)
        },
        undroppableFn (e){
            var _this = this
            var dropzones = document.querySelectorAll(_this.dropzone)
            var drops = 0
            for(var dr = 0; dr < dropzones.length; dr++) {
                var dropzone = dropzones[dr]
                if(Draggable.hitTest(_this.$refs.drag, dropzone, '100%')){
                    //console.log('touchig dropzone', e)
                    var droppedtimes = dropzone.getAttribute('droppedtimes')
                    droppedtimes = parseInt(droppedtimes)
                    var minus = droppedtimes > 0 ? droppedtimes-1 : 0
                    dropzone.setAttribute('droppedtimes', minus)
                }
            }
        },
        HitTestFn (e, isdrop) {
            var _this = this
            var dropzones = document.querySelectorAll(_this.dropzone)
            var drops = 0
            for(var dr = 0; dr < dropzones.length; dr++) {
                var dropzone = dropzones[dr]
                if(Draggable.hitTest(_this.$refs.drag, dropzone, '50%')){
                    if(isdrop){
                        drops++
                        _this.dropHitTest(dropzone, e)

                    } else {
                        _this.hoverHitTest(dropzone, e)
                    }
                } else {
                    if(!isdrop) { _this.hoverExitHitTest(dropzone, e) }
                }
            }
            _this.state = 'set'
            if(isdrop && drops == 0){ 
                    _this.backToInitPos()
                    _this.$emit('notdropped')
                    _this.isItOk = undefined
            }
        },
        hoverHitTest(dropzone, e) {
            var _this = this
            if(!this.dropzoneCanBeDropped(dropzone)){
                return false
            }
            if(!dropzone.classList.contains('hover')){
                dropzone.classList.add('hover')
                s_select.play()
            }
        },
        hoverExitHitTest(dropzone, e) {
            if(dropzone.classList.contains('hover')){ dropzone.classList.remove('hover') }
        },
        dropHitTest(dropzone, e) {

            var _this = this
            _this.dropzonesDetected++
            
            if(dropzone.classList.contains('hover')){ dropzone.classList.remove('hover') }
            
            if(_this.singleDetection!=undefined && _this.dropzonesDetected > 1) {
                return false
            }


            if(!_this.dropzoneCanBeDropped(dropzone)){
                _this.backToInitPos()
                s_error.play()
                return false
            } else {
                dropzone.classList.add('dropzoneused')
            }

            if(this.data == dropzone.getAttribute('data')){
                _this.hitTestISOK(dropzone,e)
            } else {
                _this.hitTestISERROR(dropzone,e)
            }

        },
        hitTestISOK(dropzone, e){
            var _this = this

            _this.$emit('dropped')

            //## OK
            if(_this.noOkSound == undefined && _this.extval == undefined){
                s_ok.play()
            }

            if(_this.isoksound !=undefined){
                var _this = this
                var sound = new Howl({
                     src: [_this.isoksound],
                     onend: function () {
                        _this.$emit('isoksoundcompleted')
                     }
                })
                sound.play()
            }

            setTimeout(function (){
                let droppedtimes = dropzone.getAttribute('droppedtimes')
                _this.dragoks++
                _this.$emit('isok', {droppedtimes: droppedtimes, dragoks: _this.dragoks})
                _this.isItOk = true





                
            }, 100)
            _this.returnToPositionFn()
            _this.stayInDropFn()
            _this.dropzoneStatusClass('ok', dropzone)
            _this.dropzoneSound(dropzone, 'oksound')
            _this.dragStatusClass('ok')
            _this.stayIfOkFn()
            app.particleAnimation(e, 100, null, null)

            if(_this.noAnimations == undefined && _this.extval == undefined){
                _this.setClassAnimation('ok')
            }
            _this.droppedtimesAdd(dropzone)
            _this.appendToDropzoneFn(dropzone, e)
            _this.appendCloneToDropzoneFn(dropzone, e)
            if(_this.disableok==undefined && _this.extval == undefined){
                EventBus.$emit('isok')
                
            }
            
            _this.oktimes += 1

        },
        hitTestISERROR(dropzone, e){
            var _this = this


            //## ERROR
            
            _this.$emit('iserror')
            _this.isItOk = false
            _this.stayInDropFn()
            _this.dropzoneStatusClass('error', dropzone)
            _this.dropzoneSound(dropzone, 'errorsound')
            
            if(_this.noReturnOnDrop != undefined || _this.extval != undefined){
                _this.droppedtimesAdd(dropzone)
            }

            _this.appendCloneToDropzoneFn(dropzone, e)

            if(_this.noReturnOnDrop == undefined && _this.extval == undefined){
                _this.returnToPositionFn()
                _this.returnIfErrorFn()
            }
            _this.dragStatusClass('error')
            EventBus.$emit('iserror')
            if(_this.noAnimations == undefined && _this.extval == undefined ){
                _this.setClassAnimation('error')
            }
            
            if(_this.noErrorSound == undefined && _this.extval == undefined){
                s_error.play()
            }
        },
        appendToDropzoneFn(dropzone, e){
            if(this.appendToDropzone != undefined){
                var obj = this.$refs.drag.children[0]
                dropzone.append(obj)
                TweenLite.to(this.$refs.drag, .5, {x:0, y:0});
            }
        },
        appendCloneToDropzoneFn(dropzone, e){
            if(this.appendClone != undefined){
                var obj = this.$refs.drag.children[0].cloneNode(true)
                if(dropzone.getAttribute('data') == this.data){
                    obj.setAttribute('isright', true)
                    this.isItOk = true
                } else {
                    obj.setAttribute('isright', false)
                    this.isItOk = false
                }
                obj.setAttribute('isclone', true)
                if(this.isfalse!=undefined){
                    obj.setAttribute('isfalse', true)
                }
                dropzone.append(obj)
                this.$refs.drag.setAttribute('wascloned', true)
                this.clonedIn.push(dropzone)
                //TweenLite.to(this.$refs.drag, .5, {x:0, y:0});
            }
        },
        dropzoneCanBeDropped (dropzone) {
            if(dropzone.getAttribute('droptimes') == 'multiple') {
                var droplimit = parseInt(dropzone.getAttribute('droplimit'))
                if(droplimit) {
                    var droppedtimes = dropzone.getAttribute('droppedtimes')
                    if(droppedtimes){
                        if(droppedtimes < droplimit){
                            return true
                        }  else {
                            return false
                        }
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            } else if(dropzone.getAttribute('droptimes') == 'once') {
                return dropzone.classList.contains('dropzoneused') ? false : true
            } else if(dropzone.getAttribute('droptimes') == 'untilok') {
                return dropzone.classList.contains(this.dropzoneOkClass) ? false : true
            }
        },
        droppedtimesAdd (dropzone){
                if(dropzone.getAttribute('droptimes') != 'multiple') {
                    return false
                }
                var droppedtimes = dropzone.getAttribute('droppedtimes')
                if(droppedtimes){
                    var sum = parseInt(droppedtimes)+1
                    dropzone.setAttribute('droppedtimes', sum)
                    } else {
                        dropzone.setAttribute('droppedtimes', 1)
                }
        },
        dropzoneStatusClass(status, dropzone){
            var _this = this
            if(status == 'ok' && _this.dropzoneOkClass!=undefined) {
                dropzone.classList.add(_this.dropzoneOkClass)
                if(dropzone.classList.contains(_this.dropzoneErrorClass)){ dropzone.classList.remove(_this.dropzoneErrorClass) }
            }
            if(status == 'error' && _this.dropzoneErrorClass!=undefined) {
                dropzone.classList.add(_this.dropzoneErrorClass)
                if(dropzone.classList.contains(_this.dropzoneOkClass)){ dropzone.classList.remove(_this.dropzoneOkClass) }

            }
        },
        dragStatusClass(status){
            var _this = this
            if(status == 'ok' && _this.dragOkClass!=undefined) {
                _this.$refs.drag.classList.add(_this.dragOkClass)
                if(_this.$refs.drag.classList.contains(_this.dragErrorClass)){ _this.$refs.drag.classList.remove(_this.dragErrorClass) }
            }
            if(status == 'error' && _this.dragErrorClass!=undefined) {
                _this.$refs.drag.classList.add(_this.dragErrorClass)
                if(_this.$refs.drag.classList.contains(_this.dragOkClass)){ _this.$refs.drag.classList.remove(_this.dragOkClass) }

            }
        },
        stayIfOkFn(){
            if(this.stayIfOk!=undefined) {
                this.draggable[0].disable()
            }
        },
        stayInDropFn(){
            var _this = this
            if(_this.stayInDrop!=undefined) {
                _this.draggable[0].disable()
            } else {
                _this.returnToPositionFn()

            }
        },
        returnToPositionFn(){

            if(this.returnToPosition!=undefined) {
                this.backToInitPos()
                if(this.undroppable != undefined || this.extval != undefined) {
                    this.undroppableFn()
                }
            }
            
        },
        returnIfErrorFn(){
            if(this.returnIfErrorFn!=undefined) {
                this.backToInitPos()
            }
            if(this.undroppable != undefined || this.extval != undefined) {
                this.undroppableFn()
            }
           
        },
        reset(){
            this.lastPosition.x = 0
            this.lastPosition.y = 0
            this.backToInitPos()
            s_select.play()
        },
        backToInitPos(){
            if(this.returnToLastPosition!=undefined){
                TweenLite.to(this.$refs.drag, .5, {x: this.lastPosition.x, y: this.lastPosition.y, top: this.posy, left: this.posx, delay: .6});
                return false
            }
            //TweenLite.to(this.$refs.drag, .5, {x:0, y:0, top: this.posy, left: this.posx, delay: .6});
            TweenLite.to(this.$refs.drag, .5, {x:0, y:0, top: 0, left: 0, delay: .6});
            this.dragLineClear()
        },
        dropzoneSound(dropzone, attr) {
            if(dropzone.getAttribute(attr)){
                var sound = new Howl({ src: [dropzone.getAttribute(attr)] })
                sound.play()
            }
        },
        dragLineDraw(e) {
            var line = {}
            line.x = this.dragPosX
            line.y = this.dragPosY
            line.color = this.csscolors[this.c] || this.particleColor 
            line.lineWith = 4
            line.draw = function () {
                ctx.beginPath()
                ctx.lineWidth = line.lineWith
                ctx.strokeStyle = line.color
                ctx.moveTo(line.x, line.y)
                ctx.lineTo(e.clientX, e.clientY)
                ctx.stroke()
            }
            return line
        },
        dragLineFnInit() {
            if(this.dragLine!=undefined) {
                this.canvas = document.createElement('canvas')
                this.canvas.setAttribute('class', 'dragLineCanvas');
                //document.body.appendChild(this.canvas)
                var parentEl = document.getElementsByClassName('scene')[0]
                parentEl.appendChild(this.canvas)
                this.updateCanvas()
                this.ctx = this.canvas.getContext('2d')
            }
        },
        updateCanvas () {
            if(this.dragLine!=undefined) {
                var parentEl = document.getElementsByClassName('scene')[0]
                this.canvas.width = parentEl.clientWidth * 2;
                this.canvas.height = parentEl.clientHeight * 2;
                this.canvas.style.width = parentEl.clientWidth + 'px';
                this.canvas.style.height = parentEl.clientHeight + 'px';
                this.canvas.getContext('2d').scale(2, 2);
            }
        },
        dragLineFn(e) {
            if(this.dragLine!=undefined) {
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                this.ctx.beginPath()
                this.ctx.lineWidth = 2
                this.ctx.strokeStyle = this.csscolors[this.c] ||  this.particleColor
                this.ctx.arc(this.dragPosX, this.dragPosY, 20, 0, 2*Math.PI)
                this.ctx.stroke()
                this.ctx.beginPath()
                this.ctx.arc(this.dragPosX, this.dragPosY, 10, 0, 2*Math.PI)
                this.ctx.stroke()
                this.ctx.beginPath()
                this.ctx.lineWidth = 6
                this.ctx.strokeStyle = this.csscolors[this.c] || this.particleColor
                this.ctx.lineCap = 'round'
                this.ctx.setLineDash([5, 10])
                this.ctx.moveTo(this.dragPosX, this.dragPosY)
                this.ctx.lineTo(e.clientX + window.scrollX, e.clientY + window.scrollY)
                this.ctx.stroke()


            }
        },
        dragLineClear(){
            if(this.dragLine!=undefined) {
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            }
        },
        updatePositionFn (e) {
            if(this.updatePosition!=undefined){
                this.posx = e.clientX + window.scrollX
                this.posy = e.clientY + window.scrollY
            }
        },
        removeClones () {
            for(var i in this.clonedIn){
                let dzone = this.clonedIn[i]
                let theclone = dzone.querySelectorAll('[isright="false"]')
                dzone.classList.remove('dropzoneused')
                // minus droppedtimes
                if(this.undroppable != undefined || this.extval){
                    var droppedtimes = dzone.getAttribute('droppedtimes')
                    droppedtimes = parseInt(droppedtimes)
                    var minus = droppedtimes > 0 ? droppedtimes-1 : 0
                    dzone.setAttribute('droppedtimes', minus)
                }
                //---
                this.state = 'unset'
                theclone[0].remove()
            }
            this.$refs.drag.removeAttribute('wascloned')
            this.clonedIn = []
            /*
            for(var dr = 0; dr < dropzones.length; dr++) {
                var dropzone = dropzones[dr]
                if(Draggable.hitTest(_this.$refs.drag, dropzone, '100%')){
                    console.log('touchig dropzone', e)
                    var droppedtimes = dropzone.getAttribute('droppedtimes')
                    droppedtimes = parseInt(droppedtimes)
                    var minus = droppedtimes > 0 ? droppedtimes-1 : 0
                    dropzone.setAttribute('droppedtimes', minus)
                }
            }*/
        },
        externalValidation(){

            let theresult = false
            if(this.isItOk == true){
                theresult = true
            } else {
                if(this.isfalse != undefined && this.state == 'unset'){
                    theresult = true
                } else {
                    theresult = false
                }
                this.undroppableFn()
                this.backToInitPos()
                this.removeClones()
            }
            return theresult
        }
    },
    mounted () {
        this.init()
        window.addEventListener('resize', this.updateCanvas)
    }
})


/*
drag(:data="i" dropzone=".drop" :dragsound="'s/s'+(index+1)+'.mp3'" stay-if-ok): img(:src="'i/a'+(index+1)+'.png'").img-fluid
*/


/* externalValidation */
/*


.h4 2. A Claudia le faltan
    .drop.d2(data="E" droptimes="multiple" droplimit="1")
    | para llegar a Ixtlahuacán.
.row.w100.wrap
    drag(data="D" dropzone=".d2" extval ref="b4" isfalse): number(randomc smaller ) 15 minutos
    drag(data="E" dropzone=".d2" extval ref="b5" ): number(randomc smaller ) 3 kilómetros
    drag(data="F" dropzone=".d2" extval ref="b6" isfalse): number(randomc smaller ) 3 metros
button(@click="dragValidation([''b4', 'b5', 'b6'], 2)").button.big.animate__animated.animate__flip Verificar

*/