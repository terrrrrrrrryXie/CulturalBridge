<template>
    <button 
        class="btn btn-success toggle" 
        data-bs-toggle="offcanvas" 
        data-bs-target="#rightSidebar" 
        aria-controls="open/closeRightSidebar"
    >
      🐱: Hi!
    </button>

    <div 
        class="offcanvas offcanvas-end sidebar" 
        tabindex="-1" 
        id="rightSidebar" 
        aria-labelledby="rightSidebarLabel"
    >
      <div class="display" ref="chatWindow">
        <div class="topic"><span>Talking with 🐱Snowball</span></div>
        <ChatMessageComp
            v-for="(msg, index) in contextPrompt['contents']"
            :key="index"
            :role="msg['role']"
        >
            {{ msg['parts'][0]['text'] }}
        </ChatMessageComp>
      </div>
      <hr>  
      <form class="input" @submit.prevent="send(userInput)">
        <textarea 
            type="text" 
            class="form-control" 
            style="resize: none" 
            v-model="userInput"
            placeholder="Say something to Snowball"
            required
            @keyup.enter="send(userInput)"
        ></textarea>
        <button 
            type="submit"
            class="btn btn-primary send"
        >
            <i class="bi bi-send" />
        </button>
      </form>
    </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import { useStore } from "vuex";
import ChatMessageComp from "./ChatMessageComp.vue";

const store = useStore()

const userInput = ref('')
const contextPrompt = ref({
    "contents": []
})

const chatWindow = ref(null)
watch(
  contextPrompt,
  async () => {
    await nextTick();
    if (chatWindow.value) {
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
    }
  },
  { deep: true }
);

const send = async (inputText) => {
    userInput.value = ''
    contextPrompt.value['contents'].push({
        "role": "user",
        "parts": [
            { "text": inputText }
        ]
    })
    try {
        const text = await store.dispatch('sendMsgToAI', { msg: inputText })
        contextPrompt.value['contents'].push({
            "role": "model",
            "parts": [
                { "text": text }
            ]
        })
    }catch(error) {
        console.error('error happend: ', error);
        contextPrompt.value['contents'].push({
            "role": "model",
            "parts": [
                { "text": 'Some errors happened, please resend your message again' }
            ]
        })
    }   
}
</script>

<style scoped>
.topic {
    position: absolute;
    top: 0;
    width: 100%;
    /* border: 2px red solid; */
    height: 10vh;
    font-size: 1.2vw;
    line-height: 10vh;
    padding-left: 2vw;
    font-weight: bolder;
    background-color: rgba(225, 225, 225, 0.96);
}
.toggle {
    position: fixed;
    right: 0;
    bottom: 24vh;
    z-index: 1;
}

.sidebar {
    width: 40vw !important;
}
@media (max-width: 768px) {
    .sidebar {
        width: 70vw !important;
    }
    * {
        font-size: 1.2rem;
    }
}
.display {
    padding-top: 12vh;
    width: 100%;
    height: 90%;
    /* border: 2px red solid; */
    overflow: auto;
    scroll-behavior: smooth; 
}
.input {
    width: 100%;
    height: 10%;
    /* border: 2px blue solid; */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    
}
.form-control {
    width: 80%;
    /* border: 2px green solid; */
    height: 80%;
}
.send {
    width: 10%;
    height: 80%;
    font-size: 1.2vw;
}
</style>