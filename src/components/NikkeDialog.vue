<script setup lang="ts">
import {
    ICharacterData,
    Project,
    enterprise,
    msgType,
    exportImgType,
    ImgConfig,
    builtinImageDatas,
} from "../script/project";
import NikkeMessage from "./NikkeMessage.vue";
import domtoimage from "dom-to-image-more";
import { ref, onMounted, nextTick, reactive } from "vue";
import { saveAs } from "file-saver";
import NikkeWindow from "./NikkeWindow.vue";
import NikkeInfo from "./NikkeInfo.vue";
import NikkeIcon from "./NikkeIcon.vue";
import NikkeSelect from "./NikkeSelect.vue";
import { ImgType } from '../script/project';

let props = defineProps<{
    dialogData: Project;
    back: Function;
    currentTime: string;
}>();

let imgConfig: ImgConfig = reactive({
    width: 500,
    maxWidth: 550,
    bottomHeigth: 15, // 最下面对话与图片最底部的距离 用于方便查看
});

enum exportImgState {
    pause,
    run,
}

let currentExportImgState = ref<exportImgState>(exportImgState.pause);

let currentModel = ref(msgType.nikke);

var typeList = ref([
    msgType.nikke,
    msgType.img,
    msgType.aside,
    msgType.partition,
    msgType.branch,
]);

// 使用ref包装dialogData，使其变成响应式
const dialogData = ref(props.dialogData);
const scrollContainer = ref<HTMLElement | null>(null);
const currentSelectImgae = ref<number>(-1);

const scrollToBottom = () => {
    nextTick(() => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
        }
    });
};

function check() {
    // 如果当前模式是图片
    if (currentSelectImgae.value != -1 || currentModel.value == msgType.branch) {
        return;
    }
    if (
        inputContent.value != "" &&
        currentModel.value != msgType.aside &&
        currentModel.value != msgType.partition
    ) {
        currentModel.value = msgType.nikke;
    }
}

function append() {
    // 当前模式和最后对话的模式不同 即最后对话的是img则无需进行添加
    if (currentModel.value == msgType.img && currentSelectImgae.value != -1) {
        // 如果想最加图片则必须使得msgType为追加图片
        if (currentImageType.value == ImgType.localImage) {
            dialogData.value.messageData.list[
                dialogData.value.messageData.list.length - 1
            ].msg.push("[url][base64:] [" + totalImages.value[currentSelectImgae.value] + "]");
        } else if (currentImageType.value == ImgType.builtinImage) {
            dialogData.value.messageData.list[
                dialogData.value.messageData.list.length - 1
            ].msg.push("[url][base64:] [" + builtinImageDatas[currentSelectImgae.value] + "]");
        }else {
            dialogData.value.messageData.list[
                dialogData.value.messageData.list.length - 1
            ].msg.push("[差分]");
        }
    } else if (
        dialogData.value.messageData.list[dialogData.value.messageData.list.length - 1]
            .msgType == msgType.img
    ) {
        let model: msgType = msgType.nikke;
        // 如果最后一项是指挥官则修改为指挥官
        if (
            dialogData.value.messageData.list[dialogData.value.messageData.list.length - 1]
                .nikke.img == "指挥官"
        ) {
            model = msgType.commander;
        }
        // 如果最后一项是图片 且追加类型不等于图片则修改最后一项的类型
        dialogData.value.messageData.list[
            dialogData.value.messageData.list.length - 1
        ].msgType = model;
        dialogData.value.messageData.list[
            dialogData.value.messageData.list.length - 1
        ].msg.push(inputContent.value);
        inputContent.value = "";
    } else {
        dialogData.value.messageData.list[
            dialogData.value.messageData.list.length - 1
        ].msg.push(inputContent.value);
        inputContent.value = "";
    }

    scrollToBottom();

    // exportImg();
}

function add() {
    var info: ICharacterData = {
        msgType: currentModel.value, // 正常消息类型
        msg: [],
        nikke: dialogData.value.projectNikkes[currentNikke.value],
    };

    if (
        isZHG.value &&
        (currentModel.value == msgType.nikke || currentModel.value == msgType.img)
    ) {
        info.nikke = {
            name: "指挥官",
            img: "指挥官",
            enterprise: enterprise.主角,
        };

        info.msgType = msgType.commander;
    }

    // 如果消息类型是图片 则进行图片文本
    if (currentModel.value == msgType.img && currentSelectImgae.value != -1) {
        info.msgType = msgType.img;
        if (currentImageType.value == ImgType.localImage) {
            info.msg.push("[url][base64:] [" + totalImages.value[currentSelectImgae.value] + "]");
        } else if (currentImageType.value == ImgType.builtinImage) {
            info.msg.push("[url][base64:] [" + builtinImageDatas[currentSelectImgae.value] + "]");
        } else {
            info.msg.push("[表情]");
        }
    } else {
        info.msg.push(inputContent.value);
    }
    dialogData.value.messageData.list?.push(info);
    scrollToBottom();
    inputContent.value = "";
}

var isImg = ref(false);

var imgData = reactive({
    scale: 2,
    quality: 0.95,
    exportType: "0",
    imgName: dialogData.value.name,
    mark: true,
});

function exprotRealToImg() {
    switch (imgData.exportType) {
        case exportImgType.png.toString():
            currentExportImgState.value = exportImgState.run;
            nextTick(() => {
                if (dialogImg.value != undefined) {
                    domtoimage
                        .toPng(dialogImg.value, {
                            width: dialogImg.value.clientWidth * imgData.scale,
                            height: dialogImg.value.clientHeight * imgData.scale,
                            style: {
                                transform: "scale(" + imgData.scale + ")",
                                transformOrigin: "top left",
                            },
                        })
                        .then(function (dataUrl: string) {
                            saveAs(dataUrl, imgData.imgName + ".png");

                            var img = new Image();
                            img.src = dataUrl;
                            preview.value?.appendChild(img);

                            if (dialogImg.value != undefined) {
                                dialogImg.value.style.transform = `scale(${1})`;
                            }
                            currentExportImgState.value = exportImgState.pause;

                            // isImg.value = false;
                        })
                        .catch(function (error: any) {
                            currentExportImgState.value = exportImgState.pause;

                            console.error("oops, something went wrong!", error);
                        });
                }
            });
            break;
        case exportImgType.jpeg.toString():
            currentExportImgState.value = exportImgState.run;
            nextTick(() => {
                if (dialogImg.value != undefined) {
                    domtoimage
                        .toJpeg(dialogImg.value, {
                            width: dialogImg.value.clientWidth * imgData.scale,
                            height: dialogImg.value.clientHeight * imgData.scale,
                            quality: imgData.quality,
                            style: {
                                transform: "scale(" + imgData.scale + ")",
                                transformOrigin: "top left",
                            },
                        })
                        .then(function (dataUrl: string) {
                            saveAs(dataUrl, imgData.imgName + ".jpeg");

                            var img = new Image();
                            img.src = dataUrl;
                            preview.value?.appendChild(img);

                            if (dialogImg.value != undefined) {
                                dialogImg.value.style.transform = `scale(${1})`;
                            }
                            currentExportImgState.value = exportImgState.pause;
                            // isImg.value = false;
                        })
                        .catch(function (error: any) {
                            currentExportImgState.value = exportImgState.pause;
                            console.error("oops, something went wrong!", error);
                        });
                }
            });
            break;
        default:
            break;
    }
}

function exportImg() {
    isImg.value = true;
    // 添加预览图
}

const dialogImg = ref<HTMLElement | null>(null);
const dialogHeader = ref<HTMLElement | null>(null);
const dialogContent = ref<HTMLElement | null>(null);
const preview = ref<HTMLElement | null>(null);
let totalImages = ref<string[]>([]); // 存储到 local 中

const inputRef = ref<HTMLInputElement>();
const inputPlaceholder = ref("请输入对话内容");

function show() {
    isSelectView.value = !isSelectView.value;
    scrollToBottom();
}

function selectModel(type: msgType) {
    inputPlaceholder.value = "请输入对话内容";

    if (type == msgType.img) {
        inputContent.value = "";
        inputPlaceholder.value = "";
    }

    if (type == msgType.partition) {
        inputPlaceholder.value = "请输入分割内容，默认为END";
    }

    if (type == msgType.aside) {
        inputPlaceholder.value = "请输入旁白内容";
    }

    currentModel.value = type;
}

onMounted(() => {
    scrollToBottom();

    // 判断有没有totalImages这个字段
    var isV = localStorage.getItem("totalImages"); //'true' 字符串类型的
    if (isV === null) {
        localStorage.setItem("totalImages", JSON.stringify(totalImages.value));
    } else {
        totalImages.value = JSON.parse(isV);
    }
});

var currentNikke = ref(0);
var isSelectView = ref(false);
var isZHG = ref(false);
let isImgListView = ref(false);
var inputContent = ref("");

function selectNikke(index: number) {
    currentNikke.value = index;
    isZHG.value = false;
}

function selectZ() {
    isZHG.value = true;
}

function clamp(vaule: number, min: number, max: number) {
    if (vaule < min) {
        return min;
    }

    if (vaule > max) {
        return max;
    }

    return vaule;
}

function cancel() {
    isImg.value = false;
    console.log("cancel");
}

const selectedImages = ref<string[]>([]);

const handleFileUpload = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const files = Array.from(fileInput.files || []);

    if (files.length > 0) {
        const readerPromises = files.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readerPromises)
            .then((imageDataArray) => {
                selectedImages.value = selectedImages.value.concat(imageDataArray);
            })
            .finally(() => {
                addImages();
            });
    }
};

const addImages = () => {
    // 将选中的图像添加到totalImages，同时检查重复, 并且当数据有更新时我们将图片添加到本地数据存储中
    let sum: number = 0;
    selectedImages.value.forEach((image) => {
        if (!totalImages.value.includes(image)) {
            totalImages.value.push(image);
            sum++;
        }
    });
    if (sum > 0) {
        localStorage.setItem("totalImages", JSON.stringify(totalImages.value));
    }
};

function selectImage(index: number) {
    console.log(1);
    if (currentSelectImgae.value == index) {
        currentSelectImgae.value = -1;
    } else {
        currentSelectImgae.value = index;
    }
}

const fileInput = ref<HTMLInputElement>();

const openFileInput = () => {
    isImgListView.value = !isImgListView.value;
};

// const saveImages = () => {
//     selectedImages.value.forEach((imageData, index) => {
//         const blob = dataURLtoBlob(imageData);
//         const fileName = `image_${index}.png`;
//         saveAs(blob, fileName);
//     });
// };

// 将数据URL转换为Blob的辅助函数
// const dataURLtoBlob = (dataURL: string) => {
//     const arr = dataURL.split(',');
//     if (arr.length < 2) {
//         throw new Error('Invalid data URL');
//     }

//     const mimeMatch = arr[0].match(/:(.*?);/);
//     if (!mimeMatch || mimeMatch.length < 2) {
//         throw new Error('MIME type not found in data URL');
//     }

//     const mime = mimeMatch[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);

//     while (n--) {
//         u8arr[n] = bstr.charCodeAt(n);
//     }

//     return new Blob([u8arr], { type: mime });
// };

const openFile = () => {
    fileInput.value?.click();
};

let isAddNikkeWindow = ref(false);

const addNikke = () => {
    isAddNikkeWindow.value = true;
}

const cancelAdition = () => {
    isAddNikkeWindow.value = false;
}

let currentImageType = ref<ImgType>(ImgType.localImage);

const selectType = (index: number) => {
    currentImageType.value = index;
    console.log(index);
}

</script>

<template>
    <!-- <div>
        <input type="file" @change="handleFileUpload" accept="image/*" multiple />
        <div v-for="(image, index) in selectedImages" :key="index">
            <img :src="image" alt="Uploaded Image" />
        </div>
        <button @click="saveImages">Save Images</button>
    </div> -->
    <div style="width: 100%;height: 75%;position: absolute;">
        <NikkeWindow id="createProject" title="添加新的妮姬对象" :confirm="false" :show="isImg" v-if="isAddNikkeWindow"
            button-cancel="取消添加" :cancel="cancelAdition" button-success="确认添加">
            <div>
                <NikkeSelect :filter-data="dialogData?.projectNikkes"></NikkeSelect>
            </div>
        </NikkeWindow>
    </div>

    <div class="dialog">

        <div class="dheader">
            <div class="tilte">
                <span style="vertical-align: middle">
                    <img src="/wifi.png" style="width: 18px" />
                </span>
                {{ currentTime }}
            </div>
            <div class="dback" @click="$props.back(dialogData)">
                <div class="dtilte">
                    <img src="/back.png" alt="" style="width: 25px; margin-top: 2px" />
                    <span style="vertical-align: middle">{{ dialogData?.name }}</span>
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
            <NikkeMessage :is-edit="true" :dialog-data="dialogData" :current-data="totalImages"
                v-for="(value, index) in dialogData?.messageData.list" :type="value.msgType" :msgs="value.msg"
                :nikke="value.nikke" :index="index" :key="index"></NikkeMessage>
        </div>

        <div style="position: relative; bottom: 0; width: 100%">
            <div class="dmodel">
                <span class="dmodelView" :class="{ slectModel: currentModel == value }" v-for="value in typeList"
                    @click="selectModel(value)">{{ value }}</span>
                <span class="dmodelView export" style="margin-left: auto; width: 80px" @click="exportImg()">导出图片</span>
            </div>
            <!-- <div class="editBar"></div> -->
            <div class="selectNikkeInfo last" v-if="isSelectView" @click="selectZ()">指</div>
            <div class="dselectnikke" v-if="isSelectView">
                <div class="selectNikkeInfo" v-for="(value, index) in dialogData?.projectNikkes" :key="index"
                    :style="{ backgroundImage: 'url(avatars/' + value.img + '.png)' }" @click="selectNikke(index)"></div>
                <div class="selectNikkeInfo nadd" @click="addNikke()"></div>

            </div>

            <div style="background-color:#fcfcfc;" v-if="isImgListView">
                <div class="imageType">
                    <ul style="color: black;" class="itab">
                        <li @click="selectType(0)" :class="{ selectType: currentImageType == ImgType.localImage }">
                            <span>本地图片</span>
                        </li>
                        <li @click="selectType(1)" :class="{ selectType: currentImageType == ImgType.builtinImage }">
                            <span>内置图片</span>
                        </li>
                        <li @click="selectType(2)" :class="{ selectType: currentImageType == ImgType.difference }">
                            <span>表情差分</span>
                        </li>
                    </ul>
                </div>
                <div class="imgList" v-if="currentImageType == ImgType.localImage">
                    <div v-for="(value, index) in totalImages" :key="index">
                        <div style="width: 96px; height: 96px">
                            <img :src="value" :class="{ isSelectImageView: currentSelectImgae === index }"
                                style="box-sizing: border-box;width: 96px;background-color: #c6c6c6;border-radius: 5px;border: 2px #c6c6c6 solid;transition: all 0.1s ease-in-out;"
                                @click="selectImage(index)" />
                        </div>
                    </div>
                    <div style="font-size: 64px;color: black;width: 96px;height: 96px;text-align: center;border: 1px solid skyblue;border-radius: 10px;display: flex;justify-content: center;align-items: center;"
                        @click="openFile()">
                        <span style="margin-top: -11px"> + </span>
                    </div>
                </div>
                <div class="imgList" v-if="currentImageType == ImgType.builtinImage">
                    <div v-for="(value, index) in builtinImageDatas" :key="index">
                        <div style="width: 96px; ">
                            <img :src="value" :class="{ isSelectImageView: currentSelectImgae === index }"
                                style="box-sizing: border-box;width: 96px;background-color: #c6c6c6;border-radius: 5px;border: 2px #c6c6c6 solid;transition: all 0.1s ease-in-out;"
                                @click="selectImage(index)">
                        </div>
                    </div>
                </div>
                <div class="imgList" v-if="currentImageType == ImgType.difference">
                    <div v-for="(value, index) in builtinImageDatas" :key="index">
                        {{ value }}
                    </div>

                </div>
            </div>

            <div class="nikkeedit">
                <div class="selectNikkeInfo" @click="show()" :style="{
                    backgroundImage:
                        'url(avatars/' + dialogData?.projectNikkes[currentNikke].img + '.png)',
                }" :class="{ zhg: isZHG }">
                    <span v-if="isZHG" style="
              color: rgb(92, 58, 58);
              line-height: 32px;
              text-align: center;
              width: 100%;
              display: inline-block;
            ">指挥官</span>
                </div>
                <div class="upload" @click="openFileInput()">
                    <img src="/image.png" />
                </div>
                <input id="fileInput" type="file" ref="fileInput" style="display: none" @change.stop="handleFileUpload"
                    accept="image/*" multiple />
                <input ref="inputRef" type="text" class="nikkeInput dinput" v-model="inputContent" @input="check()"
                    @focus="check()" @keyup.enter="add()" @keydown.tab="append()" :placeholder="inputPlaceholder" />
                <div class="add newadd" @click="add()">新增</div>
                <div class="add oldadd" @click="append()"
                    v-if="currentModel != msgType.aside && currentModel != msgType.partition">
                    追加
                </div>
            </div>
        </div>
    </div>

    <div class="dialogImg" :style="{
        height:
            (dialogHeader == undefined ? 80 : clamp(dialogHeader.clientHeight, 70, 90)) +
            (dialogContent == undefined
                ? 50
                : clamp(dialogContent.scrollHeight + imgConfig.bottomHeigth, 150, 99999999)) +
            'px !important',
    }" ref="dialogImg" v-if="isImg">
        <div class="dheader himg" ref="dialogHeader">
            <div class="tilte">
                <span style="vertical-align: middle">
                    <img src="/wifi.png" style="width: 18px" />
                </span>
                {{ currentTime }}
            </div>
            <div class="dback" @click="$props.back(dialogData)">
                <div class="dtilte">
                    <img src="/back.png" alt="" style="width: 25px; margin-top: 2px" />
                    <span style="vertical-align: middle">{{ dialogData?.name }}</span>
                </div>
                <div class="dtilte" style="
            margin-left: auto;
            display: flex;
            margin-right: 10px;
            font-size: 16px;
            margin-top: 5px;
          " v-if="imgData.mark">
                    由 @{{ dialogData.author }} 使用 巴拉巴拉生成器 制作
                </div>
            </div>
        </div>
        <div class="dcontent toimg" ref="dialogContent">
            <NikkeMessage :is-edit="false" :dialog-data="dialogData" :current-data="totalImages"
                v-for="(value, index) in dialogData?.messageData.list" :type="value.msgType" :msgs="value.msg"
                :nikke="value.nikke" :index="index" :key="index"></NikkeMessage>
        </div>
    </div>

    <NikkeWindow id="createProject" title="导出图片" :confirm="true" :show="isImg" v-if="isImg" button-cancel="关闭"
        :cancel="cancel" :success="exprotRealToImg" button-success="导出">
        <NikkeIcon></NikkeIcon>
        <div class="project">
            <div class="label">
                <NikkeInfo>如果出现问题可以通过点击上面的图标进行跳转反馈，包括bug、想要添加的功能等等都可以在上反馈。</NikkeInfo>
                <NikkeInfo>
                    <div class="error">
                        <span style="color: rgb(182, 93, 93); font-size: 10px; background-color: ">如果主页的字体不是 “sourcehansans”
                            请尝试等待或者切换网络环境等待字体加载完毕，可避免部分导出图片的问题。</span>
                    </div>
                </NikkeInfo>
                <div class="pcontent">
                    <span>图片名称 *</span>
                    <input class="nikkeInput" v-model="imgData.imgName" type="text" />
                </div>
                <div class="pcontent">
                    <span>是否添加水印 </span>
                    <input type="checkbox" v-model="imgData.mark" />
                </div>
                <NikkeInfo> 将会在头部添加作者名字、使用的工具等信息 (临时) </NikkeInfo>
                <div class="pcontent">
                    <span>导出图片格式</span>
                    <NikkeRadio :checked="true" label="任务" style="flex: 1">
                        <div style="margin: 0; display: flex; justify-content: space-between">
                            <div>
                                <input id="png" type="radio" value="0" name="projectType" v-model="imgData.exportType"
                                    checked />
                                <label for="png">png</label>
                            </div>
                            <div>
                                <input id="jpeg" type="radio" value="1" name="projectType" v-model="imgData.exportType" />
                                <label for="jpeg">jpeg</label>
                            </div>
                        </div>
                    </NikkeRadio>
                </div>
                <div class="pcontent" v-if="parseInt(imgData.exportType) == exportImgType.jpeg">
                    <span>质量</span>
                    <input class="nikkeInput" v-model="imgData.quality" type="number" min="0" max="1" />
                    <div></div>
                </div>
                <NikkeInfo v-if="parseInt(imgData.exportType) == exportImgType.jpeg">
                    jepg导出时的质量取值范围{0-1}
                </NikkeInfo>
                <div class="pcontent">
                    <span>缩放</span>
                    <input style="flex: 0; width: 120px" class="nikkeInput" type="number" maxlength="20" min="1" max="10"
                        v-model="imgData.scale" />
                </div>
                <NikkeInfo>
                    图片的缩放比例，值越高画面越清晰，但大小则会变得更大 推荐范围{1-10}
                </NikkeInfo>
                <div style="height: 1px; background-color: #e6e7e6"></div>
                <div style="text-align: center">预览</div>
                <NikkeInfo>
                    <div class="error">
                        <span
                            style="color: rgb(182, 93, 93); font-size: 10px; background-color: ">网络环境不好可能会导致导出加载一直转圈，请等待。</span>
                    </div>
                </NikkeInfo>
                <NikkeInfo> 图片预览，如果无法在你的浏览器导出则保存预览图 </NikkeInfo>
                <div ref="preview" class="preview"></div>
                <div class="loading" v-if="currentExportImgState == exportImgState.run">
                    Loading&#8230;
                </div>
            </div>
        </div>
    </NikkeWindow>
</template>

<style>
.error {
    background-color: #fcfafa;
    border-radius: 10px;
    padding: 5px;
    border: #f3f1f1 1px solid;
}

.editBar {
    width: 100%;
    height: 40px;
    background-color: rgb(255, 243, 243);
}

.loading {
    position: fixed;
    height: 2em;
    width: 2em;
    overflow: visible;
    margin: auto !important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.loading:before {
    content: "";
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
}

.loading:not(:required) {
    /* hide "loading..." text */
    font: 0/0 a;
    color: transparent;
    text-shadow: none;
    background-color: transparent;
    border: 0;
}

.loading:not(:required):after {
    content: "";
    display: block;
    font-size: 10px;
    width: 1em;
    height: 1em;
    margin-top: -0.5em;
    -webkit-animation: spinner 1500ms infinite linear;
    -moz-animation: spinner 1500ms infinite linear;
    -ms-animation: spinner 1500ms infinite linear;
    -o-animation: spinner 1500ms infinite linear;
    animation: spinner 1500ms infinite linear;
    border-radius: 0.5em;
    -webkit-box-shadow: rgba(0, 0, 0, 0.75) 1.5em 0 0 0, rgba(0, 0, 0, 0.75) 1.1em 1.1em 0 0,
        rgba(0, 0, 0, 0.75) 0 1.5em 0 0, rgba(0, 0, 0, 0.75) -1.1em 1.1em 0 0,
        rgba(0, 0, 0, 0.5) -1.5em 0 0 0, rgba(0, 0, 0, 0.5) -1.1em -1.1em 0 0,
        rgba(0, 0, 0, 0.75) 0 -1.5em 0 0, rgba(0, 0, 0, 0.75) 1.1em -1.1em 0 0;
    box-shadow: rgba(0, 0, 0, 0.75) 1.5em 0 0 0, rgba(0, 0, 0, 0.75) 1.1em 1.1em 0 0,
        rgba(0, 0, 0, 0.75) 0 1.5em 0 0, rgba(0, 0, 0, 0.75) -1.1em 1.1em 0 0,
        rgba(0, 0, 0, 0.75) -1.5em 0 0 0, rgba(0, 0, 0, 0.75) -1.1em -1.1em 0 0,
        rgba(0, 0, 0, 0.75) 0 -1.5em 0 0, rgba(0, 0, 0, 0.75) 1.1em -1.1em 0 0;
}

/* Animation */

@-webkit-keyframes spinner {
    0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@-moz-keyframes spinner {
    0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@-o-keyframes spinner {
    0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes spinner {
    0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

.contentBox {
    overflow-y: scroll;
}

.preview>img {
    width: 100%;
}

.isSelectImageView {
    border: 5px #32b1f4 solid !important;
}

.isback {
    position: absolute;
    display: block;
    width: 96px;
    height: 96px;
    background-color: #1a151559;
    background-image: url("/select.png");
    background-repeat: no-repeat;
    background-size: 48px;
    background-position: center center;
    opacity: 0.8;
}

.itab {
    display: flex;
    height: 35px;
    align-items: center;
}

.itab>li {
    height: 35px;
    min-width: 80px;
    padding: 0 5px;
    color: rgb(80, 80, 80);
    display: flex;
    align-items: center;
    justify-content: center;
}

.selectType {
    color: rgb(243, 124, 124) !important;
    background-color: rgb(222, 224, 222);

}

.imageType {
    height: 35px;
}

.imgList {
    height: 230px;
    max-height: 230px;
    min-height: 230px;
    overflow-y: scroll;
    background-color: #fcfcfc;
    border-top: 1px solid #f1f1f1;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
}

.imgList>div {
    margin: 5px;
}

.upload {
    width: 32px;
    height: 32px;
}

.upload>img {
    width: 32px;
    height: 32px;
}

.label div {
    margin: 5px 0;
}

.label {
    color: rgb(59, 50, 50);
    display: flex;
    font-weight: bold;
    letter-spacing: 2px;
    font-size: 14px;
    flex-direction: column;
}

.pcontent span {
    width: 30%;
    line-height: 25px;
}

.pcontent {
    display: flex;
    flex: 1;
}

.export {
    transition: transform 0.1s ease-in-out !important;
}

.export:active {
    transform: scale(0.95);
}

div.toimg {
    overflow: hidden !important;
}

div.dialogImg {
    position: absolute;
    right: -999999px;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    min-width: 500px !important;
    max-width: 550px;
    z-index: 99999;
}

div.himg {
    min-height: 110px;
    max-height: 120px;
}

.dmodel {
    position: relative;
    display: flex;
    width: 100%;
    height: 40px;
    --line-color: rgba(60, 10, 30, 0.02);
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
    border-radius: 0.25rem;
    margin: 5px;
    transition: all 0.1s ease-in-out;
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
    /* height: 50px; */
}

.last {
    position: absolute;
    color: rgb(92, 58, 58);
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    background-color: #fda912 !important;
}

.nadd {
    box-sizing: border-box;
    border: #027fc2 1px dashed;

    background-image: url("/icon/addNikke.svg");
    background-position: center;
    background-size: 24px !important;
}

/* .selectNikkeInfo::after {
    content: "";
    width: 32px;
    height: 32px;
    position: absolute;
    background-image: url("/icon/delete.svg");
    background-size: 32px;
    opacity: .9;
} */

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
    transition: transform 0.06s ease-in-out;
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
    transition: all 0.1s ease-in;
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

.tilte {
    position: relative;
    z-index: 10;
}

.dback {
    position: relative;
    z-index: 10;
    display: flex;
    flex: 1;
    padding-bottom: 10px;
    align-items: center;
    transition: all 0.1s ease-in-out;
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
    animation: dposInOut 0.25s ease-in-out;
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
    transition: all 0.1s ease-in-out;
    color: black;
    --line-color: rgba(60, 10, 30, 0.02);
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
    min-height: 110px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
    background: linear-gradient(transparent 50%, #fda912 50%),
        linear-gradient(90deg, transparent 50%, #f8be53bb 50%);
    background-size: 5px 5px;
    background-position: center;
    background-color: #fda912;
}

/* .dheader::after {
    content: "";
    z-index: 1;
    position: absolute;
    background-image: url('data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAABiAgMAAAAXTKQxAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACVBMVEX3t0X3t0X///+98LFLAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAHdElNRQfnCxYRBSCeyqUCAAABAUlEQVRIx+2WyxHDIAxExYES1A8l6GD6byWO7RAw0q5nOCa6vtHu+oOEyLdyPaqIW1qvMkhdnmtXk36qQ93xSOsGpGf5Ox3bp+axfaZ9e3JwF149bEi7U88ubuHUx4a0m3oKcIXWH3ONsCHryzy0Ps1zjAvHGmNDyc5sGIPg7+gEZ4QLw4qwLWJE9wf/49/CivDqv5YRpsdg7QiuHX82W0D0B4OLTEUyU9lEDs3Lk21AdgnbRIF5W7JQm+5QsoHJ/mbbn9wd2M2D3FvYrYfcmQZsgrBDO1wkxi5rn2UTiKNmwc2CmxNuzu6rHLDFWJH0kQzQBFIf1kh6t0ZUoLSk6JleKJaqutiaJukAAAAASUVORK5CYII=');
    background-repeat: no-repeat;
    background-size: 256px;
    width: 256px;
    height: 256px;
    top: -109px;
    right: -50px;
    opacity: 0.65;
    transform: rotate(4deg);
} */
</style>
