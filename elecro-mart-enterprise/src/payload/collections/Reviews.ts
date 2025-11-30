import { CollectionConfig } from 'payload'

const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'product',
    defaultColumns: ['product', 'customer', 'rating', 'is_approved', 'created_at'],
  },
  access: {
    read: () => true,
    create: ({ req }) => {
      return !!req.user // Only authenticated users can create reviews
    },
    update: ({ req }) => {
      const user = req.user
      if (user?.role === 'admin' || user?.role === 'manager') {
        return true
      }
      // Users can only update their own reviews - simplified for now
      return true
    },
    delete: ({ req }) => {
      return req.user?.role === 'admin'
    },
  },
  hooks: {
    beforeChange: [
      async ({ req, operation, data, originalDoc }) => {
        if (operation === 'create') {
          // Auto-generate review ID
          data.review_id = `REV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        }
        
        // Update product rating when review is approved
        if (operation === 'update' && data.is_approved !== undefined) {
          const productId = data.product || originalDoc?.product
          if (productId) {
            try {
              // Get all approved reviews for this product
              const reviews = await req.payload.find({
                collection: 'reviews',
                where: {
                  product: { equals: productId },
                  is_approved: { equals: true },
                },
              })
              
              if (reviews.docs.length > 0) {
                // Calculate average rating
                const totalRating = reviews.docs.reduce((sum, review) => sum + review.rating, 0)
                const averageRating = totalRating / reviews.docs.length
                
                // Update product rating
                await req.payload.update({
                  collection: 'products',
                  id: productId,
                  data: {
                    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
                    review_count: reviews.docs.length,
                  },
                })
              }
            } catch (error) {
              console.error('Error updating product rating:', error)
            }
          }
        }
        
        return data
      },
    ],
  },
  fields: [
    {
      name: 'review_id',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: false,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      hasMany: false,
    },
    {
      name: 'rating',
      type: 'select',
      required: true,
      options: [
        {
          label: '5 Stars - Excellent',
          value: '5',
        },
        {
          label: '4 Stars - Good',
          value: '4',
        },
        {
          label: '3 Stars - Average',
          value: '3',
        },
        {
          label: '2 Stars - Poor',
          value: '2',
        },
        {
          label: '1 Star - Terrible',
          value: '1',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      maxLength: 100,
      admin: {
        description: 'Review title (optional)',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      maxLength: 1000,
      required: true,
      admin: {
        description: 'Detailed review comment',
      },
    },
    {
      name: 'pros',
      type: 'text',
      hasMany: true,
      maxRows: 5,
      admin: {
        description: 'What did you like about this product?',
      },
    },
    {
      name: 'cons',
      type: 'text',
      hasMany: true,
      maxRows: 5,
      admin: {
        description: 'What could be improved?',
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 5,
      admin: {
        description: 'Photos of the product (optional)',
      },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Video review (optional)',
      },
    },
    {
      name: 'verified_purchase',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Customer actually purchased this product',
      },
    },
    {
      name: 'helpful_count',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Number of users who found this review helpful',
      },
    },
    {
      name: 'reported_count',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this review was reported',
      },
    },
    {
      name: 'is_approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Approved by admin for public display',
      },
    },
    {
      name: 'is_featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured review (appears prominently)',
      },
    },
    {
      name: 'admin_response',
      type: 'textarea',
      admin: {
        description: 'Response from store management',
      },
    },
    {
      name: 'admin_response_date',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'When the admin responded',
      },
    },
    {
      name: 'moderation_notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for moderation',
      },
    },
    {
      name: 'purchase_verified_date',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'When the purchase was verified',
      },
    },
    {
      name: 'order_item',
      type: 'relationship',
      relationTo: 'order_items',
      admin: {
        description: 'Specific order item this review relates to',
      },
    },
  ],
  timestamps: true,
}

export default Reviews