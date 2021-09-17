<template>
  <div class="container text-left">
    <b-alert show variant="danger" v-if="error" dismissible>{{ error }}</b-alert>
    <b-table
      id="mediaPermissions"
      ref="mediaPermissions"
      responsive="md"
      :items="permissionsProvider"
      :fields="fields"
      empty-text="No Permissions associated with this media"
      show-empty
      primary-key="'primaryKey'"
      sort-by="'name'"
      head-row-variant="primary"
      sort-icon-left
      hover
      caption-top
      no-provider-sorting
      no-provider-filtering>
      <template #table-caption>
        <h1 class="text-center">Permissions for {{ $route.params.mediaId }}:</h1>
        <b-button class="mb-1" size="md" v-b-modal.add-permission variant="primary" pill><b-icon icon="plus-circle-fill"></b-icon> Add</b-button>
      </template>
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template #cell(controls)="data">
        <div class="text-nowrap text-right">
            <b-button size="sm" class="ml-1" variant="danger" @click="handleDelete(data.item)" v-b-tooltip="{ title: 'Delete', variant: 'danger' }" pill><b-icon icon="dash-circle-fill"></b-icon></b-button>
        </div>
      </template>
    </b-table>
    <b-modal id="add-permission" title="Add Permission" @show="showModal" @ok="handleOk" :ok-disabled="disableSelect">
      <b-alert show variant="danger" v-if="modalError" dismissible>{{ error }}</b-alert>
      <b-alert v-model="showAllPermsAlert" variant="info" dismissible>This media already has all possible permissions.</b-alert>
      <div ref="modalSpinner" class="text-center text-info my-2" v-show="modalLoading">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
      <div ref="modalForm" v-show="!modalLoading">
        <form ref="addPermissionForm" v-if="!disableSelect">
          <b-form-group label="ID:" label-for="media-id">
            <b-form-input id="media-id" v-model="$route.params.mediaId" plaintext></b-form-input>
          </b-form-group>
          <b-form-group label="Permission:" label-for="permission-select">
            <b-form-select id="permission-select" ref="permissions" v-model="selected" :options="allPermissions" :state="validationStates.permissionState" text-field="name" value-field="name" autofocus multiple required>
              <template #first>
                <b-form-select-option value="" disabled>-- Please select a Permission  --</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </form>
      </div>
    </b-modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        allPermissions: [],
        disableSelect: false,
        error: "",
        fields: [
          {
            key: 'perm_name',
            label: 'Permission',
            sortable: true,
          },
          {
            key: 'controls',
            label: '',
          }
        ],
        modalError: "",
        modalLoading: true,
        permissionsProvider() {
          return this.$RFIDSecuritySvc.association.get(this.$route.params.mediaId)
          .then(response => {
            return response.data
          })
          .catch(err => {
            console.log(err)
            this.error = `Error retrieving permissions for media with id '${this.$route.params.mediaId}': ${err}`
            return []
          })
        },
        showAllPermsAlert: false,
        selected: [],
        validationStates: {
          permissionState: null,
        }
      }
    },
    methods: {
      handleDelete(item) {
        this.$RFIDSecuritySvc.association.delete(item)
        .then(() => {
          this.$refs.mediaPermissions.refresh()
        })
        .catch(err => {
          console.log(err)
        })
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        const valid = this.$refs.addPermissionForm.checkValidity()
        for (const property in this.validationStates) {
          this.validationStates[property] = valid
        }
        if (!valid) {
          return
        }

        const creates = []
        const errors = []
        for (const p of this.selected) {
          const promise = this.$RFIDSecuritySvc.association.create({ media_id: this.$route.params.mediaId, perm_name:  p})
          promise
          .catch(err => {
            errors.push(`Unable to add permission '${p}': ${err}`)
          })
          creates.push(promise)
        }

        Promise.allSettled(creates)
        .then(() => {
          if (creates.length == errors.length) {
            //All of them failed, don't bother refreshing
            this.$bvModal.msgBoxOk(errors.join("\n"))
          } else {
            if (creates.length > 0) {
              // At least one create failed
              this.$bvModal.msgBoxOk(errors.join("\n"))
            }
            this.$refs.mediaPermissions.refresh()
          }
          this.$nextTick(() => {
              this.$bvModal.hide('add-permission')
          })
        })
      },
      showModal() {
        for (const property in this.validationStates) {
          this.validationStates[property] = null
        }
        this.modalLoading = true
        this.showAllPermsAlert = false
        this.disableSelect = false
        this.selected = []
        this.$RFIDSecuritySvc.permission.list()
        .then(response => {
          this.permissionsProvider()
          .then(currentPerms => {
            let disabledCount = 0
            for (const p of response.data) {
              if (currentPerms.findIndex(currentPerm => currentPerm.perm_name === p.name) > -1) {
                disabledCount++
                p.disabled = true
              }
            }
            if (disabledCount == response.data.length) {
              this.showAllPermsAlert = true
              this.disableSelect = true
            } else {
              this.allPermissions = response.data
            }
            this.modalLoading = false
          })
          .catch(()=> {
            this.allPermissions = response.data
            this.modalLoading = false
          })
        })
        .catch(err => {
          this.modalError = `Unable to load permissions: ${err}`
        })
      },
    },
    mounted() {
    },
  }
</script>
