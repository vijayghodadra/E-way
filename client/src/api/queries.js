import api from './axios';

// Mock fallback products if backend is not running yet
export const mockProducts = [
  {
    _id: 'prod_1',
    title: 'Golden Saffron Youth Radiance Elixir',
    slug: 'golden-saffron-youth-radiance-elixir',
    subtitle: '100% Pure Kumkumadi Saffron Night Serum',
    price: 3450,
    discountPrice: 2950,
    rating: 4.9,
    numReviews: 128,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608248597560-8438b4562c55?auto=format&fit=crop&q=80&w=800'
    ],
    category: { name: 'Botanical Skincare', slug: 'botanical-skincare' },
    description: 'An ethereal cold-infused facial elixir harnessing Kashmiri Saffron threads, pure Sandalwood, and 26 ancient restorative herbs. Minimizes fine lines, enhances natural glow, and deeply nourishes skin overnight.',
    ingredients: ['Kashmiri Saffron', 'Mysore Sandalwood', 'Lotus Flower Seed Oil', 'Pure Vetiver'],
    benefits: ['Improves elasticity & firmness', 'Fades dark spots', 'Restores natural glow'],
    howToUse: 'Warm 3 to 4 drops between clean palms and gently press onto face.',
    volume: '30ml / 1.0 fl oz',
    isBestSeller: true,
    isFeatured: true
  },
  {
    _id: 'prod_2',
    title: 'Rose & Vetiver Dew Drops Moisture Nectar',
    slug: 'rose-vetiver-dew-drops-moisture-nectar',
    subtitle: 'Hydrating Botanical Hydra-Gel Cream',
    price: 2200,
    discountPrice: 1890,
    rating: 4.8,
    numReviews: 94,
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
    ],
    category: { name: 'Botanical Skincare', slug: 'botanical-skincare' },
    description: 'Light-as-air hydration powered by Kannauj Steam-Distilled Rose Petals, Hyaluronic Acid, and Wild Vetiver Root.',
    ingredients: ['Rose Hydrosol', 'Plant Hyaluronic Acid', 'Vetiver Extract', 'Niacinamide 5%'],
    benefits: ['48H Plumping hydration', 'Calms redness', 'Restores skin barrier'],
    howToUse: 'Smooth generously over cleansed face morning and evening.',
    volume: '50ml / 1.7 fl oz',
    isBestSeller: true,
    isFeatured: true
  },
  {
    _id: 'prod_3',
    title: 'Kesh-Revitalize Bhringraj & Amla Hair Elixir',
    slug: 'kesh-revitalize-bhringraj-amla-hair-elixir',
    subtitle: 'Intensive Scalp Strengthening & Growth Oil',
    price: 1950,
    discountPrice: 1650,
    rating: 4.9,
    numReviews: 210,
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608248597560-8438b4562c55?auto=format&fit=crop&q=80&w=800'
    ],
    category: { name: 'Herbal Hair Care', slug: 'herbal-hair-care' },
    description: 'An authentic slow-cooked scalp elixir steeped with wild Bhringraj leaves, organic Amla berries, and Rosemary oil.',
    ingredients: ['Bhringraj Leaf', 'Wild Amla', 'Virgin Coconut Oil', 'Rosemary Oil'],
    benefits: ['Reduces hair fall up to 85%', 'Boosts root circulation', 'Protects hair density'],
    howToUse: 'Section scalp and massage warm oil into roots for 10 minutes.',
    volume: '100ml / 3.4 fl oz',
    isBestSeller: true,
    isFeatured: true
  },
  {
    _id: 'prod_4',
    title: 'Velvet Jasmine & Wild Almond Body Butter',
    slug: 'velvet-jasmine-wild-almond-body-butter',
    subtitle: 'Rich Whipped Skin Nourishing Butter',
    price: 1800,
    discountPrice: 1550,
    rating: 4.7,
    numReviews: 76,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
    ],
    category: { name: 'Artisanal Body Care', slug: 'artisanal-body-care' },
    description: 'Ultra-luxurious whipped body soufflé enriched with Raw Shea Butter, Sweet Almond Extract, and Jasmine.',
    ingredients: ['Raw Shea Butter', 'Sweet Almond Oil', 'Mogra Jasmine Distillate'],
    benefits: ['Deeply hydrates dry skin', 'Velvety feel', 'Sensual jasmine scent'],
    howToUse: 'Apply liberally over damp body post-bath.',
    volume: '200g / 7.0 oz',
    isBestSeller: false,
    isFeatured: true
  }
];

export const fetchProductsAPI = async (params = {}) => {
  try {
    const res = await api.get('/products', { params });
    return res.data;
  } catch (err) {
    console.warn('[API Fallback]: Returning fallback mock products list');
    return {
      success: true,
      products: mockProducts,
      page: 1,
      pages: 1,
      total: mockProducts.length
    };
  }
};

export const fetchFeaturedProductsAPI = async () => {
  try {
    const res = await api.get('/products/featured');
    return res.data.products;
  } catch (err) {
    return mockProducts.filter((p) => p.isFeatured);
  }
};

export const fetchProductBySlugAPI = async (slug) => {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data;
  } catch (err) {
    const found = mockProducts.find((p) => p.slug === slug || p._id === slug) || mockProducts[0];
    return {
      success: true,
      product: found,
      relatedProducts: mockProducts.filter((p) => p._id !== found._id)
    };
  }
};

export const fetchCategoriesAPI = async () => {
  try {
    const res = await api.get('/categories');
    return res.data.categories;
  } catch (err) {
    return [
      { _id: 'cat_1', name: 'Botanical Skincare', slug: 'botanical-skincare', image: mockProducts[0].images[0] },
      { _id: 'cat_2', name: 'Herbal Hair Care', slug: 'herbal-hair-care', image: mockProducts[2].images[0] },
      { _id: 'cat_3', name: 'Artisanal Body Care', slug: 'artisanal-body-care', image: mockProducts[3].images[0] },
      { _id: 'cat_4', name: 'Aromatherapy & Wellness', slug: 'aromatherapy-wellness', image: mockProducts[1].images[0] }
    ];
  }
};
