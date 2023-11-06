<script setup lang="ts">
defineProps<{
    label?: string | undefined,
    checked: boolean,
}>()
</script>

<template>
    <div class="radio">
        <slot></slot>
        <!-- <span class="radioBox"></span>
        <span class="label">{{ label == undefined ? "标签" : label }}</span> -->
    </div>
</template>

<style scoped>


.radio {
    display: inline-block;
}

.label {
    display: inline-block;
    height: 16px;
    line-height: 17px;
    vertical-align: middle;
    margin-left: 5px;
}

.checked {
    color: #32b1f4;
    background-color: #32b1f4;
    border-color: #32b1f4;

}

.radioBox {
    vertical-align: middle;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 5px;
    background-color: #32b1f4;

    border: 2px white solid;
    outline: #32b1f4 solid thin;

    
}
</style>