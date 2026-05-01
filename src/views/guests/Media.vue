<template>
  <div>
    <AppList :config="config" ref="guestMediasList">
      <template #headerMessage>{{ tableCaption }}</template>
      <template #itemDetailsForm='row'>
        <BFormGroup class="mb-1" label='Name' label-for='guest-name'>
          <BFormInput id='guest-name'
                      :model-value="guestName"
                      plaintext></BFormInput>
        </BFormGroup>
        <BAlert :model-value='hasAllMedia && isNew' variant='info'>No available media to associated with a guest.
        </BAlert>
        <template v-if="updatable">
          <BFormGroup class="mb-1" label='Media' label-for='media-select'
                      invalid-feedback='Must select a media to associate' :state="mediaValidationState">
            <BInputGroup>
              <BFormSelect id='media-select' ref='mediaSelect' v-model='selectedMedia' :options='mediaOptions' required
                           :state="mediaValidationState">
                <template #first>
                  <BFormSelect-option value='' disabled>-- Please select a Media --</BFormSelect-option>
                </template>
              </BFormSelect>
              <BButton variant="outline-secondary" :disabled="isRefreshingMedia" @click="refreshMedia">
                <VueFeather :type="isRefreshingMedia ? 'loader' : 'refresh-cw'" size="14" />
              </BButton>
            </BInputGroup>
          </BFormGroup>
          <BFormGroup class="mb-1" label='Sound' label-for='sound-select'
                      invalid-feedback='Must select a sound or enable the system default' :state="soundValidationState">
            <BInputGroup>
              <BInputGroupText>
                <BFormCheckbox id='defaultSound' ref='defaultSound' v-model='useDefaultSoundChecked' switch>Use Default
                </BFormCheckbox>
              </BInputGroupText>
              <BFormSelect id='sound-select' ref='soundSelect' v-model='sound' :options='allSounds' text-field='name'
                           value-field='id' :disabled='useDefaultSoundChecked' :required='!useDefaultSoundChecked'
                           :state="soundValidationState">
              </BFormSelect>
              <BButton variant="outline-secondary" :disabled="isRefreshingSounds || useDefaultSoundChecked"
                       @click="refreshSounds">
                <VueFeather :type="isRefreshingSounds ? 'loader' : 'refresh-cw'" size="14" />
              </BButton>
            </BInputGroup>
          </BFormGroup>
          <BFormGroup class="mb-1" v-if='updatable' label='Color' label-for='color-input'>
            <BInputGroup>
              <BInputGroupText>
                <BFormCheckbox id='defaultColor' v-model='useDefaultColorChecked' switch>Use Default</BFormCheckbox>
              </BInputGroupText>
              <BFormInput id='color-input' v-model='color' type='color'
                          :disabled='useDefaultColorChecked'></BFormInput>

            </BInputGroup>
          </BFormGroup>
        </template>
        <BAlert variant='danger' :model-value='!!modalError' dismissible>{{ modalError }}</BAlert>
      </template>
      <template #customControlsPre='row'>
        <BButton v-if='row.item.sound' size='sm' variant='primary'
                 @click.stop='play(row.item.sound.name)' v-b-tooltip.v-primary="'Play'" pill>
          <VueFeather type="play" size="16" />
        </BButton>
      </template>
      <template #customControlsPost='row'>
        <BButton size='sm' variant='primary'
                 v-b-tooltip.v-primary="'Permissions'" @click='guestMediasList!.selectRow(row.item, true)' pill>
          <VueFeather type="key" size="16" />
        </BButton>
      </template>
      <template #empty>No media found for {{ guestName }}</template>
      <template v-slot:[`cell(color)`]='item'>
        <AppColor :color='item.color ? item.color : {} as Color'></AppColor>
      </template>
      <template v-slot:[`cell(sound)`]='item'>
        <BLink v-if='item.sound' :to="{ name: 'SoundList', query: { filter: `${item.sound.name}` } }">{{
          item.sound.name }}</BLink>
        <span v-if='!item.sound' class='text-muted'>&lt;default&gt;</span>
      </template>
    </AppList>
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { GuestMedia, AppListConfig, Sound, Color, Media, Guest } from '@/components/model'
import { useApi } from '@/composables/useApi'
import { errorToString } from '@/components/Error'
import { useSoundPlayer } from '@/composables/useSoundPlayer'

// This is the control for the sound player
const { play } = useSoundPlayer()
const router = useRouter()
const route = useRoute()
const api = useApi()

const mediaValidationState = ref<boolean | null>(null)
const soundValidationState = ref<boolean | null>(null)
const selectedMedia = ref<Media | null>(null)

const props = defineProps<{
  guestId: number
}>()

const config = new AppListConfig(GuestMedia, () => api.guestMedia.listByGuest(props.guestId), [
  {
    key: 'media',
    label: 'Media',
    sortable: true,
    accessor: (item: GuestMedia) => item.media?.name || ''
  },
  {
    key: 'sound',
    sortable: true,
  },
  {
    key: 'color',
    sortable: true,
  },
])
config.create = (item: GuestMedia) => {
  item.media = selectedMedia.value!
  return api.guestMedia.create(item)
}
config.delete = (item: GuestMedia) => api.guestMedia.delete(item.id)
config.update = (item: GuestMedia) => {
  item.media = selectedMedia.value!
  return api.guestMedia.update(item)
}
config.showModalCallback = showModalCallback
config.customValidationCallback = (_: HTMLFormElement, valid: boolean): boolean => {
  const soundValid = useDefaultSoundChecked.value ? true : sound.value !== ''
  soundValidationState.value = soundValid

  const mediaValid = selectedMedia.value != null
  mediaValidationState.value = mediaValid

  return valid && soundValid && mediaValid
}

const guest = ref<Guest>({} as Guest)
const guestName = computed(() => {
  if (typeof guest.value?.displayIdentifier === 'function') {
    return guest.value.displayIdentifier()
  }

  return ''
})
const tableCaption = computed((): string => {
  if (guestName.value) {
    return `Media for ${guestName.value}:`
  }
  return `Media for guest with id ${props.guestId}:`
})

const retrieveGuest = (guestId: number) => {
  api.guests.get(guestId)
    .then(response => guest.value = response)
    .catch(() => guest.value = {} as Guest)
}

const guestMediasList = useTemplateRef('guestMediasList')
watch(
  () => props.guestId, (newId, oldId) => {
    retrieveGuest(newId)
    if (oldId !== undefined) {
      guestMediasList.value?.refresh()
    }
  },
  { immediate: true }
)

// Must be a ref for the computed soundMap to work
// Alternatively, we can just rebuild the map whenever we rebuild allSounds
const allSounds = ref([]) as Ref<Sound[]>
const soundMap = computed(() => {
  return allSounds.value.reduce((map, sound) => {
    map[String(sound.id)] = sound;
    return map;
  }, {} as Record<string, Sound>);
})

const useDefaultColorChecked = ref(false)
const useDefaultSoundChecked = ref(false)
const color = ref('')
const sound = ref('')
const modalError = ref('')
const allMedia = ref<Media[]>([] as Media[])
const hasAllMedia = ref(false)
const isNew = ref(false)

/**
* The color and sound properties are complex and require some special handling in the modal
* This callback sets up the necessary state and watchers to handle those properties
* @param guestMedia the item being created or edited
*/
async function showModalCallback(guestMedia: GuestMedia) {
  guestMedia.guest = guest.value
  mediaValidationState.value = null
  soundValidationState.value = null
  modalError.value = ''
  isNew.value = !guestMedia.id

  color.value = guestMedia.color?.html ?? '#000000'
  useDefaultColorChecked.value = !guestMedia.color

  sound.value = guestMedia.sound ? String(guestMedia.sound.id) : ''
  useDefaultSoundChecked.value = !guestMedia.sound

  watch([color, useDefaultColorChecked, sound, useDefaultSoundChecked], () => {
    // Sync Color
    guestMedia.color = useDefaultColorChecked.value
      ? null
      : Color.fromNumber(parseInt(`0x${color.value.substring(1)}`));

    // Sync Sound
    guestMedia.sound = useDefaultSoundChecked.value
      ? null
      : (soundMap.value[sound.value] ?? null);
  });

  // Reload the sound and media lists each time we open the modal to ensure we have the latest
  try {
    const [sounds, media] = await Promise.all([api.sound.list(), api.media.listUnassociated()])
    allSounds.value = sounds.sort((a, b) => a.name.localeCompare(b.name));
    allMedia.value = media;
    hasAllMedia.value = media.length === 0

    if (guestMedia.media) {
      const match = allMedia.value.find(m => m.id === guestMedia.media.id);

      // If found in the list, use that reference. 
      // If not (e.g., already associated), keep the existing media object.
      selectedMedia.value = match || guestMedia.media;
    } else {
      selectedMedia.value = null
    }
  } catch (err) {
    modalError.value = `Unable to load sounds: ${errorToString(err as Error)}`
    // Because we can't load the sounds, the only option will be the system default
    useDefaultSoundChecked.value = true
  }
}

const updatable = computed(() => {
  const isBlockedByMedia = hasAllMedia.value && isNew.value;
  return !modalError.value && !isBlockedByMedia;
})

const isRefreshingMedia = ref(false)

async function refreshMedia() {
  isRefreshingMedia.value = true
  try {
    allMedia.value = await api.media.listUnassociated()
    hasAllMedia.value = allMedia.value.length === 0
  } catch (err) {
    modalError.value = `Failed to refresh media: ${errorToString(err as Error)}`
  } finally {
    isRefreshingMedia.value = false
  }
}

const mediaOptions = computed(() => {
  return allMedia.value.map(media => ({
    value: media, // The whole object is the value
    text: media.name // What the user sees
  }))
})

const isRefreshingSounds = ref(false)

async function refreshSounds() {
  isRefreshingSounds.value = true
  try {
    const sounds = await api.sound.list()
    allSounds.value = sounds.sort((a, b) => a.name.localeCompare(b.name))
  } catch (err) {
    modalError.value = `Failed to refresh sounds: ${errorToString(err as Error)}`
  } finally {
    isRefreshingSounds.value = false
  }
}
</script>
