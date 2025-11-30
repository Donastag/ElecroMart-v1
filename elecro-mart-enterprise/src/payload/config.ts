import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'

// Collections
import Users from './collections/Users'
import Products from './collections/Products'
import Categories from './collections/Categories'
import Orders from './collections/Orders'
import OrderItems from './collections/OrderItems'
import Customers from './collections/Customers'
import Reviews from './collections/Reviews'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-for-development-only',
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Products,
    Categories,
    Orders,
    OrderItems,
    Customers,
    Reviews,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
})
