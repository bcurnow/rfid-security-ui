<template>
  <b-modal id="item-details" :title="itemDetailsTitle" @show="resetModal" @hidden="resetModal" @ok="handleOk">
    <form ref="itemDetailsForm">
      <slot name="itemFormGroups" v-bind:item="item" v-bind:newItem="newItem"></slot>
    </form>
  </b-modal>
</template>
<script>
export default {
  computed: {
    item: function() {
      return this.$store.state.listDetailShared.item
    },
    itemDetailsTitle: function() {
      return `${this.itemType} Details`
    },
    newItem: function() {
      return this.$store.state.listDetailShared.newItem
    },
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
      this.config = this.$store.state.listDetailShared.item
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
          this.itemAddedCallback(this.item)
        })
        .catch(err => {
          this.$bvModal.msgBoxOk(`Unable to create ${this.itemType.toLowerCase()} '${JSON.stringify(this.item)}': ${this.errorResolver(err)}`)
        })
      } else {
        //This is an update
        this.updateItemPromise(this.item)
        .catch(err => {
          this.$bvModal.msgBoxOk(`Unable to update ${this.itemType.toLowerCase()} '${JSON.stringify(this.item)}': ${this.errorResolver(err)}`)
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
        console.log("Using default errorResolver")
        if (error) {
          return error.toString()
        }
        return ""
      }
    },
    itemType: {
      type: String,
      required: true,
    },
    itemAddedCallback: {
      type: Function,
      required: true,
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
