<template>
  <div>
    <AppList :config="config">
      <template #itemDetailsForm='row'>
        <BFormGroup class="mb-1" label='ID' label-for='id-input' v-if='!row.isNew'>
          <BFormInput id='id-input' v-model='row.item.id' plaintext></BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1" label='Name' label-for='name-input' invalid-feedback='A permission name is required'
                    floating>
          <BFormInput id='name-input' v-model='row.item.name' placeholder='Name' required></BFormInput>
        </BFormGroup>
        <BFormGroup class="mb-1" label='Description' label-for='desc-input' floating>
          <BFormInput id='desc-input' v-model='row.item.desc' placeholder='Description'></BFormInput>
        </BFormGroup>
      </template>
    </AppList>
  </div>
</template>
<script setup lang="ts">
import { Permission, AppListConfig } from '@/components/model'
import { useApi } from '@/composables/useApi';
const api = useApi()
const config = new AppListConfig<Permission>(Permission, api.permission.list)
config.create = (item: Permission) => api.permission.create(item)
config.delete = (item: Permission) => api.permission.delete(item.id)
config.update = (item: Permission) => api.permission.update(item)
</script>
