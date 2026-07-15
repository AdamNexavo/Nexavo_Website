import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createChatApiMiddleware } from "./server/chat-handler";

const DEV_PORT = Number(process.env.PORT || process.env.VITE_DEV_PORT || 5173);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      /** Fixed local port — avoids silent jump to 8081 when 8080 is busy */
      port: DEV_PORT,
      strictPort: true,
      host: "127.0.0.1",
      open: false,
      /** .env edits no longer restart/kill the dev server mid-session */
      watch: {
        ignored: ["**/.env", "**/.env.*", "**/.git/**", "**/dist/**"],
      },
    },
    preview: {
      port: DEV_PORT,
      strictPort: true,
      host: "127.0.0.1",
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      {
        name: "nexavo-chat-api",
        configureServer(server) {
          server.middlewares.use(
            createChatApiMiddleware(env.OPENAI_API_KEY),
          );
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
