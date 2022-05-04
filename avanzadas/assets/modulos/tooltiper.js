Vue.component('tooltiper', {
    props: ['pos'],
    data() {
        return {
            opened: false
        }
    },
    template: `
        <div class="tooltiper">
            <div class="tooltiper__btn" @click="openTip">
                <img src="../../assets/aanim/Tooltiper.svg">
            </div>
            <div :class="'tooltiper__content ' + (pos!=undefined ? pos : '')" v-show="opened">
                <slot></slot>
                <div class="tooltiper__close" @click="closeTip">x</div>
            </div>
        </div>
    `,
    methods: {
        openTip (){
            this.opened = true
            s_select.play()
        },
        closeTip (){
            this.opened = false
            s_select.play()
        },
    },
    mounted () {
       
    }
})