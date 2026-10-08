import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@my-app/items'


export type Item = {
  id: string
  name: string
  country: string
  region: string
  district: string
  lat: number
  long: number
}

export async function getItems(): Promise<Item[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY)

  if (!json) {
    return []
  }

  try {
    return JSON.parse(json) as Item[]
  } catch (error) {
    return []
  }
}

export async function addItem(item: Item): Promise<Item[]> {
  const items = await getItems()

  const updatedItems = [...items, item]

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedItems),
  )

  return updatedItems
}

export async function removeItem(id: string): Promise<Item[]> {
  const items = await getItems()

  const updatedItems = items.filter((item) => item.id !== id)

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedItems),
  )

  return updatedItems
}