<script setup lang="ts">
import VuePictureCropper, { cropper } from "vue-picture-cropper";
import { ref, reactive } from 'vue';
import NikkeButton from "./NikkeButton.vue";
import { NikkeDatabase, addDataToDB, buttonType, retrieveDataFromDB } from "../script/project";
import { openDB } from "../data/useIndexedDB";

let pic = ref()
let name = ref('')


let customNikkeList = ref<Array<any>>([])


function ready() {
    console.log("ready");
}

const dbPromise: Promise<IDBDatabase> = openDB("nikkeDatabase");

const result = reactive({
    dataURL: '',
    blobURL: '',
})

const isShowModal = ref<boolean>(false)
const selectModal = ref<boolean>(false)
const uploadInput = ref<HTMLInputElement | null>(null)

function selectFile(e: Event) {
    pic.value = ''
    result.dataURL = ''
    result.blobURL = ''

    const { files } = e.target as HTMLInputElement
    if (!files || !files.length) return


    const file = files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        pic.value = String(reader.result)

        isShowModal.value = true
        selectModal.value = false

        if (!uploadInput.value) return
        uploadInput.value.value = pic.value
    }
}

retrieveDataFromDB(dbPromise, NikkeDatabase.nikkeProject, 3).then((value) => {
    if (value) {
        customNikkeList.value = JSON.parse(value.customNikkeList);

    } else {
        console.log("没有数据");
    }
});

function addNikke() {
    customNikkeList.value.push(
        {
            name: name.value,
            url: result.dataURL
        }
    )
    addDataToDB(dbPromise, NikkeDatabase.nikkeProject, { sequenceId: 3, customNikkeList: JSON.stringify(customNikkeList.value) })
}



/**
 * Get cropping results
 */
async function getResult() {
    if (!cropper) return
    const base64 = cropper.getDataURL()
    const blob: Blob | null = await cropper.getBlob()
    if (!blob) return

    await cropper.getFile({
        fileName: "test",
    })

    result.dataURL = base64
    result.blobURL = URL.createObjectURL(blob)
    // isShowModal.value = false
    selectModal.value = true
}
</script>

<template>
    <div class="tab">
        <input ref="uploadInput" type="file" accept="image/jpg, image/jpeg, image/png" @change="selectFile" />
        <NikkeButton content="确认" :type="buttonType.Success" @click="getResult" style="height: 40px;"></NikkeButton>
    </div>

    <div v-if="isShowModal" style="display: flex;justify-content: center;">
        <VuePictureCropper :boxStyle="{
            width: '100%',
            height: '128px',
            backgroundColor: '#f8f8f8',
            margin: 'auto'
        }" :img="pic" :options="{
    viewMode: 1,
    dragMode: 'crop',
    aspectRatio: 1,
}" @ready="ready" />

    </div>

    <div v-if="selectModal" style="display: flex;margin: 8px;align-items: center;">
        <div class="imgTx">
            <img :src="result.dataURL" style="width: 64px;height: 64px;" alt="">
        </div>
        <div>
            <input class="nikkeInput" style="margin-bottom: 5px;" type="text" placeholder="请输入角色名称" v-model="name" />
            <div style="font-size: 12px;color: #666;">企业固定 <span style="color: red;">自定义</span> </div>
        </div>

    </div>
    <div v-if="selectModal" style="display: flex;justify-content: center;margin-bottom: 10px;">
        <NikkeButton content="确认添加" :type="buttonType.Success" @click="addNikke" style="height: 40px;"></NikkeButton>
    </div>
    <div style="font-size: 12px;color: #666;">列表 <span style="color: red;">已添加的妮姬</span> 👇</div>
    <div style="display: flex;flex-wrap: wrap;justify-content: center;">
        <div class="boxCn" v-for="v, i in customNikkeList" :key="i">
            <img :src="v.url" style="width: 48px;" />
        </div>
    </div>
</template>

<style scoped>
.imgTx {
    margin-right: 10px;
    height: 64px;
    width: 64px;
    border-radius: 32px;
    overflow: hidden;
}

.boxCn {
    margin: 5px;
    height: 48px;
    width: 48px;
    border-radius: 24px;
    overflow: hidden;
    background-color: pink;
}

.tab {
    display: flex;
    align-items: center;
    height: 40px;
}
</style>
