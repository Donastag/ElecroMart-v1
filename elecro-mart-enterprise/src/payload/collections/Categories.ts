import { CollectionConfig } from 'payload'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'is_active', 'sort_order'],
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
      async ({ data, operation }) => {
        if (operation === 'create' && !data.slug) {
          // Generate slug from name
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 50,
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
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        description: 'Parent category for hierarchical structure',
      },
    },
    {
      name: 'children',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        readOnly: true,
        description: 'Child categories (auto-populated)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category banner image',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon class or emoji for category display',
      },
    },
    {
      name: 'sort_order',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
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
      admin: {
        description: 'Featured categories appear in navigation',
      },
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
      name: 'product_count',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of products in this category (auto-calculated)',
      },
    },
  ],
  timestamps: true,
}

export default Categories