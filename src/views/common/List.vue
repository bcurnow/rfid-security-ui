<template>
  <div class="container text-left">
    <b-button class="mb-1" size="md" v-b-modal.item-details variant="primary" @click="createItem" pill><b-icon icon="plus-circle-fill"></b-icon> Add</b-button>
    <div class="row">
      <div class="col-sm">
        <b-table
          id="itemsTable"
          responsive="md"
          :items="itemsProvider"
          :fields="fields"
          :primary-key="primaryKey"
          :sort-by="primaryKey"
          :empty-text="emptyMessage"
          show-empty
          ref="itemsTable"
          head-row-variant="primary"
          sort-icon-left
          hover
          no-provider-sorting
          no-provider-filtering>
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #cell(controls)="data">
            <div class="text-nowrap text-right">
              <slot name="standardControls" v-if="includeControls(data.item[primaryKey])">
                  <b-button size="sm" class="ml-1" v-b-modal.item-details variant="primary" @click="editItem(data.item)" v-b-tooltip="{ title: 'Edit', variant: 'primary' }" pill><b-icon icon="pencil"></b-icon></b-button>
                  <b-button size="sm" class="ml-1" variant="danger" @click="handleDelete(data.item)" v-if="hasDeleteFunction" v-b-tooltip="{ title: 'Delete', variant: 'danger' }" pill><b-icon icon="dash-circle-fill"></b-icon></b-button>
              </slot>
              <slot name="customControls" :item="data.item">
              </slot>
            </div>
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
      emptyMessage: function() {
        return `No ${this.itemType}[s] found`
      },
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
        selected: {},
      }
    },
    methods: {
      createItem() {
        this.selected = {}
        this.isNew = true
      },
      editItem(item) {
        this.selected = item
        this.isNew = false
      },
      handleDelete(item) {
        this.$bvModal.msgBoxConfirm(`Are you sure you want to delete '${this.itemString(item)}'?`, {
          title: `Delete ${this.itemType}?`,
        })
        .then(value => {
          if (value) {
            this.deleteItemPromise(item)
            .then(() => {
              this.$refs.itemsTable.refresh()
            })
            .catch(err => {
              this.$bvModal.msgBoxOk(`Unable to delete ${this.itemType.toLowerCase()} '${this.itemString(item)}': ${this.errorResolver(err)}`)
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
      itemAdded() {
        this.$refs.itemsTable.refresh()
      },
      itemsProvider() {
        return this.itemsPromise()
        .then(response => {
          return response.data
        })
        .catch(err => {
          this.error = `An error occurred while loading the data: ${err}`
          return []
        })
      }
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
      itemString: {
        type: Function,
        default: function(item) {
          return item[this.primaryKey]
        },
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
      primaryKey: {
        type: String,
        default: "id",
      },
      controlFilter: {
        type: Array,
        default: function() {
          return []
        },
      }
    },
  }
</script>
