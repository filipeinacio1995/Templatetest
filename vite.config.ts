import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscator from 'rollup-plugin-obfuscator';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    obfuscator({
      global: true,
      options: {
        // Optimized for performance while still preventing easy copy-paste
        compact: true,
        controlFlowFlattening: false, // Killed performance
        deadCodeInjection: false, // Killed performance
        debugProtection: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'mangled', // Short names like a, b, c (hard to read, fast to run)
        log: false,
        numbersToExpressions: false, // Keep numbers as numbers for speed
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: false, // Avoids too many string ops
        stringArray: true,
        stringArrayCallsTransform: false, // Faster execution
        stringArrayEncoding: ['none'], // Faster decoding
        stringArrayThreshold: 0.75,
        transformObjectKeys: false, // Keep object keys for better JSON/API speed
        unicodeEscapeSequence: false
      }
    })
  ],
  build: {
    sourcemap: false, // Still no maps
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    chunkSizeWarningLimit: 1000,
  }
})