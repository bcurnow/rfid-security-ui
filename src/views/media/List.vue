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
          :selected="detailsModalProps.selected"
          :updateItemPromise="updateItemPromise"
          :validationStates="validationStates"
        >
          <template v-slot:itemFormGroups>
            <b-form-group label="ID:" label-for="id-input" invalid-feedback="A media ID is required!">
              <b-form-input id="id-input" v-model="detailsModalProps.selected.id" v-if="!detailsModalProps.isNew" plaintext></b-form-input>
              <b-form-input id="id-input" v-model="detailsModalProps.selected.id" v-if="detailsModalProps.isNew" :state="validationStates.idState" placeholder="Media ID" required></b-form-input>
            </b-form-group>
            <b-form-group label="Name:" label-for="name-input" invalid-feedback="A media name is required!">
              <b-form-input id="name-input" v-model="detailsModalProps.selected.name" :state="validationStates.nameState" placeholder="Media Name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Description:" label-for="desc-input">
              <b-form-input id="desc-input" v-model="detailsModalProps.selected.desc" placeholder="Media Description"></b-form-input>
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
            key: 'id',
            label: 'ID',
            sortable: true,
          },
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
        itemType: "Media",
        primaryKey: "id",
        validationStates: {
          idState: null,
          nameState: null,
        }
      }
    },
    methods: {
      createItemPromise: function(item) {
        return this.$RFIDSecuritySvc.media.create(item)
      },
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.media.delete(item.id)
      },
      itemString: item => {
        return item.name
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.media.list()
      },
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.media.update(item.id, item.name, item.desc)
      }
    },
  }
</script>
