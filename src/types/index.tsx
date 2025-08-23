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
  size?: number
}

export type HomeCategory = {
  name: string
  imgUrl: string
  productCount: number
}

export type UserApiLoginResponse = {
  data: {
    user: User
    token?: string
  }
}

export type UserApiDataLoginResponse = {
  user: User
  token?: string
}

export type UserDetailApiResponse = {
  data: {
    user: UserDetail
  }
}

export type UserDetailApiDataResponse = {
  user: UserDetail
}

export type Auth = {
  id: number
  provider: string
  providerId: string
  avatar?: string | null
  userId: number
  createdAt: string
  lastUsedAt: string
}

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  avatar?: string | null
  auths?: Auth[]
  authProviders?: string[]
  hasBilling: boolean
  hasShipping: boolean
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
  address2?: string
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
  address2?: string
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

export type StateItems = {
  states: StateItem[]
}

export type ShippingType = {
  id: number
  value: string
  label: string
  price: number
}

export type ShippingTypes = {
  shippingTypes: ShippingType[]
}

export type ShippingTypesResponse = {
  shippingTypes: ShippingType[]
}

// Generic API response structure
export type ApiResponseStructure = {
  data?: Record<string, unknown>
}

// Type mapping for different endpoints
export type EndpointDataMap = {
  states: StateItem[]
  shippingtypes: ShippingType[]
  // Add new endpoints here as needed, following this pattern:
  // endpoint: ResultType[]
}

export type EndpointKeys = keyof EndpointDataMap

export type UserAuthApiResponse = {
  id: number
  firstName: string
  lastName: string
  email: string
  avatar: string
  authProviders: string[]
  hasBilling: boolean
  hasShipping: boolean
}

export type UserAuthApiTransformedResponse = {
  isValid: boolean
  user: UserAuthApiResponse
}
