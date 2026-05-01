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
import { Color } from '@/components/model';


const props = withDefaults(defineProps< {
  color: Color,
  nullColorValue?: string,
}>(), {
  nullColorValue: "<default>",
})

const colorStyle = computed(() =>
  props.color.html ? `background-color: ${props.color.html}` : ''
)
</script>