import { CollectionConfig } from 'payload'

const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'order_number',
    defaultColumns: ['order_number', 'customer', 'status', 'total_amount', 'created_at'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'manager') {
        return true
      }
      // Customers can only read their own orders
      return {
        customer: {
          equals: user?.id,
        },
      }
    },
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
        if (operation === 'create') {
          // Generate order number
          const timestamp = Date.now()
          const random = Math.random().toString(36).substr(2, 5).toUpperCase()
          data.order_number = `ORD-${timestamp}-${random}`
          data.status = 'pending'
          data.payment_status = 'pending'
        }
        
        // Update timestamps based on status changes
        if (operation === 'update' && data.status) {
          const now = new Date().toISOString()
          
          switch (data.status) {
            case 'processing':
              data.processed_at = now
              break
            case 'shipped':
              data.shipped_at = now
              break
            case 'delivered':
              data.delivered_at = now
              break
            case 'cancelled':
              data.cancelled_at = now
              break
          }
        }
        
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, operation }) => {
        if (operation === 'create' || operation === 'update') {
          // Send email notifications based on status
          // You could integrate with email service here
          console.log(`Order ${doc.order_number} status changed to: ${doc.status}`)
        }
      },
    ],
  },
  fields: [
    {
      name: 'order_number',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Link to authenticated user (if applicable)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      index: true,
    },
    {
      name: 'payment_status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      index: true,
    },
    {
      name: 'payment_method',
      type: 'select',
      options: [
        {
          label: 'Credit Card',
          value: 'credit_card',
        },
        {
          label: 'M-Pesa',
          value: 'mpesa',
        },
        {
          label: 'Bank Transfer',
          value: 'bank_transfer',
        },
        {
          label: 'Cash on Delivery',
          value: 'cod',
        },
      ],
    },
    {
      name: 'payment_reference',
      type: 'text',
      admin: {
        description: 'Payment gateway reference ID',
      },
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'order_items',
      hasMany: true,
      admin: {
        description: 'Order line items',
      },
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Subtotal before taxes and shipping',
      },
    },
    {
      name: 'tax_amount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Tax amount (16% VAT for Kenya)',
      },
    },
    {
      name: 'shipping_amount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Shipping cost',
      },
    },
    {
      name: 'discount_amount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Total discount amount',
      },
    },
    {
      name: 'total_amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Final total amount',
      },
    },
    {
      name: 'currency',
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
    {
      name: 'shipping_address',
      type: 'group',
      required: true,
      fields: [
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
          required: true,
        },
        {
          name: 'instructions',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'billing_address',
      type: 'group',
      fields: [
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
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this order',
      },
    },
    {
      name: 'customer_notes',
      type: 'textarea',
      admin: {
        description: 'Notes from customer',
      },
    },
    {
      name: 'processed_at',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'shipped_at',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'delivered_at',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'cancelled_at',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'tracking_number',
      type: 'text',
      admin: {
        description: 'Shipping tracking number',
      },
    },
    {
      name: 'coupon_code',
      type: 'text',
      admin: {
        description: 'Applied coupon code',
      },
    },
  ],
  timestamps: true,
}

export default Orders