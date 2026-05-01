<template>
  <div>
    <AppList :config="config">
      <template #itemDetailsForm='row'>
        <BFormGroup class="mb-1" label='Key' label-for='key-input' invalid-feedback='A configuration key is required'
                    floating>
          <BFormInput id='key-input' v-model='row.item.key' :plaintext="!row.isNew" placeholder='Key'
                      :required="row.isNew"></BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1" label='Value' label-for='value-input'
                    invalid-feedback='A configuration value is required' floating>
          <BFormInput id='value-input' v-model='row.item.value' placeholder='Value' required></BFormInput>
        </BFormGroup>
      </template>
    </AppList>
  </div>
</template>
<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import { Config } from '@/components/model'
import { AppListConfig } from '@/components/model';

// We need to call this inside setup directly because otherwise we'll lose the injection context
// This should stay as close to the top as possible
const api = useApi()

const config: AppListConfig<Config> = new AppListConfig(Config, api.config.list)
config.create = (item: Config) => api.config.create(item)
config.delete = (item: Config) => api.config.delete(item.key)
config.update = (item: Config) => api.config.update(item)
// Define custom post filter logic to remove the ADMIN_API_KEY config entry, this is what controls
// the access to the API and should not be modified with the UI
config.itemsFilter = async (items: Config[]) => {
  return items.filter(item => item.key !== 'ADMIN_API_KEY')
}
</script>
