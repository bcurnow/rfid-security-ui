<template>
  <div class="container text-left">
    <item-list
      :createItemPromise="createItemPromise"
      :deleteItemPromise="deleteItemPromise"
      :fields="fields"
      :itemsPromise="itemsPromise"
      :itemToDisplayString="itemToDisplayString"
      itemType="Media"
      :updateItemPromise="updateItemPromise"
      :validationStates="validationStates">
      <template v-slot:customControls="data">
        <b-button size="sm" class="ml-1" variant="primary" :to="{ name: 'MediaPermissions', params: { mediaId: data.item.id } }" v-b-tooltip="{ title: 'Permissions ', variant: 'primary' }" pill><b-icon icon="key"></b-icon></b-button>
      </template>
      <template v-slot:formGroups="formGroupsProps">
        <b-form-group label="ID:" label-for="id-input" invalid-feedback="A media ID is required!">
          <b-input-group>
            <b-form-input id="id-input" v-model="formGroupsProps.item.id" v-if="!formGroupsProps.isNew" plaintext></b-form-input>
            <b-form-input id="id-input" v-model="formGroupsProps.item.id" v-if="formGroupsProps.isNew" :state="validationStates.idState" placeholder="Media ID" required></b-form-input>
            <b-input-group-append>
              <b-button variant="info" @click="readMedia(formGroupsProps.item)" v-if="formGroupsProps.isNew">Read Media</b-button>
            </b-input-group-append>
          </b-input-group>
          <b-toast id="readingToast" variant="info" toaster="readingToaster" static solid no-close-button no-auto-hide>Please place the media near the reader</b-toast>
          <b-toast id="readingErrorToast" variant="danger" toaster="readingToaster" static solid no-close-button no-auto-hide>{{ mediaReadError }}</b-toast>
        </b-form-group>
        <b-form-group label="Name:" label-for="name-input" invalid-feedback="A media name is required!">
          <b-form-input id="name-input" v-model="formGroupsProps.item.name" :state="validationStates.nameState" placeholder="Media Name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Description:" label-for="desc-input">
          <b-form-textarea id="desc-input" v-model="formGroupsProps.item.desc" placeholder="Media Description"></b-form-textarea >
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
        mediaReadError: "",
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
      itemToDisplayString: item => {
        return item.name
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.media.list()
      },
      readMedia: function(item) {
        this.$bvToast.hide("readingErrorToast")
        this.$bvToast.show('readingToast')

        this.$RFIDSecuritySvc.reader.getUid()
        .then(response => {
          // Because the common list component sets the create item to an empty object ({})
          // none of the properties of that object are reactive, the form is able to
          // update the object so create works but for us to update via code, we need to let
          // Vue know that we've added the property, the $set method does this
          this.$set(item, 'id', response.data)
          this.$bvToast.hide("readingToast")
        })
        .catch(err => {
          this.mediaReadError = `An error occurred while reading media: ${err}`
          this.$bvToast.hide("readingToast")
          this.$bvToast.show('readingErrorToast')
          console.log(err)
        })
      },
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.media.update(item.id, item.name, item.desc)
      },
    },
  }
</script>
