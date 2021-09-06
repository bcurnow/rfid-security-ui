<template>
  <div class="container text-left">
    <item-list
      :deleteItemPromise="deleteItemPromise"
      :itemType="itemType"
      :fields="fields"
      :itemsPromise="itemsPromise"
      :primaryKey="primaryKey"
      :controlFilter="controlFilter"
      :errorResolver="errorResolver"
    >
      <template v-slot:detailsModal="detailsModalProps">
        <item-details
          :itemAddedCallback="detailsModalProps.itemAdded"
          :itemType="itemType"
          :createItemPromise="createItemPromise"
          :updateItemPromise="updateItemPromise"
          :validationStates="validationStates"
          :errorResolver="errorResolver"
          :selected="detailsModalProps.selected"
          :isNew="detailsModalProps.isNew"
        >
          <template v-slot:itemFormGroups>
            <b-form-group label="Key:" label-for="key-input" invalid-feedback="A configuration key is required!">
              <b-form-input id="key-input" v-model="detailsModalProps.selected.key" v-if="!detailsModalProps.isNew" plaintext></b-form-input>
              <b-form-input id="key-input" v-model="detailsModalProps.selected.key" v-if="detailsModalProps.isNew" :state="validationStates.keyState" placeholder="Config Key" required></b-form-input>
            </b-form-group>
            <b-form-group label="Value:" label-for="value-input" invalid-feedback="A configuration value is required!">
              <b-form-input id="value-input" v-model="detailsModalProps.selected.value" :state="validationStates.valueState" placeholder="Config Value" required></b-form-input>
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
        itemType: "Configuration",
        primaryKey: "key",
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
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.config.update(item.key, item.value)
      }
    },
  }
</script>
