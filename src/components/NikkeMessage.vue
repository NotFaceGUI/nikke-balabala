<script setup lang="ts">
import { ref } from 'vue';
import { INikkeData, Project, msgType } from '../script/project';
import NikkeMessageEdit from './NikkeMessageEdit.vue';

const props = defineProps<{
    msgs: Array<string>
    nikke: INikkeData
    type: msgType
    index: number,
    currentData: string[],
    dialogData: Project,
    isEdit: boolean,
}>()

const dialogData = ref(props.dialogData);
const spaceRefs = ref([]);
let editContent = ref("");

let editInputs = ref<Array<number>>([])

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

function deleteMsg(index: number) {
    if (props.msgs.length == 1) {
        props.msgs.splice(index, 1);
        dialogData.value.messageData.list.splice(props.index, 1);
    } else {
        props.msgs.splice(index, 1);
    }
    console.log("删除");
}

function addMsg(index: number, isUpOrDown: number) {
    if (isUpOrDown == 0) {
        props.msgs.splice(index, 0, "插入的数据")
    } else if (isUpOrDown == 1) {
        props.msgs.splice(index + 1, 0, "插入的数据")
    }
}

function editMsg(index: number) {
    if (!editInputs.value.indexOf(index)) {
        lostfocus(index);
    } else {
        editInputs.value[0] = index;
        editContent.value = props.msgs[index];
    }

    console.log(index);
}

function parseImgToDataURL(content: string) {
    let value = content.split(" ");
    let index: string = value[1].substring(1, value[1].length - 1);
    return index;
}

function lostfocus(index: number) {
    editInputs.value.length = 0;
    props.msgs[index] = editContent.value;
    console.log("失去焦点");
}

</script>

<template>
    <div class="msg" v-if="type == msgType.nikke">
        <div class="head" :style="{ backgroundImage: 'url(avatars/' + nikke.img + '.png)' }"></div>
        <div class="textgroup">
            <div class="name">{{ nikke.name }}</div>
            <div class="textbox" v-for="value, index in msgs" :key="index">
                <span class="text" v-if="!parseImg(value)">
                    <input ref="spaceRefs" v-if="!editInputs.indexOf(index)" v-model="editContent" type="text"
                        @blur="lostfocus(index)" class="nikkeInput msgInput">
                    <div v-else>
                        {{ value }}
                    </div>
                </span>

                <span v-else class="text mzhg toimg">
                    <img :src="parseImgToDataURL(value)" class="imgType" />
                </span>
                <img src="/g.png" class="nikkeImg" />
                <NikkeMessageEdit v-if="isEdit" :add="addMsg" :edit="editMsg" :current-index="index" :delete="deleteMsg">
                </NikkeMessageEdit>
            </div>
        </div>
    </div>

    <div class="zmsg" v-else-if="type == msgType.commander">
        <div class="ztextbox" v-for="value, index in msgs" :key="index">
            <span v-if="!parseImg(value)" class="text mzhg">
                <input ref="spaceRefs" v-if="!editInputs.indexOf(index)" v-model="editContent" type="text"
                    @blur="lostfocus(index)" class="nikkeInput msgInput">
                <div v-else>
                    {{ value }}
                </div>
            </span>
            <span v-else class="text mzhg toimg">
                <img :src="parseImgToDataURL(value)" class="imgType" />
            </span>
            <img src="/rg.png" class="znikkeImg" />
            <NikkeMessageEdit v-if="isEdit" :add="addMsg" :edit="editMsg" :current-index="index" :delete="deleteMsg">
            </NikkeMessageEdit>
        </div>
    </div>
    <div class="zmsg" v-else-if="type == msgType.img && nikke.img == '指挥官'">
        <div class="ztextbox" v-for="value, index in msgs" :key="index">
            <span class="text mzhg toimg">
                <img :src="parseImgToDataURL(value)" class="imgType" />
            </span>
            <img src="/rg.png" class="znikkeImg" />
            <NikkeMessageEdit v-if="isEdit" :add="addMsg" :edit="editMsg" :current-index="index" :delete="deleteMsg">
            </NikkeMessageEdit>
        </div>
    </div>
    <div class="msg" v-else-if="type == msgType.img">
        <div class="head" :style="{ backgroundImage: 'url(avatars/' + nikke.img + '.png)' }"></div>
        <div class="textgroup">
            <div class="name">{{ nikke.name }}</div>
            <div class="textbox" v-for="value, index in msgs" :key="index">
                <span class="text toimg">
                    <img :src="parseImgToDataURL(value)" class="imgType" />
                </span>
                <img src="/g.png" class="nikkeImg" />
                <NikkeMessageEdit v-if="isEdit" :add="addMsg" :edit="editMsg" :current-index="index" :delete="deleteMsg">
                </NikkeMessageEdit>
            </div>
        </div>
    </div>
    <div class="zmsg ntext" style="color: rgb(59, 50, 50);" v-else-if="type == msgType.aside">
        <div class="textbox aside" style="justify-content: center;">
            <span style="margin: 3px 0;">
                <input ref="spaceRefs" v-if="!editInputs.indexOf(0)" v-model="editContent" type="text" @blur="lostfocus(0)"
                    class="nikkeInput msgInput">
                <div v-else>
                    {{ msgs[0] === "" ? "这里是旁白请讲" : msgs[0] }}
                </div>
            </span>
            <div style="display: none;height: 100%;">
                <NikkeMessageEdit v-if="isEdit" :add="addMsg" :edit="editMsg" :current-index="0" :delete="deleteMsg">
                </NikkeMessageEdit>
            </div>

        </div>

    </div>
    <div class="zmsg ntext" v-else-if="type == msgType.partition">
        <div class="partition">
            <div class="line"></div>
            <span class="partitionContent">{{ msgs[0] === "" ? "END" : msgs[0] }}</span>
            <div style="display: none;">
                <NikkeMessageEdit v-if="isEdit" :add="addMsg" :edit="editMsg" :current-index="0" :delete="deleteMsg">
                </NikkeMessageEdit>
            </div>

            <div class="line"></div>
        </div>
    </div>
    <div class="zmsg" v-else-if="type == msgType.branch">
        <div class="ztextbox">
            <span class="text mzhg zb">
                <div class="branch" v-for="value, index in msgs" :key="index">
                    {{ value }}
                </div>
            </span>
            <img src="/rg.png" class="znikkeImg" />
            <NikkeMessageEdit v-if="isEdit" :add="addMsg" :edit="editMsg" :current-index="0" :delete="deleteMsg">
            </NikkeMessageEdit>
        </div>
    </div>
</template>

<style scoped>
.partition:hover>div {
    max-height: 21px;
    display: flex !important;
    justify-content: center;
    align-items: center;
}

.aside:hover>div {
    max-height: 24px;

    display: flex !important;
    justify-content: center;
    align-items: center;
}

.zb {
    min-width: 280px !important;
    padding: 8px 20px !important;
}

.branch:hover {
    background-color: #ffc04b;
}

.branch {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    box-shadow: 0 4px 7px #00000010;
    border-radius: 20px;
    color: #272727;
    margin: 5px 0;
    margin-bottom: 8px;
    min-height: 51px;
    padding: 12px 18px;

}

.branch:last-child {
    margin-bottom: 5px;

}

.msgInput {
    border: 0px solid transparent !important;
    height: 100%;
    width: 100%;
}

.ntext {
    text-align: center;
    margin: 10px 5px;
    word-break: break-all;
}

.line {
    flex: 1;
    height: 2px;
    background-color: #c7c7c7
}

.partition {
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 40px;
}

.partitionContent {
    display: inline-block;
    margin: 0 5px;
    font-size: 14px;
    color: #5f5f5f;
}

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
    margin-bottom: 10px;
    margin-right: 10px;
}

.ztextbox {
    display: flex;
    flex-direction: row-reverse;
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
    background-image: url("avatars/am.png");
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