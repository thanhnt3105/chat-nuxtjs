<template>
  <div
    class="message"
    :class="{ owner: message.senderId === userService.$state.user.uid }"
  >
    <div className="messageInfo">
      <img
        :src="
          message.senderId === userService.$state.user.uid
            ? userService.$state.user.photoURL
            : chatService.$state.user.photoURL
        "
        alt=""
      />
      <span>just now</span>
    </div>
    <div className="messageContent">
      <p>{{ message.text }}</p>
      <img v-if="message.img" :src="message.img" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
const userService = useAuth();
const chatService = useChat();

const props = defineProps<{
  message: {
    text: string;
    img: string;
    senderId: string;
  };
}>();
</script>
