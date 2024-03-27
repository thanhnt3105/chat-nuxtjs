<template>
  <div className="input">
    <input type="text" placeholder="Type something..." v-model="text" />
    <div className="send">
      <img src="@/assets/image/attach.png" alt="" />
      <input
        type="file"
        style="display: none"
        id="file"
        @change="handleImage"
      />
      <label for="file">
        <img src="@/assets/image/img.png" alt="" />
      </label>
      <button @click="handleSend">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ref as firebaseRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuid } from "uuid";
import { db, storage } from "../plugins/firebase";

const text = ref("");
const image = ref(null);
const userService = useAuth();
const chatService = useChat();

const handleSend = async () => {
  if (image.value) {
    const userStorageRef = firebaseRef(storage, `chats/${uuid()}`);

    const uploadTask = uploadBytesResumable(userStorageRef, image.value);

    uploadTask.on(
      (error: any) => {
        console.log("error", error);
        // setErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", chatService.$state.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text: text.value,
              senderId: userService.$state.user.uid,
              date: serverTimestamp(),
              img: downloadURL,
            }),
          });
        });
      }
    );
  } else {
    try {
      await updateDoc(doc(db, "chats", chatService.$state.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text.value,
          senderId: userService.$state.user.uid,
          date: Timestamp.now(),
        }),
      });
    } catch (error) {
      console.log("error", error);
    }
  }
  await updateDoc(doc(db, "userChats", userService.$state.user.uid), {
    [chatService.$state.chatId + ".lastMessage"]: {
      text: text.value,
    },
    [chatService.$state.chatId + ".date"]: serverTimestamp(),
  });

  await updateDoc(doc(db, "userChats", chatService.$state.user.uid), {
    [chatService.$state.chatId + ".lastMessage"]: {
      text: text.value,
    },
    [chatService.$state.chatId + ".date"]: serverTimestamp(),
  });

  image.value = null;
  text.value = "";
};

const handleImage = (e: any) => {
  image.value = e.target.files[0];
};
</script>
