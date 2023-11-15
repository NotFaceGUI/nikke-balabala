<script setup lang="ts">
import { ref } from "vue";

interface editProps {
    currentIndex: number;
    delete: (deleteIndex: number) => void;
    edit: (editIndex: number) => void;
    add: (insertIndex: number, isUpOrDown: number) => void;
}

let props = defineProps<editProps>();

const isEidt = ref(false);

function openEdit() {
    isEidt.value = !isEidt.value;
}

function addEdit(isUpOrDown: number){
    // openEdit();
    props.add(props.currentIndex, isUpOrDown);
}

</script>

<template>
    <div class="edit" @click="openEdit()"></div>
    <!-- <div style="position: relative;height: 100%;flex: 1;"> -->
    <transition name="bounce" type="transition">
        <div class="editTab" v-if="isEidt">
            &UpArrow;
            <div class="upadd" @click="addEdit(0)"></div>
            <div class="edittool" @click="edit(currentIndex)"></div>
            <div class="delete" @click="$props.delete(currentIndex)"></div>
            <div class="downadd" @click="addEdit(1)"></div>
            &DownArrow;
        </div>
    </transition>

</template>

<style>


.edit {
    width: 24px;
    height: 24px;
    margin: 10px;
    /* background-color: pink; */
    background-image: url("/icon/edit.svg");
    background-repeat: no-repeat;
    opacity: 0.3;
    transition: all 0.1s ease-in-out;
}

.edit:active {
    transform: scale(0.9) !important;
}

.edit:hover {
    transform: scale(1.1);

    opacity: 1;
}

.editTab {
    padding: 0 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(255, 243, 243);
    min-width: 142px;
    min-height: 30px;
    border: 1px solid #ffffffc2;
    border-radius: 15px;
}

.bounce-enter-from,
.bounce-leave-to {
    opacity: 0;
}

.bounce-enter-active,
.bounce-leave-active {
    transition: opacity .5s ease;
}

.bounce-enter-active {
    animation: bounce .4s ease;
}

.bounce-leave-active {
    animation: bounce .5s ease reverse;
}

@keyframes bounce {
    0% {
        transform: scale(0);
        transform: translateY(-20px);
    }

    50% {
        transform: translateY(5px);
        transform: scale(1.2);
    }

    100% {
        transform: translateY(0px);
        transform: scale(1);
    }
}

.editTab>div {
    margin: 0 1px;
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    transition: all 0.1s ease-in-out;
}

.editTab>div:hover {
    transform: scale(1.1);
}

.editTab>div:active {
    transform: scale(0.9);
}

.delete {
    background-image: url("/icon/reduce-btn-fill.svg");
    color: red;
}

.edittool {
    background-image: url("/icon/inedit.svg");
}

.upadd {
    background-image: url("/icon/add.svg");
}

.downadd {
    background-image: url("/icon/add.svg");
}
</style>
