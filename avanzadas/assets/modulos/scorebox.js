Vue.component('scorebox', {
    props: ['score', 'showmax'],
    data () {
        return {
            scorerender: 0,
            ended: false,
        }
    },
    template: `
        <div :class="'scorebox ' + (showmax && !ended?'showmax':'') + ' '+ percentage">
            <embed src="../../assets/aanim/ScoreIcon.svg"> 
            <div v-if="scorerender != score">{{scorerender}}</div>
            <div class="animate__animated animate__bounceIn" v-if="scorerender == score">{{scorerender}}</div>
            <div v-if="showmax && !ended">&nbsp;/ {{Math.round(showmax)}}</div>
        </div>
    `,
    watch: {
        score (nval, olval) {
            this.runscore(olval)
        }
    },
    computed: {
        percentage () {
            if((this.showmax/4) > this.score ) {
                return 'low'
            } else if(this.showmax-(this.showmax/3) > Math.round(this.score) ) {
                return 'mid'
            } else {
                return ''
            }
        }
    },
    methods: {
        runscore (starting) {
            var _this = this
            if(!_this.showmax){
                _this.scorerender = 0
            } else {
                _this.scorerender = Math.round(starting)
            }
            var interval = setInterval(function(){
                if(_this.scorerender < Math.round(_this.score) ){
                    _this.scorerender += 1
                }else if(_this.scorerender > Math.round(_this.score) ){
                    _this.scorerender -= 1
                } else {
                    clearInterval(interval)
                    if(_this.showmax && _this.scorerender == _this.showmax){
                        _this.ended = true
                        app.particleAnimation({clientX:window.innerWidth -50, clientY:window.innerHeight -40}, 100, null, null,'#015093' )
                    }
                }
            }, 50)
        }
    },
    mounted () {
        this.runscore(0)
        //this.$ref.instructions
    }
})