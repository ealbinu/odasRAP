var EventBus = new Vue()

Vue.component('scene', {
    props: [
        'answers', // total de respuestas
        'score', //puntaje de actividad
        'alloks', // todas deben estar ok para avanzar
        'alloksSound', //sonido cuando todos ok
        'sceneColor', //Color principal de la escena
        'devmode', // Activa modo developer con botones para las funciones
        'startScene', // Es la escena de inicio
        'endScene', // Es la escena del final
        'finalData', //Resultados finales sólo para endScene
        'hidescorebox', // No mostrar la caja de score de la derecha
        'temporals',
        'temps',
    ],
    data() {
        return {
            appearok: false,
            currentAnswers: 0,
            oks: 0,
            errors: 0,
            comenzarBtnClicked: false,
            timeoutSounds: null,
            ended: false
        }
    },
    watch: {
        temporals (newP, oldP) {
            this.checkTemporals()
        }
    },
    computed: {
        getOks () {
            return this.oks
        }
    },
    template: `
        <section :class="'scene ' + 'sc_'+$parent.currentScene" v-if="appearok" ref="sceneac">
            <div v-if="startScene!=undefined" class="startScene">
                <button @click="comenzarFn" :disabled="comenzarBtnClicked" class="button">comenzar</button>
            </div>
            <div v-if="endScene!=undefined" class="endScene text-center">
                <h1>Felicidades</h1>
                <h2>Completaste la actividad</h2>
                <scorebox :score="finalData.scoresum"></scorebox>
                <p class="endResults">Obtuviste <strong>{{finalData.oks}} respuesta{{finalData.oks>1?'s':''}} correcta{{finalData.oks>1?'s':''}}</strong>.</p>
                <template v-if="finalData.score != finalData.scoresum">
                    <p class="endResultErrors">Tuviste problemas con {{finalData.errors}} respuestas.</p>
                    <p class="endImprove">Puedes mejorar tu puntaje repitiendo la actividad.</p>
                </template>
                <button @click="reset" class="button">Repetir actividad</button>
            </div>
            <template v-if="startScene==undefined && endScene==undefined">
                <slot></slot>
                <div class="scenebar" v-if="hidescorebox==undefined">
                    <scorebox :showmax="score" :score="scoresum"></scorebox>
                </div>
                <div v-if="devmode" class="devmode">
                    <div class="row">
                        <div>Oks: {{oks}}</div>
                        <div>Errors: {{errors}}</div>
                        <div>Answers: {{answers}}</div>
                        <div>Current: {{currentAnswers}}</div>
                        <div>Temporals: {{temporals}}</div>
                        <div>Temps: {{temps}}</div>
                    </div>
                    <div class="row">
                        <button @click="okFn">okFn</button>
                        <button @click="errorFn">errorFn</button>
                        <button @click="oks=answers; endedFn()">endAll Ok</button>
                        <button @click="oks=answers-1; errors=1; currentAnswers=answers; endedFn()">endOne Bad</button>
                    </div>
                </div>
            </template>
        </section>
    `,
    computed: {
        scoresum () {
            var currentScore = Math.round((this.score / this.answers) * (this.oks))
            return currentScore
        }
    },
    methods: {
        comenzarFn(){
            this.comenzarBtnClicked = true
            this.$emit('completed', {oks: null, errors: null, answers: null, score: null, scoresum: null})
            s_fanf.play()
        },
        okFn() {
            this.oks++
            this.currentAnswers++
            this.endedFn()
        },
        errorFn() {
            this.errors++
            this.currentAnswers++
            this.endedFn()
        },
        endedFn (event) {

            if(this.alloks != undefined) {
                if(this.oks == this.answers && this.oks>0) {
                    //Checar que todos los sonidos hayan terminado para terminar la escena
                    this.timeoutSounds = setInterval(this.checkIfSoundsArePlaying, 100)
                }
            } else {
                if(this.currentAnswers == this.answers) { //Todas las preguntas contestadas...
                    this.$emit('completed', {oks: this.oks, errors: this.errors, answers: this.answers, score: this.score, scoresum: this.scoresum})
                }
            }
        },
        checkIfSoundsArePlaying(){
            var allmuted = true
            for(var hw in Howler._howls){
                if(Howler._howls[hw].playing()  && Howler._howls[hw]._state == 'loaded' ){ allmuted = false }
            }
            if(allmuted && !this.ended){
                clearInterval(this.timeoutSounds)
                this.playAllOksSounds()
                this.endRun()
            }
        },
        playAllOksSounds () {
            if(this.alloksSound){
                var sound = new Howl({ src: [this.alloksSound] })
                    app.particleAnimation({clientX:window.innerWidth / 2, clientY:window.innerHeight / 2}, 100, 5000, 100)
                    setTimeout(function(){
                        s_win.play()
                    },200)
                setTimeout(function(){
                    sound.play()
                },100)

            }
        },
        endRun(){
            this.ended = true
            this.$emit('completed', {oks: this.oks, errors: this.errors, answers: this.answers, score: this.score, scoresum: this.scoresum})
        },
        checkTemporals () {
            this.oks = 0
            this.errors = 0

            for(t in this.temporals){
                var tem = this.temporals[t]
                if(tem){
                    this.okFn()
                } else {
                    this.errorFn()
                }
            }
        },
        appear() {
            var _this = this
                app.particleAnimation({clientX:window.innerWidth / 2, clientY:window.innerHeight / 2}, 80, 5000, 800, _this.sceneColor)
                _this.appearok = true
        },
        reset () { location.reload() },

    },
    mounted () {
        this.oks = 0
        this.errors = 0
        this.currentAnswers = 0
        EventBus.$on('isok', this.okFn)
        EventBus.$on('iserror', this.errorFn)
        EventBus.$on('clicked', this.checkClicks)
        if(app){
            this.appear()
        } else {
            this.appearok = true
        }
        this.$emit('loaded')
    },
    created() {
        if(this.hidescorebox==undefined && this.startScene==undefined && this.endScene==undefined){
            ScenesBus.$emit('scenePoints')
        }
    }
})
