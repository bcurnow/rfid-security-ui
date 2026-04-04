<template>
  <BModal :id="id" :title="title" @show="showModal" ok-only>
    <div class="text-center">
      <audio controls autoplay>
        <source :src="url" type="audio/wav" />
        Your browser does not support the <code>audio</code> element.
      </audio>
    </div>
  </BModal>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'

const props = withDefaults(defineProps<{
  id?: string
  soundName: string
  title?: string
}>(), {
  id: 'sound-player',
  title: 'Sound Player',
})

const url = ref<string>('')

function showModal(): void {
  const instance = getCurrentInstance()
  const RFIDSecuritySvc = instance?.appContext.config.globalProperties.$RFIDSecuritySvc
  url.value = RFIDSecuritySvc?.player.url(props.soundName) ?? ''
}
</script>