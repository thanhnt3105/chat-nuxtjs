<template>
  <div className="chat">
    <div className="chatInfo">
      <span>{{ chatService.$state.user.displayName }}</span>
      <div className="chatIcons">
        <img src="@/assets/image/cam.png" alt="" />
        <img src="@/assets/image/add.png" alt="" />
        <img src="@/assets/image/more.png" alt="" />
      </div>
    </div>
    <Messages />
    <Input />
  </div>
</template>

<script setup lang="ts">
const chatService = useChat();
</script>
