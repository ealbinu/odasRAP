Vue.component('player', {
    props: [
        'value',
        'initclass', // clase inicial,
        'initx',
        'inity',
        'parentBox',
        'maxx',
        'maxy',
        'activo',
        'okwhen'
    ],
    data () {
        return {
            parentSize: {w:0, h:0},
            findPS: null,
            pos: {x:0, y:0,},
            forbbiden: [
                [2,2], [4, 2], [6, 2], [8,2],
                [2,4], [4, 4], [6, 4], [8,4],
                [2,6], [4, 6], [6, 6], [8,6],
                [2,8], [4, 8], [6, 8], [8,8],
                [2,10], [4, 10], [6, 10], [8,10],
                [1,12],[2,12], [4, 12], [6, 12], [8,12],
                [1,13],[2,13],
            ],
            moving: false,
            win: false,
        }
    },
    template: `
    <div>
        <div :class="'player ' + (initclass!=undefined?initclass:'') + ' ' + (activo?'activo':'') + ' ' + (win?'win':'')" ref="player">
            <slot></slot>
        </div>
        <div class="arrows" v-if="activo">
            <img class="w30" src="aimg/btnUp.svg" @click="moveUp">
            <div class="row">
                <img class="w30" src="aimg/btnLeft.svg" @click="moveLeft">
                <img class="w30" src="aimg/btnDown.svg" @click="moveDown">
                <img class="w30" src="aimg/btnRight.svg" @click="moveRight">
            </div>
        </div>
    </div>
    `,
    watch: {
        activo (nv, ov) {
            if(nv){
                var _this = this
                setTimeout(function(){
                    console.log('added')
                    if(!this.win){
                        document.onkeydown = _this.keyboard
                    }
                }, 100)
            } else {
                console.log('removing')
                document.onkeydown = null
            }
        }
    },
    methods: {
        moveDown(){
            
            if(this.moving){ return false}
            if(this.pos.y < this.maxy-1) { this.move(this.pos.x, this.pos.y+=1)}
        },
        moveRight(){
            if(this.moving){ return false}
            if(this.pos.x < this.maxx-1) { this.move(this.pos.x+=1, this.pos.y)}
        },
        moveUp(){
            if(this.moving){ return false}
            if(this.pos.y > 0) { this.move(this.pos.x, this.pos.y-=1)}
        },
        moveLeft(){
            if(this.moving){ return false}
            if(this.pos.x > 0) { this.move(this.pos.x-=1, this.pos.y)}
        },
        toPercentage(axis, num){
            if(axis == 'x') {
                let calc = (100 / (this.maxx-1)) * (num)
                return calc+"%"
            } else if(axis == 'y') {
                let calc = (100 / (this.maxy-1)) * (num)
                return calc+"%"
            }
        },
        move(px, py, setSpeed){
            if(this.win){ return false }
            var _this = this
            let okgo = true
            _this.moving = true
            this.forbbiden.find(function(el){
                if(el[0] === (px+1) && el[1] == (py+1)){
                    okgo = false
                    _this.moving = false
                }
            })
            s_select.play()
            if(okgo){
                let speed = setSpeed ? setSpeed : .5
                _this.pos = {x:px, y:py}
                _this.checkWin()
                let animation = TweenLite.to(this.$refs.player, .5, {left:this.toPercentage('x', px), top:this.toPercentage('y', py)})
                animation.eventCallback('onComplete', function () {
                    _this.moving = false
                })
            }
        },
        checkWin(){
            if(this.okwhen){
                if(this.okwhen[0] == this.pos.x && this.okwhen[1] == this.pos.y){
                    this.win = true
                    s_win.play()
                    this.$emit('isok')
                    EventBus.$emit('isok')
                }
            }
        },
        startPosition () {this.move(this.initx, this.inity, 0.2)},
        keyboard (e) {
            //if(!this.activo){ return false }
            e = e || window.event;
            if (e.keyCode == '38') { //up
                this.moveUp()
            }
            else if (e.keyCode == '40') { //down
                this.moveDown()
            }
            else if (e.keyCode == '37') { //left
                this.moveLeft()
            }
            else if (e.keyCode == '39') { //right
                this.moveRight()
            }

        }
    },
    mounted () {
        //this.findParent()
        this.startPosition()
        if(this.activo){
            document.onkeydown = this.keyboard
        }
    },
})