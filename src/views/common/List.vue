<template>
  <div class="container text-left">
    <div class="row">
      <div class="col-sm">
        <b-table
          borderless
          caption-top
          :current-page="tableData.currentPage"
          :fields="fields"
          :filter="tableData.filter"
          head-row-variant="primary"
          hover
          :id="tableRef"
          :items="itemsProvider"
          no-provider-filtering
          no-provider-sorting
          :per-page="perPage"
          :primary-key="primaryKey"
          :ref="tableRef"
          responsive="md"
          @row-clicked="rowClicked"
          @row-selected="rowSelected"
          show-empty
          :selectable="rowClicked != null"
          :select-mode="selectMode"
          :sort-by="primaryKey"
          sort-icon-left
          striped>
          <template #table-caption>
            <slot name="caption"></slot>
          </template>
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #thead-top>
            <div>
              <div v-if="$slots.headerMessage">
                <b-tr class="table-borderless">
                  <b-th :colspan="fields.length">
                    <slot name="headerMessage"></slot>
                  </b-th>
                </b-tr>
              </div>
              <div v-if="!disableFiltering">
                <b-tr>
                  <b-th :colspan="fields.length">
                    <slot name="thead-filter">
                      <b-form-group class="mb-0" label="Filter" label-for="filter-input" label-cols="auto" label-size="sm">
                        <b-input-group size="sm">
                          <b-form-input id="filter-input" v-model="tableData.filter" type="search" placeholder="Type to Search"></b-form-input>
                          <b-input-group-append>
                            <b-button :disabled="!tableData.filter" @click="tableData.filter = ''">Clear</b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                    </slot>
                  </b-th>
                </b-tr>
              </div>
            </div>
          </template>
          <template #head(controls)>
            <div class="text-right">
              <slot name="addButton">
                <b-button size="md" variant="primary" @click="createItem" v-if="hasCreateFunction" v-b-tooltip.v-primary="`Add ${itemType}`" pill><b-icon icon="plus-circle-fill"></b-icon></b-button>
              </slot>
            </div>
          </template>
          <template v-for="field in customRenderFields" v-slot:[toCell(field)]="props">
            <slot :name="field" v-bind="props"></slot>
          </template>
          <template #cell(controls)="props">
            <div class="text-nowrap text-right">
              <slot name="customControlsPre" v-bind="props" v-if="includeControls(props.item[primaryKey])"></slot>
              <slot name="standardControls" :item="props.item" v-if="includeControls(props.item[primaryKey])">
                  <b-button size="sm" class="ml-1" variant="primary" @click="editItem(props.item)" v-if="hasUpdateFunction" v-b-tooltip="{ title: 'Edit', variant: 'primary' }" pill><b-icon class="mb-1 mt-1" icon="pencil"></b-icon></b-button>
                  <b-button size="sm" class="ml-1" variant="danger" @click="handleDelete(props.item)" v-if="hasDeleteFunction" v-b-tooltip="{ title: 'Delete', variant: 'danger' }" pill><b-icon class="mb-1 mt-1" icon="dash-circle-fill"></b-icon></b-button>
              </slot>
              <slot name="customControlsPost" v-bind="props" v-if="includeControls(props.item[primaryKey])"></slot>
            </div>
          </template>
          <template #empty>
            <div class="text-center">
              <slot name="empty">{{ emptyMessage }}</slot>
            </div>
          </template>
          <template #emptyfiltered>
            <div class="text-center">
              <slot name="emptyfiltered">{{ emptyFilteredMessage }}</slot>
            </div>
          </template>
        </b-table>
        <b-pagination v-if="showPaginationControls" v-model="tableData.currentPage" :per-page="perPage" :total-rows="totalRows" :value="tableData.currentPage"></b-pagination>
        <b-alert :show="hasError" variant="danger" fade dismissible>{{ tableData.tableError }}</b-alert>
      </div>
    </div>
    <b-modal :id="this.modalRef" :title="itemDetailsTitle" @show="showModal" @ok="handleModalOk" :ok-disabled="modalOkDisabled()" :ok-only="modalOkOnly()">
      <div class="text-center text-info my-2" v-show="modalLoading">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
      <div v-show="!modalLoading">
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
        return `No ${this.itemType.toLowerCase()}s found`
      },
      emptyFilteredMessage: function() {
        return `No ${this.itemType.toLowerCase()}s found with current filter settings`
      },
      hasCreateFunction: function() {
        return this.createItemPromise
      },
      hasDeleteFunction: function() {
        return this.deleteItemPromise
      },
      hasError: function() {
        return this.tableData.tableError != null
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
      modalRef: function() {
        return `${this.id}Modal`
      },
      showPaginationControls: function() {
        return this.totalRows > this.perPage
      },
      table: function() {
        return this.$refs[this.tableRef]
      },
      tableRef: function() {
        return `${this.id}Table`
      },
      totalRows: function() {
        return this.tableData.items.length
      }
    },
    data() {
      return {
        tableData: {
          currentPage: 1,
          filter: '',
          items: [],
          retrieveItems: true,
          tableError: null,
        },
        isNew: false,
        modalLoading: true,
        selected: {},
      }
    },
    methods: {
      afterModalChange() {
        this.$bvModal.hide(this.modalRef)
        this.refreshItems()
      },
      checkFormValidity() {
        // Reset the validationStates to null to clear any previous messages (since this only fires invalid events)
        for (const property in this.validationStates) {
          this.validationStates[property] = null
        }
        const valid = this.$refs.itemDetailsForm.checkValidity()
        return valid
      },
      clearSelected() {
        this.table.clearSelected()
      },
      createItem() {
        // In order to maintain reactivity, we need to ensure that the selected Object
        this.selected = {}
        this.isNew = true
        this.$bvModal.show(this.modalRef)
      },
      editItem(item) {
        this.selected = Object.assign({}, item)
        this.isNew = false
        this.$bvModal.show(this.modalRef)
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

        this.handleItemDetailsFormSubmit()
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
      isRowSelected(index) {
        this.table.isRowSelected(index)
      },
      itemsProvider(ctx) {
        if (this.tableData.retrieveItems) {
          return this.itemsPromise()
          .then(response => {
            this.tableData.items = response.data
            this.tableData.retrieveItems = false
            return this.itemsProviderTransform(this.tableData, ctx)
          })
          .catch(err => {
            this.tableData.tableError = `An error occurred while loading the data: ${errorToString(err)}`
            return []
          })
        } else {
          return this.itemsProviderTransform(this.tableData, ctx)
        }
      },
      itemsProviderTransform(tableData, ctx) {
        // TODO: Implement pagination on the server side
        let sliceStart = (ctx.currentPage - 1) * ctx.perPage
        let sliceEnd = sliceStart + ctx.perPage

        return tableData.items.slice(sliceStart, sliceEnd)
      },
      refreshItems() {
        this.tableData.retrieveItems = true
        this.table.refresh()
      },
      selectAllRows() {
        this.table.selectAllRows()
      },
      selectRow(index) {
        this.table.selectRow(index)
      },
      showModal() {
        this.modalLoading = true
        for (const property in this.validationStates) {
          this.validationStates[property] = null
        }
        this.showModalCallback(this.selected, () => {
          this.modalLoading = false
        })
      },
      toCell(slot) {
        return `cell(${slot})`
      },
      unselectRow(index) {
        this.table.unselectRow(index)
      },
    },
    props: {
      createItemPromise: Function,
      customRenderFields: {
        type: Array,
        default: function() {
          return []
        }
      },
      deleteItemPromise: Function,
      errorResolver: {
        type:Function,
        default: function(err) {
          return this.$RFIDSecuritySvc.errorToString(err)
        }
      },
      disableFiltering: {
        type: Boolean,
        default: false,
      },
      fields: {
        type: Array,
        required: true
      },
      id: {
        type: String,
        required: true,
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
      modalOkOnly: {
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
      perPage: {
        type: Number,
        default: 10,
      },
      primaryKey: {
        type: String,
        default: "id",
      },
      rowClicked: {
        type: Function,
        default: function() {},
      },
      rowSelected: {
        type: Function,
        default: function() {},
      },
      selectMode: {
        type: String,
        default: 'single'
      },
      showModalCallback: {
        type: Function,
        default: function(item, finishedCallback) {
          finishedCallback()
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
