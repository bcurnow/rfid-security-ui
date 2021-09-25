<template>
  <div class="container text-left">
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
          caption-top
          hover
          no-provider-sorting
          no-provider-filtering
          sort-icon-left>
          <template #table-caption>
            <slot name="caption"></slot>
            <slot name="addButton">
              <b-button class="mb-1" size="md" v-b-modal.item-details variant="primary" @click="createItem" v-if="hasCreateFunction" pill><b-icon icon="plus-circle-fill"></b-icon> Add</b-button>
            </slot>
          </template>
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #cell(controls)="controlsProps">
            <div class="text-nowrap text-right">
              <slot name="standardControls" :item="controlsProps.item" v-if="includeControls(controlsProps.item[primaryKey])">
                  <b-button size="sm" class="ml-1" v-b-modal.item-details variant="primary" @click="editItem(controlsProps.item)" v-if="hasUpdateFunction" v-b-tooltip="{ title: 'Edit', variant: 'primary' }" pill><b-icon icon="pencil"></b-icon></b-button>
                  <b-button size="sm" class="ml-1" variant="danger" @click="handleDelete(controlsProps.item)" v-if="hasDeleteFunction" v-b-tooltip="{ title: 'Delete', variant: 'danger' }" pill><b-icon icon="dash-circle-fill"></b-icon></b-button>
              </slot>
              <slot name="customControls" :item="controlsProps.item" v-if="includeControls(controlsProps.item[primaryKey])">
              </slot>
            </div>
          </template>
        </b-table>
        <b-alert :show="hasError" variant="danger" fade dismissible>{{ tableError }}</b-alert>
      </div>
    </div>
    <b-modal id="item-details" :title="itemDetailsTitle" @show="showModal" @ok="handleModalOk" :ok-disabled="isModalOkDisabled">
      <div class="text-center text-info my-2" v-show="modalLoading">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
      <div ref="modalForm" v-show="!modalLoading">
        <form ref="itemDetailsForm">
          <slot name="formGroups" :item="selected" :isNew="isNew"></slot>
        </form>
      </div>
    </b-modal>
  </div>
</template>
<script>
  import errorToString from '@/components/Error.js'

  export default {
    computed: {
      emptyMessage: function() {
        return `No ${this.itemType}[s] found`
      },
      hasCreateFunction: function() {
        return this.createItemPromise || this.submitHandler
      },
      hasDeleteFunction: function() {
        return this.deleteItemPromise
      },
      hasError: function() {
        return this.tableError != null
      },
      hasUpdateFunction: function() {
        return this.updateItemPromise
      },
      isModalOkDisabled: function() {
        return this.modalOkDisabled()
      },
      itemDetailsTitle: function() {
        return `${this.itemType} Details`
      },
    },
    data() {
      return {
        isNew: false,
        modalLoading: true,
        selected: {},
        tableError: null,
      }
    },
    methods: {
      afterModalChange() {
        this.$bvModal.hide('item-details')
        this.refreshItems()
      },
      checkFormValidity() {
        const valid = this.$refs.itemDetailsForm.checkValidity()
        for (const property in this.validationStates) {
          this.validationStates[property] = valid
        }
        return valid
      },
      createItem() {
        // In order to maintain reactivity, we need to ensure that the selected Object
        this.selected = {}
        this.isNew = true
      },
      editItem(item) {
        this.selected = Object.assign({}, item)
        this.isNew = false
      },
      handleDelete(item) {
        this.$bvModal.msgBoxConfirm(`Are you sure you want to delete ${this.itemType.toLowerCase()} '${this.itemToDisplayString(item)}'?`, {
          title: `Delete ${this.itemType}?`,
        })
        .then(value => {
          if (value) {
            this.deleteItemPromise(item)
            .then(() => {
              this.refreshItems()
            })
            .catch(err => {
              this.$bvModal.msgBoxOk(`Unable to delete ${this.itemType.toLowerCase()} '${this.itemToDisplayString(item)}': ${errorToString(err)}`)
            })
          }
        })
      },
      handleModalOk(bvModalEvt) {
        bvModalEvt.preventDefault()

        if (! this.checkFormValidity()) {
          return
        }

        this.submitHandler('item-details', this.refreshItems)
      },
      handleItemDetailsFormSubmit() {
        if (this.isNew) {
          // This is a create
          this.createItemPromise(this.selected)
          .then(() => {
            this.afterModalChange()
          })
          .catch(err => {
            this.$bvModal.msgBoxOk(`Unable to create ${this.itemType.toLowerCase()} '${this.itemToDisplayString(this.selected)}': ${this.errorResolver(err)}`)
          })
        } else {
          //This is an update
          this.updateItemPromise(this.selected)
          .then(() => {
            this.afterModalChange()
          })
          .catch(err => {
            this.$bvModal.msgBoxOk(`Unable to update ${this.itemType.toLowerCase()} '${this.itemToDisplayString(this.selected)}': ${this.errorResolver(err)}`)
          })
        }
      },
      includeControls(key) {
        if (this.noControlsForPKs.findIndex(filterKey => filterKey === key) > -1) {
          return false
        }
        return true
      },
      itemsProvider() {
        return this.itemsPromise()
        .then(response => {
          return response.data
        })
        .catch(err => {
          this.tableError = `An error occurred while loading the data: ${errorToString(err)}`
          return []
        })
      },
      refreshItems() {
        this.$refs.itemsTable.refresh()
      },
      showModal() {
        this.modalLoading = true
        for (const property in this.validationStates) {
          this.validationStates[property] = null
        }
        this.showModalCallback(() => {
          this.modalLoading = false
        })
      },
    },
    props: {
      createItemPromise: Function,
      deleteItemPromise: Function,
      fields: {
        type: Array,
        required: true
      },
      itemToDisplayString: {
        type: Function,
        default: function(item) {
          return item[this.primaryKey]
        },
      },
      itemsPromise: {
        type: Function,
        required: true,
      },
      itemType: {
        type: String,
        required: true,
      },
      modalOkDisabled: {
        type: Function,
        default: function() {
          return false
        },
      },
      noControlsForPKs: {
        type: Array,
        default: function() {
          return []
        },
      },
      primaryKey: {
        type: String,
        default: "id",
      },
      showModalCallback: {
        type: Function,
        default: function(finishedCallback) {
          finishedCallback()
        },
      },
      submitHandler: {
        type: Function,
        default: function() {
          this.handleItemDetailsFormSubmit()
        },
      },
      updateItemPromise: Function,
      validationStates: {
        type: Object,
        required: true,
      },
    },
  }
</script>
