<template>
    <div class="fp-column"
         style="padding-bottom:10px; margin-bottom: 10px; border-bottom: solid 1px rgba(128,128,128,0.4)">
        <q-item clickable tag="a" target="_blank" @click="click">
            <div style="width: 35px; max-width: 35px !important; padding: 5px;">
                <q-icon :name="icon" size="25px" :style="(iconAngle ? `rotate: ${iconAngle}deg;` : '')"/>
            </div>
            <q-item-section>
                <q-item-label>{{ title }}</q-item-label>
                <q-item-label caption>{{ caption }}</q-item-label>
            </q-item-section>
        </q-item>
        <template v-if="selected">
            <div v-for="(item, n) in params" :key="n">
                <div v-if="item.type === itemTypesEnum.TOGGLE" class="fp-column"
                     style="padding-left: 10px; padding-right: 10px;">
                    <div class="width-100" style="text-align: center;">{{ item.label }}</div>
                    <q-btn-toggle push glossy toggle-color="primary" :options="item.options" spread
                                  v-model="item.value" @update:model-value="val=>handleToggle(val, item)"/>
                </div>
                <div v-if="item.type === itemTypesEnum.BUTTON" class="width-100 fp-row" style="padding-top: 10px;">
                    <q-btn style="margin: auto;" color="secondary" :label="item.label"
                    @click="store[item.store][item.name] = item.click"
                    />
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {appSetting} from "stores/appSetting";
import {game} from "stores/game";
import {user} from "stores/user";
import itemTypesEnum from "components/layouts/itemTypesEnum";


export default defineComponent({
    name: 'EssentialLink',
    props: {
        title: {type: String, required: true},
        caption: {type: String, default: ''},
        link: {type: String, default: '/'},
        icon: {type: String, default: ''},
        iconAngle: {type: Number, default: 0},
        params: {type: Array, default: () => ([])},
    },

    data: () => ({
        test: 4
    }),
    computed: {
        itemTypesEnum() {
            return itemTypesEnum
        },
        store() {
            return {
                appSetting: appSetting(),
                user: user(),
                game: game(),
            }
        },
        selected() {
            if (game().isGameActive) return false
            return appSetting().menuSelectedItem === this.title
        },
        isGameActive(){
            return game().isGameActive
        }


    },

    methods: {
        click() {
            this.$router.push({path: '/' + this.link})
            appSetting().menuSelectedItem = this.title
            game().isGameActive = false
        },
        handleToggle(value, item){
          if (item.eval)
            eval(item.eval)
        }

    }
})
</script>
