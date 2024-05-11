<template>
  <q-list>
    <div class="fp-column item">
      <q-item clickable tag="a" target="_blank" @click="click">
        <div style="width: 35px; max-width: 35px !important; padding: 5px;">
          <q-icon name="style" size="25px" style="rotate: 180deg;"/>
        </div>
        <q-item-section>
          <q-item-label>Hra</q-item-label>
          <q-item-label caption>nová hra</q-item-label>
        </q-item-section>
      </q-item>
      <!--      <template v-if="selected">-->
      <!--        <div v-for="(item, n) in params" :key="n">-->
      <!--          <div v-if="item.type === itemTypesEnum.TOGGLE" class="fp-column"-->
      <!--               style="padding-left: 10px; padding-right: 10px;">-->
      <!--            <div class="width-100" style="text-align: center;">{{ item.label }}</div>-->
      <!--            <q-btn-toggle push glossy toggle-color="primary" :options="item.options" spread-->
      <!--                          v-model="item.value" @update:model-value="val=>handleToggle(val, item)"/>-->
      <!--          </div>-->
      <!--          <div v-if="item.type === itemTypesEnum.BUTTON" class="width-100 fp-row" style="padding-top: 10px;">-->
      <!--            <q-btn style="margin: auto;" color="secondary" :label="item.label"-->
      <!--                   @click="store[item.store][item.name] = item.click"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </template>-->
    </div>
  </q-list>
</template>


<script>


export default {
  name: "LeftMenu",

  methods:{
    click(){
      console.log('click')
    },
  },

}
</script>

<style scoped>
.item {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: solid 1px rgba(128, 128, 128, 0.4)
}
</style>
