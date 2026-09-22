import type { Product } from '../types/Products'

export const products: Product[] = [
  {
    id: 1,
    name: 'REMAN GENERATOR',
    price: 7500,
    imageUrl:
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
    category: 'Power Systems',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'REMAN GENIE ROTATOR',
    price: 6800,
    imageUrl:
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500',
    category: 'Drive Components',
    rating: 4.3,
  },
  {
    id: 3,
    name: 'KIT, SKYEVE RETROFIT',
    price: 4200,
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
    category: 'Maintenance Kits',
    rating: 4.6,
  },
  {
    id: 4,
    name: 'BOLT ON FALL PROTECTION',
    price: 2900,
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
    category: 'Safety Equipment',
    rating: 4.2,
  },
  {
    id: 5,
    name: 'HYDRAULIC PUMP ASSY',
    price: 6100,
    imageUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
    category: 'Hydraulics',
    rating: 4.4,
  },
  {
    id: 6,
    name: 'LIFT CYLINDER SEAL KIT',
    price: 1850,
    imageUrl:
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=500',
    category: 'Seals & Gaskets',
    rating: 4.1,
  },
  {
    id: 7,
    name: 'STEEL PLATFORM HANDRAIL',
    price: 2400,
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
    category: 'Accessories',
    rating: 4.3,
  },
  {
    id: 8,
    name: 'AERIAL WORK PLATFORM FILTER',
    price: 920,
    imageUrl:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500',
    category: 'Filters',
    rating: 4.5,
  },
]

export const productCategories = Array.from(
  new Set(products.map((product) => product.category)),
)
