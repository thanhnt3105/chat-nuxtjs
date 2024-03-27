<template>
  <div className="messages">
    <Message v-for="m of messages" :message="m" key="{m.id}" />
  </div>
</template>

<script setup lang="ts">
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "~/plugins/firebase";

const messages = ref([]);
const chatDetail = useChat();

let unSub: any;

watch(
  () => chatDetail.$state.chatId,
  (newChatId, oldValue) => {
    // Unsubscribe from the old snapshot
    if (unSub) {
      unSub();
    }
    // Subscribe to a new snapshot if newChatId is not null
    if (newChatId) {
      unSub = onSnapshot(doc(db, "chats", newChatId), (doc) => {
        if (doc.exists()) {
          messages.value = doc.data().messages;
        }
      });
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (unSub) {
    unSub();
  }
});
</script>
