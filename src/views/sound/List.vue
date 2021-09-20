<template>
  <div class="container text-left">
    <item-list
      :deleteItemPromise="deleteItemPromise"
      :errorResolver="errorResolver"
      :fields="fields"
      :itemsPromise="itemsPromise"
      :itemType="itemType"
      :primaryKey="primaryKey"
    >
      <template v-slot:detailsModal="detailsModalProps">
        <item-details
          :createItemPromise="createItemPromise"
          :errorResolver="errorResolver"
          :isNew="detailsModalProps.isNew"
          :itemAddedCallback="detailsModalProps.itemAdded"
          :itemType="itemType"
          :primaryKey="primaryKey"
          :selected="detailsModalProps.selected"
          :updateItemPromise="updateItemPromise"
          :validationStates="validationStates"
        >
          <template v-slot:itemFormGroups>
            <b-form-group label="Name:" label-for="name-input" invalid-feedback="A name is required!">
              <b-form-input id="name-input" ref="nameInput" v-model="detailsModalProps.selected.name" :state="validationStates.nameState" placeholder="Name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Sound File:" label-for="file-input" invalid-feedback="A sound file is required!">
              <b-form-file id="file-input" v-model="uploadFile" :state="validationStates.fileState" accept="audio/wav" :required="detailsModalProps.isNew" @change="inputFileChanged(detailsModalProps.selected)"></b-form-file>
            </b-form-group>
          </template>
        </item-details>
      </template>
      <template v-slot:customControls="data">
        <b-button size="sm" class="ml-1" v-b-modal.sound-player variant="primary" @click="playSound(data.item)" v-b-tooltip="{ title: 'Play', variant: 'primary' }" pill><b-icon icon="play"></b-icon></b-button>
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
            key: 'controls',
            label: '',
          }
        ],
        itemType: "Sound",
        primaryKey: "name",
        url: null,
        uploadFile: null,
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
        formData.append('content', this.uploadFile)
        return this.$RFIDSecuritySvc.sound.create(formData)
      },
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.sound.delete(item.name)
      },
      inputFileChanged() {
        this.$nextTick()
        .then(() => {
          if (this.$refs.nameInput.value == "") {
            // I'm not sure this is the best way to do this but it does work
            let el = document.getElementById('name-input')
            el.value = this.uploadFile.name
            el.dispatchEvent(new Event('input'));
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
        if (this.uploadFile != null) {
          formData.append('content', this.uploadFile)
        }
        return this.$RFIDSecuritySvc.sound.update(item.id, formData)
      }
    },
  }
</script>
