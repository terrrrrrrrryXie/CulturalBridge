<template>
  <div class="text" :style="role === 'model' ? '' : 'justify-content: flex-end;'">
            <div class="modelAvatar" v-if="role === 'model'">
                <i class="bi bi-stars" />
            </div>
            <div :class="['msg', role === 'model' ? 'modelContent' : 'userContent']">
                <slot></slot>
            </div>
            <div 
                class="userAvatar"
                v-if="role === 'user'"
            >
                <i class="bi bi-person" />
            </div>
        </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    role: String
})
console.log(props);

</script>

<style scopd>
.text {
    width: 100%;
    /* height: 10vh; */
    /* border: 2px yellow solid; */
    padding-left: 1.4vw;
    padding-right: 1.4vw;
    display: flex;
    flex-direction: row;
    margin-bottom: 2vh;
    /* align-items: center; */
}
.modelAvatar {
    width: 8vh;
    height: 8vh;
    border: 4px black solid;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2vw;
}
.modelContent {
    /* border: 2px green solid; */
    width: 60%;
    margin-left: 1.6vw;
}
.userAvatar {
    width: 8vh;
    height: 8vh;
    border: 4px black solid;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2vw;
}
.userContent {
    /* border: 2px green solid; */
    width: 60%;
    margin-right: 1.6vw;
}
.msg {
    background-color: rgb(235, 235, 235);
    padding: 1.4vh;
    border-radius: .6vw;
}
</style>