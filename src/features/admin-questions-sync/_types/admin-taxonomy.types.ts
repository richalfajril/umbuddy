export type AdminSubMaterial = {
  id: string
  name: string
  order: number
  is_active: boolean
}

export type AdminMaterial = {
  id: string
  name: string
  order: number
  is_active: boolean
  sub_materials: AdminSubMaterial[]
}

export type AdminSubtest = {
  id: string
  code: string
  name: string
  order: number
  is_active: boolean
  materials: AdminMaterial[]
}
