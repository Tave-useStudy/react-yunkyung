import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // npm run analyze → dist/stats.html 에 번들 구성(어떤 모듈이 몇 KB인지) 트리맵 생성
    mode === 'analyze' &&
      visualizer({ filename: 'dist/stats.html', gzipSize: true, template: 'treemap' }),
  ],
}))
