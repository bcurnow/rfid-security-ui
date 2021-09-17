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
      <template v-slot:customControls="data">
        <b-button size="sm" class="ml-1" variant="primary" :to="{ name: 'MediaPermissions', params: { mediaId: data.item.id } }" v-b-tooltip="{ title: 'Permissions ', variant: 'primary' }" pill><b-icon icon="key"></b-icon></b-button>
      </template>
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
              <b-input-group>
                <b-form-input id="id-input" v-model="detailsModalProps.selected.id" v-if="!detailsModalProps.isNew" plaintext></b-form-input>
                <b-form-input id="id-input" v-model="detailsModalProps.selected.id" v-if="detailsModalProps.isNew" :state="validationStates.idState" placeholder="Media ID" ref="mediaId" required></b-form-input>
                <b-input-group-append>
                  <b-button variant="info" @click="readMedia(detailsModalProps.selected)" v-if="detailsModalProps.isNew">Read Media</b-button>
                </b-input-group-append>
              </b-input-group>
              <b-toast id="readingToast" variant="info" toaster="readingToaster" static solid no-close-button no-auto-hide>Please place the media near the reader</b-toast>
              <b-toast id="readingErrorToast" variant="danger" toaster="readingToaster" static solid no-close-button no-auto-hide>{{ mediaReadError }}</b-toast>
            </b-form-group>
            <b-form-group label="Name:" label-for="name-input" invalid-feedback="A media name is required!">
              <b-form-input id="name-input" v-model="detailsModalProps.selected.name" :state="validationStates.nameState" placeholder="Media Name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Description:" label-for="desc-input">
              <b-form-textarea id="desc-input" v-model="detailsModalProps.selected.desc" placeholder="Media Description"></b-form-textarea >
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
        mediaReadError: "",
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
      readMedia: function() {
        this.$bvToast.hide("readingErrorToast")
        this.$bvToast.show('readingToast')

        this.$RFIDSecuritySvc.reader.getUid()
        .then(response => {
          // I'm not sure this is the best way to do this but it does work
          let el = document.getElementById('id-input')
          el.value=response.data
          el.dispatchEvent(new Event('input'));
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
