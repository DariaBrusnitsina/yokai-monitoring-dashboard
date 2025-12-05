import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Игнорируем Next.js специфичные файлы и тесты
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/__tests__/**',
      '**/e2e/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/jest.config.js',
      '**/jest.setup.js',
      '**/next.config.js',
      '**/next-env.d.ts',
      '**/docker-compose.yml',
      '**/Dockerfile',
      '**/app/**',
    ],
  },
  {
    // Для features разрешаем импорт из widgets (композиция виджетов)
    files: ['./features/**'],
    rules: {
      'fsd/forbidden-imports': 'off',
    },
  },
  {
    // Для widgets разрешаем cross-import (композиция виджетов)
    files: ['./widgets/**'],
    rules: {
      'fsd/forbidden-imports': 'off',
    },
  },
  {
    // Отключаем проверку на незначительные слайсы для небольших проектов
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
])

