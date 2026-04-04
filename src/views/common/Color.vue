<template>
  <div>
    <div
      v-if="color.html"
      :style="colorStyle"
      class="w-100"
      v-b-tooltip.v-primary="color.html">
      &nbsp;
    </div>
    <span v-else class="text-muted">{{ nullColorValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type Color from '@/components/model/Color'

const props = withDefaults(defineProps<{
  color: Color
  nullColorValue?: string
}>(), {
  nullColorValue: '',
})

const colorStyle = computed(() =>
  props.color.html ? `background-color: ${props.color.html}` : ''
)
</script>