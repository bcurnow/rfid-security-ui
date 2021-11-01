<template>
  <div class='container text-left'>
    <item-list
      :createItemPromise='createItemPromise'
      :customRenderFields='customRenderFields'
      :deleteItemPromise='deleteItemPromise'
      :fields='fields'
      :itemClass='itemClass'
      :itemsPromise='itemsPromise'
      :modalOkDisabled='modalOkOnly'
      :postValidation='postValidation'
      ref='GuestMedia'
      :rowSelected='mediaSelected'
      :showModalCallback='showModal'
      sortBy='media.name'
      :updateItemPromise='updateItemPromise'
      :validationStates='validationStates'>
      <template #headerMessage>{{ tableCaption }}</template>
      <template #formGroups='props'>
        <b-form-group label='Guest Name:' label-for='guest-name'>
          <b-form-input id='guest-name' v-model='guestName' readonly></b-form-input>
        </b-form-group>
        <b-form-group v-if='showFormFields' label='Media:' label-for='media-select' invalid-feedback='Must select a media to associate!'>
          <b-form-select id='media-select' ref='mediaSelect' v-if='isNew' v-model='selected' :options='allMedia' :state='validationStates.media' @invalid='validationStates.media = false' text-field='name' value-field='id' autofocus required>
            <template #first>
              <b-form-select-option value='' disabled>-- Please select a Media --</b-form-select-option>
            </template>
          </b-form-select>
          <b-form-input id='media-select' v-if='!isNew' :value='props.item.media ? props.item.media.name : ""' disabled></b-form-input>
        </b-form-group>
        <b-alert v-model='hasAllMedia' variant='info'>No available media to associated with a guest.</b-alert>
        <b-form-group v-if='showFormFields' label='Sound:' label-for='sound-select' invalid-feedback='Must select a sound or enable the system default!'>
          <b-checkbox class='mb-1' id='defaultSound' ref='defaultSound' v-model='systemDefaultSoundChecked' @input='validationStates.sound = systemDefaultSoundChecked ? null :  !!sound' switch>System Default</b-checkbox>
          <b-form-select id='sound-select' ref='soundSelect' v-model='sound' :options='allSounds' text-field='name' value-field='id' :disabled='systemDefaultSoundChecked' :state='validationStates.sound' :required='!systemDefaultSoundChecked' @input='validationStates.sound = true' autofocus></b-form-select>
        </b-form-group>
        <b-form-group v-if='showFormFields' label='Color:' label-for='color-input'>
          <b-checkbox class='mb-1' id='defaultColor' v-model='systemDefaultColorChecked' switch>System Default</b-checkbox>
          <b-form-input id='color-input' v-model='color' placeholder='Guest Default Color' type='color' :disabled='systemDefaultColorChecked'></b-form-input>
        </b-form-group>
        <b-alert show variant='danger' v-if='modalError' dismissible>{{ modalError }}</b-alert>
      </template>
      <template #customControlsPre='props'>
        <b-button v-if='props.item.sound' size='sm' class='ml-1' v-b-modal.guestMediaSoundPlayer variant='primary' @click='playerSound = props.item.sound.name' v-b-tooltip.v-primary="'Play'" pill><b-icon class='mb-1 mt-1' icon='play'></b-icon></b-button>
      </template>
      <template #customControlsPost='props'>
        <b-button size='sm' class='ml-1' variant='primary' :to="{ name: 'GuestMediaPermissions', params: { mediaId: props.item.media.id } }" v-b-tooltip.v-primary="'Permissions'" @click='$refs.GuestMedia.selectRow(props.index)' pill><b-icon class='mb-1 mt-1' icon='key'></b-icon></b-button>
      </template>
      <template #empty>No media found for {{ guestName }} ({{ $route.params.guestId }})</template>
      <template #color='props'>
        <color :color='props.item.color ? props.item.color : {}'></color>
      </template>
      <template #sound='props'>
        <b-link v-if='props.item.sound' :to="{ name: 'SoundList', query: { filter: `${props.item.sound.name}` } }">{{ props.item.sound.name }}</b-link>
        <span v-if='!props.item.sound' class='text-muted'>&lt;default&gt;</span>
      </template>
    </item-list>
    <sound-player id='guestMediaSoundPlayer' :soundName='playerSound'></sound-player>
    <router-view></router-view>
  </div>
</template>
<script>
  import {GuestMedia} from '@/components/model'
  import Color from '../common/Color'
  import List from '../common/List'
  import SoundPlayer from '../common/SoundPlayer'

  export default {
    components: {
      'color': Color,
      'item-list': List,
      'sound-player': SoundPlayer,
    },
    computed: {
      colorInput: function() {
        let color = null
        if (!this.systemDefaultColorChecked) {
          // The result of a color input box is hex color string (e.g. #c81919), need to convert that to an integer
          color = parseInt(`0x${this.color.substring(1)}`)
        }
        return color
      },
      showFormFields: function() {
        return !this.modalOkOnly()
      },
      soundInput: function() {
        let sound = null
        if (!this.systemDefaultSoundChecked) {
          sound = this.sound
        }
        return sound
      },
      tableCaption: function() {
        if (this.guestName) {
          return `Media for for ${this.guestName}:`
        }
        return `Media for guest with id ${this.$route.params.guestId}:`
      },
    },
    data() {
      return {
        allMedia: [],
        allSounds: [],
        color: null,
        customRenderFields: ['color', 'sound'],
        hasAllMedia: false,
        fields: [
          {
            key: 'media.name',
            label: 'Media',
            sortable: true,
          },
          {
            key: 'sound',
            sortable: true,
          },
          {
            key: 'color',
            sortable: true,
          },
          {
            key: 'controls',
            label: '',
          }
        ],
        isNew: false,
        itemClass: GuestMedia,
        guestName: null,
        modalError: '',
        playerSound: '',
        selected: [],
        sound: null,
        systemDefaultColorChecked: false,
        systemDefaultSoundChecked: false,
        validationStates: {
          media: null,
          color: null,
          sound: null,
        }
      }
    },
    methods: {
      modalOkOnly: function() {
        if (this.modalError) {
          return true
        }

        if (this.hasAllMedia && this.isNew) {
          return true
        }

        return false
      },
      createItemPromise() {
        return this.$RFIDSecuritySvc.guestMedia.create(this.$route.params.guestId, this.selected, this.soundInput, this.colorInput)
      },
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.guestMedia.delete(item.id)
      },
      getGuestName: function(guestId) {
        this.$RFIDSecuritySvc.guests.get(guestId)
        .then(response => this.guestName = response.displayIdentifier())
        .catch(() => this.guestName = null)
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.guestMedia.listByGuest(this.$route.params.guestId)
      },
      mediaSelected: function(selectedRows) {
        if (selectedRows.length === 0) {
          if (this.$route.name != 'GuestMedia') {
            this.$router.push({ name: 'GuestMedia' })
          }
        } else {
          let item = selectedRows[0]
          if (this.$route.name != 'GuestMediaPermissions' || this.$route.params.mediaId != item.media.id) {
            this.$router.push({ name: 'GuestMediaPermissions', params: { mediaId: item.media.id } })
          }
        }
      },
      postValidation(_, isValid) {
        if (isValid) {
          return
        }

        // I'm not 100% sure why this is required, it feels like missing functionality in the b-form-select
        if (this.$refs.mediaSelect.value === '') {
          this.validationStates.media = false
        }

        if (this.$refs.soundSelect.value === null && ! this.systemDefaultSoundChecked) {
          this.validationStates.sound = false
        }
      },
      async showModal(item, isNew) {
        this.isNew = isNew

        if (item.color) {
          this.color = item.color.html
          this.systemDefaultColorChecked = false
        } else {
          // Vue.js doesn't like it when we set a color input to ''/null
          // default color is black (#000000) so default it to that
          this.color = '#000000'
          this.systemDefaultColorChecked = true
        }

        if (item.sound) {
          this.sound = item.sound.id
          this.systemDefaultSoundChecked = false
        } else {
          this.sound = null
          this.systemDefaultSoundChecked = true
        }

        this.hasAllMedia = false
        if (isNew) {
          this.selected = ''
          try {
            this.allMedia = await this.$RFIDSecuritySvc.media.listUnassociated()

            if (this.allMedia.length == 0) {
              this.hasAllMedia = true
            }
          } catch (err) {
            this.modalError = `Unable to load media: ${this.$RFIDSecuritySvc.errorToString(err)}`
          }
        }

        try {
          this.allSounds = await this.$RFIDSecuritySvc.sound.list()
          this.allSounds.sort((a,b) => (a.name > b.name) ? 1 : -1)
        } catch (err) {
          this.modalError = `Unable to load sounds: ${this.$RFIDSecuritySvc.errorToString(err)}`
        }
      },
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.guestMedia.update(item.id, item.guest.id, item.media.id, this.soundInput, this.colorInput)
      },
    },
    mounted() {
      this.guestName = this.getGuestName(this.$route.params.guestId)
    },
    watch: {
      '$route'(to, from) {
        if (to.params.guestId != from.params.guestId) {
          this.guestName = this.getGuestName(to.params.guestId)
          this.$refs.GuestMedia.refreshItems()
        }
      }
    },
  }
</script>
