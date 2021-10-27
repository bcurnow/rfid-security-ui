<template>
  <div class="container text-left">
    <item-list
      :createItemPromise="createItemPromise"
      :deleteItemPromise="deleteItemPromise"
      :fields="fields"
      :itemsPromise="itemsPromise"
      :itemClass="itemClass"
      :updateItemPromise="updateItemPromise"
      :validationStates="validationStates">
      <template #formGroups="props">
        <b-form-group label="ID:" label-for="id-input" v-if="!props.isNew">
          <b-form-input id="id-input" v-model="props.item.id" readonly></b-form-input>
        </b-form-group>
        <b-form-group label="Name:" label-for="name-input" invalid-feedback="A permission name is required!">
          <b-form-input id="name-input" v-model="props.item.name" :state="validationStates.name" @invalid="validationStates.name = false" placeholder="Permission Name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Description:" label-for="desc-input">
          <b-form-input id="desc-input" v-model="props.item.desc" placeholder="Permission Description"></b-form-input>
        </b-form-group>
      </template>
    </item-list>
  </div>
</template>
<script>
  import List from '../common/List'
  import {Permission} from '@/components/svc/Permission.js'

  export default {
    components: {
      'item-list': List,
    },
    data() {
      return {
        fields: [
          {
            key: 'name',
            sortable: true,
          },
          {
            key: 'desc',
          },
          {
            key: 'controls',
            label: '',
          }
        ],
        itemClass: Permission,
        validationStates: {
          name: null,
        }
      }
    },
    methods: {
      createItemPromise: function(item) {
        return this.$RFIDSecuritySvc.permission.create(item)
      },
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.permission.delete(item.id)
      },
      itemToDisplayString: item => {
        return item.name
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.permission.list()
      },
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.permission.update(item.id, item.name, item.desc)
      }
    },
  }
</script>
