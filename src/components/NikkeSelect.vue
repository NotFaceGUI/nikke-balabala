<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { INikkeData, nikkeData, buttonType } from '../script/project';
import NikkeButton from './NikkeButton.vue';

var selectNikke: Array<INikkeData> = reactive([]);
var isSelect: Array<boolean> = reactive([]);

let props = defineProps<{
    filterData?: Array<INikkeData>,  // 过滤数据
}>();

const parentData = ref(props.filterData);
var selectNikke: Array<INikkeData> = reactive([]);

function select(value: INikkeData, index: number) {
    // 如果数组中有这个元素则代表当前nikke是被选择的，所以要删除元素反之则添加元素
    if (!selectNikke.includes(value)) {
        selectNikke.push(value);
        isSelect[index] = true;
    } else {
        selectNikke = selectNikke.filter(item => item.img !== value.img);
        isSelect[index] = false;
    }
    console.log("已选nikke：", selectNikke);
}

const filteredNikkes = computed(() => {
    const filterArray: Array<INikkeData> = props.filterData || [];

    return nikkeData.nikkes.filter(value =>
        !filterArray.some(filterItem => filterItem.img === value.img)
    );
});


const adition = () => {
    selectNikke.forEach(value => parentData.value?.push(value));
    isSelect.length = 0;
    selectNikke.length = 0;
}

</script>

<template>
    <div class="nikkeGrid">
        <div class="nikke" :class="{ nikkeCheck: isSelect[index] }" @click="select(value, index)"
            v-for="(value, index) in filteredNikkes" :key="index"
            :style="{ backgroundImage: 'url(avatars/' + value.img + '.png)' }">
        </div>
    </div>
    <div style="display: flex;justify-content: center;">
        <NikkeButton :type="buttonType.Success" content="添加新妮姬" @click="adition()"
            style="width: 170px;height: 50px;margin: 5px;">
        </NikkeButton>
    </div>
</template>

<style scoped>
.nikkeGrid {
    display: grid;
    grid-template-columns: 65px 65px 65px 65px;
    justify-content: center;
    align-items: center;
    justify-items: center;
    gap: 5px;
    row-gap: 0;
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 5px 0;
}

.nikke {
    width: 60px;
    height: 60px;
    margin: 5px;
    background-color: #c6c6c6;
    border-radius: 5px;
    border: 2px #c6c6c6 solid;
    /* background-image: url("/nikke/bx.png"); */
    background-repeat: no-repeat;
    background-size: 60px 60px;
    transition: border 0.1s ease-in-out;
}

.nikkeCheck {
    border: 2px #32b1f4 solid;
}

.nikkeCheck::before {
    content: "";
    display: block;
    width: 60px;
    height: 60px;
    background-color: #1a151559;
    background-image: url("/select.png");
    background-repeat: no-repeat;
    background-size: 48px;
    background-position: center center;
    opacity: 0.8;
}
</style>