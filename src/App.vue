<template>
  <BApp>
    <div id="app" class="container">
      <aside class="sidebar">
        <RouterLink to="/" class="sidebar-brand">
          <span class="brand-icon">
            <VueFeather type="radio" size="17" />
          </span>
          <span class="brand-text">
            <span class="brand-name">RFID Security</span>
            <span class="brand-version">{{ config.appVersion }}</span>
          </span>
        </RouterLink>

        <nav class="sidebar-nav">
          <RouterLink
                      v-for="item in domainItems"
                      :key="item.to"
                      :to="item.to"
                      class="sidebar-link">
            <VueFeather :type="item.icon" size="16" class="sidebar-link__icon" />
            <span>{{ item.label }}</span>
          </RouterLink>

          <hr class="sidebar-divider" />

          <RouterLink
                      v-for="item in settingsItems"
                      :key="item.to"
                      :to="item.to"
                      class="sidebar-link sidebar-link--settings">
            <VueFeather :type="item.icon" size="14" class="sidebar-link__icon" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <div class="sidebar-footer">
          <button class="sidebar-theme-btn" @click="toggleTheme">
            <VueFeather :type="colorMode === 'dark' ? 'sun' : 'moon'" size="10" />
            <span>{{ colorMode === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>
        </div>
      </aside>

      <main class="main-content">
        <RouterView />
        <AppSoundPlayer id="soundPlayer" :soundName="soundName" v-model="isVisible" />
      </main>
    </div>
  </BApp>
</template>

<script setup lang="ts">
import config from '@/config'
import { useColorMode } from 'bootstrap-vue-next'
import { useSoundPlayer } from '@/composables/useSoundPlayer'

// Setup the sound player
const { isVisible, soundName } = useSoundPlayer()

const colorMode = useColorMode()
colorMode.value = 'light'

const domainItems = [
  { to: '/guests', icon: 'users', label: 'Guests' },
  { to: '/media', icon: 'radio', label: 'Media' },
  { to: '/permissions', icon: 'lock', label: 'Permissions' },
]

const settingsItems = [
  { to: '/configs', icon: 'settings', label: 'Configs' },
  { to: '/sounds', icon: 'music', label: 'Sounds' },
]

const toggleTheme = () => {
  colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
}

defineOptions({ name: 'App' })
</script>

<style lang="scss">
// ── Custom properties ─────────────────────────────────────────────────────────
:root {
  --sidebar-w: 220px;

  --surface: #ffffff;
  --surface-bg: #f5f5f7;
  --border-color: rgba(0, 0, 0, 0.08);
  --text-primary: #1d1d1f;
  --text-secondary: #6e6e73;
  --accent: #0071e3;
  --accent-subtle: rgba(0, 113, 227, 0.10);
  --sidebar-glass: rgba(255, 255, 255, 0.82);
  --hover-bg: rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);

  // Bootstrap overrides
  --bs-primary: #0071e3;
  --bs-primary-rgb: 0, 113, 227;
  --bs-link-color: #0071e3;
  --bs-link-hover-color: #0077ed;
  --bs-border-radius: 10px;
  --bs-border-radius-sm: 7px;
  --bs-border-radius-lg: 14px;
  --bs-border-radius-xl: 18px;
  --bs-body-font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Segoe UI', Arial, sans-serif;
}

[data-bs-theme="dark"] {
  --surface: #1c1c1e;
  --surface-bg: #000000;
  --border-color: rgba(255, 255, 255, 0.10);
  --text-primary: #f5f5f7;
  --text-secondary: #98989d;
  --accent: #0a84ff;
  --accent-subtle: rgba(10, 132, 255, 0.15);
  --sidebar-glass: rgba(28, 28, 30, 0.88);
  --hover-bg: rgba(255, 255, 255, 0.06);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.30), 0 1px 2px rgba(0, 0, 0, 0.20);

  --bs-primary: #0a84ff;
  --bs-primary-rgb: 10, 132, 255;
  --bs-link-color: #0a84ff;
  --bs-link-hover-color: #409cff;
  --bs-body-bg: #000000;
  --bs-body-color: #f5f5f7;
  --bs-border-color: rgba(255, 255, 255, 0.10);
}

// ── Global reset ──────────────────────────────────────────────────────────────
html,
body {
  margin: 0;
  padding: 0;
  background-color: var(--surface-bg);
  font-family: var(--bs-body-font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
}

// ── App shell ─────────────────────────────────────────────────────────────────
#app {
  display: flex;
  min-height: 100vh;
  background-color: var(--surface-bg);
  color: var(--text-primary);
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--sidebar-w);
  display: flex;
  flex-direction: column;
  background: var(--sidebar-glass);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-right: 1px solid var(--border-color);
  z-index: 100;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 16px 18px;
  text-decoration: none;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.70;
  }

  .brand-icon {
    width: 30px;
    height: 30px;
    background: var(--accent);
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand-name {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.2px;
    line-height: 1;
  }

  .brand-version {
    font-size: 10px;
    font-weight: 400;
    color: var(--text-secondary);
    letter-spacing: 0.1px;
    line-height: 1;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 10px 8px;
  overflow-y: auto;
}

.sidebar-divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 6px 12px;
  opacity: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
  margin-bottom: 2px;

  &__icon {
    flex-shrink: 0;
  }

  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }

  &.router-link-active {
    background: var(--accent-subtle);
    color: var(--accent);
  }
}

.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid var(--border-color);
}

.sidebar-theme-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 500;
  font-family: inherit;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  margin-bottom: 8px;

  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }
}


// ── Main content ──────────────────────────────────────────────────────────────
.main-content {
  margin-left: var(--sidebar-w);
  flex: 1;
  padding: 28px 32px;
  min-height: 100vh;
  background-color: var(--surface-bg);
}

// ── Bootstrap component refinements ──────────────────────────────────────────
.btn.rounded-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-inline: var(--bs-btn-padding-y);
  line-height: 1;
}

.btn-primary {
  --bs-btn-bg: var(--accent);
  --bs-btn-border-color: var(--accent);
  --bs-btn-hover-bg: #0077ed;
  --bs-btn-hover-border-color: #0077ed;
  --bs-btn-active-bg: #0065cc;
  --bs-btn-active-border-color: #0065cc;
}

[data-bs-theme="dark"] .btn-primary {
  --bs-btn-hover-bg: #409cff;
  --bs-btn-hover-border-color: #409cff;
  --bs-btn-active-bg: #60adff;
  --bs-btn-active-border-color: #60adff;
}

.card {
  background-color: var(--surface);
  border-color: var(--border-color);
  box-shadow: var(--shadow-sm);
}

.modal-content {
  background-color: var(--surface);
  border-color: var(--border-color);
}

.table {
  --bs-table-color: var(--text-primary);
  --bs-table-striped-color: var(--text-primary);
  --bs-table-hover-color: var(--text-primary);
}

// middle align the headers
.table thead tr th {
  vertical-align: middle;
  font-size: .85em;
}

// Reduce the size of the table text
.table tbody tr {
  font-size: .85em;
}

// Give each form group an mb-2 equivalent spacing
.form-group,
fieldset.row {
  margin-bottom: 0.5rem !important;
  /* 0.5rem is the mb-2 equivalent */
}

// ── Mobile ────────────────────────────────────────────────────────────────────
@media (max-width: 767px) {
  :root {
    --sidebar-w: 0px;
  }

  .sidebar {
    display: none;
  }

  .main-content {
    margin-left: 0;
    padding: 16px;
  }
}
</style>
