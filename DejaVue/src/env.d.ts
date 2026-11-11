/// <reference types="vite/client" />

// Diz ao TypeScript quais variáveis de ambiente existem.
// O Vite só entrega ao código as que começam com VITE_.
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
