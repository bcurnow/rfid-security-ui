<template>
  <div class="container text-left">
    <item-list :deleteItem="deleteItem" :fields="fields" :itemPromise="itemPromise" :newItem="newItem" primary-key="id">
      <template v-slot:detailsModal>
        <item-details :selected="selected" v-on:itemAdded="addItem"></item-details>
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
        selected: {},
        fields: [
          {
            key: 'id',
            sortable: true,
            label: 'ID'
          },
          {
            key: 'name',
            sortable: true,
          },
          {
            key: 'desc',
            label: 'Description'
          },
          {
            key: 'controls',
            label: '',
          }
        ],
      }
    },
    methods: {
      deleteItem(config) {
        this.$bvModal.msgBoxConfirm(`Are you sure you want to remove configuration key '${config.key}'?`, {
          title: "Delete configuration?",
        })
        .then(value => {
          if (value) {
            this.$RFIDSecuritySvc.config.delete(config.key)
            .then(() => {
              this.items.splice(this.items.findIndex(item => item.key === config.key), 1)
            })
            .catch(err => {
              this.$bvModal.msgBoxOk(`Unable to delete configuration key '${config.key}': ${err}`)
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
