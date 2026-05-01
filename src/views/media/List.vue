<template>
  <div>
    <AppList :config="config" , ref="mediaList">
      <template #headerMessage>Select a row to see associated permissions</template>
      <template #customControlsPost='row'>
        <BButton size='sm' variant='primary'
                 :to="{ name: 'MediaPermissions', params: { mediaId: row.item.id || '' } }"
                 v-b-tooltip.v-primary="'Permissions'" @click="mediaList!.selectRow(row.item, true)" pill>
          <VueFeather type="key" size="16" />
        </BButton>
      </template>
      <template #itemDetailsForm='row'>
        <BFormGroup class="mb-1" label='Name' label-for='name-input' invalid-feedback='A media name is required'
                    floating>
          <BFormInput id='name-input' v-model='row.item.name' placeholder='Media Name' required></BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1" label='Description:' label-for='desc-input' floating>
          <BFormTextarea id='desc-input' v-model='row.item.desc' placeholder='Media Description'></BFormTextArea>
        </BFormGroup>
        <BFormGroup class="mb-1" invalid-feedback='A media UID is required' :state="mediaValidationState">
          <BInputGroup>
            <BFormInput id=' id-input' v-model='row.item.id' :plaintext="!row.isNew" :required="row.isNew">
            </BFormInput>
            <BButton variant='info' @click='readMedia(row.item)'>Read Media</BButton>
          </BInputGroup>
        </BFormGroup>
      </template>
      <template #emptyfiltered>No media found with current filter settings</template>
    </AppList>
    <router-view :key="route.params.mediaId as string || 'empty'" v-if="route.params.mediaId"></router-view>
  </div>
</template>
<script setup lang="ts">
import { Media, AppListConfig } from '@/components/model'
import { useApi } from '@/composables/useApi';
import { useToast } from 'bootstrap-vue-next';
import AppList from '@/views/common/AppList.vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import router from '@/router';

const api = useApi()
const route = useRoute()

const mediaValidationState = ref<boolean | null>(null)

const props = defineProps<{
  mediaId?: string
}>()

const mediaList = useTemplateRef<ComponentExposed<typeof AppList>>('mediaList')

const mediaSelected = (media: Media, index: number) => {
  if (route.params.mediaId != media.id) {
    router.push({ name: 'MediaPermissions', params: { mediaId: media.id } })
  }
}

const mediaUnselected = (media: Media, index: number) => {
  // There can only be one selected at a time
  if (route.name != 'MediaList') {
    router.push({ name: "MediaList" })
  }
}

const config = new AppListConfig<Media>(Media, api.media.list)
config.create = (item: Media) => api.media.create(item)
config.delete = (item: Media) => api.media.delete(item.id)
config.update = (item: Media) => api.media.update(item)
config.rowSelectedCallback = mediaSelected
config.rowUnselectedCallback = mediaUnselected
config.customValidationCallback = (_: HTMLFormElement, valid: boolean): boolean => {
  mediaValidationState.value = valid
  return valid
}
config.showModalCallback = () => {
  mediaValidationState.value = null
}

const toast = useToast()

const readMedia = (item: Media): void => {
  // Show a toast message to let the user know to place their media near the reader
  const readingMediaToast = toast.create({
    id: 'mediaReadToast',
    title: 'Reading Media',
    content: 'Please place the media near the reader',
    variant: 'info',
    solid: true,
    noAutoHide: true,
  })

  try {
    api.reader.getUid().then(uid => {
      item.id = uid
      readingMediaToast.hide()
    }).catch(err => {
      readingMediaToast.hide()
      const errorToast = toast.create({
        title: 'Error Reading Media',
        content: `An error occurred while reading media: ${err}`,
        variant: 'danger',
        solid: true,
        noAutoHide: true,
      })
      errorToast.show()
    })
  } finally {
    // No matter what, make sure the reading toast is hidden
    readingMediaToast.hide()
  }
}

watch(() => route.name as string, (newName: string) => {
  if (newName === 'MediaList') {
    mediaList.value?.clearSelected()
  }
});

const selectRow = (item: Media) => {
  if (item.id === route.params.mediaId) {
    mediaList.value?.selectRow(item)
  }

  return item.id
}
</script>
