<template>
  <div class="container text-left">
    <item-list :deleteItem="deleteItem" itemType="Configuration" :fields="fields" :itemsPromise="itemsPromise" :newItem="newItem" primary-key="key">
      <template v-slot:detailsModal="slotProps">
        <item-details :itemAddedCallback="slotProps.itemAdded"></item-details>
      </template>
    </item-list>
  </div>
</template>
<script>
  import List from '../common/List'
  import Details from './Details'

  export default {
    components: {
      'item-list': List,
      'item-details': Details,
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
      }
    },
    methods: {
      deleteItem: function(item) {
        return this.$RFIDSecuritySvc.config.delete(item.key)
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.config.list()
      },
      newItem: () => {
        return { key: null }
      },
    },
  }
</script>
