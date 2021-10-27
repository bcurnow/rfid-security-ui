<template>
  <div class="container text-left">
    <item-list
      :createItemPromise="createItemPromise"
      :deleteItemPromise="deleteItemPromise"
      :fields="fields"
      :itemClass="itemClass"
      :itemsPromise="itemsPromise"
      :modalOkDisabled="() => modalError != '' || hasAllPerms"
      ref="MediaPermissions"
      :showModalCallback="showModal"
      :validationStates="validationStates">
      <template #headerMessage>{{ tableCaption }}</template>
      <template #formGroups>
        <b-form-group label="ID:" label-for="media-id">
          <b-form-input id="media-id" v-model="$route.params.mediaId" readonly></b-form-input>
        </b-form-group>
        <b-form-group label="Permission:" label-for="permission-select">
          <b-form-select id="permission-select" v-if="!hasAllPerms && !modalError" v-model="selected" :options="allPermissions" :state="validationStates.permission" @invalid="validationStates.permission = false" text-field="name" value-field="id" autofocus multiple required>
            <template #first>
              <b-form-select-option value="" disabled>-- Please select a Permission  --</b-form-select-option>
            </template>
          </b-form-select>
          <b-alert show variant="danger" v-if="modalError" dismissible>{{ modalError }}</b-alert>
          <b-alert v-model="hasAllPerms" variant="info">This media already has all possible permissions.</b-alert>
        </b-form-group>
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
        modalError: "",
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
      showModal(_, finishCallback) {
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
            finishCallback()
          })
          .catch(()=> {
            this.allPermissions = allPermissionsResponse
            finishCallback()
          })
        })
        .catch(err => {
          this.modalError = `Unable to load permissions: ${err}`
          finishCallback()
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
