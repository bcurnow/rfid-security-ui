<template>
  <BModal :id="id" ref="modalRef" v-model="isVisible" :title="title" @hidden="onHidden"
          ok-only>
    <div class="text-center">
      <audio v-if="url" :key="url" :src="url" :controls="true" :autoplay="true">
        Your browser does not support the <code>audio</code> element.
      </audio>
    </div>
  </BModal>
</template>

<script setup lang="ts">
import { BModal } from 'bootstrap-vue-next';
import { useApi } from '@/composables/useApi'

const props = withDefaults(defineProps<{
  id: string
  soundName: string
  title?: string
  soundPlayerVisible?: boolean
}>(), {
  title: 'Sound Player',
  soundPlayerVisible: false
})

const modalRef = ref<InstanceType<typeof BModal> | null>(null)
const url = ref<string | null>(null)
const api = useApi()

const isVisible = computed({
  get: () => props.soundPlayerVisible,
  set: (value) => emit('update:soundPlayerVisible', value)
})

watch(
  () => props.soundName, (name) => {
    url.value = name ? api.player.url(name) : null
  },
  { immediate: true }
)

const onHidden = () => {
  url.value = null
  emit('update:soundPlayerVisible', false)
}

const emit = defineEmits(['update:soundPlayerVisible'])

defineExpose({
  show: () => modalRef.value?.show(),
  hide: () => modalRef.value?.hide()
})

</script>