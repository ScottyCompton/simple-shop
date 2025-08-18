export type ProductListApiResponse = {
  data: {
    products: Product[]
  }
}

export type ProductListApiDataResponse = {
  products: Product[]
}

export type CategoryApiResponse = {
  data: {
    categories: string[]
  }
}

export type CategoryApiDataResponse = {
  categories: string[]
}

export type HomeCategoryApiResponse = {
  data: {
    categories: HomeCategory[]
  }
}

export type HomeCategoryApiDataResponse = {
  categories: HomeCategory[]
}

export type ProductDetailApiResponse = {
  data: {
    product: Product
  }
}

export type ProductDetailApiDataResponse = {
  product: Product
}

export type Product = {
  id: number
  name: string
  price: number
  category: string
  shortDesc: string
  inStock: boolean
  imgUrl: string
  mfgName: string
  longDesc?: string
}

export type CartItem = {
  id: number
  name: string
  price: number
  qty: number
}

export type HomeCategory = {
  name: string
  imgUrl: string
  productCount: number
}

export type UserApiLoginResponse = {
  data: {
    user: User
  }
}

export type UserApiDataLoginResponse = {
  user: User
}

export type UserDetailApiResponse = {
  data: {
    user: UserDetail
  }
}

export type StatesApiDataResponse = {
  states: StateItem[]
}

export type StatesApiResponse = {
  data: {
    states: StateItem[]
  }
}

export type UserDetailApiDataResponse = {
  user: UserDetail
}

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  // Add any other user fields you need
}

export type UserDetail = {
  user: User
  billing: UserBilling
  shipping: UserShipping
}

export type UserShipping = {
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  phone: string
  shippingMethod?: string
}

export type UserBilling = {
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  sameAsShipping: boolean
  phone: string
}

export type StateItem = {
  abbr: string
  state: string
}

export type ShippingType = {
  id: number
  value: string
  label: string
  price: number
}

export type ShippingTypesApiResponse = {
  data: {
    shippingTypes: ShippingType[]
  }
}

export type ShippingTypesApiDataResponse = {
  shippingTypes: ShippingType[]
}
