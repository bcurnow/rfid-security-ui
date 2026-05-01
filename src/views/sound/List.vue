<template>
  <div>
    <AppList :config="config" ref="soundList">
      <template #itemDetailsForm='row'>
        <BFormGroup class="mb-1" label='Name' label-for='name-input' invalid-feedback='A name is required' floating>
          <BFormInput id='name-input' v-model='row.item.name' placeholder='Name' required></BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1 d-box" invalid-feedback='A sound file is required' :state="uploadFileValidationState">
          <BFormFile id='file-input' v-model='uploadFile' accept='audio/wav' :state="uploadFileValidationState"
                     :required='row.isNew'
                     browse-text="Upload sound" placeholder="No sound selected"
                     @change="(event: Event) => uploadFileChanged(event as CustomEvent, row.item)"></BFormFile>
        </BFormGroup>
      </template>
      <template #customControlsPre='row'>
        <BButton size='sm' variant='primary' v-b-tooltip.v-primary="'Play'"
                 @click.stop="play(row.item.name)" pill>
          <VueFeather type="play" size="16" />
        </BButton>
      </template>
    </AppList>
  </div>
</template>
<script setup lang="ts">
import { Sound, AppListConfig } from '@/components/model'
import { useApi } from '@/composables/useApi'
import { useSoundPlayer } from '@/composables/useSoundPlayer'

// This is the control for the sound player
const { play } = useSoundPlayer()

// We need to call this inside setup directly because otherwise we'll lose the injection context
// This should stay as close to the top as possible
const api = useApi()

const uploadFileValidationState = ref<boolean | null>(null)

const uploadFile = ref<File | null>(null)

const uploadFileChanged = (event: CustomEvent, sound: Sound) => {
  if (!sound.name || sound.name === '') {
    sound.name = event.detail.files[0].name
  }
}

const config: AppListConfig<Sound> = new AppListConfig(Sound, api.sound.list, [
  {
    key: 'name',
    sortable: true,
  },
  {
    key: 'lastUpdateTimestamp',
    label: 'Last Updated',
    sortable: true,
  },
])
config.create = (item: Sound) => api.sound.create(item.name, uploadFile.value!)
config.delete = (item: Sound) => api.sound.delete(item.id)
config.update = (item: Sound) => api.sound.update(item.id, item.name, uploadFile.value!)
config.customValidationCallback = (_: HTMLFormElement, valid: boolean): boolean => {
  uploadFileValidationState.value = uploadFile.value ? true : false
  return valid
}
config.showModalCallback = () => {
  uploadFileValidationState.value = null
}
</script>
