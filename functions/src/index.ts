// Import the required modules individually
// Updated for Node.js 20 runtime
import { onRequest, onCall } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2'
import * as functions from 'firebase-functions/v1' // v1 for legacy functions
import * as admin from 'firebase-admin'

import { BufferItem } from '../../shared/types'
import { ProviderRegistry } from './providers'

admin.initializeApp()

// Set the region globally for all functions
setGlobalOptions({ region: 'europe-west1' })

export const webhook = onRequest({ cors: true }, async (request, response) => {
  const key = request.params[0]
  const user = await (await admin.database().ref(`/keys/${key}`).get()).val()
  if (!user) {
    response.status(403).send('Invalid key')
    return
  }

  // Find the appropriate provider for this payload
  const provider = ProviderRegistry.findProvider(request.body)
  
  if (!provider) {
    response
      .status(400)
      .send('Unsupported webhook format - no provider found for this payload')
    return
  }

  // Validate the payload
  if (!provider.validate(request.body)) {
    response
      .status(400)
      .send(`Invalid ${provider.name} payload - missing required fields`)
    return
  }

  // Transform the payload to our buffer format
  const bufferData = provider.transform(request.body)
  
  // Create the buffer item with expiration
  const today = new Date()
  const exp = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7,
  )
  
  const buffer: BufferItem = {
    id: bufferData.id,
    exp,
    data: {
      platform: bufferData.platform as 'audiopen' | 'voicenotes' | 'alfie',
      id: bufferData.id,
      title: bufferData.title,
      content: bufferData.content,
      orig_transcript: bufferData.orig_transcript,
      tags: bufferData.tags || [],
      date_created: bufferData.date_created,
      ...(bufferData.timestamp && { timestamp: bufferData.timestamp }),
      ...(bufferData.metadata && { metadata: bufferData.metadata }),
    },
  }

  // Check if note is already in buffer
  const db = admin.database()
  const bufferRef = db.ref(`/buffer/${user}`)
  const snapshot = await bufferRef
    .orderByChild('data/id')
    .equalTo(buffer.id)
    .once('value')
    
  // Update if exists, else push
  if (snapshot.exists()) {
    const itemKey = Object.keys(snapshot.val())[0]
    await bufferRef.child(itemKey).set(buffer)
  } else {
    await bufferRef.push(buffer)
  }
  
  response.send('ok')
})

// V1 for auth triggers
export const newUser = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(async (user: admin.auth.UserRecord) => {
    // crypto.randomUUID() is globally available in Node.js 18+ (Web Crypto API)
    // It generates cryptographically secure UUID v4 values
    const key = crypto.randomUUID()
    await Promise.all([
      admin.database().ref(`/keys/${key}`).set(user.uid),
      admin.database().ref(`/users/${user.uid}/key`).set(key),
    ])
  })

interface WipeData {
  id: string
}
export const wipe = onCall<WipeData>({ cors: true }, async ({ auth, data }) => {
  if (auth) {
    const user = await admin.auth().getUser(auth.uid)
    if (user.providerData[0].providerId != 'anonymous') {
      const db = admin.database()
      const ref = db.ref(`/buffer/${user.uid}`)
      await ref.transaction((buffer) => {
        if (buffer == null) {
          return buffer
        }
         
        if (typeof buffer == 'object' && data.id !== undefined) {
          return (
            Object.entries(buffer)
              // @ts-ignore
              .filter(([_key, value]) => value.id !== data.id)
              .reduce((obj, [key, value]) => {
                // @ts-ignore
                obj[key] = value
                return obj
              }, {})
          )
        }

        throw new Error(
          `buffer not as expected ${typeof buffer} ${JSON.stringify(buffer)}`,
        )
      })
    }
  }
})

// TODO: v2 function errors out with that same error as before, fix later
// Permission 'iam.serviceAccounts.signBlob' denied on resource (or it may not exist).
// export const generateObsidianToken = onCall(async ({ auth }) => {
//   if (auth) {
//     return admin.auth().createCustomToken(auth.uid)
//   }
//   throw new Error('authed only')
// })
// V1 function:
export const generateObsidianToken = functions
  .region('europe-west1')
  .https.onCall((_data: unknown, context: functions.https.CallableContext) => {
    if (context.auth) {
      return admin.auth().createCustomToken(context.auth.uid)
    }
    throw new Error('authed only')
  })
