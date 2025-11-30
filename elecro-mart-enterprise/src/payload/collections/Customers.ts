import { CollectionConfig } from 'payload'

const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['first_name', 'last_name', 'email', 'phone', 'created_at'],
  },
  access: {
    read: ({ req }) => {
      const user = req.user
      if (user?.role === 'admin' || user?.role === 'manager') {
        return true
      }
      // Users can only read their own customer record
      return {
        email: {
          equals: user?.email,
        },
      }
    },
    create: () => true,
    update: ({ req }) => {
      const user = req.user
      if (user?.role === 'admin' || user?.role === 'manager') {
        return true
      }
      // Users can only update their own customer record
      return {
        email: {
          equals: user?.email,
        },
      }
    },
    delete: ({ req }) => {
      return req.user?.role === 'admin'
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          // Auto-generate customer ID if not provided
          if (!data.customer_id) {
            data.customer_id = `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'customer_id',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Link to authenticated user account',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'first_name',
      type: 'text',
      required: true,
      maxLength: 50,
    },
    {
      name: 'last_name',
      type: 'text',
      required: true,
      maxLength: 50,
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Primary phone number (Kenyan format preferred)',
      },
    },
    {
      name: 'date_of_birth',
      type: 'date',
      admin: {
        description: 'Date of birth for age verification',
      },
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Other',
          value: 'other',
        },
        {
          label: 'Prefer not to say',
          value: 'prefer_not_to_say',
        },
      ],
    },
    {
      name: 'addresses',
      type: 'group',
      fields: [
        {
          name: 'shipping_addresses',
          type: 'array',
          maxRows: 5,
          fields: [
            {
              name: 'label',
              type: 'text',
              admin: {
                description: 'e.g., Home, Office, etc.',
              },
            },
            {
              name: 'is_default',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'first_name',
              type: 'text',
              required: true,
            },
            {
              name: 'last_name',
              type: 'text',
              required: true,
            },
            {
              name: 'company',
              type: 'text',
            },
            {
              name: 'address_line_1',
              type: 'text',
              required: true,
            },
            {
              name: 'address_line_2',
              type: 'text',
            },
            {
              name: 'city',
              type: 'text',
              required: true,
            },
            {
              name: 'county',
              type: 'text',
              required: true,
              admin: {
                description: 'Kenyan county (e.g., Nairobi, Mombasa, etc.)',
              },
            },
            {
              name: 'postal_code',
              type: 'text',
            },
            {
              name: 'country',
              type: 'text',
              defaultValue: 'Kenya',
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'instructions',
              type: 'textarea',
              admin: {
                description: 'Delivery instructions for this address',
              },
            },
          ],
        },
        {
          name: 'billing_addresses',
          type: 'array',
          maxRows: 5,
          fields: [
            {
              name: 'label',
              type: 'text',
            },
            {
              name: 'is_default',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'first_name',
              type: 'text',
            },
            {
              name: 'last_name',
              type: 'text',
            },
            {
              name: 'company',
              type: 'text',
            },
            {
              name: 'address_line_1',
              type: 'text',
            },
            {
              name: 'address_line_2',
              type: 'text',
            },
            {
              name: 'city',
              type: 'text',
            },
            {
              name: 'county',
              type: 'text',
            },
            {
              name: 'postal_code',
              type: 'text',
            },
            {
              name: 'country',
              type: 'text',
              defaultValue: 'Kenya',
            },
          ],
        },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'newsletter_subscribed',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'sms_notifications',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'preferred_language',
          type: 'select',
          defaultValue: 'en',
          options: [
            {
              label: 'English',
              value: 'en',
            },
            {
              label: 'Swahili',
              value: 'sw',
            },
          ],
        },
        {
          name: 'preferred_currency',
          type: 'select',
          defaultValue: 'KES',
          options: [
            {
              label: 'Kenyan Shilling',
              value: 'KES',
            },
            {
              label: 'US Dollar',
              value: 'USD',
            },
          ],
        },
      ],
    },
    {
      name: 'statistics',
      type: 'group',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'total_orders',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'total_spent',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'average_order_value',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'last_order_date',
          type: 'date',
        },
        {
          name: 'customer_since',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this customer',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Customer tags for segmentation',
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      index: true,
    },
    {
      name: 'is_vip',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'VIP customers get special treatment',
      },
    },
    {
      name: 'referral_code',
      type: 'text',
      unique: true,
      admin: {
        description: 'Customer referral code',
      },
    },
  ],
  timestamps: true,
}

export default Customers