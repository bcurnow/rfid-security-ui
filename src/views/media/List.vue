<template>
  <div class="container text-left">
    <item-list
      id="Media"
      :createItemPromise="createItemPromise"
      :customRenderFields="customRenderFields"
      :deleteItemPromise="deleteItemPromise"
      :fields="fields"
      :itemsPromise="itemsPromise"
      :itemToDisplayString="itemToDisplayString"
      itemType="Media"
      ref="Media"
      :rowSelected="mediaSelected"
      :updateItemPromise="updateItemPromise"
      :validationStates="validationStates">
      <template #headerMessage>Select a row to see associated permissions</template>
      <template #customControlsPost="props">
        <b-button size="sm" class="ml-1" variant="primary" :to="{ name: 'MediaPermissions', params: { mediaId: props.item.id } }" v-b-tooltip="{ title: 'Permissions ', variant: 'primary' }" @click="$refs.Media.selectRow(props.index)" pill><b-icon class="mb-1 mt-1" icon="key"></b-icon></b-button>
      </template>
      <template #id="props">
        {{ selectRow(props) }}
      </template>
      <template #formGroups="props">
        <b-form-group label="UUID:" label-for="id-input" invalid-feedback="A media UUID is required!" :state="validationStates.id">
          <b-input-group>
            <b-form-input id="id-input" v-model="props.item.id" v-if="!props.isNew" readonly></b-form-input>
            <b-form-input id="id-input" v-model="props.item.id" v-if="props.isNew" :state="validationStates.id" placeholder="Media UUID" @invalid="validationStates.id = false" required></b-form-input>
            <b-input-group-append>
              <b-button variant="info" @click="readMedia(props.item)" v-if="props.isNew">Read Media</b-button>
            </b-input-group-append>
          </b-input-group>
          <b-toast id="readingToast" variant="info" toaster="readingToaster" static solid no-close-button no-auto-hide>Please place the media near the reader</b-toast>
          <b-toast id="readingErrorToast" variant="danger" toaster="readingToaster" static solid no-close-button no-auto-hide>{{ mediaReadError }}</b-toast>
        </b-form-group>
        <b-form-group label="Name:" label-for="name-input" invalid-feedback="A media name is required!">
          <b-form-input id="name-input" v-model="props.item.name" :state="validationStates.name" placeholder="Media Name" @invalid="validationStates.name = false" required></b-form-input>
        </b-form-group>
        <b-form-group label="Description:" label-for="desc-input">
          <b-form-textarea id="desc-input" v-model="props.item.desc" placeholder="Media Description"></b-form-textarea >
        </b-form-group>
      </template>
      <template #emptyfiltered>No media found with current filter settings</template>
    </item-list>
    <router-view></router-view>
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
        customRenderFields: ['id'],
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
            key: 'id',
            label: 'UUID',
            sortable: true,
          },
          {
            key: 'controls',
            label: '',
          }
        ],
        mediaReadError: "",
        validationStates: {
          id: null,
          name: null,
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
      mediaSelected: function(selectedRows) {
        if (selectedRows.length == 0) {
          if (this.$route.name != 'MediaList') {
            this.$router.push({ name: 'MediaList' })
          }
        } else {
          let item = selectedRows[0]
          if (this.$route.name != 'MediaPermissions' || this.$route.params.mediaId != item.id) {
            this.$router.push({ name: 'MediaPermissions', params: { mediaId: item.id } })
          }
        }
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
        })
      },
      selectRow(props) {
        if (props.item.id == this.$route.params.mediaId) {
          props.selectRow(props.index)
        }
        return props.item.id
      },
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.media.update(item.id, item.name, item.desc)
      },
    },
    watch: {
      '$route'(to) {
        if (to.name == 'MediaList') {
          this.$refs.Media.clearSelected()
        }
      }
    }
  }
</script>
