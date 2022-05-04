Vue.component('tip', {
    props: ['txt'],
    data() {
        return {
            open: false
        }
    },
    methods: {
        openit(fn){
            this.open = fn
            s_select.play()

        }
    },
    template: `
        <div class="tip">
            <div class="tip_btn" v-if="!open" @click="openit(true)"><img src="../../assets/aimg/tip.png"></div>
            <div v-else class="animate__animated animate__jello tip_container">
            <slot></slot>
            <div @click="openit(false)" class="tip_btn"><img src="../../assets/aimg/tipclose.png"></div>
            </div>
        </div>
    `
})