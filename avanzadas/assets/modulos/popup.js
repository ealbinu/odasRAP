Vue.component('popup', {
    props: [
        'particleColor', // color de particulas
        'initclass', // class de inicio (se pueden usar c1,c2,c3...),
        'conf', // left, top, width, height in percentage
        'c', // Clase de color que se asigna (1-8)
    ],
    data () {
        return {
            state: false
        }
    },
    computed: {
        csspos (){
            let left = 'left: ' + this.conf[0] + '; '
            let top = 'top: ' + this.conf[1] + '; '
            let width = 'width: ' + this.conf[2] + '; '
            let height = 'height: ' + this.conf[3] + '; '
            return left + top + width + height
        }
    },
    methods: {
        toggle () {
            this.state = !this.open
        },
        open () {
            this.state = true
            s_select.play()
        },
        close () {
            for(var hw in Howler._howls){Howler._howls[hw].stop()}
            this.state = false
        }
    },
    template: `
        <div :class="
                'popup animate__animated animate__jello ' +
                (c!=undefined?'c'+c:'') + ' '
            "
            v-show="state" :style="csspos">
            <template v-if="state">
              <slot></slot>
              </template>
            <button @click="close" class="popup__button"></button>
        </div>
    `,
})

/*
popup(:conf="['10%', '10%', '80%', '80%']" c="1")
*/
