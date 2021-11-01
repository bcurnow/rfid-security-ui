<template>
  <div class='container text-left'>
    <div class='row'>
      <div class='col-sm'>
        <b-table
          borderless
          caption-top
          :current-page='tableData.currentPage'
          :fields='fields'
          :filter='tableData.filter'
          @filtered='onFiltered'
          head-row-variant='primary'
          hover
          :id='tableRef'
          :items='itemsProvider'
          no-provider-sorting
          :per-page='perPage'
          :primary-key='itemClass.primarykey'
          :ref='tableRef'
          responsive='md'
          @row-clicked='rowClicked'
          @row-selected='rowSelected'
          show-empty
          :selectable='rowClicked != null'
          :select-mode='selectMode'
          :sort-by='sortBy'
          sort-icon-left
          striped>
          <template #table-caption>
            <slot name='caption'></slot>
          </template>
          <template #table-busy>
            <div class='text-center text-primary my-2'>
              <b-spinner class='align-middle'></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #thead-top>
            <div>
              <div v-if='$slots.headerMessage'>
                <b-tr class='table-borderless'>
                  <b-th :colspan='fields.length'>
                    <slot name='headerMessage'></slot>
                  </b-th>
                </b-tr>
              </div>
              <div v-if='!disableFiltering'>
                <b-tr>
                  <b-th :colspan='fields.length'>
                    <slot name='thead-filter'>
                      <b-form-group class='mb-0' label='Filter' label-for='filter-input' label-cols='auto' label-size='sm'>
                        <b-input-group size='sm'>
                          <b-form-input id='filter-input' v-model='tableData.filter' type='search' placeholder='Type to Search' debounce='250'></b-form-input>
                          <b-input-group-append>
                            <b-button :disabled='!tableData.filter' @click='tableData.filter = ""'>Clear</b-button>
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
            <div class='text-right'>
              <slot name='addButton'>
                <b-button size='md' variant='primary' @click='createItem' v-if='hasCreateFunction' v-b-tooltip.v-primary='`Add ${itemClass.type}`' pill><b-icon icon='plus-circle-fill'></b-icon></b-button>
              </slot>
            </div>
          </template>
          <template v-for='field in customRenderFields' v-slot:[toCell(field)]='props'>
            <slot :name='field' v-bind='props'></slot>
          </template>
          <template #cell(controls)='props'>
            <div class='text-nowrap text-right'>
              <slot name='customControlsPre' v-bind='props' v-if='isControllable(props.item)'></slot>
              <slot name='standardControls' :item='props.item' v-if='isControllable(props.item)'>
                  <b-button size='sm' class='ml-1' variant='primary' @click='editItem(props.item)' v-if='hasUpdateFunction' v-b-tooltip.v-primary="'Edit'" pill><b-icon class='mb-1 mt-1' icon='pencil'></b-icon></b-button>
                  <b-button size='sm' class='ml-1' variant='danger' @click='handleDelete(props.item)' v-if='hasDeleteFunction' v-b-tooltip.v-danger="'Delete'" pill><b-icon class='mb-1 mt-1' icon='dash-circle-fill'></b-icon></b-button>
              </slot>
              <slot name='customControlsPost' v-bind='props' v-if='isControllable(props.item)'></slot>
            </div>
          </template>
          <template #empty>
            <div class='text-center'>
              <slot name='empty'>{{ emptyMessage }}</slot>
            </div>
          </template>
          <template #emptyfiltered>
            <div class='text-center'>
              <slot name='emptyfiltered'>{{ emptyFilteredMessage }}</slot>
            </div>
          </template>
        </b-table>
        <b-pagination v-if='tableData.totalRows > perPage' v-model='tableData.currentPage' :per-page='perPage' :total-rows='tableData.totalRows' :value='tableData.currentPage'></b-pagination>
        <b-alert :show='tableData.errorMessage != null' variant='danger' fade dismissible>{{ tableData.errorMessage }}</b-alert>
      </div>
    </div>
    <b-modal :id='modalRef' :ref='modalRef' :title='`${itemClass.type} Details`' @show='showModal' @ok='handleModalOk' :ok-disabled='okDisabled' :ok-only='okOnly'>
      <div class='text-center text-info my-2' v-show='modalData.loading'>
        <b-spinner class='align-middle'></b-spinner>
        <strong>Loading...</strong>
      </div>
      <div v-show='!modalData.loading'>
        <b-form id='itemDetailsForm' ref='itemDetailsForm'>
          <slot name='formGroups' :item='selected' :isNew='isNew' :form='`itemDetailsForm`'></slot>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>
<script>
  import errorToString from '@/components/Error.js'

  export default {
    computed: {
      emptyMessage: function() {
        return `No ${this.itemClass.type.toLowerCase()}s found`
      },
      emptyFilteredMessage: function() {
        return `No ${this.itemClass.type.toLowerCase()}s found with current filter settings`
      },
      hasCreateFunction: function() {
        return this.createItemPromise
      },
      hasDeleteFunction: function() {
        return this.deleteItemPromise
      },
      hasUpdateFunction: function() {
        return this.updateItemPromise
      },
      modalRef: function() {
        return `${this.itemClass.type.replace(/ /g, '')}Modal`
      },
      okDisabled: function() {
        // Wrapped in an computed property because we need the value to update if changed by the child
        return this.modalOkDisabled()
      },
      okOnly: function() {
        // Wrapped in an computed property because we need the value to update if changed by the child
        return this.modalOkOnly()
      },
      table: function() {
        return this.$refs[this.tableRef]
      },
      tableRef: function() {
        return `${this.itemClass.type.replace(/ /g, '')}Table`
      },
    },
    data() {
      return {
        isNew: false,
        modalData: {
          processClicks: true,
          loading: true,
        },
        selected: {},
        tableData: {
          currentPage: 1,
          errorMessage: null,
          filter: '',
          items: [],
          retrieveItems: true,
          totalRows: 0,
        },
      }
    },
    methods: {
      afterModalChange() {
        // We're done with whatever change we attempted
        this.modalData.processClicks = true
        this.$bvModal.hide(this.modalRef)
        this.refreshItems()
      },
      checkFormValidity() {
        // Reset the validationStates to null to clear any previous messages (since this only fires invalid events)
        for (const property in this.validationStates) {
          this.validationStates[property] = null
        }
        const formValid = this.$refs.itemDetailsForm.checkValidity()
        this.postValidation(this.$refs.itemDetailsForm, formValid)
        return formValid
      },
      clearSelected() {
        this.table.clearSelected()
      },
      convertToString(value) {
        if (value === null || typeof value === 'undefined') {
          return ''
        } else if (value instanceof Object) {
          return Object.keys(value)
            .sort()
            .map(key => this.convertToString(value[key]))
            .join(' ')
        } else {
          return String(value)
        }
      },
      createItem() {
        // In order to maintain reactivity, we need to ensure that the selected Object is set to something
        this.selected = new this.itemClass({})
        this.isNew = true
        this.$bvModal.show(this.modalRef)
      },
      editItem(item) {
        //this.selected = Object.assign({}, item)
        this.selected = Object.assign(new this.itemClass({}), item)
        this.isNew = false
        this.$bvModal.show(this.modalRef)
      },
      handleDelete(item) {
        this.$bvModal.msgBoxConfirm(`Are you sure you want to delete ${this.itemClass.type.toLowerCase()} ${item.displayIdentifier()}?`, {
          title: `Delete ${this.itemClass.type}?`,
        })
        .then(confirm => {
          if (confirm) {
            this.deleteItemPromise(item)
            .then(() => this.refreshItems())
            .catch(err => this.$bvModal.msgBoxOk(`Unable to delete ${this.itemClass.type.toLowerCase()} ${item.displayIdentifier()}: ${errorToString(err)}`))
          }
        })
      },
      handleModalOk(bvModalEvt) {
        bvModalEvt.preventDefault()

        if (! this.checkFormValidity()) {
          return
        }

        if (!this.modalData.processClicks) {
          // This ensures that if someone double clicks the OK button, we don't process it
          return
        }

        // We're about to process updates, make sure to disable the click handling
        this.modalData.processClicks = false

        if (this.isNew) {
          // This is a create
          this.createItemPromise(this.selected)
          .then(() => this.afterModalChange())
          .catch(err => {
            this.$bvModal.msgBoxOk(`Unable to create ${this.itemClass.type.toLowerCase()}: ${errorToString(err)}`)
          })
        } else {
          //This is an update
          this.updateItemPromise(this.selected)
          .then(() => this.afterModalChange())
          .catch(err => {
            this.$bvModal.msgBoxOk(`Unable to update ${this.itemClass.type.toLowerCase()} ${this.selected.displayIdentifier()}: ${errorToString(err)}`)
          })
        }
      },
      isControllable(item) {
        if (item.isControllable) {
          return item.isControllable()
        }
        // If the item doesn't have an isControllable function, it is controllable by default
        return true
      },
      isRowSelected(index) {
        this.table.isRowSelected(index)
      },
      async itemsProvider(ctx) {
        if (this.tableData.retrieveItems) {
          try {
            const response = await this.itemsPromise()
            this.tableData.items = response
            this.tableData.retrieveItems = false
          } catch(err) {
            this.tableData.errorMessage = `An error occurred while loading the data: ${errorToString(err)}`
            this.tableData.items = []
            // Don't reset retrieveItems since we failed
          }
        }

        // At this point, tableData.items has the correct set of items
        // Reset the total rows to the full count (in case filtering had been applied)
        this.tableData.totalRows = this.tableData.items.length
        return this.itemsProviderApplyContext(ctx)
      },
      itemsProviderApplyContext(ctx) {
        // Apply filtering of the list first, then pagination
        const items = this.itemsProviderFilter(ctx)
        // TODO: Implement pagination on the server side (maybe? we don't have a lot of data)
        let sliceStart = (ctx.currentPage - 1) * ctx.perPage
        let sliceEnd = sliceStart + ctx.perPage

        return items.slice(sliceStart, sliceEnd)
      },
      itemsProviderFilter(ctx) {
        if (ctx.filter === null || ctx.filter === '') {
          // No filter, return the data unmodified
          return this.tableData.items
        }
        return this.tableData.items.filter(item => this.convertToString(item).includes(ctx.filter))
      },
      onFiltered(_, length) {
        // Reset the pagination properties to reflect the filtering
        this.tableData.totalRows = length
        this.tableData.currentPage = 1
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
        this.modalData.loading = true
        this.modalData.processClicks = true
        for (const property in this.validationStates) {
          this.validationStates[property] = null
        }
        Promise.resolve(this.showModalCallback(this.selected, this.isNew)).finally(() => this.modalData.loading = false)
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
      disableFiltering: {
        type: Boolean,
        default: false,
      },
      fields: {
        type: Array,
        required: true
      },
      itemClass: {
        type: Function,
        required: true,
      },
      itemsPromise: {
        type: Function,
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
      perPage: {
        type: Number,
        default: 10,
      },
      postValidation: {
        type: Function,
        default: function() {},
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
        default: function() {},
      },
      sortBy: {
        type: String,
        default: function() {
          this.itemClass.primaryKey
        },
      },
      updateItemPromise: Function,
      validationStates: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      if (this.$route.query && this.$route.query.filter) {
        this.tableData.filter = this.$route.query.filter
      }
    }
  }
</script>
