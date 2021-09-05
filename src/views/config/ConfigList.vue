<template>
  <div class="container text-left">
    <b-button size="md" v-b-modal.config-details variant="primary" @click="selected = { key: null }" pill><b-icon icon="plus-circle-fill"></b-icon> Add New</b-button>
    <div class="row">
      <div class="col-sm">
        <b-table id="ConfigList" striped hover responsive="md" :items="items" :fields="fields" :primary-key="'key'">
          <template #cell(controls)="data">
            <div v-if="data.item.key != 'ADMIN_API_KEY'">
              <b-button size="sm" v-b-modal.config-details variant="primary" @click="selected = data.item" pill><b-icon icon="pencil"></b-icon></b-button>
              <b-button size="sm" class="ml-1" variant="danger" @click="deleteItem(data.item, data.index)" pill><b-icon icon="dash-circle-fill"></b-icon></b-button>
            </div>
          </template>
        </b-table>
      </div>
    </div>
    <config-details :selected="selected" v-on:configAdded="addItem"></config-details>
  </div>
</template>
<script>
  import ConfigDetails from './ConfigDetails'
  export default {
    components: {
      'config-details': ConfigDetails,
    },
    data() {
      return {
        items: [],
        selected: {},
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
      addItem(config) {
        this.items.splice(this.items.size, 0, config)
      },
      deleteItem(config, index) {
        this.$bvModal.msgBoxConfirm(`Are you sure you want to remove configuration key '${config.key}'?`, {
          title: "Delete configuration",
        })
        .then(value => {
          if (value) {
            this.$RFIDSecuritySvc.config.delete(config.key)
            .then(() => {
              this.items.splice(index, 1)
            })
            .catch(err => {
              this.$bvModel.msgBoxOk(`Unable to delete configuration key '${config.key}': ${err}`)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
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
