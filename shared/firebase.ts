/// <reference types="vite/client" />

import { FirebaseOptions, initializeApp } from 'firebase/app'

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyB7E8hJ5lcOITiBwA0HrPSeHe3ns-2-GAk',
  authDomain: 'loud-thoughts.firebaseapp.com',
  databaseURL:
    'https://loud-thoughts-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'loud-thoughts',
  storageBucket: 'loud-thoughts.firebasestorage.app',
  messagingSenderId: '909058117274',
  appId: '1:909058117274:web:b9bda7711cb08fd7d55923',
  measurementId: 'G-NE273130WT',
}

const app = initializeApp(firebaseConfig)

export default app
