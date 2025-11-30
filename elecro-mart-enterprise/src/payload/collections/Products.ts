import { CollectionConfig } from 'payload'
import { Product } from '../../types'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'inventory_count', 'is_active'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'manager'
    },
    update: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'manager'
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation === 'create' && !data.sku) {
          // Generate SKU if not provided
          data.sku = `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
        }
        
        // Update inventory tracking
        if (operation === 'update' && data.inventory_count !== undefined) {
          // Here you could add inventory alerts logic
          if (data.inventory_count <= 5) {
            console.log(`Low stock alert for product: ${data.name}`)
          }
        }
        
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, operation }) => {
        if (operation === 'update' && doc.inventory_count <= 5) {
          // Send low stock notification
          // You could integrate with email service here
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'short_description',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in KES (Kenyan Shillings)',
      },
    },
    {
      name: 'original_price',
      type: 'number',
      min: 0,
      admin: {
        description: 'Original price for discount display',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'inventory_count',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Current stock quantity',
      },
    },
    {
      name: 'low_stock_threshold',
      type: 'number',
      defaultValue: 5,
      min: 0,
      admin: {
        description: 'Alert when stock falls below this number',
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 10,
    },
    {
      name: 'ai_generated_image',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'AI-generated image URL (if applicable)',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Product tags for search and filtering',
      },
    },
    {
      name: 'specifications',
      type: 'group',
      fields: [
        {
          name: 'weight',
          type: 'number',
        },
        {
          name: 'dimensions',
          type: 'text',
        },
        {
          name: 'material',
          type: 'text',
        },
        {
          name: 'color',
          type: 'text',
        },
        {
          name: 'brand',
          type: 'text',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'meta_title',
          type: 'text',
          maxLength: 60,
        },
        {
          name: 'meta_description',
          type: 'text',
          maxLength: 160,
        },
        {
          name: 'focus_keyword',
          type: 'text',
        },
      ],
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      index: true,
    },
    {
      name: 'is_featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description: 'Featured products appear on homepage',
      },
    },
    {
      name: 'weight',
      type: 'number',
      min: 0,
      admin: {
        description: 'Weight in kg for shipping calculations',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      admin: {
        description: 'Average rating (auto-calculated from reviews)',
      },
    },
    {
      name: 'review_count',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of reviews (auto-calculated)',
      },
    },
  ],
  timestamps: true,
}

export default Products