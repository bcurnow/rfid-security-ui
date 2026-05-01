<template>
  <div>
    <AppList :config="config" ref="mediaPermissionsList">
      <template #headerMessage>{{ tableCaption }}</template>
      <template v-slot:cell(media)="row">
        {{ row.item.media.name }}
      </template>
      <template v-slot:cell(permission)="row">
        {{ row.item.permission.name }}
      </template>
      <template #itemDetailsForm>
        <BFormGroup class="mb-1" label='Media ID' label-for='media-id'>
          <BFormInput id='media-id' v-model='props.mediaId' plaintext></BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1" label='Media Name' label-for='media-name'>
          <BFormInput id='media-name' v-model='mediaName' plaintext></BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1" label='Permission' label-for='permission-select'
                    invalid-feedback='Must select a permission to grant'>
          <BFormSelect id='permission-select' v-if='!hasAllPerms && !modalError'
                       v-model='selected' :options='allPermissions' text-field='name'
                       value-field='id' multiple required>
            <template #first>
              <BFormSelect-option value='' disabled>-- Please select a Permission --</BFormSelect-option>
            </template>
          </BFormSelect>
        </BFormGroup>
        <BAlert show variant='danger' v-if='modalError' dismissible>{{ modalError }}</BAlert>
        <BAlert v-model='hasAllPerms' variant='info'>This media already has all possible permissions.</BAlert>
      </template>
      <template v-slot:[`cell(permission.name)`]='item'>
        <BLink :to="{ name: 'PermissionList', query: { filter: `${item.permission.name}` } }">{{ item.permission.name }}
        </BLink>
      </template>
      <template #empty>No permissions found for {{ mediaName }}</template>
    </AppList>
  </div>
</template>
<script setup lang="ts">
import { AppListConfig, MediaPerm, Media, Permission, SelectablePermission } from '@/components/model'
import { useApi } from '@/composables/useApi';
import { AppListExposed } from '@/views/common/AppList.vue'
import AppErrorList from '@/views/common/AppErrorList.vue'
import { useModal } from 'bootstrap-vue-next';

const props = defineProps<{
  mediaId: string
}>()

const api = useApi()
const route = useRoute()
const { create } = useModal()
const mediaPermissionsList = useTemplateRef<AppListExposed<MediaPerm>>('mediaPermissionsList')
const mediaName = ref('')
const modalError = ref('')
const selected = ref<Permission[]>([])
const allPermissions = ref<SelectablePermission[]>([])
const hasAllPerms = ref(false)
const allPermsMap = computed(() => {
  return allPermissions.value.reduce((map, permission) => {
    map[permission.id] = permission
    return map
  }, {} as Record<number, Permission>)
})
const tableCaption = computed(() => {
  if (mediaName.value !== '') {
    return `Permissions for ${mediaName.value}:`
  }
  return `Permissions for ${route.params.mediaId}:`
})

const showModalCallback = async (mediaPerm: MediaPerm, isNew: boolean) => {
  mediaPerm.media = new Media({ id: props.mediaId, name: mediaName.value, desc: '' } as Media)
  hasAllPerms.value = false
  try {
    // Always reload the permissions in case someone added a new one
    allPermissions.value = await api.permission.list()
    const currentPerms = new Set(mediaPermissionsList.value!.items.map(mp => mp.permission.id))
    let disabledCount = 0
    allPermissions.value = allPermissions.value.map((p: SelectablePermission) => {
      if (currentPerms.has(p.id)) {
        disabledCount++
        p.disabled = true
      }
      return p
    })

    if (disabledCount === allPermissions.value.length) {
      hasAllPerms.value = true
    }
  } catch (err) {
    modalError.value = `Unable to load permissions: ${err}`
  }

  // Make sure none of the permissions are selected:
  selected.value = []
}

interface AddPermissionError {
  permission: Permission
  error: any
}

const addPermissionsToMedia = async (mediaPerm: MediaPerm): Promise<MediaPerm[]> => {
  const createCalls = []
  const errors = [] as AddPermissionError[]
  const createdMediaPerms = [] as MediaPerm[]
  for (const permId of selected.value) {
    const permission = allPermsMap.value[Number(permId)]
    createCalls.push(
      api.mediaPerms.create(new MediaPerm({ media: mediaPerm.media, permission: permission }))
        .then((response) => {
          createdMediaPerms.push(MediaPerm.fromApi(response))
        })
        .catch((err) => {
          errors.push({ permission: permission, error: err })
        })
    )
  }

  await Promise.allSettled(createCalls)

  if (errors.length > 0) {
    // at least one create failed
    const errorMessages = []
    for (const error of errors) {
      errorMessages.push(`Unable to add permission '${error.permission}': ${api.errorToString(error.error)}`)
    }

    // Show a pop-up with the errors
    const modal = create({
      title: 'Submission Errors',
      component: AppErrorList,
      props: {
        errors: errorMessages
      },
      okOnly: true
    });

    modal.show();
  }

  return createdMediaPerms
}

const config = new AppListConfig(MediaPerm, () => api.mediaPerms.listByMedia(props.mediaId))
config.create = addPermissionsToMedia
config.delete = (item: MediaPerm) => api.mediaPerms.delete(item.id)
config.showModalCallback = showModalCallback
config.customValidationCallback = (_: HTMLFormElement, valid: boolean): boolean => {
  if (selected.value.length === 0) {
    return false
  }
  return valid
}

watch(() => props.mediaId, async (newId) => {
  if (!newId) {
    return
  }

  const media = await api.media.get(newId)
  mediaName.value = media.name ?? ''
  await mediaPermissionsList.value?.refresh()
},
  { immediate: true }
)
</script>
