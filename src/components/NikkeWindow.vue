<script setup lang="ts">
import { buttonType } from "../script/project";
import NikkeButton from "./NikkeButton.vue";

defineProps<{
  title: string;
  show?: boolean;
  confirm: boolean;
  buttonSuccess?: string;
  buttonCancel?: string;
  cancel: Function;
  success?: Function;
}>();
</script>

<template>
  <div class="black"></div>
  <div class="window">
    <div class="wcontent">
      <div class="x" v-if="!confirm" @click="$props.cancel()"></div>

      <span class="title">{{ title }}</span>
      <img src="/gg_top.png" class="windowImg" alt="" style="width: 100%" />
    </div>
    <div class="contentBox">
      <slot></slot>
    </div>
    <div class="btnBox" v-if="confirm">
      <NikkeButton
        :type="buttonType.Cancel"
        :content="buttonCancel"
        @click="$props.cancel != undefined ? $props.cancel() : undefined"
        style="width: 170px; height: 50px; margin: 5px"
      >
      </NikkeButton>
      <NikkeButton
        :type="buttonType.Success"
        :content="buttonSuccess"
        @click="$props.success != undefined ? $props.success() : undefined"
        style="width: 170px; height: 50px; margin: 5px"
      >
      </NikkeButton>
    </div>
  </div>
</template>

<style scoped>
.x {
  width: 48px;
  height: 48px;
  background: url("/icon/close.svg") no-repeat center;
  background-size: 48px;
  position: absolute;
  top: 10px;
  right: 10px;
  transition: all 0.1s ease-in-out;
}

.x:active {
  transform: scale(0.9);
}

.wcontent {
  position: relative;
  display: flex;
  justify-content: center;
}

.btnBox {
  position: absolute;
  bottom: -15%;
  display: flex;
  width: 100%;
  justify-content: center;
}

.contentBox {
  position: absolute;
  top: 50px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  height: 85%;
  width: 95%;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  padding: 10px 20px;
  padding-right: 30px;
  background-color: white;
}

.title {
  position: absolute;
  z-index: 10;
  font-weight: bold;
  margin-top: 25px;
}

.window {
  position: absolute;
  z-index: 9999999999;
  max-width: 450px;
  width: 90%;
  min-width: 365px;
  height: 70%;
  background-color: #f1f1f1;
  left: 0;
  top: -7.5%;
  right: 0;
  transform: translateY(0);
  bottom: 0;
  margin: auto;
  transition: all 0.3s ease-in-out;
  animation: posInOut 0.25s ease-in-out;
  border-radius: 10px;
  box-sizing: border-box;
}

.black::before {
  content: "";
  display: block;
  position: absolute;
  z-index: 9999999;
  background-color: rgba(0, 0, 0, 0.65);
  width: 100vw;
  height: 100vh;
  animation: opacityIn 0.15s ease-in-out;
}

@keyframes posInOut {
  0% {
    transform: translateY(80vh) scale(0.5);
    opacity: 0;
  }

  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes opacityIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
