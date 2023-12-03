<template>
  <div class="card">
    <div class="role" :style="{
      backgroundImage:
        'url(avatars/' + selectNikkes.projectNikkes[0].img + '.png)',
    }"></div>
    <!-- <img :src="'/pic/' + selectNikkes.projectNikkes[0].img + '.png'" alt="" srcset="" style="width: 128px;position: absolute;"> -->
    <div class="textContent">
      <slot></slot>
      <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 5px;
        ">
        <span style="font-size: 18px; font-weight: bold">{{ selectNikkes.name }}</span>
        <span class="cardAuthor"><a href="#">[ {{ selectNikkes.author }} ]</a></span>
      </div>
      <div style="flex: 1; font-size: 15px; margin-top: 2px; color: gray">
        <span>{{ selectNikkes.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Project } from "../script/project";

defineProps<{
  selectNikkes: Project; // 对话的妮姬
}>();
</script>

<style scoped>
.card {
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  padding: 5px;
  height: 75px;
  color: black;
  box-shadow: 0px 0.4px 2.4px -6px rgba(0, 0, 0, 0.192),
    0px 1.3px 7.1px -6px rgba(0, 0, 0, 0.259), 0px 6px 9px -6px rgba(0, 0, 0, 0.31);
  margin: 6px 10px;
  border-radius: 5px;
  background-color: white;
  transition: all 0.1s ease-in-out;
}


.cardAuthor {
  text-decoration: none;
  font-size: 14px;
}

.cardAuthor>a {
  color: #414141;
  transition: all 0.2s ease-in-out;
}

.cardAuthor>a:hover {
  color: #fda912;
}

.card:hover {

  background-color: aliceblue;
}

.card:active {
  transform: scaleY(0.9);
  transform: scaleX(0.98);
}

.card:hover .role::before {
  border-color: transparent aliceblue transparent transparent;
}

.textContent {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 75%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
  top: 0;
  right: 0;
}

.role {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 75px;
  width: 25%;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: left center;
  box-shadow: inset 0px 0px 16px 0px rgba(0, 0, 0, 0.274);
}

.role::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  width: 0;
  height: 0;
  bottom: 0px;
  right: -1px;
  display: block;
  border-color: transparent white transparent transparent;
  border-style: solid;
  border-width: 78px 25px 0 0;

  transition: all 0.1s ease-in-out;
}
</style>
