import { NextRequest, NextResponse } from 'next/server'
import getPayloadInstance from '@/lib/payload-server'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadInstance()
    const { searchParams } = new URL(request.url)

    const featured = searchParams.get('featured') === 'true'

    // Build where clause
    const where: any = {
      is_active: {
        equals: true,
      },
    }

    if (featured) {
      where.is_featured = {
        equals: true,
      }
    }

    const result = await payload.find({
      collection: 'categories',
      sort: 'sort_order',
      where,
      depth: 1,
    })

    // Transform Payload data
    const categories = result.docs.map(transformCategory)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function transformCategory(payloadCategory: any) {
  return {
    id: payloadCategory.id,
    name: payloadCategory.name,
    slug: payloadCategory.slug,
    description: payloadCategory.description,
    parentId: payloadCategory.parent?.id,
    imageUrl: payloadCategory.image?.url,
    icon: payloadCategory.icon,
    sortOrder: payloadCategory.sort_order || 0,
    isActive: payloadCategory.is_active !== false,
    isFeatured: payloadCategory.is_featured || false,
    productCount: payloadCategory.product_count || 0,
  }
}
