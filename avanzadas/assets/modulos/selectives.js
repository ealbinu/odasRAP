Vue.component('selectives', {
    props: ['ops', 'ans', 'number', 'disableok', 'automatic'],
    data () {
        return {
            selected: null,
            validateok: false
        }
    },
    methods: {
        clicked (index){
            if(this.validateok){
                return false
            }
            this.selected = index
            s_select.play()
            this.$emit('selected')
            if(this.automatic){
                this.validate()
            }
        },
        validate () {
            if(this.ans == this.selected){
                if(this.disableok==undefined){
                    s_ok.play()
                    EventBus.$emit('isok')
                }
                this.$emit('isok')
                this.validateok = true
                return true
            } else {
                if(this.disableok==undefined){
                    s_error.play()
                }
                this.$emit('iserror')
                this.selected = null
                return false
            }
        }
    },
    template: `
        <div class="selectives">
            <div class="row w100 wrap">
                <template v-for="(i, index) in ops">
                    <template v-if="number!=undefined">
                        <div @click="clicked(index)" class="pa-1" :class="index == selected ? 'on':'off'"><number randomc smaller>{{i}}</number></div>
                    </template>
                    <template v-else>
                        <div @click="clicked(index)" :class="index == selected ? 'on':'off'" v-html="i"></div>
                    </template>
                </template>
            </div>
        </div>
    `
})


/*

selectives(:ans="1" key="p1" :ops="['Habla sobre los movimientos lentos de los simios.','Trata de por qué los simios no pueden hablar como los humanos.','Expone el porqué de la evolución del lenguaje en los simios.']" number disableok ref="p1")

*/