<template>
  <div className="formContainer">
    <div className="formWrapper">
      <span className="logo">Nuxt Chat</span>
      <span className="title">Login</span>
      <v-form>
        <input type="email" placeholder="email" v-model="email" />
        <input type="password" placeholder="password" v-model="password" />
        <button @click="handleSubmit">Sign in</button>
        <span v-if="error">Something went wrong</span>
        <p>
          You do have an account? <NuxtLink to="/register">Register</NuxtLink>
        </p>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../plugins/firebase";

const router = useRouter();

const error = ref(false);
const email = ref("");
const password = ref("");
const handleSubmit = async () => {
  try {
    console.log("first", email.value, password.value);
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/");
  } catch (err) {
    console.log("err", err);
    error.value = true;
  }
};
</script>
