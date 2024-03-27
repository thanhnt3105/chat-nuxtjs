<template>
  <div class="formContainer">
    <div class="formWrapper">
      <span class="logo">Nuxt Chat</span>
      <span class="title">Register</span>
      <v-form>
        <input type="text" placeholder="display name" v-model="displayName" />
        <input type="email" placeholder="email" v-model="email" />
        <input type="password" placeholder="password" v-model="password" />
        <input
          style="display: none"
          type="file"
          id="file"
          @change="handleFileChange"
        />
        <label for="file">
          <img src="@/assets/image/addAvatar.png" alt="" />
          <span>Add an avatar</span>
        </label>
        <button type="submit" @click="handleSubmit">Sign up</button>
        <span v-if="err">Something went wrong</span>
      </v-form>
      <p>You do have an account? <NuxtLink to="/login">Login</NuxtLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  ref as firebaseRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "~/plugins/firebase";

const err = ref(false);
const router = useRouter();

const displayName = ref("");
const email = ref("");
const password = ref("");
const file = ref(null);

const handleFileChange = (event: any) => {
  file.value = event.target.files[0]; // This will store the file
};

const handleSubmit = async () => {
  console.log("file", file.value);
  try {
    const res = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const userStorageRef = firebaseRef(storage, `userProfiles/${res.user.uid}`);

    const uploadTask = file.value
      ? uploadBytesResumable(userStorageRef, file.value)
      : null;
    if (!uploadTask) return;
    uploadTask.on(
      (_state: any, error: any) => {
        // Code inside the callback function
        console.log("error", error);
        err.value = true;
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateProfile(res.user, {
            displayName: displayName.value,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName: displayName.value,
            email: email.value,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "userChats", res.user.uid), {});

          router.push("/");
        });
      }
    );
  } catch (error) {
    err.value = true;
  }
};
</script>
