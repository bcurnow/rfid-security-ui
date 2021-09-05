<template>
  <div class="container text-left">
    <b-button size="md" v-b-modal.item-details variant="primary" @click="createItem" pill><b-icon icon="plus-circle-fill"></b-icon> Add</b-button>
    <div class="row">
      <div class="col-sm">
        <b-table id="CommonList" responsive="md" :items="items" :fields="fields" primary-key="primaryKey" sort-by="primaryKey" head-row-variant="primary" sort-icon-left hover>
          <template #cell(controls)="data">
            <slot name="controlsCell">
              <b-button size="sm" v-b-modal.item-details variant="primary" @click="editItem(data.item)" pill><b-icon icon="pencil"></b-icon></b-button>
              <b-button size="sm" class="ml-1" variant="danger" @click="deleteItem(data.item)" pill><b-icon icon="dash-circle-fill"></b-icon></b-button>
            </slot>
          </template>
        </b-table>
      </div>
    </div>
    <slot name="detailsModal" v-on:item-added="itemAdded" v-on:item-deleted="itemDeleted">
      <h1>No modal content supplied!</h1>
    </slot>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        items: [],
      }
    },
    methods: {
      createItem() {
        console.log('createItem')
        this.$emit('item-selected', this.newItem())
      },
      editItem(item) {
        console.log(`editItem: ${item}`)
        this.$emit('item-selected', item)
      },
      itemAdded(item) {
        console.log(`itemAdded: ${item}`)
        this.items.push(item)
      },
      itemDeleted(item) {
        console.log(`itemDeleted: ${item}`)
        this.items.splice(this.items.findIndex(otherItem => otherItem[this.primaryKey] === item[this.primaryKey]), 1)
      }
    },
    props: {
      deleteItem: Function,
      fields: Array,
      itemPromise: Function,
      newItem: Function,
      primaryKey: String,
    },
    mounted() {
      this.itemPromise()
      .then(response => {
        this.items = response.data
      })
      .catch(function(error) {
        console.log(error)
      })
    },
  }
</script>
