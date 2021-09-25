<template>
  <div class="container text-left">
    <item-list
      :createItemPromise="createItemPromise"
      :deleteItemPromise="deleteItemPromise"
      :fields="fields"
      :itemsPromise="itemsPromise"
      itemType="Configuration"
      :noControlsForPKs="noControlsForPKs"
      primaryKey="key"
      :updateItemPromise="updateItemPromise"
      :validationStates="validationStates">
      <template v-slot:formGroups="formGroupsProps">
        <b-form-group label="Key:" label-for="key-input" invalid-feedback="A configuration key is required!">
          <b-form-input id="key-input" v-model="formGroupsProps.item.key" v-if="!formGroupsProps.isNew" plaintext></b-form-input>
          <b-form-input id="key-input" v-model="formGroupsProps.item.key" v-if="formGroupsProps.isNew" :state="validationStates.keyState" placeholder="Config Key" required></b-form-input>
        </b-form-group>
        <b-form-group label="Value:" label-for="value-input" invalid-feedback="A configuration value is required!">
          <b-form-input id="value-input" v-model="formGroupsProps.item.value" :state="validationStates.valueState" placeholder="Config Value" required></b-form-input>
        </b-form-group>
      </template>
    </item-list>
  </div>
</template>
<script>
  import List from '../common/List'

  export default {
    components: {
      'item-list': List,
    },
    data() {
      return {
        noControlsForPKs: [
          'ADMIN_API_KEY',
        ],
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
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.config.update(item.key, item.value)
      }
    },
  }
</script>
