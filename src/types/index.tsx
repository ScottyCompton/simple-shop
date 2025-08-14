
export type ProductListApiResponse = {
  data: {
    products: Product[]   
  }
}

export type ProductListApiDataResponse = {
  products: Product[];
}

export type CategoryApiResponse = {
  data: {
    categories: string[];
  }
}

export type CategoryApiDataResponse = {
  categories: string[];
}


export type HomeCategoryApiResponse = {
  data: {
    categories: HomeCategory[];
  }
}

export type HomeCategoryApiDataResponse = {
  categories: HomeCategory[];
}

export type ProductDetailApiResponse = {
  data: {
    product: Product
  }
}

export type ProductDetailApiDataResponse = {
  product: Product;
}

export type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
    shortDesc: string;
    inStock: boolean;
    imgUrl: string;
    mfgName: string;
    longDesc?: string;
}

export type CartItem = {
    id: number;
    name: string;
    price: number;
    qty: number;
};

export type HomeCategory = {
    name: string;
    imgUrl: string;
    productCount: number;
}
