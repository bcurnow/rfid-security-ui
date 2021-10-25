<template>
  <div class="container text-left">
    <item-list
      :createItemPromise="createItemPromise"
      :deleteItemPromise="deleteItemPromise"
      :fields="fields"
      id="Sound"
      :itemsPromise="itemsPromise"
      itemType="Sound"
      primaryKey="name"
      :updateItemPromise="updateItemPromise"
      :validationStates="validationStates">
      <template #formGroups="props">
        <b-form-group label="Name:" label-for="name-input" invalid-feedback="A name is required!">
          <b-form-input id="name-input" ref="nameInput" v-model="props.item.name" :state="validationStates.name" @invalid="validationStates.name = false" placeholder="Name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Sound File:" label-for="file-input" invalid-feedback="A sound file is required!" :state="validationStates.file">
          <b-form-file id="file-input" ref="fileInput" v-model="props.item.uploadFile" :state="validationStates.file" @invalid="validationStates.file = false" accept="audio/wav" required @input="uploadFileChanged(props.item)"></b-form-file>
        </b-form-group>
      </template>
      <template #customControlsPost="props">
        <b-button size="sm" class="ml-1" v-b-modal.sound-player variant="primary" @click="soundName = props.item.name" v-b-tooltip="{ title: 'Play', variant: 'primary' }" pill><b-icon class="mb-1 mt-1" icon="play"></b-icon></b-button>
      </template>
    </item-list>
    <sound-player :soundName="soundName"></sound-player>
  </div>
</template>
<script>
  import List from '../common/List'
  import SoundPlayer from '../common/SoundPlayer'

  export default {
    components: {
      'item-list': List,
      'sound-player': SoundPlayer,
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
        soundName: "",
        validationStates: {
          name: null,
          file: null,
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
        return this.$RFIDSecuritySvc.sound.delete(item.id)
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
