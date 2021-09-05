<template>
  <div class="container text-left">
    <div class="row">
      <div class="col-sm">
        <b-table id="MediaList" striped hover responsive="md" :items="items" :fields="fields" :primary-key="'id'">
          <template #cell(controls)="data">
            <router-link :to="{ name: 'MediaEdit', params: { id: data.item.id }}">
              <b-icon icon="pencil"></b-icon>
            </router-link>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [],
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
          label: 'Description',
        },
        {
          key: 'controls',
          label: '',
        }
      ],
    }
  },
  mounted() {
    this.$RFIDSecuritySvc.media.list()
    .then(response => {
      this.items = response.data
    })
    .catch(function(error) {
      console.log(error)
    })
  },
}
</script>
