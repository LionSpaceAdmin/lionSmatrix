import { defineConfig } from 'drizzle-kit'

// טען את קבצי ה-environment מ-.env אם קיים
try {
  require('dotenv').config()
} catch {
  // dotenv לא מותקן, זה בסדר
}

export default defineConfig({
  // Schema files
  schema: './lib/db/schema.ts',
  
  // Output directory למיגרציות
  out: './lib/db/migrations',
  
  // Database configuration
  dialect: 'postgresql',
  dbCredentials: {
    // בdev container השתמש ב-DATABASE_URL_INTERNAL
    // בshotin רגיל השתמש ב-DATABASE_URL
    connectionString: process.env.DATABASE_URL_INTERNAL || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lionspace_dev'
  },

  // Development options
  verbose: process.env.NODE_ENV === 'development',
  strict: true,

  // Migration options
  migrations: {
    prefix: 'index',
    table: '__drizzle_migrations__',
    schema: 'public'
  },

  // Dev container specific settings
  ...(process.env.DEV_CONTAINER === 'true' && {
    dbCredentials: {
      connectionString: 'postgresql://postgres:postgres@db:5432/lionspace_dev'
    }
  })
})