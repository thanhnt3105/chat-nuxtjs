// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          crossorigin: "anonymous",
          href: "https://fonts.gstatic.com",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+JP:wght@400;600;700&display=swap",
        },
      ],
    },
  },
  css: ["bulma", "@/assets/css/main.scss"],
  ssr: false,
  plugins: ["~/plugins/firebase"],
  modules: ["@pinia/nuxt"],
});
