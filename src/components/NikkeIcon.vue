<script setup lang="ts">
function jump(url: string) {
    location.href = url;
}
</script>

<template>
    <div class="iconBox">
        <div class="github" @click="jump('https://github.com/NotFaceGUI/nikke-balabala')"></div>
        <div class="qq"
            @click="jump('http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=q58gDR3R88UQTboHAvFoUb0bImyL_IQc&authKey=iA8KsKpWt0QnhjhhCknz71hgR7NcDJ6tQcMvNgcwYvUWhGD1Pcb8%2B%2BoysZr6G1gk&noverify=0&group_code=629686535')">
        </div>
    </div>
</template>

<style scoped> .iconBox {
     display: flex;
     justify-content: center;
     align-items: center;
 }

 .github {
     margin: 5px;
     width: 30px;
     height: 30px;
     background: url("/icon/github.svg") no-repeat;
     background-size: 30px;
 }

 .qq {
     margin-right: 5px;
     width: 32px;
     height: 32px;
     background: url("/icon/qq.svg") no-repeat;
     background-size: 32px;
 }
</style>