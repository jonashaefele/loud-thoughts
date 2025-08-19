import { FirebaseApp } from 'firebase/app'
import { User } from 'firebase/auth'
import { createContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { BufferItem } from '@shared/types'

export type Store = {
  app?: FirebaseApp
  currentUser?: User
  obsidianToken?: string
  key?: string
  buffer?: BufferItem[]
  loading?: boolean
}

export type StoreMutations = {
  setApp(app: FirebaseApp): void
  setCurrentUser(user: User | undefined): void
  setObsidianToken(token: string): void
  setLoading(loading: boolean): void
  setKey(key: string): void
  setBuffer(buffer: BufferItem[]): void
}

export const AppContext = createContext<[Store, StoreMutations]>([
  {},
  {
    setApp(app: FirebaseApp) {},
    setCurrentUser(user: User | undefined) {},
    setObsidianToken(token: string) {},
    setLoading(loading: boolean) {},
    setKey(key: string) {},
    setBuffer(buffer: BufferItem[]) {},
  },
])

export const createAppStore = (): [Store, StoreMutations] => {
  const [state, setState] = createStore<Store>({
    loading: true,
  })

  return [
    state,
    {
      setApp(app) {
        setState('app', app)
      },
      setCurrentUser(user) {
        setState('currentUser', user)
      },
      setObsidianToken(token) {
        setState('obsidianToken', token)
      },
      setLoading(loading) {
        setState('loading', loading)
      },
      setKey(key) {
        setState('key', key)
      },
      setBuffer(buffer) {
        setState('buffer', buffer)
      },
    },
  ]
}
