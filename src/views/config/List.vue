<template>
  <div class="container text-left">
    <item-list :deleteItem="deleteItem" :fields="fields" :itemPromise="itemPromise" :newItem="newItem" primary-key="key">
      <template v-slot:detailsModal>
        <item-details></item-details>
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
      deleteItem(item) {
        this.$bvModal.msgBoxConfirm(`Are you sure you want to remove configuration key '${item.key}'?`, {
          title: "Delete configuration?",
        })
        .then(value => {
          if (value) {
            this.$RFIDSecuritySvc.config.delete(item.key)
            .then(() => {
              this.$emit('item-deleted', item)
            })
            .catch(err => {
              this.$bvModal.msgBoxOk(`Unable to delete configuration key '${item.key}': ${err}`)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      },
      itemPromise: function() {
        return this.$RFIDSecuritySvc.config.list()
      },
      newItem: () => {
        return { key: null }
      },
    },
    mounted() {
      this.$RFIDSecuritySvc.config.list()
      .then(response => {
        this.items = response.data
      })
      .catch(function(error) {
        console.log(error)
      })
    },
  }
</script>
