<template>
    <ul class="list-group">
        <li v-for="(err, i) in errors" :key="i" class="list-group-item list-group-item-danger">
            {{ err }}
        </li>
    </ul>
</template>

<script setup lang="ts">
defineProps<{ errors: string[] }>();
</script>