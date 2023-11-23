<script setup lang="ts">
defineProps<{
    content?: string | undefined,

}>()
</script>

<template>
    <div class="info">
        <!-- {{ content == undefined ? "内容" : content }} -->
        <slot ></slot>
    </div>
</template>

<style scoped>
.info {
    color: #cecbca;
    text-indent: 2em;
}
</style>