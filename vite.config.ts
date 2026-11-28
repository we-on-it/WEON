import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: ['index.html', 'team-project-home/index.html', 'my-tasks/index.html'] } },
});
