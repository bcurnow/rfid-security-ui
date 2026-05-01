<template>
  <div>
    <div class="card overflow-hidden">
      <BTable borderless
              caption-top
              debounce="250"
              debounce-max-wait="2000"
              head-row-variant="primary"
              hover
              no-provider-paging
              no-provider-sorting
              responsive="md"
              show-empty
              small
              striped
              :busy="tableBusy"
              :current-page="currentPage"
              :fields="props.config.tableFields()"
              :filter="filter"
              :filter-function="applyFilter"
              :id="tableId"
              :items="tableItems"
              :per-page="props.config.itemsPerPage"
              :primary-key="primaryKey"
              ref="tableComponentRef"
              :selectable="selectable"
              :select-mode="selectMode"
              :sort-by="props.config.sortBy"
              @filtered="onFiltered"
              @row-clicked="onRowClicked"
              @row-selected="onRowSelected"
              @row-unselected="onRowUnselected">
        <BThead class="align-middle" />
        <template #table-caption>
          <slot name="caption" />
        </template>
        <template #table-busy>
          <div class="text-center text-primary">
            <BSpinner class="align-middle" />
            <strong>Loading...</strong>
          </div>
        </template>

        <template #thead-top>
          <BTr v-if="slots.headerMessage" class="table-borderless">
            <BTh :colspan="props.config.tableFields().length">
              <slot name="headerMessage" />
            </BTh>
          </BTr>
          <BTr v-if="props.config.filteringEnabled">
            <BTh :colspan="props.config.tableFields().length">
              <slot name="thead-filter">
                <BFormGroup label="Filter" label-for="filter-input" label-cols="auto" label-size="sm">
                  <BInputGroup size="sm">
                    <BFormInput id="filter-input" v-model="filter" type="search" placeholder="Type to Search" />
                    <BButton :disabled="!filter" @click="filter = ''">Clear</BButton>
                  </BInputGroup>
                </BFormGroup>
              </slot>
            </BTh>
          </BTr>
        </template>

        <template #head(controls)>
          <div class="text-nowrap text-end align-middle">
            <slot name="addButton">
              <BButton v-if="hasCreateFunction" size="sm" variant="primary" @click="createItem"
                       v-b-tooltip.v-primary="`Add ${props.config.itemClass.displayName()}`" pill>
                <VueFeather type="plus-circle" size="16" />
              </BButton>
            </slot>
            <slot name="refreshButton">
              <BButton size="sm" variant="primary" @click="refreshItems()" v-b-tooltip.v-primary="`Refresh the table`"
                       pill>
                <VueFeather type="refresh-cw" size="16" />
              </BButton>
            </slot>
          </div>
        </template>

        <template #cell(controls)="row">
          <div class="text-nowrap text-end">
            <slot name="customControlsPre" v-bind="row" />
            <slot name="standardControls" :item="row.item">
              <BButton v-if="hasUpdateFunction" size="sm" variant="primary" @click="editItem(row.item, row.index)"
                       v-b-tooltip.v-primary="'Edit'" pill>
                <VueFeather type="edit-2" size="16" />
              </BButton>
              <BButton v-if="hasDeleteFunction" size="sm" variant="danger" @click="deleteItem(row.item, row.index)"
                       v-b-tooltip.v-danger="'Delete'" pill>
                <VueFeather type="minus-circle" size="16" />
              </BButton>
            </slot>
            <slot name="customControlsPost" v-bind="row" />
          </div>
        </template>

        <template #empty>
          <div class="text-center">
            <slot name="empty">
              {{ filter ? emptyFilteredMessage : emptyMessage }}
            </slot>
          </div>
        </template>

        <!-- Include any of the slots provided to AppList. This allows custom rendering and override of any of the slots in AppList -->
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>

      </BTable>
    </div>

    <BPagination size="sm" v-model="currentPage" :per-page="props.config.itemsPerPage" :total-rows="totalRows" />

    <BAlert v-model="alertTimeout" :show="showAlert" variant="danger" dismissible @dismissed="alertMessage = ''" fade>
      {{ alertMessage }}
    </BAlert>

    <BModal :id="itemDetailsModalId" ref="itemDetailsModal" :title="`${props.config.itemClass.displayName()} Details`"
            @show="showModal" @ok="modalOk" :ok-disabled="okDisabled" :ok-only="okOnly">
      <div v-if="modalIsLoading" class="text-center text-info">
        <BSpinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
      <div v-else>
        <BForm :id="itemDetailsFormId" ref="itemDetailsForm" :validated="showValidation" novalidate>
          <slot name="itemDetailsForm" :item="selected" :isNew="isCreate" :form="`itemDetailsForm`" />
        </BForm>
      </div>
    </BModal>
  </div>
</template>
<!-- This script block exposes the interface which the setup block uses -->
<script lang="ts">
export interface AppListExposed<T> {
  items: T[];
  refresh: () => Promise<void>;
  selectRow: (item: T, clear?: boolean) => void;
  clearSelected: () => void;
}
</script>
<script setup lang="ts" generic="T extends BaseModel<T>">
import axios from 'axios'

import {
  BTableFilterFunction,
  useToggle,
  BTable,
  type BTableSelectMode,
  type BvTriggerableEvent,
  useModal,
  TableRowEventObject,
} from 'bootstrap-vue-next'

import { BaseModel, AppListConfig, ConcreteBaseModel } from '@/components/model'
import errorToString from '@/components/Error'
import { ComponentExposed } from 'vue-component-type-helpers'

// These should remain at the top so that they are called well before anything needs them
const slots = useSlots()
const route = useRoute()

// Computed
const emptyMessage = computed(() => `No ${props.config.itemClass.displayName().toLowerCase()}s found`)
const emptyFilteredMessage = computed(() => `No ${props.config.itemClass.displayName().toLowerCase()}s found with current filter settings`)
const hasCreateFunction = computed(() => !!props.config.create)
const hasDeleteFunction = computed(() => !!props.config.delete)
const hasUpdateFunction = computed(() => !!props.config.update)
const selectable = computed(() => !!props.config.rowSelectedCallback || !!props.config.rowSelectedCallback || !!props.config.rowClickedCallback)
const tableId = computed(() => `AppList.${props.config.itemClass.displayName().replace(/ /g, '')}Table`)
const itemDetailsModalId = computed(() => `AppList.${props.config.itemClass.displayName().replace(/ g/, '')}ItemDetailsModal`)
const itemDetailsFormId = computed(() => `AppList.${props.config.itemClass.displayName().replace(/ g/, '')}ItemDetailsForm`)
const okDisabled = computed(() => !props.config.modalOkEnabled)
const okOnly = computed(() => props.config.modalOkOnly)
const showAlert = computed(() => alertMessage.value != '')

const { show, hide } = useToggle(itemDetailsModalId)
const { create } = useModal()

const props = defineProps<{
  config: AppListConfig<T>
}>()

// Handle the validation, this helps ensure that users of this component can
// specify the validation rules in their template (slot formGroups) and we'll ensure they're correct
// before we create/update but the fields will not initially show as invalid (since they're all blank)
const showValidation = ref(false)

//BTable configuration/references
const table = useTemplateRef<ComponentExposed<typeof BTable>>('tableComponentRef')
// We need to use a shallowRef because otherwise we'll get into UnwrapRefSimple madness
const tableItems = shallowRef<T[]>([])
const tableItemsById = computed(() => {
  return new Map(tableItems.value.map(item => [item[primaryKey as keyof T], item]));
})
// The primary key field name, this is used to avoid any sort of "row jumping" issues when BTable uses it's own identifier
const primaryKey: string = props.config.itemClass.primaryKey()
// handle the case where someone provides a filter within the URL query parameters
const filter = ref(route.query?.filter as string)
// This controls the value of the alert directly below the table
const alertMessage = ref('')
// Controls the timeout, this is set to a number when we want to show the alert and then reset to false when we want to hide it, this is how the :show prop on BAlert is configured
const alertTimeout = ref<boolean | number>(false)
// The section mode for the table, this is set to single which means only one row can be selected at a time and the selected row will be available in the rowSelected callback provided in the config
const selectMode: BTableSelectMode = 'single'
// Controls whether the table-busy slot is shown
const tableBusy = ref(false)
// The below control the pagination in BTable using BPagination
const currentPage = ref(1)
const totalRows = ref(0)

//Modal references
// The form to display with all the item details, for edit/create
const itemDetailsForm = ref<{ $el: HTMLFormElement } | null>();
// This indicator controls whether there's a spinner shown, this allows the showModalCallback to potentially load things that take a second without
// showing a partially loaded form to the user
const modalIsLoading = ref(true)
// If true, we are creating a new item
const isCreate = ref(false)
// The currently selected item, this is used for both edit and create, when creating this will be an empty instance of the item which will then be populated by the form
const selected = ref<T>(props.config.createInstance({}))
// The index in tableItems of the currently selected item, this is used for edit and delete so that we can update the table after those operations
const selectedIndex = ref<number>(-1)

/**
 * BTable custom filter function. This will use all the fields of the item when filtering.
 * @param item the item to check
 * @param filter the current value of the filter
 */
const applyFilter: BTableFilterFunction<T> = (item: T, filter: string | undefined) => {
  if (filter) {
    // Make sure to lower case both the item fields and the filter so that the filtering is case insensitive
    return JSON.stringify(item).toLowerCase().includes(filter.toLowerCase())
  }

  return true
}

/**
 * Each time the table is filtered, this method will be called
 * 
 * @param filteredItems the items that are now show
 */
const onFiltered = (filteredItems: readonly T[]) => {
  // Update the pagination values so the control works correctly
  totalRows.value = filteredItems.length
  currentPage.value = 1
}

/**
 * Reloads the tableItems by making a backend call. We don't call after create/update/delete because those operations update the tableItems directly
 * This can be used as a manual refresh or if the user wants to ensure they have the latest data after leaving the page and coming back without a full reload
 */
const refreshItems = async (): Promise<void> => {
  tableBusy.value = true
  try {
    const allItems = await props.config.list()
    tableItems.value = props.config.itemsFilter ? await props.config.itemsFilter(allItems) : allItems
    totalRows.value = tableItems.value.length
    //Don't reset the current page here, this allows the user to refresh without losing their place in the pagination
    //If the current page is now out of range due to the new totalRows then BTable will automatically move them to the last valid page
  } finally {
    tableBusy.value = false
  }
}

/**
 * Sets up the modal form for creating a new item and then shows the modal
 */
const createItem = (): void => {
  // Create a new, empty instance which will be populated by the form
  selected.value = props.config.createInstance({})
  isCreate.value = true
  show()
}

/**
 * Sets up the modal form for editing an existing item and then shows the modal
 * 
 * @param item the item to edit, this will be used to populate the form with the current values
 * @param index the index of the item in the tableItems array, this is used to update the correct item in the table after editing
 */
const editItem = (item: T, index: number): void => {
  selectedIndex.value = index
  // Create a new instance with the values from the item to edit, this allows us to make changes to the selected item without mutating the original until the user clicks OK
  selected.value = props.config.createInstance(item)
  isCreate.value = false
  show()
}

/**
 * Prompts the user for confirmation and then deletes the item if they confirm, this also updates the tableItems to remove the deleted item from the table
 * 
 * @param item the item to delete
 * @param index the index of the item to delete in the tableItems array, this is used to update the correct item in the table after deleting
 */
async function deleteItem(item: T, index: number): Promise<void> {
  const result = await create({
    body: `Are you sure you want to delete ${props.config.itemClass.displayName().toLowerCase()} ${item.displayIdentifier()}?`,
    title: 'Confirm Delete',
    okTitle: 'Yes',
    cancelTitle: 'No',
    centered: true,
  }).show()

  if (result?.ok === true) {
    try {
      await props.config.delete!(item)
      // Reset the tableItems to the new array, filtering out the deleted index
      tableItems.value = tableItems.value.filter((_, i) => i !== index)
    } catch (err) {
      alertMessage.value = `Unable to delete: ${errorToString(err as Error)}`
      alertTimeout.value = 5000
    }
  }
}

/**
 * @show call back for the modal form, handles any setup needed before showing the form
 */
const showModal = (): void => {
  // Make sure to reset the validations so they don't show by default. We only want them to show when clicking OK
  showValidation.value = false
  modalIsLoading.value = true
  try {
    if (props.config.showModalCallback) {
      // If there's a custom callback provided, use it to allow for any custom setup needed for the form
      // This is especially helpful for forms that need to load additional data before showing like the Guest form with colors and sounds
      props.config.showModalCallback(selected.value as T, isCreate.value)
    }
  } finally {
    modalIsLoading.value = false
  }
}

/**
 * @ok callback for the modal form, this is called when the user clicks the OK button and only proceeds if the form is valid
 * It will then either call the create or update function and then update the tableItems accordingly
 * 
 * @param event the event metadata for the ok event, this is used to prevent the modal from closing if the form is invalid
 */
const modalOk = async (event: BvTriggerableEvent): Promise<void> => {
  showValidation.value = true
  const formElement = itemDetailsForm.value?.$el as HTMLFormElement | undefined;
  // Execute the custom validation logic if it's provided, this allows for any validation that can't be easily handled in the template,
  // this is especially helpful for validating things across multiple fields (see Media and Permissions vues)
  const customValid = props.config.customValidationCallback ? props.config.customValidationCallback(formElement!, formElement?.checkValidity() ?? true, selected.value) : true

  if (formElement && (!formElement.checkValidity() || !customValid)) {
    // If we aren't valid, don't allow the click to proceed
    event.preventDefault()
    return
  }

  // Everything is valid, let's go ahead and call the API
  try {
    if (isCreate.value) {
      // Create an then get the created item back, this assures that all the fields are filled out and things like the id are populated
      const item = await props.config.create!(selected.value);
      if (Array.isArray(item)) {
        tableItems.value.push(...item)
      } else {
        tableItems.value.push(item)
      }
    } else {
      await props.config.update!(selected.value as T);
      tableItems.value[selectedIndex.value] = selected.value as T
    }
    // Because we're using a shallowRef for tableItems, we need to reset the value to trigger the reactivity
    // The alternative would be to refresh all the data with a list call, this should work with the data volumes we're planning to see
    tableItems.value = [...tableItems.value]
    // Only hide if we're successful, if there's an error we want to keep the modal open so the user can fix it without losing their changes
    hide()
  } catch (err) {
    let errorMessage = errorToString(err as Error)
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 409) {
        errorMessage = `${props.config.itemClass.displayName()} already exists: ${(selected.value as T).displayIdentifier()}`
      }
    }
    alertMessage.value = errorMessage
    // Don't make this permanent so that when the user goes to make another change the alert will go away, this also allows us to reuse the same alert for both create and update errors
    alertTimeout.value = 5000
  }
}

const onRowSelected = (value: unknown): void => {
  // The value will be the primary key for one of the items
  const index = tableItems.value.findIndex((item: T) => item[props.config.itemClass.primaryKey() as keyof T] == value)
  if (props.config.rowSelectedCallback) {
    props.config.rowSelectedCallback(tableItems.value[index], index)
  }
}

const onRowUnselected = (value: unknown): void => {
  // The value will be the primary key for one of the items
  const index = tableItems.value.findIndex((item: T) => item[props.config.itemClass.primaryKey() as keyof T] == value)
  if (props.config.rowUnselectedCallback) {
    props.config.rowUnselectedCallback(tableItems.value[index], index)
  }
}

const onRowClicked = (tableRowEvent: TableRowEventObject<T, MouseEvent | KeyboardEvent>): void => {
  if (props.config.rowClickedCallback) {
    props.config.rowClickedCallback(tableRowEvent)
  }
}

// These are the exposed methods, anything we want to vue that embeds this to be able to do should be added here
defineExpose<AppListExposed<T>>({
  get items(): T[] {
    return tableItems.value as T[]
  },
  refresh: refreshItems,
  selectRow: (item: T, clear: boolean = false) => {
    if (clear) {
      table.value?.selection.clear()
    }
    table.value?.selection.add(item)
  },
  clearSelected: () => {
    table.value?.selection.clear()
  },
})

/**
 * Once everything is loaded, populate the tableItems
 */
onMounted(refreshItems)
</script>