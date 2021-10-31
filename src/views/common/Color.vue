<template>
  <div>
    <div v-if='color != null' :style='toColorStyle(color.html)' class='w-100' v-b-tooltip.v-primary='`${color.html}`'>&nbsp;</div>
    <p v-if='color === null' class='text-muted'>{{ nullColorValue }}</p>
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
