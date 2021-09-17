<template>
  <b-modal id="item-details" :title="itemDetailsTitle" @show="resetModal" @hidden="resetModal" @ok="handleOk">
    <form ref="itemDetailsForm">
      <slot name="itemFormGroups"></slot>
    </form>
  </b-modal>
</template>
<script>
export default {
  data() {
    return {
        item: this.selected,
        newItem: this.isNew,
        itemDetailsTitle: `${this.itemType} Details`
    }
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.itemDetailsForm.checkValidity()
      for (const property in this.validationStates) {
        this.validationStates[property] = valid
      }
      return valid
    },
    resetModal() {
      for (const property in this.validationStates) {
        this.validationStates[property] = null
      }
      this.item = this.selected
      this.newItem = this.isNew
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit() {
      if (! this.checkFormValidity()) {
        return
      }

      if (this.newItem) {
        // This is a create
        this.createItemPromise(this.item)
        .then(() => {
          let newItem = this.item
          if (this.postCreateItemLookupPromise) {
            //Rather than passing back the current item, we need to lookup that item again as some of the fields may be auto populated
            this.postCreateItemLookupPromise(this.item)
            .then(response => {
              newItem = response.data
              this.itemAddedCallback(newItem)
            })
            .catch(err => {
              this.$bvModal.msgBoxOk(`Unable to lookup ${this.itemType.toLowerCase()} '${this.itemString(this.item)}': ${this.errorResolver(err)}`)
            })
          } else {
            this.itemAddedCallback(newItem)
          }
        })
        .catch(err => {
          this.$bvModal.msgBoxOk(`Unable to create ${this.itemType.toLowerCase()} '${this.itemString(this.item)}': ${this.errorResolver(err)}`)
        })
      } else {
        //This is an update
        this.updateItemPromise(this.item)
        .catch(err => {
          this.$bvModal.msgBoxOk(`Unable to update ${this.itemType.toLowerCase()} '${this.itemString(this.item)}': ${this.errorResolver(err)}`)
        })
      }
      this.$nextTick(() => {
          this.$bvModal.hide('item-details')
      })
    },
  },
  props: {
    createItemPromise: {
      type: Function,
      required: true,
    },
    errorResolver: {
      type: Function,
      default: function(error) {
        console.log("WARNING: Using default errorResolver")
        if (error) {
          return error.toString()
        }
        return ""
      }
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    itemString: {
      type: Function,
      default: function(item) {
        return item[this.primaryKey]
      },
    },
    itemType: {
      type: String,
      required: true,
    },
    itemAddedCallback: {
      type: Function,
      required: true,
    },
    postCreateItemLookupPromise: Function,
    selected: {
      type: Object,
      required: true,
    },
    primaryKey: {
      type: String,
      default: "id",
    },
    updateItemPromise: {
      type: Function,
      required: true,
    },
    validationStates: {
      type: Object,
      required: true,
    }
  },
}
</script>
