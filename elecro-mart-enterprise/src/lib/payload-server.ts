import configPromise from '@/payload/config'
import { getPayload } from 'payload'

let payloadInstance: any = null

export async function getPayloadInstance() {
  if (!payloadInstance) {
    payloadInstance = await getPayload({
      config: configPromise
    })
  }
  return payloadInstance
}

// Export the getter function instead of the instance directly
export default getPayloadInstance
