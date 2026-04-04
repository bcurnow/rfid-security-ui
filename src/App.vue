<template>
  <div id="app">
    <BNavbar toggleable="lg" type="dark" variant="primary" fixed="top" class="fw-bold">
      <BNavbarBrand>
        <BLink to="/" class="d-flex align-items-center text-light">
          <i class="bi bi-broadcast-pin fs-2 text-light me-1"></i> RFID Security Manager
        </BLink>
      </BNavbarBrand>

      <BNavbarToggle target="nav-collapse" />

      <BCollapse id="nav-collapse" is-nav>
        <BNavbarNav>
          <BNavItem to="/guests">
            <i class="bi bi-people-fill me-1"></i>
            Guests
          </BNavItem>
          <BNavItem to="/media">
            <i class="bi bi-file-lock me-1"></i>
            Media
          </BNavItem>
          <BNavItem to="/permissions">
            <i class="bi bi-lock-fill me-1"></i>
            Permissions
          </BNavItem>
        </BNavbarNav>

        <!-- Right aligned nav items -->
        <BNavbarNav class="ms-auto">
          <BNavItem to="/configs">
            <i class="bi bi-gear me-1"></i>
            Configs
          </BNavItem>
          <BNavItem to="/sounds">
            <i class="bi bi-music-note-list me-1"></i>
            Sounds
          </BNavItem>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>

    <RouterView class="pt-3" />

    <BContainer class="footer fixed-bottom" fluid>
      <BRow>
        <BCol />
        <BCol class="text-center">{{ $config.appVersion }}</BCol>
        <BCol />
      </BRow>
    </BContainer>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'App' })
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
  margin-top: 60px;
}

.footer {
  background-color: var(--bs-primary);
  color: var(--bs-light);
}
</style>