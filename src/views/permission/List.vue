<template>
  <div class="container text-left">
    <item-list
      :deleteItemPromise="deleteItemPromise"
      :errorResolver="errorResolver"
      :fields="fields"
      :itemsPromise="itemsPromise"
      :itemString="itemString"
      :itemType="itemType"
      :primaryKey="primaryKey"
    >
      <template v-slot:detailsModal="detailsModalProps">
        <item-details
          :createItemPromise="createItemPromise"
          :errorResolver="errorResolver"
          :isNew="detailsModalProps.isNew"
          :itemAddedCallback="detailsModalProps.itemAdded"
          :itemString="itemString"
          :itemType="itemType"
          :postCreateItemLookupPromise="postCreateItemLookupPromise"
          :selected="detailsModalProps.selected"
          :updateItemPromise="updateItemPromise"
          :validationStates="validationStates"
        >
          <template v-slot:itemFormGroups>
            <b-form-group label="ID:" label-for="id-input" v-if="!detailsModalProps.isNew">
              <b-form-input id="id-input" v-model="detailsModalProps.selected.id" plaintext></b-form-input>
            </b-form-group>
            <b-form-group label="Name:" label-for="name-input" invalid-feedback="A permission name is required!">
              <b-form-input id="name-input" v-model="detailsModalProps.selected.name" :state="validationStates.nameState" placeholder="Permission Name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Description:" label-for="desc-input">
              <b-form-input id="desc-input" v-model="detailsModalProps.selected.desc" placeholder="Permission Description"></b-form-input>
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
        errorResolver: this.$RFIDSecuritySvc.errorToString,
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
        itemType: "Permission",
        primaryKey: "id",
        validationStates: {
          idState: null,
          nameState: null,
        }
      }
    },
    methods: {
      createItemPromise: function(item) {
        return this.$RFIDSecuritySvc.permission.create(item)
      },
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.permission.delete(item.name)
      },
      itemString: item => {
        return item.name
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.permission.list()
      },
      postCreateItemLookupPromise: function(item) {
        return this.$RFIDSecuritySvc.permission.get(item.name)
      },
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.permission.update(item.id, item.name, item.desc)
      }
    },
  }
</script>
