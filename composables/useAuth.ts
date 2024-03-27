import { onAuthStateChanged } from "firebase/auth";
import { auth } from "~/plugins/firebase";
import { defineStore } from "pinia";

export const useAuth = defineStore({
  id: "auth",
  state: () => ({
    user: {} as any,
  }),
  actions: {
    async getCurrentUser() {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = user;
            resolve(user);
          } else {
            reject("No user is signed in.");
          }
          unsubscribe();
        });
      });
    },
  },
});
