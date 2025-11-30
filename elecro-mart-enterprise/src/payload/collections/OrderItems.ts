import { CollectionConfig } from 'payload'

const OrderItems: CollectionConfig = {
  slug: 'order_items',
  admin: {
    useAsTitle: 'product',
    defaultColumns: ['order', 'product', 'quantity', 'unit_price', 'total_price'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => false,
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'product_name',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'product_sku',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'unit_price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'total_price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'discount_amount',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'final_price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'tax_amount',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.quantity && data.unit_price) {
          data.total_price = data.quantity * data.unit_price
        }
        if (data.total_price && data.discount_amount !== undefined) {
          data.final_price = data.total_price - (data.discount_amount || 0)
        }
        return data
      },
    ],
  },
  timestamps: true,
}

export default OrderItems