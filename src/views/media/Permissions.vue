<template>
  <div class="container text-left">
    <item-list
      :deleteItemPromise="deleteItemPromise"
      :fields="fields"
      :itemsPromise="itemsPromise"
      :itemToDisplayString="itemToDisplayString"
      itemType="Media Permission"
      :modalOkDisabled="isOkDisabled"
      :showModalCallback="showModal"
      :submitHandler="handleSubmit"
      :validationStates="validationStates">
      <template v-slot:caption>
        <h1 class="text-center">{{ tableCaption }}</h1>
      </template>
      <template v-slot:formGroups>
        <b-alert show variant="danger" v-if="modalError" dismissible>{{ modalError }}</b-alert>
        <b-alert v-model="showAllPermsAlert" variant="info" dismissible>This media already has all possible permissions.</b-alert>
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
      </template>
    </item-list>
  </div>
</template>
<script>
  import List from '../common/List'

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
        disableSelect: false,
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
        mediaName: null,
        modalError: "",
        showAllPermsAlert: false,
        selected: [],
        validationStates: {
          permissionState: null,
        }
      }
    },
    methods: {
      deleteItemPromise: function(item) {
        return this.$RFIDSecuritySvc.association.delete(item)
      },
      isOkDisabled: function() {
        return this.disableSelect
      },
      itemsPromise: function() {
        return this.$RFIDSecuritySvc.association.get(this.$route.params.mediaId)
      },
      handleSubmit(modalName, refreshFunction) {
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
          if (errors.length > 0) {
            // At least one create failed
            this.$bvModal.msgBoxOk(errors.join("\n"))
            if (errors.length != creates.length) {
              // At least one create succeeded, refresh
              refreshFunction()
            }
          } else {
            refreshFunction()
          }
          this.$bvModal.hide(modalName)
        })
      },
      itemToDisplayString: item => {
        return item.perm_name
      },
      showModal(finishCallback) {
        this.showAllPermsAlert = false
        this.disableSelect = false
        this.selected = []
        this.$RFIDSecuritySvc.permission.list()
        .then(response => {
          this.itemsPromise()
          .then(currentPerms => {
            let disabledCount = 0
            for (const p of response.data) {
              if (currentPerms.data.findIndex(currentPerm => currentPerm.perm_name === p.name) > -1) {
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
            finishCallback()
          })
          .catch(()=> {
            this.allPermissions = response.data
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
      this.mediaName = null
      this.$RFIDSecuritySvc.media.get(this.$route.params.mediaId)
      .then(response => {
        this.mediaName = response.data.name
      })
      .catch(() => {
        this.mediaName = null
      })
    }
  }
</script>
