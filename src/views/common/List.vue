<template>
  <div class="container text-start">
    <div class="row">
      <div class="col-sm">
        <BTable
          borderless
          caption-top
          :current-page="tableData.currentPage"
          :fields="fields"
          :filter="tableData.filter"
          @filtered="onFiltered"
          head-row-variant="primary"
          hover
          :id="tableRef"
          :items="itemsProvider"
          no-provider-sorting
          :per-page="perPage"
          :primary-key="itemClass.primaryKey"
          :ref="tableRef"
          responsive="md"
          @row-clicked="rowClicked"
          @row-selected="rowSelected"
          show-empty
          :selectable="rowClicked != null"
          :select-mode="selectMode"
          :sort-by="sortBy"
          striped>
          <template #table-caption>
            <slot name="caption" />
          </template>
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <BSpinner class="align-middle" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template #thead-top>
            <Btr v-if="slots.headerMessage" class="table-borderless">
              <BTh :colspan="fields.length">
                <slot name="headerMessage" />
              </BTh>
            </Btr>
            <Btr v-if="!disableFiltering">
              <BTh :colspan="fields.length">
                <slot name="thead-filter">
                  <BFormGroup class="mb-0" label="Filter" label-for="filter-input" label-cols="auto" label-size="sm">
                    <BInputGroup size="sm">
                      <BFormInput id="filter-input" v-model="tableData.filter" type="search" placeholder="Type to Search" :debounce="250" />
                      <BButton :disabled="!tableData.filter" @click="tableData.filter = ''">Clear</BButton>
                    </BInputGroup>
                  </BFormGroup>
                </slot>
              </BTh>
            </Btr>
          </template>
          <template #head(controls)>
            <div class="text-end">
              <slot name="addButton">
                <BButton
                  v-if="hasCreateFunction"
                  size="md"
                  variant="primary"
                  @click="createItem"
                  v-b-tooltip.v-primary="`Add ${itemClass.type}`"
                  pill>
                  <i class="bi bi-plus-circle-fill" />
                </BButton>
              </slot>
            </div>
          </template>
          <template v-for="field in customRenderFields" v-slot:[toCell(field)]="props">
            <slot :name="field" v-bind="props" />
          </template>
          <template #cell(controls)="props">
            <div class="text-nowrap text-end">
              <template v-if="isControllable(props.item)">
                <slot name="customControlsPre" v-bind="props" />
                <slot name="standardControls" :item="props.item">
                  <BButton v-if="hasUpdateFunction" size="sm" class="ms-1" variant="primary" @click="editItem(props.item)" v-b-tooltip.v-primary="'Edit'" pill>
                    <i class="bi bi-pencil me-1 mt-1 mb-1" />
                  </BButton>
                  <BButton v-if="hasDeleteFunction" size="sm" class="ms-1" variant="danger" @click="handleDelete(props.item)" v-b-tooltip.v-danger="'Delete'" pill>
                    <i class="bi bi-dash-circle-fill me-1 mt-1 mb-1" />
                  </BButton>
                </slot>
                <slot name="customControlsPost" v-bind="props" />
              </template>
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
        </BTable>
        <BPagination
          v-if="tableData.totalRows > perPage"
          v-model="tableData.currentPage"
          :per-page="perPage"
          :total-rows="tableData.totalRows" />
        <BAlert v-if="tableData.errorMessage" variant="danger" dismissible @dismissed="tableData.errorMessage = null">
          {{ tableData.errorMessage }}
        </BAlert>
      </div>
    </div>
    <BModal
      :id="modalRef"
      :ref="modalRef"
      :title="`${itemClass.type} Details`"
      @show="showModal"
      @ok="handleModalOk"
      :ok-disabled="okDisabled"
      :ok-only="okOnly">
      <div v-if="modalData.loading" class="text-center text-info my-2">
        <BSpinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
      <div v-else>
        <BForm id="itemDetailsForm" ref="itemDetailsForm">
          <slot name="formGroups" :item="selected" :isNew="isNew" :form="`itemDetailsForm`" />
        </BForm>
      </div>
    </BModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useSlots } from 'vue'
import { useRoute } from 'vue-router'
import { useModal } from 'bootstrap-vue-next'
import type { TableField } from 'bootstrap-vue-next'
import type BaseModel from '@/components/model/BaseModel'
import errorToString from '@/components/Error'

// Type for the item class constructor
type ModelConstructor<T extends BaseModel> = {
  new (...args: unknown[]): T
  type: string
  primaryKey: string
}

// Type for the items provider context
interface TableContext {
  currentPage: number
  perPage: number
  filter: string
}

const props = withDefaults(defineProps<{
  createItemPromise?: (item: BaseModel) => Promise<void>
  customRenderFields?: string[]
  deleteItemPromise?: (item: BaseModel) => Promise<void>
  disableFiltering?: boolean
  fields: TableField[]
  itemClass: ModelConstructor<BaseModel>
  itemsPromise: () => Promise<BaseModel[]>
  modalOkDisabled?: () => boolean
  modalOkOnly?: () => boolean
  perPage?: number
  postValidation?: (form: HTMLFormElement, valid: boolean) => void
  rowClicked?: ((item: BaseModel) => void) | null
  rowSelected?: (items: BaseModel[]) => void
  selectMode?: string
  showModalCallback?: (item: BaseModel, isNew: boolean) => void | Promise<void>
  sortBy?: string
  updateItemPromise?: (item: BaseModel) => Promise<void>
  validationStates: Record<string, boolean | null>
}>(), {
  customRenderFields: () => [],
  disableFiltering: false,
  modalOkDisabled: () => false,
  modalOkOnly: () => false,
  perPage: 10,
  postValidation: () => {},
  rowClicked: null,
  rowSelected: () => {},
  selectMode: 'single',
  showModalCallback: () => {},
  sortBy: '',
})

const route = useRoute()
const slots = useSlots()
const { show: showBvModal, hide: hideBvModal, confirm, msgBoxOk } = useModal()

// Refs
const itemDetailsForm = ref<HTMLFormElement | null>(null)
const isNew = ref(false)
const selected = ref<BaseModel>(new props.itemClass({}))

const modalData = reactive({
  processClicks: true,
  loading: true,
})

const tableData = reactive({
  currentPage: 1,
  errorMessage: null as string | null,
  filter: route.query?.filter as string ?? '',
  items: [] as BaseModel[],
  retrieveItems: true,
  totalRows: 0,
})

// Computed
const emptyMessage = computed(() => `No ${props.itemClass.type.toLowerCase()}s found`)
const emptyFilteredMessage = computed(() => `No ${props.itemClass.type.toLowerCase()}s found with current filter settings`)
const hasCreateFunction = computed(() => !!props.createItemPromise)
const hasDeleteFunction = computed(() => !!props.deleteItemPromise)
const hasUpdateFunction = computed(() => !!props.updateItemPromise)
const modalRef = computed(() => `${props.itemClass.type.replace(/ /g, '')}Modal`)
const tableRef = computed(() => `${props.itemClass.type.replace(/ /g, '')}Table`)
const okDisabled = computed(() => props.modalOkDisabled())
const okOnly = computed(() => props.modalOkOnly())
const table = computed(() => tableRef.value)

// Methods
function toCell(slot: string): string {
  return `cell(${slot})`
}

function isControllable(item: BaseModel): boolean {
  return item.isControllable()
}

function afterModalChange(): void {
  modalData.processClicks = true
  hideBvModal(modalRef.value)
  refreshItems()
}

function checkFormValidity(): boolean {
  for (const property in props.validationStates) {
    props.validationStates[property] = null
  }
  const formValid = itemDetailsForm.value?.checkValidity() ?? false
  props.postValidation(itemDetailsForm.value!, formValid)
  return formValid
}

function createItem(): void {
  selected.value = new props.itemClass({})
  isNew.value = true
  showBvModal(modalRef.value)
}

function editItem(item: BaseModel): void {
  selected.value = Object.assign(new props.itemClass({}), item)
  isNew.value = false
  showBvModal(modalRef.value)
}

async function handleDelete(item: BaseModel): Promise<void> {
  const confirmed = await confirm(`Are you sure you want to delete ${props.itemClass.type.toLowerCase()} ${item.displayIdentifier()}?`, {
    title: `Delete ${props.itemClass.type}?`,
  })
  if (confirmed) {
    try {
      await props.deleteItemPromise!(item)
      refreshItems()
    } catch (err) {
      await msgBoxOk(`Unable to delete ${props.itemClass.type.toLowerCase()} ${item.displayIdentifier()}: ${errorToString(err as Error)}`)
    }
  }
}

async function handleModalOk(event: Event): Promise<void> {
  event.preventDefault()

  if (!checkFormValidity() || !modalData.processClicks) {
    return
  }

  modalData.processClicks = false

  try {
    if (isNew.value) {
      await props.createItemPromise!(selected.value)
    } else {
      await props.updateItemPromise!(selected.value)
    }
    afterModalChange()
  } catch (err) {
    const action = isNew.value ? 'create' : 'update'
    const identifier = isNew.value ? '' : ` ${selected.value.displayIdentifier()}`
    await msgBoxOk(`Unable to ${action} ${props.itemClass.type.toLowerCase()}${identifier}: ${errorToString(err as Error)}`)
    modalData.processClicks = true
  }
}

async function itemsProvider(ctx: TableContext): Promise<BaseModel[]> {
  if (tableData.retrieveItems) {
    try {
      tableData.items = await props.itemsPromise()
      tableData.retrieveItems = false
    } catch (err) {
      tableData.errorMessage = `An error occurred while loading the data: ${errorToString(err as Error)}`
      tableData.items = []
    }
  }
  tableData.totalRows = tableData.items.length
  return itemsProviderApplyContext(ctx)
}

function itemsProviderApplyContext(ctx: TableContext): BaseModel[] {
  const filtered = itemsProviderFilter(ctx)
  const start = (ctx.currentPage - 1) * ctx.perPage
  return filtered.slice(start, start + ctx.perPage)
}

function itemsProviderFilter(ctx: TableContext): BaseModel[] {
  if (!ctx.filter) {
    return tableData.items
  }
  const query = ctx.filter.toLowerCase()
  return tableData.items.filter(item =>
    JSON.stringify(item).toLowerCase().includes(query)
  )
}

function onFiltered(_: BaseModel[], length: number): void {
  tableData.totalRows = length
  tableData.currentPage = 1
}

function refreshItems(): void {
  tableData.retrieveItems = true
  // trigger table refresh via reactive state change
  tableData.currentPage = 1
}

function showModal(): void {
  modalData.loading = true
  modalData.processClicks = true
  for (const property in props.validationStates) {
    props.validationStates[property] = null
  }
  Promise.resolve(props.showModalCallback!(selected.value, isNew.value))
    .finally(() => { modalData.loading = false })
}

// Public methods exposed to parent components
defineExpose({
  clearSelected: () => (table.value as unknown as { clearSelected: () => void })?.clearSelected(),
  isRowSelected: (index: number) => (table.value as unknown as { isRowSelected: (i: number) => boolean })?.isRowSelected(index),
  refreshItems,
  selectAllRows: () => (table.value as unknown as { selectAllRows: () => void })?.selectAllRows(),
  selectRow: (index: number) => (table.value as unknown as { selectRow: (i: number) => void })?.selectRow(index),
  unselectRow: (index: number) => (table.value as unknown as { unselectRow: (i: number) => void })?.unselectRow(index),
})
</script>