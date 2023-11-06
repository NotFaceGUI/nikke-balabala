<script setup lang="ts">
import { buttonType } from '../script/project';

defineProps<{
    type: buttonType,
    content: string | undefined
}>()

</script>


<template>
    <div class="btn">
        <span class="value" :class="{valueExit: type == buttonType.Cancel}">{{ content == undefined ? "按钮" : content }}</span>
        <img class="btnbg" src="/btn_bg.png" v-if="type == buttonType.Success">
        <img class="btnbg" src="/btn_white_bg.png" v-if="type == buttonType.Cancel">
    </div>
</template>

<style scoped>
.btn {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: all .05s ease-in;
}

.btn:active {
    transform: scale(0.9);
}

.value {
    color: white;
    font-weight: bold;
    position: absolute;
    z-index: 999;
    text-shadow: 1px 1px 5px #332c2c;
}

.valueExit {
    color: #332c2c;
    text-shadow: 1px 1px 5px #797676;
}

.btnbg {
    position: absolute;
    top: 0;
    display: block;
    width: 100%;
    height: 100%;
}
</style>