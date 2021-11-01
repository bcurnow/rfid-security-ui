<template>
  <div>
    <div v-if='color.html' :style='toColorStyle(color.html)' class='w-100' v-b-tooltip.v-primary='`${color.html}`'>&nbsp;</div>
    <span v-else class='text-muted'>{{ nullColorValue }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    toColorStyle(color) {
      if (color) {
        return `background-color: ${color}`
      }
    },
  },
  props: {
    color: {
      type: Object,
      required: true,
    },
    nullColorValue: {
      type: String,
      default: '<default>'
    }
  }
}
</script>
