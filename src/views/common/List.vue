<template>
  <div class="container text-left">
    <b-button class="mb-1" size="md" v-b-modal.item-details variant="primary" @click="createItem" pill><b-icon icon="plus-circle-fill"></b-icon> Add</b-button>
    <div class="row">
      <div class="col-sm">
        <b-table id="CommonList" responsive="md" :items="items" :fields="fields" :primary-key="primaryKey" :sort-by="primaryKey" head-row-variant="primary" sort-icon-left hover>
          <template #cell(controls)="data">
            <slot name="controlsCell" v-if="includeControls(data.item[primaryKey])">
              <div class="text-nowrap">
                <b-button size="sm" v-b-modal.item-details variant="primary" @click="editItem(data.item)" pill><b-icon icon="pencil"></b-icon></b-button>
                <b-button v-if="hasDeleteFunction" size="sm" class="ml-1" variant="danger" @click="handleDelete(data.item)" pill><b-icon icon="dash-circle-fill"></b-icon></b-button>
              </div>
            </slot>
          </template>
        </b-table>
        <b-alert :show="hasError" variant="danger" fade dismissible>{{ error }}</b-alert>
      </div>
    </div>
    <slot name="detailsModal" :itemAdded="itemAdded" :selected="selected" :isNew="isNew">
      <b-alert show variant="warning" fade dismissible>No modal content supplied!</b-alert>
    </slot>
  </div>
</template>
<script>
  export default {
    computed: {
      hasDeleteFunction: function() {
        return this.deleteItemPromise && this.itemType
      },
      hasError: function() {
        return this.error != null
      },
    },
    data() {
      return {
        error: null,
        isNew: false,
        items: [],
        selected: {},
      }
    },
    methods: {
      createItem() {
        this.selected = this.newItem()
        this.isNew = true
      },
      editItem(item) {
        this.selected = item
        this.isNew = false
      },
      handleDelete(item) {
        this.$bvModal.msgBoxConfirm(`Are you sure you want to delete '${item[this.primaryKey]}'?`, {
          title: `Delete ${this.itemType}?`,
        })
        .then(value => {
          if (value) {
            this.deleteItemPromise(item)
            .then(() => {
              this.items.splice(this.items.findIndex(otherItem => otherItem[this.primaryKey] === item[this.primaryKey]), 1)
            })
            .catch(err => {
              this.$bvModal.msgBoxOk(`Unable to delete ${this.itemType.toLowerCase()} '${item[this.primaryKey]}': ${this.errorResolver(err)}`)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      },
      includeControls(key) {
        if (this.controlFilter.findIndex(filterKey => filterKey === key) > -1) {
          return false
        }
        return true
      },
      itemAdded(item) {
        this.items.push(item)
      },
    },
    props: {
      deleteItemPromise: Function,
      errorResolver: {
        type: Function,
        default: function(error) {
          if (error) {
            return error.toString()
          }
          return ""
        }
      },
      itemType: String,
      fields: {
        type: Array,
        required: true
      },
      itemsPromise: {
        type: Function,
        required: true,
      },
      newItem: {
        type: Function,
        default: function() {
          return {}
        }
      },
      primaryKey: {
        type: String,
        required: true,
      },
      controlFilter: {
        type: Array,
        default: function() {
          return []
        },
      }
    },
    mounted() {
      this.itemsPromise()
      .then(response => {
        this.items = response.data
      })
      .catch(err => {
        this.error = `An error occurred while loading the data: ${err}`
      })
    },
  }
</script>
