const path = require('path')
const fs = require('fs')
const { defineConfig } = require('vite')
const markdownRawPlugin = require('vite-raw-plugin')

module.exports = defineConfig({
  build: {
    minify: true,
    lib: {
      entry: path.resolve(__dirname, 'main.ts'),
      fileName: 'main',
      name: 'AudiopenObsidian',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['obsidian'],
      output: {},
    },
  },
  plugins: [
    markdownRawPlugin({
      fileRegex: /\.md$/,
    }),
    {
      name: 'copy-assets',
      closeBundle() {
        const manifestSource = path.resolve(__dirname, 'manifest.json')
        const manifestDest = path.resolve(__dirname, 'dist', 'manifest.json')
        fs.copyFileSync(manifestSource, manifestDest)

        const stylesSource = path.resolve(__dirname, 'styles.css')
        const stylesDest = path.resolve(__dirname, 'dist', 'styles.css')
        fs.copyFileSync(stylesSource, stylesDest)
      },
    },
  ],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
})
