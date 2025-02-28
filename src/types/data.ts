export interface Item {
  icon: string
  name: string
  city: string
  state: string
  serviceArea?: string
  users: number
  url: string
}

export interface Section {
  name: string
  list: Item[]
}