<template>
  <b-modal id="item-details" title="Config Details" @show="resetModal" @hidden="resetModal" @ok="handleOk" v-on:item-selected="updateItem">
    <form ref="itemDetailsForm">
      <b-form-group label="Key:" label-for="key-input" invalid-feedback="A configuration key is required!">
        <b-form-input id="key-input" v-model="config.key" v-if="!newItem" plaintext></b-form-input>
        <b-form-input id="key-input" v-model="config.key" v-if="newItem" :state="keyState" placeholder="Config Key" required></b-form-input>
      </b-form-group>
      <b-form-group label="Value:" label-for="value-input" invalid-feedback="A configuration value is required!">
        <b-form-input id="value-input" v-model="config.value" :state="valueState" placeholder="Config Value" required></b-form-input>
      </b-form-group>
    </form>
  </b-modal>
</template>
<script>
export default {
  data() {
    return {
      config: {},
      keyState: null,
      valueState: null,
    }
  },
  computed: {
    newItem: function() {
      return this.config.key == null
    }
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.itemDetailsForm.checkValidity()
      this.keyState = valid
      this.valueState = valid
      return valid
    },
    resetModal() {
      this.keyState = null
      this.valueState = null
      this.config = {}
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit() {
      if (! this.checkFormValidity()) {
        return
      }

      console.log(this.newItem)
      if (this.newItem) {
        // This is a create
        this.$RFIDSecuritySvc.config.create(this.config)
        .then(() => {
          this.$emit('item-added', this.config)
        })
        .catch(function(error) {
          console.log(error)
        })
      } else {
        //This is an update
        this.$RFIDSecuritySvc.config.update(this.config.key, this.config.value)
        .then(response => {
          console.log(response)
        })
        .catch(function(error) {
          console.log(error)
        })
      }
      this.$nextTick(() => {
          this.$bvModal.hide('item-details')
        })
    },
    updateItem(item) {
      console.log('updateItem')
      this.config = item
    },
  },
}
</script>
