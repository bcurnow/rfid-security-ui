<template>
  <div class='container text-left'>
    <item-list
      :createItemPromise='createItemPromise'
      :customRenderFields='customRenderFields'
      :deleteItemPromise='deleteItemPromise'
      :fields='fields'
      :itemClass='itemClass'
      :itemsPromise='itemsPromise'
      :modalOkDisabled='() => modalError != "" || hasAllPerms'
      :postValidation='postValidation'
      ref='MediaPermissions'
      :showModalCallback='showModal'
      :validationStates='validationStates'>
      <template #headerMessage>{{ tableCaption }}</template>
      <template #formGroups>
        <b-form-group label='Media ID:' label-for='media-id'>
          <b-form-input id='media-id' v-model='$route.params.mediaId' readonly></b-form-input>
        </b-form-group>
        <b-form-group label='Media Name:' label-for='media-name'>
          <b-form-input id='media-name' v-model='mediaName' readonly></b-form-input>
        </b-form-group>
        <b-form-group label='Permission:' label-for='permission-select' invalid-feedback='Must select a permission to grant!'>
          <b-form-select id='permission-select' ref='permissionSelect' v-if='!hasAllPerms && !modalError' v-model='selected' :options='allPermissions' :state='validationStates.permission' text-field='name' value-field='id' autofocus multiple required>
            <template #first>
              <b-form-select-option value='' disabled>-- Please select a Permission  --</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
        <b-alert show variant='danger' v-if='modalError' dismissible>{{ modalError }}</b-alert>
        <b-alert v-model='hasAllPerms' variant='info'>This media already has all possible permissions.</b-alert>
      </template>
      <template #permission.name='props'>
        <b-link :to="{ name: 'PermissionList', query: { filter: `${props.item.permission.name}`}}">{{ props.item.permission.name }}</b-link>
      </template>
      <template #empty>No permissions found for {{ mediaName}} ({{ $route.params.mediaId }})</template>
    </item-list>
  </div>
</template>
<script>
  import List from '../common/List'
  import {MediaPerm} from '@/components/model'

  export default {
    components: {
      'item-list': List,
    },
    computed: {
      tableCaption: function() {
        if (this.mediaName) {
          return `Permissions for ${this.mediaName} (${this.$route.params.mediaId}):`
        }
        return `Permissions for ${this.$route.params.mediaId}:`
      },
    },
    data() {
      return {
        allPermissions: [],
        customRenderFields: ['permission.name'],
        hasAllPerms: false,
        fields: [
          {
            key: 'permission.name',
            label: 'Permission',
            sortable: true,
          },
          {
            key: 'controls',
            label: '',
          }
        ],
        itemClass: MediaPerm,
        mediaName: null,
        modalError: '',
        selected: [],
        validationStates: {
          permission: null,
        }
      }
    },
    methods: {
      createItemPromise() {
        const creates = []
        const errors = []
        for (const p of this.selected) {
          creates.push(
            this.$RFIDSecuritySvc.mediaPerms.create({ media_id: this.$route.params.mediaId, permission_id:  p}).catch(err => errors.push({ permission: p, error: err }))
          )
        }

        return Promise.allSettled(creates)
        .then(() => {
          if (errors.length > 0) {
            // At least one create failed
            const errorMessages = []
            for (const error of errors) {
              let permissionName = this.permissionIdToName(error.permission)
              if (null === permissionName) {
                permissionName = `id = ${error.permission}`
              }

              errorMessages.push(this.$createElement('li', {}, [`Unable to add permission '${permissionName}': ${this.$RFIDSecuritySvc.errorToString(error.error)}`]))
            }

            const container = this.$createElement('div', { class: ['alert', 'alert-danger'] }, [this.$createElement('ul', {}, errorMessages)])
            this.$bvModal.msgBoxOk([container], {
              title: 'One or more errors occured while adding permissions',
            })
          }
        })
      },
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.mediaPerms.delete(item.id)
      },
      getMediaName: function(mediaId) {
        this.$RFIDSecuritySvc.media.get(mediaId)
        .then(response => this.mediaName = response.name)
        .catch(() => this.mediaName = null)
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.mediaPerms.listByMedia(this.$route.params.mediaId)
      },
      permissionIdToName(id) {
        for (const permission of this.allPermissions) {
          if (permission.id === id) {
            return permission.name
          }
        }
        return null
      },
      postValidation(_, isValid) {
        if (isValid) {
          return
        }
        if (this.selected.length === 0) {
          this.validationStates.permission = false
        }
      },
      showModal() {
        this.hasAllPerms = false
        this.selected = []
        this.$RFIDSecuritySvc.permission.list()
        .then(allPermissionsResponse => {
          this.allPermissions = allPermissionsResponse
          this.itemsPromise()
          .then(currentPerms => {
            let disabledCount = 0
            for (const p of this.allPermissions) {
              if (currentPerms.findIndex(currentPerm => currentPerm.permission.id === p.id) > -1) {
                disabledCount++
                this.$set(p, 'disabled', true)
              }
            }
            if (disabledCount === this.allPermissions.length) {
              this.hasAllPerms = true
            }
          })
          .catch(()=> {
            this.allPermissions = allPermissionsResponse
          })
        })
        .catch(err => {
          this.modalError = `Unable to load permissions: ${err}`
        })
      },
    },
    mounted() {
      this.mediaName = this.getMediaName(this.$route.params.mediaId)
    },
    watch: {
      '$route'(to) {
        this.mediaName = this.getMediaName(to.params.mediaId)
        this.$refs.MediaPermissions.refreshItems()
      }
    }
  }
</script>
