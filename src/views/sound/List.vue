<template>
  <div class="container text-left">
    <item-list
      :createItemPromise="createItemPromise"
      :deleteItemPromise="deleteItemPromise"
      :fields="fields"
      :itemsPromise="itemsPromise"
      itemType="Sound"
      primaryKey="name"
      :updateItemPromise="updateItemPromise"
      :validationStates="validationStates">
      <template v-slot:formGroups="formGroupsProps">
        <b-form-group label="Name:" label-for="name-input" invalid-feedback="A name is required!">
          <b-form-input id="name-input" ref="nameInput" v-model="formGroupsProps.item.name" :state="validationStates.nameState" placeholder="Name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Sound File:" label-for="file-input" invalid-feedback="A sound file is required!">
          <b-form-file id="file-input" ref="fileInput" v-model="formGroupsProps.item.uploadFile" :state="validationStates.fileState" accept="audio/wav" :required="formGroupsProps.isNew" @input="uploadFileChanged(formGroupsProps.item)"></b-form-file>
        </b-form-group>
      </template>
      <template v-slot:customControls="customControlsProps">
        <b-button size="sm" class="ml-1" v-b-modal.sound-player variant="primary" @click="playSound(customControlsProps.item)" v-b-tooltip="{ title: 'Play', variant: 'primary' }" pill><b-icon icon="play"></b-icon></b-button>
      </template>
    </item-list>
    <b-modal id="sound-player" title="Sound Player" ok-only>
      <div class="text-center">
        <audio controls autoplay>
          <source :src="url" type="audio/wav">
          Your browser does not support the <code>audio</code> element.
        </audio>
      </div>
    </b-modal>
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
        fields: [
          {
            key: 'name',
            sortable: true,
          },
          {
            key: 'last_update_timestamp',
            label: 'Last Updated',
            sortable: true,
          },
          {
            key: 'controls',
            label: '',
          }
        ],
        url: null,
        validationStates: {
          nameState: null,
          fileState: null,
        }
      }
    },
    methods: {
      createItemPromise: function(item) {
        let formData = new FormData()
        formData.append('name', item.name)
        formData.append('content', item.uploadFile)
        return this.$RFIDSecuritySvc.sound.create(formData)
      },
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.sound.delete(item.name)
      },
      uploadFileChanged(item) {
        this.$nextTick(() => {
          if (!item.name || item.name == "") {
            // Set the name of the sound to the file name
            this.$set(item, 'name', item.uploadFile.name)
          }
        })
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.sound.list()
      },
      playSound(item) {
        this.url = this.playerUrl(item)
      },
      playerUrl(item) {
        return this.$RFIDSecuritySvc.player.url(item.name)
      },
      updateItemPromise: function(item) {
        let formData = new FormData()
        formData.append('name', item.name)
        if (item.uploadFile != null) {
          formData.append('content', item.uploadFile)
        }
        return this.$RFIDSecuritySvc.sound.update(item.id, formData)
      }
    },
  }
</script>
