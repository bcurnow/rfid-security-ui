<template>
  <b-modal id='sound-player' title='Sound Player' @show='showModal' ok-only>
    <div class='text-center'>
      <audio controls autoplay>
        <source :src='url' type='audio/wav'>
        Your browser does not support the <code>audio</code> element.
      </audio>
    </div>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
  methods: {
    showModal() {
      this.url = this.$RFIDSecuritySvc.player.url(this.soundName)
    }
  },
  props: {
    soundName: {
      type: String,
      required: true,
    },
  }
}
</script>
