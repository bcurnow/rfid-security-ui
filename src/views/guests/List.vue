<template>
  <div class='container text-left'>
    <item-list
      :createItemPromise='createItemPromise'
      :customRenderFields='customRenderFields'
      :deleteItemPromise='deleteItemPromise'
      :fields='fields'
      :itemClass='itemClass'
      :itemsPromise='itemsPromise'
      ref='Guests'
      :rowSelected='guestSelected'
      :showModalCallback='showModal'
      :updateItemPromise='updateItemPromise'
      :validationStates='validationStates'>
      <template #formGroups='props'>
        <b-form-group label='ID:' label-for='id-input' v-if='!props.isNew'>
          <b-form-input id='id-input' v-model='props.item.id' readonly></b-form-input>
        </b-form-group>
        <b-form-group label='First Name:' label-for='firstname-input' invalid-feedback='A first name is required!'>
          <b-form-input id='firstname-input' v-model='props.item.firstName' :state='validationStates.firstname' @invalid='validationStates.firstname = false' placeholder='Guest First Name' required></b-form-input>
        </b-form-group>
        <b-form-group label='Last Name:' label-for='lastname-input' invalid-feedback='A last name is required!'>
          <b-form-input id='lastname-input' v-model='props.item.lastName' :state='validationStates.lastname' @invalid='validationStates.lastname = false' placeholder='Guest Last Name' required></b-form-input>
        </b-form-group>
        <b-form-group label='Default Sound:' label-for='sound-select' invalid-feedback='Must select a sound or enable the system default!'>
          <b-checkbox class='mb-1' id='defaultSound' ref='defaultSound' v-model='systemDefaultSoundChecked' switch>System Default</b-checkbox>
          <b-form-select id='sound-select' v-model='sound' :options='allSounds' text-field='name' value-field='id' :disabled='systemDefaultSoundChecked' :state='validationStates.sound' @invalid='validationStates.sound = false' :required='!systemDefaultSoundChecked' autofocus></b-form-select>
        </b-form-group>
        <b-form-group label='Default Color:' label-for='color-input'>
          <b-checkbox class='mb-1' id='defaultColor' v-model='systemDefaultColorChecked' switch>System Default</b-checkbox>
          <b-form-input id='color-input' v-model='color' placeholder='Guest Default Color' type='color' :disabled='systemDefaultColorChecked'></b-form-input>
        </b-form-group>
        <b-alert show variant='danger' v-if='modalError' dismissible>{{ modalError }}</b-alert>
      </template>
      <template #customControlsPre='props'>
        <b-button v-if='props.item.sound' size='sm' class='ml-1' v-b-modal.sound-player variant='primary' @click='playerSound = props.item.sound.name' v-b-tooltip.v-primary="'Play'" pill><b-icon class='mb-1 mt-1' icon='play'></b-icon></b-button>
      </template>
      <template #customControlsPost='props'>
        <b-button size='sm' class='ml-1' variant='primary' :to="{ name: 'GuestMedia', params: { guestId: props.item.id } }" v-b-tooltip.v-primary="'Media'" @click='$refs.Guests.selectRow(props.index)' pill><b-icon class='mb-1 mt-1' icon='file-lock'></b-icon></b-button>
      </template>
      <template #color='props'>
        <color :color='props.item.color ? props.item.color : {}'></color>
      </template>
      <template #sound='props'>
        <b-link v-if='props.item.sound' :to="{ name: 'SoundList', query: { filter: `${props.item.sound.name}` } }">{{ props.item.sound.name }}</b-link>
        <span v-if='!props.item.sound' class='text-muted'>&lt;default&gt;</span>
      </template>
    </item-list>
    <sound-player id='guestSoundPlayer' :soundName='playerSound'></sound-player>
    <router-view></router-view>
  </div>
</template>
<script>
  import Color from '../common/Color'
  import {Guest} from '@/components/model'
  import List from '../common/List'
  import SoundPlayer from '../common/SoundPlayer'

  export default {
    components: {
      'item-list': List,
      'sound-player': SoundPlayer,
      'color': Color,
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
      soundInput: function() {
        let sound = null
        if (!this.systemDefaultSoundChecked) {
          sound = this.sound
        }
        return sound
      },
    },
    data() {
      return {
        allSounds: [],
        color: null,
        customRenderFields: ['color', 'sound'],
        errorResolver: this.$RFIDSecuritySvc.errorToString,
        fields: [
          {
            key: 'firstName',
            sortable: true,
          },
          {
            key: 'lastName',
            sortable: true,
          },
          {
            key: 'sound',
            sortable: true,
          },
          {
            key: 'color',
            label: 'Default Color',
            sortable: true,
          },
          {
            key: 'controls',
            label: '',
          }
        ],
        itemClass: Guest,
        modalError: null,
        playerSound: '',
        sound: null,
        systemDefaultColorChecked: false,
        systemDefaultSoundChecked: false,
        validationStates: {
          id: null,
          firstname: null,
          lastname: null,
          sound: null,
        }
      }
    },
    methods: {
      createItemPromise: function(item) {
        return this.$RFIDSecuritySvc.guests.create(item.firstName, item.lastName, this.soundInput, this.colorInput)
      },
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.guests.delete(item.id)
      },
      guestSelected: function(selectedRows) {
        if (selectedRows.length === 0) {
          if (this.$route.name != 'GuestsList') {
            this.$router.push({ name: 'GuestsList' })
          }
        } else {
          let item = selectedRows[0]
          if (this.$route.name != 'GuestMedia' || this.$route.params.guestId != item.id) {
            this.$router.push({ name: 'GuestMedia', params: { guestId: item.id } })
          }
        }
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.guests.list()
      },
      async showModal(item) {
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
          this.systemDefaultSoundChecked = true
        }

        try {
          this.allSounds = await this.$RFIDSecuritySvc.sound.list().sort((a,b) => (a.name > b.name) ? 1 : -1)
        } catch(err) {
          this.modalError = `Unable to load sounds: ${this.$RFIDSecuritySvc.errorToString(err)}`
          // Because we can't load the sounds, the only option will be the system default
          this.systemDefaultSoundChecked = true
        }
      },
      updateItemPromise: function(item) {
        return this.$RFIDSecuritySvc.guests.update(item.id, item.firstName, item.lastName, this.soundInput, this.colorInput)
      },
    },
  }
</script>
