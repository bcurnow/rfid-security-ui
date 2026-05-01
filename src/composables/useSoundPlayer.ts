import { ref, readonly } from 'vue'

const soundName = ref('')
const isVisible = ref(false)

export function useSoundPlayer() {
    const play = (name: string) => {
        soundName.value = name
        isVisible.value = true
    }

    const close = () => {
        isVisible.value = false
        soundName.value = ''
    }

    return {
        play,
        close,
        soundName: readonly(soundName),
        isVisible // Bound to v-model in App.vue
    }
}
