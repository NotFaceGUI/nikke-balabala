<script setup lang="ts">
import { INikkeData, msgType } from '../script/project';

defineProps<{
    msgs: Array<string>
    nikke: INikkeData
    type: msgType
    currentData: string[]
}>()


function parseImg(content: string) {

    let value = content.split(" ");

    if (value.length = 2) {
        if (value[0] !== "[url][base64:]") {
            return false;
        }
        let path: string = value[1].substring(1, value[1].length - 1);
        console.log(path);
        return true;
    }

    return false;
}

function parseImgToDataURL(content: string) {
    let value = content.split(" ");
    let index: string = value[1].substring(1, value[1].length - 1);
    return parseInt(index);
}

</script>

<template>
    <div class="msg" v-if="type == msgType.nikke">
        <div class="head" :style="{ backgroundImage: 'url(/pic/' + nikke.img + '.png)' }"></div>
        <div class="textgroup">
            <div class="name">{{ nikke.name }}</div>
            <div class="textbox" v-for="value, index in msgs" :key="index">
                <span class="text" v-if="!parseImg(value)">{{ value }}</span>
                <span v-else class="text mzhg toimg">
                    <img :src="currentData[parseImgToDataURL(value)]" class="imgType" />
                </span>
                <img src="/g.png" class="nikkeImg" />
            </div>
        </div>
    </div>

    <div class="zmsg" v-else-if="type == msgType.commander">
        <div class="ztextbox" v-for="value, index in msgs" :key="index">
            <span v-if="!parseImg(value)" class="text mzhg">{{ value }}</span>
            <span v-else class="text mzhg toimg">
                <img :src="currentData[parseImgToDataURL(value)]" class="imgType" />
            </span>
            <img src="/rg.png" class="znikkeImg" />
        </div>
    </div>
    <div class="zmsg" v-else-if="type == msgType.img && nikke.img == '指挥官'">
        <div class="ztextbox" v-for="value,index in msgs" :key="index">
            <span class="text mzhg toimg">
                <img :src="currentData[parseImgToDataURL(value)]" class="imgType" />
            </span>
            <img src="/rg.png" class="znikkeImg" />
        </div>
    </div>
    <div class="msg" v-else-if="type == msgType.img">
        <div class="head" :style="{ backgroundImage: 'url(/pic/' + nikke.img + '.png)' }"></div>
        <div class="textgroup">
            <div class="name">{{ nikke.name }}</div>
            <div class="textbox" v-for="value,index in msgs" :key="index">
                <span class="text toimg">
                    <img :src="currentData[parseImgToDataURL(value)]" class="imgType" />

                </span>
                <img src="/g.png" class="nikkeImg" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.imgType {
    max-width: 200px;
    padding: 5px 5px 0 5px;
    position: relative;
    border-radius: 20px;
    z-index: 9999999999999999999999;
}

.toimg {
    padding: 0 !important;
    overflow: hidden;
}

.name {
    font-weight: bold;
    font-size: 14px;
    padding-left: 8px;
    color: #272727;
}

.msg {
    display: flex;
    margin-bottom: 10px;
}

.zmsg {
    display: flex;
    flex-direction: column;
    justify-content: right;
    margin-bottom: 0px;
    margin-right: 10px;
}

.ztextbox {
    display: flex;
    align-items: center;
    justify-content: right;
    position: relative;
}

.ztextbox>.mzhg {
    user-select: text;
    /* word-wrap: break-word; */
    word-break: break-all;
    margin: 5px 0;
    padding: 12px 16px 12px 15px;
    display: inline-block;
    min-height: 51px;
    min-width: 45px;
    box-sizing: border-box;
    max-width: calc(100% - 40px);
    background-color: #fda912;
    color: #fcfaf6;
}

/* .ztextbox>.mzhg::before {
    content: "";
    display: block;
    position: absolute;
    z-index: 99999999999999;
    width: 16px;
    height: 16px;
    bottom: 9px;
    right: -5px;
    transform: rotate(5deg);
    background-image: url("/rg.png");
    background-repeat: no-repeat;
    background-size: 16px;
} */

.textgroup {
    flex: 1;
    max-width: calc(100% - 64px);
    display: flex;
    flex-direction: column;
    padding-right: 5px;
}

.head {
    height: 64px;
    width: 64px;
    margin-right: 10px;
    min-width: 64px;
    background-image: url("/pic/am.png");
    background-repeat: no-repeat;
    background-size: 64px;
    border-radius: 32px;
}

.textbox {
    display: flex;
    align-items: center;
    position: relative;
}

.znikkeImg {
    display: block;
    position: absolute;
    z-index: 99999999;
    width: 16px;
    height: 16px;
    bottom: 9px;
    right: -5px;

    width: 16px;
    height: 16px;
}

.nikkeImg {
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: 9999999;
    bottom: 9px;
    left: -5px;
    transform: rotate(5deg);
    width: 16px;
    height: 16px;
}

/* .textbox::before {
    content: "";
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: 99999999999;
    bottom: 9px;
    left: -5px;
    transform: rotate(5deg);
    background-image: url("/g.png");
    background-repeat: no-repeat;
    background-size: 16px;
} */


.text {
    user-select: text;
    /* word-wrap: break-word; */
    word-break: break-all;
    margin: 5px 0;
    font-weight: bold;
    font-size: 18px;
    padding: 12px 18px;
    box-shadow: 0 4px 7px #00000010;
    color: #272727;
    background-color: white;
    display: inline-block;
    border-radius: 20px;
    min-height: 51px;
    min-width: 45px;
    box-sizing: border-box;
    max-width: calc(100% - 40px);
}
</style>