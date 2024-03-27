<template>
  <div className="search">
    <div className="searchForm">
      <input
        type="text"
        placeholder="Find a user"
        @keydown="handleKey"
        v-model="username"
      />
    </div>
    <span v-if="error">User not found!</span>
    <div v-if="!!selectedUser" className="userChat" @click="handleSelect">
      <img :src="selectedUser.photoURL" alt="" />
      <div className="userChatInfo">
        <span>{{ selectedUser.displayName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "~/plugins/firebase";

const username = ref("");
const selectedUser = ref<User | null>(null);
const error = ref(false);

const authService = useAuth();

const handleSearch = async () => {
  const q = query(
    collection(db, "users"),
    where("displayName", "==", username.value)
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      selectedUser.value = doc.data() as User;
    });
  } catch (err) {
    console.log("err", err);
    error.value = true;
  }
};

const handleKey = (e: any) => {
  e.code === "Enter" && handleSearch();
};

const handleSelect = async () => {
  if (!authService.$state.user || !selectedUser.value) return;
  const combinedId =
    authService.$state.user.uid > selectedUser.value.uid
      ? authService.$state.user.uid + selectedUser.value.uid
      : selectedUser.value.uid + authService.$state.user.uid;
  try {
    const res = await getDoc(doc(db, "chats", combinedId));

    if (!res.exists()) {
      //create a chat in chats collection
      await setDoc(doc(db, "chats", combinedId), { messages: [] });

      //create user chats
      await updateDoc(doc(db, "userChats", authService.$state.user.uid), {
        [combinedId + ".userInfo"]: {
          uid: selectedUser.value.uid,
          displayName: selectedUser.value.displayName,
          photoURL: selectedUser.value.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", selectedUser.value.uid), {
        [combinedId + ".userInfo"]: {
          uid: authService.$state.user.uid,
          displayName: authService.$state.user.displayName,
          photoURL: authService.$state.user.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    }
  } catch (err) {}

  selectedUser.value = null;
  username.value = "";
};

watch(username, () => {
  console.log(username.value);
});
</script>
