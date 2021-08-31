<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top" class="font-weight-bold">
      <b-navbar-brand class="d-flex align-items-center">
        <b-icon icon="broadcast" font-scale="2" variant="dark" class="mr-1"></b-icon>
        <b-link href="#" class="text-light">RFID Security Manager</b-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#"><b-icon icon="people-fill" class="mr-1"></b-icon>Guests</b-nav-item>
          <b-nav-item href="#"><b-icon icon="file-lock" class="mr-1"></b-icon>Media</b-nav-item>
          <b-nav-item href="#"><b-icon icon="lock-fill" class="mr-1"></b-icon>Permissions</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#"><b-icon icon="gear" class="mr-1"></b-icon>Config</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view></router-view>
    <b-container class="footer fixed-bottom" variant="primary" fluid>
      <b-row>
        <b-col></b-col>
        <b-col class="text-center">{{ this.$config.appVersion }}</b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
}
</script>

<style lang="scss">
@import "~@/assets/scss/app.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style lang='scss' scoped>
.footer {
  background-color: var(--primary);
  color: var(--light);
}
</style>
