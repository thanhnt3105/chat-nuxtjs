<template>
  <div className="navbar">
    <span className="logo">Nuxt Chat</span>
    <div className="user">
      <img :src="currentUser?.photoURL" alt="" />
      <span>{{ currentUser?.displayName }}</span>
      <button @click="handleSignOut">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { signOut } from "firebase/auth";
import { auth } from "~/plugins/firebase";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const authService = useAuth();
const router = useRouter();
const currentUser = ref(null);

onMounted(async () => {
  try {
    currentUser.value = await authService.getCurrentUser();
  } catch (error) {
    console.error("Failed to fetch current user:", error);
  }
});

const handleSignOut = async () => {
  await signOut(auth);
  router.push("/login");
};
</script>
