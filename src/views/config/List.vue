<template>
  <div class="container text-left">
    <item-list :deleteItemPromise="deleteItemPromise" itemType="Configuration" :fields="fields" :itemsPromise="itemsPromise" :newItem="newItem" primaryKey="key" :controlFilter="controlFilter" :errorResolver="errorResolver">
      <template v-slot:detailsModal="detailsModalProps">
        <item-details :itemAddedCallback="detailsModalProps.itemAdded" itemType="Configuration" :createItemPromise="createItemPromise" :updateItemPromise="updateItemPromise" :validationStates="validationStates" :errorResolver="errorResolver">
          <template v-slot:itemFormGroups="formGroupProps">
            <b-form-group label="Key:" label-for="key-input" invalid-feedback="A configuration key is required!">
              <b-form-input id="key-input" v-model="formGroupProps.item.key" v-if="!formGroupProps.newItem" plaintext></b-form-input>
              <b-form-input id="key-input" v-model="formGroupProps.item.key" v-if="formGroupProps.newItem" :state="validationStates.keyState" placeholder="Config Key" required></b-form-input>
            </b-form-group>
            <b-form-group label="Value:" label-for="value-input" invalid-feedback="A configuration value is required!">
              <b-form-input id="value-input" v-model="formGroupProps.item.value" :state="validationStates.valueState" placeholder="Config Value" required></b-form-input>
            </b-form-group>
          </template>
        </item-details>
      </template>
    </item-list>
  </div>
</template>
<script>
  import List from '../common/List'
  import Details from '../common/Details'

  export default {
    components: {
      'item-list': List,
      'item-details': Details,
    },
    data() {
      return {
        controlFilter: [
          'ADMIN_API_KEY',
        ],
        errorResolver: this.$RFIDSecuritySvc.errorToString,
        fields: [
          {
            key: 'key',
            sortable: true,
            label: 'Key'
          },
          {
            key: 'value',
            sortable: true,
          },
          {
            key: 'controls',
            label: '',
          }
        ],
        validationStates: {
          keyState: null,
          valueState: null,
        }
      }
    },
    methods: {
      createItemPromise: function(item) {
        return this.$RFIDSecuritySvc.config.create(item)
      },
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.config.delete(item.key)
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.config.list()
      },
      newItem: () => {
        return { key: null }
      },
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.config.update(item.key, item.value)
      }
    },
  }
</script>
