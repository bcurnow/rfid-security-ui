<template>
  <div>
    <p>Welcome to RFID Security Manager!</p>
    <ul>
      <li v-for="item in thelist" :key="item.message">
        {{item}}
      </li>
    </ul>

  </div>
</template>
<script>
export default {
  data() {
    return {
      thelist: [
        {message: "hi!"}
      ]
    }
  },
  mounted() {
    const url="http://devpi.local:8080/api/v1.0/media/049B558AB35F80"
    this.axios.get(url, {
      header: {
        'X-RFIDSECURITYSVC-API-KEY': this.$config.apiKey,
      }
    })
    .then(response => {
      this.thelist = [
        response.data
      ]
    })
    .catch(function(error) {
      console.log(error)
    })
  }
}
</script>
