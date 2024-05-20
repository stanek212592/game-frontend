<template>
  <q-dialog v-model="modelValueComp" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Vyberte barvu {{ itemSelected ? '(vyberte znovu pro potvrzení)' : '' }}</div>
      </q-card-section>
      <q-card-section class="fp-row">
        <q-img v-for="(item, index) in items" :key="index" :src="item.image"
               :style="`width: 200px; border: solid 3px ${item.selected ? 'red' : 'white'};`"
               @click="handleClick(item)"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "SuitSelectDialog",

  props: {
    modelValue: {type: Boolean, default: false,},
    items: {type: Array, default: () => []},
  },

  data: () => ({}),

  computed: {
    modelValueComp: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:model-value', val)
      }
    },
    itemSelected() {
      return !!this.items.filter(a => a.selected).length
    }
  },

  methods: {
    handleClick(item) {
      if (!item.selected) {
        this.items.forEach(ele => ele.selected = false)
        item.selected = true
        return
      }
      this.$emit('select', item.name)
      this.$emit('update:model-value', false)
    }
  }
}
</script>


<style scoped>

</style>
