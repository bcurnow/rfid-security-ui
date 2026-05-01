import { AxiosResponse } from "axios";
import { BaseModel, ConcreteBaseModel, ModelConstructor } from "./BaseModel"
import { TableFieldRaw, BTableSortBy, TableField, TableRowEventObject } from "bootstrap-vue-next"
import { table } from "node:console";

export class AppListConfig<T extends BaseModel<T>> {
  // The class (e.g. Guest, Media, etc.) that this is a list of
  itemClass: ConcreteBaseModel<T>;
  // The function to create a new instance of the itemClass
  create?: (item: T) => Promise<T> | Promise<T[]>
  // The function to delete an instance of the itemClass
  delete?: (item: T) => Promise<AxiosResponse>
  // The function to list all instances of the itemClass
  list: () => Promise<T[]>
  // The function to update an instance of the itemClass
  update?: (item: T) => Promise<AxiosResponse>
  // If true, the table controls column will be shown, this is where the refresh and add buttons are located
  showTableControls: boolean = true
  /**
   * Called after validation but before create/update.
   * 
   * This allows for custom logic that can't be expressed in standard validation constraints (see Media and Permissions vues)
   * @form the form element of the create/update modal dialog
   * @valid whether the form is currently valid according to the standard validation constraints
   * @returns whether the create/update should proceed, if false is returned, the modal dialog will stay open and no create/update will occur
   */
  customValidationCallback?: (form: HTMLFormElement, valid: boolean, item: T) => boolean
  // The fields to show in the table, if empty, will show all fields returned by the list function
  private fields: TableFieldRaw<T>[] = []
  // If true, the filter field will be shown
  filteringEnabled: boolean = true
  // Cache of all the properties on the itemClass
  private itemClassFields: TableFieldRaw<T>[]
  // The number of items to show per page
  itemsPerPage: number = 10
  // Whether the modal dialog showing details should have an OK button (see the Media and Permission vue)
  modalOkEnabled: boolean = true
  // Whether the model dialog showing details should only have an OK button (see the Media vue)
  modalOkOnly: boolean = false
  /**
   * Called by the items provider after the items are retrieved but before anything else happens.
   * 
   * This function is only called when the table requests a refresh of all the items, this does not allow for custom
   * BTable filtering, instead, it can be used to filter out items that should never be presented to the BTable (see Config vue)
   */
  itemsFilter?: (items: T[]) => Promise<T[]>
  // Called when a table row is clicked
  rowClickedCallback?: ((tableRowEvent: TableRowEventObject<T, MouseEvent | KeyboardEvent>) => void)
  // Called when a table row is selected
  rowSelectedCallback?: ((selected: T, index: number) => void)
  // Called when a table row is unselected
  rowUnselectedCallback?: ((selected: T, index: number) => void)
  // Called just before the modal dialog for create/update is shown. See Guests List and Media views and Media Permissions vue)
  showModalCallback?: (item: T, isNew: boolean) => void
  // The field (or fields) to sort the table by, this sets the initial sort order of the table but the user can change it by clicking on the table headers. See the BTableSortBy type for more details
  sortBy?: BTableSortBy[]

  /** 
   * Returns the fields to display in the table.
   * Will automatically add the controls field if showTableControls is true
   * 
   * If fields is undefined, will enumerate the fields of T, minus any fields returned by inputExcludedProperties() and return each property as a sortable field
   */
  tableFields(): TableFieldRaw<T>[] {
    let tableFields = this.fields
    // Check if they provided the fields they want
    if (tableFields === undefined || tableFields.length === 0) {
      // Use the ones on the itemClass
      tableFields = this.itemClassFields
    }

    if (this.showTableControls) {
      tableFields = [...tableFields, { key: 'controls' } as TableFieldRaw<T>]
    }
    return tableFields
  }

  constructor(itemClass: ConcreteBaseModel<T>, list: () => Promise<T[]>, fields?: TableFieldRaw<T>[]) {
    this.itemClass = itemClass
    this.list = list
    this.fields = fields || []

    // Populate the itemClassFields from itemClass one time for use later
    const excludedFields = this.itemClass.prototype.inputExcludedProperties()
    const properties = Object.getOwnPropertyNames(new (this.itemClass as ModelConstructor<T>)({})).filter(field => !excludedFields.has(field))
    this.itemClassFields = properties.map(field => ({ key: field, sortable: true })) as TableFieldRaw<T>[]
  }

  /**
   * Function to create a new instance of T
   * 
   * The U extends T is what enables this method to have a return type of the exact T that the AppListConfig was constructed for
   * 
   * @returns T
   */
  createInstance<U extends T>(this: AppListConfig<U>, ...args: ConstructorParameters<ModelConstructor<U>>) {
    return new (this.itemClass as ModelConstructor<U>)(...args)
  }

}