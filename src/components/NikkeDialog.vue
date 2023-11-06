<script setup lang="ts">
import { ICharacterData, Project, enterprise, msgType } from '../script/project';
import NikkeMessage from './NikkeMessage.vue';
import domtoimage from 'dom-to-image-more';
import { ref, onMounted, nextTick } from 'vue';
import { saveAs } from 'file-saver';

let props = defineProps<{
    dialogData: Project
    back: Function
    currentTime: string
}>()


let currentModel = ref(msgType.nikke);

var typeList = ref([
    msgType.nikke,
    msgType.img,
    msgType.aside,
    msgType.partition
]);

// 使用ref包装dialogData，使其变成响应式
const dialogData = ref(props.dialogData);
const scrollContainer = ref<HTMLElement | null>(null);

domtoimage

const scrollToBottom = () => {
    nextTick(() => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
        }
    });

};



function add() {
    var info: ICharacterData = {
        msgType: currentModel.value, // 正常消息类型
        msg: [],
        nikke: dialogData.value.projectNikkes[currentNikke.value]
    }

    if (isZHG.value && (currentModel.value == msgType.nikke || currentModel.value == msgType.img)) {

        info.nikke = {
            name: "指挥官",
            img: "指挥官",
            enterprise: enterprise.主角
        };
        info.msgType = msgType.commander;
    }

    info.msg.push(inputContent.value);
    dialogData.value.messageData.list?.push(info);
    scrollToBottom();
    inputContent.value = ""
}

function exportImg() {
    //   if (dialogImg.value != undefined) {
    //     console.log("test");
    //     html2canvas(document.body).then(function (canvas) {
    //       document.body.appendChild(canvas);
    //     });
    //   }

    domtoimage
        .toBlob(dialogImg.value)
        .then(function (blob: string | Blob) {
            saveAs(blob, dialogData.value.name + '.png');
        })
        .catch(function (error: any) {
            console.error('oops, something went wrong!', error);
        });
}

const dialogImg = ref<HTMLElement | null>(null);

const dialogHeader = ref<HTMLElement | null>(null);
const dialogContent = ref<HTMLElement | null>(null);


function append() {
    dialogData.value.messageData.list[dialogData.value.messageData.list.length - 1].msg.push(inputContent.value);
    inputContent.value = "";

    // exportImg();
}

function show() {
    isSelectView.value = !isSelectView.value;
    scrollToBottom()
}

function selectModel(type: msgType) {
    currentModel.value = type;
}

onMounted(() => {
    scrollToBottom();
})

var currentNikke = ref(0);
var isSelectView = ref(false);
var isZHG = ref(false);


var inputContent = ref("");

function selectNikke(index: number) {
    currentNikke.value = index;
    isZHG.value = false;
}

function selectZ() {
    isZHG.value = true;
}

// function clamp(vaule: number, min: number, max: number) {
//     if (vaule < min) {
//         return min;
//     }

//     if (vaule > max) {
//         return max;
//     }

//     return vaule;
// }

</script>

<template >
    <div class="dialog">
        <div class="dheader">
            <div class="tilte">
                <span style="vertical-align: middle;">
                    <img src="/wifi.png" style="width: 18px;">
                </span>
                {{ currentTime }}
            </div>
            <div class="dback" @click="$props.back(dialogData)">
                <div class="dtilte">
                    <img src="/back.png" alt="" style="width: 25px;margin-top: 2px;">
                    <span style="vertical-align: middle;">{{ dialogData?.name }}</span>
                </div>
            </div>

            <!-- <div class="floorInfo">
                <span>@{{ dialogData?.author }}</span>
                <span>
                    balabala 生成器制作@流浪鬼
                </span>
            </div> -->
        </div>
        <div class="dcontent" ref="scrollContainer">
            <NikkeMessage v-for="value, index in dialogData?.messageData.list" :type="value.msgType" :msgs="value.msg"
                :nikke="value.nikke" :key="index"></NikkeMessage>
        </div>

        <div style="position: relative;bottom: 0;width: 100%;">
            <div class="dmodel">
                <span class="dmodelView" :class="{ slectModel: currentModel == value }" v-for="value in typeList"
                    @click="selectModel(value)">{{ value }}</span>
                <span class="dmodelView export" style="margin-left: auto;width: 80px;" @click="exportImg()">导出图片</span>
            </div>
            <div class="selectNikkeInfo last" v-if="isSelectView" @click="selectZ()">指</div>
            <div class="dselectnikke" v-if="isSelectView">
                <div class="selectNikkeInfo" v-for="value, index in dialogData?.projectNikkes" :key="index"
                    :style="{ backgroundImage: 'url(/pic/' + value.img + '.png)' }" @click="selectNikke(index)">
                </div>
            </div>
            <div class="nikkeedit">
                <div class="selectNikkeInfo" @click="show()"
                    :style="{ backgroundImage: 'url(/pic/' + dialogData?.projectNikkes[currentNikke].img + '.png)' }"
                    :class="{ zhg: isZHG }">
                    <span v-if="isZHG"
                        style="color: rgb(92, 58, 58);line-height: 32px;text-align: center;width: 100%;display: inline-block;">指挥官</span>
                </div>
                <input type="text" class="nikkeInput dinput" v-model="inputContent" name="" id="">
                <div class="add newadd" @click="add()">新增</div>
                <div class="add oldadd" @click="append()">追加</div>
            </div>
        </div>

    </div>

    <div class="dialogImg"
        :style="{ height: (dialogHeader == undefined ? 80 : dialogHeader.clientHeight) + (dialogContent == undefined ? 50 : dialogContent.scrollHeight - 5) + 'px !important' }"
        ref="dialogImg">
        <div class="dheader himg" ref="dialogHeader">
            <div class="tilte">
                <span style="vertical-align: middle;">
                    <img src="/wifi.png" style="width: 18px;">
                </span>
                {{ currentTime }}
            </div>
            <div class="dback" @click="$props.back(dialogData)">
                <div class="dtilte">
                    <img src="/back.png" alt="" style="width: 25px;margin-top: 2px;">
                    <span style="vertical-align: middle;">{{ dialogData?.name }}</span>
                </div>
            </div>

            <!-- <div class="floorInfo">
                <span>@{{ dialogData?.author }}</span>
                <span>
                    balabala 生成器制作@流浪鬼
                </span>
            </div> -->
        </div>
        <div class="dcontent toimg" ref="dialogContent">
            <NikkeMessage v-for="value, index in dialogData?.messageData.list" :type="value.msgType" :msgs="value.msg"
                :nikke="value.nikke" :key="index"></NikkeMessage>
        </div>
    </div>
</template>

<style>
.export {
    transition: transform .1s ease-in-out !important;
}

.export:active {
    transform: scale(0.95);
}

div.toimg {
    overflow: hidden !important;
}

div.dialogImg {
    position: absolute;
    right: -900px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    width: 500px;
    z-index: 99999;
}

div.himg {
    max-height: 100px;
}

.dmodel {
    position: relative;
    display: flex;
    width: 100%;
    height: 40px;
    --line-color: rgba(60, 10, 30, .02);
    background-image: linear-gradient(90deg, var(--line-color) 3%, transparent 0),
        linear-gradient(1turn, var(--line-color) 3%, transparent 0);
    background-size: 30px 30px;
    background-position: 100% 100%;
    background-color: #f1f1f1;
}

div>.slectModel {
    color: rgba(22, 101, 52);
    border: 1px #2dac5c solid;

    background-color: rgba(134, 239, 172);
}

.dmodelView {
    /* color: rgba(22,101,52); */
    color: #dcf4ba;
    /* background-color: rgba(134,239,172); */
    background-color: #2dac5c;
    border: 1px #bbf7d0 solid;
    text-align: center;
    display: inline-block;
    width: 60px;
    line-height: 28px;
    border-radius: .25rem;
    margin: 5px;
    transition: all .1s ease-in-out;
}

.tilte {
    font-size: 14px;
    padding: 2px 10px;
}

.nikkeedit {
    z-index: 9999999;
    position: relative;
    border-top: 1px rgb(194, 194, 194) solid;
    display: flex;
    width: 100%;
    height: 50px;
    align-items: center;
    background-color: #fff;
    color: black;
}

.zhg {
    background-image: none !important;
    background-color: #fda912 !important;
    width: 64px !important;
}

.dselectnikke {
    background-color: white;
    align-items: center;
    height: 50px;
}


.last {
    position: absolute;
    color: rgb(92, 58, 58);
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    background-color: #fda912 !important;
}


.selectNikkeInfo {
    display: inline-block;
    margin: 9px 9px;
    width: 32px;
    height: 32px;
    background-color: rgb(212, 212, 212);
    border-radius: 16px;
    background-repeat: no-repeat;
    background-size: 32px;
    border-radius: 32px;
    transition: transform .06s ease-in-out;
}

.dselectnikke>.selectNikkeInfo:first-child {
    margin-left: 59px;
}

.selectNikkeInfo:active {
    transform: scale(0.9);
}

.add {
    width: 10%;
    border-radius: 5px;
    line-height: 40px;
    text-align: center;
    height: 80%;
    margin: 0 5px;
    transition: all .1s ease-in;
}

.newadd {
    background-color: #fda912;
    border: 1px solid #b37502;
    color: white;
}

.newadd:hover {
    background-color: #fcc153;
}

.oldadd {
    background-color: #32b1f4;
    border: 1px solid #027fc2;
    color: white;
}

.oldadd:hover {
    background-color: #67caff;
}



.add:active {
    transform: scale(0.9);
}

.dinput {
    outline: 0 !important;

    border: 0;
    border-radius: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.dback {
    display: flex;
    flex: 1;
    padding-bottom: 10px;
    align-items: center;
    transition: all .1s ease-in-out;
}

.dtilte>img {
    vertical-align: middle;
}

.dback:active {
    transform: translateX(2px) scale(0.98);
}

.dialog {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    z-index: 99999;
    animation: dposInOut .25s ease-in-out;
}

@keyframes dposInOut {
    0% {
        transform: translateY(80vh) scaleY(0.5);
        opacity: 0;
    }

    100% {
        transform: translateY(0) scaleY(1);
        opacity: 1;
    }
}

.floorInfo {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    padding: 5px 10px;
}

.dtilte {
    display: inline-block;
    margin-left: 10px;
    text-align: center;
    font-size: 24px;
    font-weight: 900;
    text-shadow: 0px 1px 5px #00000027;
    line-height: 35px;
}

.dcontent {
    flex: 1;
    position: relative;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 15px 10px;
    position: relative;
    box-sizing: border-box;
    z-index: -1;
    width: 100%;
    transition: all .1s ease-in-out;
    color: black;
    --line-color: rgba(60, 10, 30, .02);
    background-image: linear-gradient(90deg, var(--line-color) 3%, transparent 0),
        linear-gradient(1turn, var(--line-color) 3%, transparent 0);
    background-size: 30px 30px;
    background-position: 100% 100%;
    background-color: #f1f1f1;
}

div::-webkit-scrollbar {
    width: 0;
    /* 隐藏滚动条 */
}

.dcontent::-webkit-scrollbar-thumb {
    background: #ccc;
    /* 滚动条thumb颜色 */
    border-radius: 5px;
    /* 滚动条thumb圆角 */
}

.dcontent::-webkit-scrollbar-track {
    background: transparent;
    /* 滚动条轨道颜色 */
    border-radius: 5px;
    /* 滚动条轨道圆角 */
}

.dheader {
    display: flex;
    flex-direction: column;
    height: 12%;
    box-shadow:
        0px 0px 10px rgba(0, 0, 0, 0.4);
    background: linear-gradient(transparent 50%, #fda912 50%),
        linear-gradient(90deg, transparent 50%, #f8be53bb 50%);
    background-size: 5px 5px;
    background-position: center;
    background-color: #fda912;
}
</style>