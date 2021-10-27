<template>
  <div class="container text-left">
    <item-list
      :createItemPromise="createItemPromise"
      :deleteItemPromise="deleteItemPromise"
      :fields="fields"
      :itemClass="itemClass"
      :itemsPromise="itemsPromise"
      :updateItemPromise="updateItemPromise"
      :validationStates="validationStates">
      <template #formGroups="props">
        <b-form-group label="Key:" label-for="key-input" invalid-feedback="A configuration key is required!">
          <b-form-input id="key-input" v-model="props.item.key" v-if="!props.isNew" readonly></b-form-input>
          <b-form-input id="key-input" v-model="props.item.key" v-if="props.isNew" :state="validationStates.key" @invalid="validationStates.key = false" placeholder="Config Key" required></b-form-input>
        </b-form-group>
        <b-form-group label="Value:" label-for="value-input" invalid-feedback="A configuration value is required!">
          <b-form-input id="value-input" v-model="props.item.value" :state="validationStates.value" @invalid="validationStates.value = false" placeholder="Config Value" required></b-form-input>
        </b-form-group>
      </template>
    </item-list>
  </div>
</template>
<script>
  import List from '../common/List'
  import {Config} from '@/components/model'
  export default {
    components: {
      'item-list': List,
    },
    data() {
      return {
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
        itemClass: Config,
        validationStates: {
          key: null,
          value: null,
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
