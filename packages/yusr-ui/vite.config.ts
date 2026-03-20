import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), 
    dts({
      // Use the app config which actually includes the "src" folder
      tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
      insertTypesEntry: true,
      rollupTypes: true, // Let's try to bundle them for a cleaner package
      copyDtsFiles: false,
      staticImport: true,
      // This is the "magic" fix:
      compilerOptions: {
        noEmit: false,
        declaration: true,
        emitDeclarationOnly: true,
      },
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'YusrUI',
      fileName: 'yusr-ui',
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom', 
        '@yusr_systems/core',
        'react/jsx-runtime',
        'tailwindcss',
        'lucide-react',
        /@radix-ui\/.*/, 
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'lucide-react': 'LucideReact',
          'tailwindcss': 'tailwindcss'
        }
      }
    }
  }
})