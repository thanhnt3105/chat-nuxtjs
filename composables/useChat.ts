import { defineStore } from "pinia";

export const useChat = defineStore({
  id: "chat",
  state: () => ({
    chatId: "",
    user: {} as any,
  }),
  actions: {
    async updateCurrentChat(payload: any) {
      const authService = useAuth();
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        this.chatId =
          currentUser.uid > payload.uid
            ? `${currentUser.uid}${payload.uid}`
            : `${payload.uid}${currentUser.uid}`;

        this.user = payload;
      } else {
        console.error("Current user is not authenticated");
      }
    },
  },
});
