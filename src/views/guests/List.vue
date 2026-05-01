<template>
  <div>
    <AppList :config="config" ref="guestsList">
      <template #itemDetailsForm='row'>
        <BFormGroup class="mb-1" label='ID:' label-for='id-input' v-if='!row.isNew' label-cols="auto">
          <BFormInput id='id-input' v-model='row.item.id' plaintext></BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1" label='First Name' label-for='firstname-input'
                    invalid-feedback='A first name is required' floating>
          <BFormInput id='firstname-input' v-model='row.item.firstName' placeholder='First Name' required>
          </BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1" label='Last Name' label-for='lastname-input' invalid-feedback='A last name is required'
                    floating>
          <BFormInput id='lastname-input' v-model='row.item.lastName' placeholder='Last Name' required></BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1" label='Sound' label-for='sound-select'
                    invalid-feedback='Must select a sound or enable the default' :state="soundValidationState">
          <BInputGroup>
            <BInputGroupText>
              <BFormCheckbox id='defaultSound' v-model='useDefaultSoundChecked' switch>Use Default</BFormCheckbox>
            </BInputGroupText>
            <BFormSelect id='sound-select' v-model='sound' :options='allSounds' text-field='name' value-field='id'
                         :disabled='useDefaultSoundChecked' :required='!useDefaultSoundChecked'
                         :state="soundValidationState"></BFormSelect>
            <BButton variant="outline-secondary" :disabled="isRefreshingSounds || useDefaultSoundChecked"
                     @click="refreshSounds">
              <VueFeather :type="isRefreshingSounds ? 'loader' : 'refresh-cw'" size="14" />
            </BButton>
          </BInputGroup>
        </BFormGroup>
        <BFormGroup class="mb-1" label='Color' label-for='color-input'
                    invalid-feedback='Must select a color or enable the default'>
          <BInputGroup>
            <BInputGroupText>
              <BFormCheckbox id='defaultColor' v-model='useDefaultColorChecked' switch>Use Default</BFormCheckbox>
            </BInputGroupText>
            <BFormInput id='color-input' v-model='color' placeholder='Color' type='color'
                        :disabled='useDefaultColorChecked'></BFormInput>
          </BInputGroup>
        </BFormGroup>
        <BAlert :model-value="!!modalError" variant='danger' class="mt-2" dismissible>{{ modalError }}</BAlert>
      </template>
      <template #customControlsPre='row'>
        <BButton v-if='row.item.sound' size='sm' variant='primary'
                 v-b-tooltip.v-primary="'Play'" pill @click.stop="play(row.item.sound.name)">
          <VueFeather type="play" size="16" />
        </BButton>
      </template>
      <template #customControlsPost='row'>
        <BButton size='sm' variant='primary'
                 v-b-tooltip.v-primary="'Media'" @click.stop='guestsList!.selectRow(row.item, true)' pill>
          <VueFeather type="radio" size="16" />
        </BButton>
      </template>
      <template v-slot:cell(color)="props">
        <AppColor :color='props.item.color ? props.item.color : {}'></AppColor>
      </template>
      <template #[`cell(sound)`]="{ item }">
        <BLink v-if='item.sound' :to="{ name: 'SoundList', query: { filter: `${item.sound.name}` } }">{{
          item.sound.name }}</BLink>
        <span v-if='!item.sound' class='text-muted'>&lt;default&gt;</span>
      </template>
    </AppList>
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { Sound, Color, Guest, AppListConfig } from '@/components/model'
import { useApi } from '@/composables/useApi'
import { errorToString } from '@/components/Error'
import { useSoundPlayer } from '@/composables/useSoundPlayer'

// This is the control for the sound player
const { play } = useSoundPlayer()
const router = useRouter()
const route = useRoute()
const api = useApi()

const soundValidationState = ref<boolean | null>(null)
const props = defineProps<{
  guestId?: number
}>()

const guestsList = useTemplateRef('guestsList')

/**
 * Handles when a row is selected from the list, if we aren't on GuestMedia, will navigate there
 * @param selectedRows the rows which are currently selected, this is an array because multi-select is possible for AppList though it's not for this list
 */
const guestSelected = (selected: Guest, index: number) => {
  if (route.name != 'GuestMedia' || props.guestId != selected.id) {
    router.push({ name: 'GuestMedia', params: { guestId: selected.id } })
  }
}

const guestUnselected = (selected: Guest, index: number) => {
  if (route.name != 'GuestsList') {
    router.push({ name: 'GuestsList' })
  }
}

const config = new AppListConfig(Guest, api.guests.list)
config.create = (item: Guest) => api.guests.create(item)
config.delete = (item: Guest) => api.guests.delete(item.id)
config.update = (item: Guest) => {
  return api.guests.update(item)
}
config.showModalCallback = showModalCallback
config.rowSelectedCallback = guestSelected
config.rowUnselectedCallback = guestUnselected
config.customValidationCallback = (_: HTMLFormElement, valid: boolean): boolean => {
  const customValid = useDefaultSoundChecked.value ? true : sound.value !== ''
  soundValidationState.value = customValid
  return valid && customValid
}
const useDefaultColorChecked = ref(false)
const useDefaultSoundChecked = ref(false)
const color = ref('')
const sound = ref('')
const modalError = ref('')

const allSounds: Ref<Sound[]> = ref([])

const soundMap = computed(() => {
  return allSounds.value.reduce((map, sound) => {
    map[String(sound.id)] = sound;
    return map;
  }, {} as Record<string, Sound>);
});

/**
 * The color and sound properties are complex and require some special handling in the modal
 * This callback sets up the necessary state and watchers to handle those properties
 * @param item the item being created or edited
 */
async function showModalCallback(item: Guest) {
  soundValidationState.value = null
  color.value = item.color?.html ?? '#000000'
  useDefaultColorChecked.value = !item.color
  sound.value = item.sound ? String(item.sound.id) : ''
  useDefaultSoundChecked.value = !item.sound

  watch([color, useDefaultColorChecked, sound, useDefaultSoundChecked], () => {
    item.color = useDefaultColorChecked.value
      ? null
      : Color.fromNumber(parseInt(`0x${color.value.substring(1)}`));

    item.sound = useDefaultSoundChecked.value
      ? null
      : (soundMap.value[sound.value] ?? null);
  });

  try {
    const sounds = await api.sound.list()
    allSounds.value = sounds.sort((a, b) => a.name.localeCompare(b.name))
  } catch (err) {
    modalError.value = `Unable to load sounds: ${errorToString(err as Error)}`
    // Because we can't load the sounds, the only option will be the default
    useDefaultSoundChecked.value = true
  }
}

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
