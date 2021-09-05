<template>
  <b-modal id="config-details" title="Config Details" @show="resetModal" @hidden="resetModal" @ok="handleOk">
    <form ref="configDetailsForm">
      <b-form-group label="Key:" label-for="key-input" invalid-feedback="A configuration key is required!">
        <b-form-input id="key-input" v-model="config.key" v-if="!newConfig" plaintext></b-form-input>
        <b-form-input id="key-input" v-model="config.key" v-if="newConfig" :state="keyState" placeholder="Config Key" required></b-form-input>
      </b-form-group>
      <b-form-group label="Value:" label-for="value-input" invalid-feedback="A configuration value is required!">
        <b-form-input id="value-input" v-model="config.value" :state="valueState" placeholder="Config Value" required></b-form-input>
      </b-form-group>
    </form>
  </b-modal>
</template>
<script>
export default {
  methods: {
    checkFormValidity() {
      const valid = this.$refs.configDetailsForm.checkValidity()
      this.keyState = valid
      this.valueState = valid
      return valid
    },
    resetModal() {
      this.keyState = null
      this.valueState = null
      this.config = this.selected
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit() {
      if (! this.checkFormValidity()) {
        return
      }

      if (this.newConfig) {
        // This is a create
        this.$RFIDSecuritySvc.config.create(this.config)
        .then(() => {
          this.$emit('configAdded', this.config)
          console.log("Need to do something here...")
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
          this.$bvModal.hide('config-details')
        })
    },
  },
  data() {
    return {
      config: this.selected,
      newConfig: this.selected.key == null,
      keyState: null,
      valueState: null,
    }
  },
  props: {
    selected: Object,
  }
}
</script>
