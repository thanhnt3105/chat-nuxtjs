<template>
  <div className="chats">
    <div
      v-for="chat of Object.entries(chats)?.sort(
        (a, b) => b[1].date - a[1].date
      )"
      className="userChat"
      key="{chat[0]}"
      @click="handleSelect(chat[1].userInfo)"
    >
      <img :src="chat[1].userInfo.photoURL" alt="" />
      <div className="userChatInfo">
        <span>{{ chat[1].userInfo.displayName }}</span>
        <p>{{ chat[1].lastMessage?.text }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "~/plugins/firebase";

const chats = ref([]);

const authService = useAuth();
const chatDetail = useChat();

const handleSelect = (u: any) => {
  chatDetail.updateCurrentChat(u);
};

let unsub: any;
watch(
  () => authService.$state.user,
  async (user) => {
    if (!user) return;
    unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
      chats.value = doc.data() as any;
    });
  }
);

onUnmounted(() => {
  if (unsub) unsub();
});
</script>
