const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eway_luxury_db';

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('[Seeder]: Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    await Order.deleteMany({});

    console.log('[Seeder]: Cleared existing database records.');

    // 1. Seed Categories
    const categoriesData = [
      {
        name: 'Botanical Skincare',
        slug: 'botanical-skincare',
        description: 'Pure bio-active serums, elixirs and cold-pressed facial oils crafted for luminous radiance.',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
        isFeatured: true
      },
      {
        name: 'Herbal Hair Care',
        slug: 'herbal-hair-care',
        description: 'Traditional Ayurvedic scalps oils, restorative mask remedies, and sulfate-free botanical cleansers.',
        image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800',
        isFeatured: true
      },
      {
        name: 'Artisanal Body Care',
        slug: 'artisanal-body-care',
        description: 'Velvety body butter blends, botanical polishers, and aromatic bathing elixirs.',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
        isFeatured: true
      },
      {
        name: 'Aromatherapy & Wellness',
        slug: 'aromatherapy-wellness',
        description: 'Pure hand-poured essential oils, ambient botanical candles, and calming ritual mists.',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
        isFeatured: true
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log(`[Seeder]: Created ${categories.length} Categories.`);

    const skincareCat = categories.find((c) => c.slug === 'botanical-skincare')._id;
    const haircareCat = categories.find((c) => c.slug === 'herbal-hair-care')._id;
    const bodycareCat = categories.find((c) => c.slug === 'artisanal-body-care')._id;
    const wellnessCat = categories.find((c) => c.slug === 'aromatherapy-wellness')._id;

    // 2. Seed Products
    const productsData = [
      {
        title: 'Golden Saffron Youth Radiance Elixir',
        slug: 'golden-saffron-youth-radiance-elixir',
        sku: 'SKU-ELX-001',
        subtitle: '100% Pure Kumkumadi Saffron Night Serum',
        brand: 'Élixir Botanicals',
        category: skincareCat,
        price: 3450,
        discountPrice: 2950,
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1608248597560-8438b4562c55?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'An ethereal cold-infused facial elixir harnessing Kashmiri Saffron threads, pure Sandalwood, and 26 ancient restorative herbs. Minimizes fine lines, enhances natural glow, and deeply nourishes skin overnight.',
        ingredients: ['Organic Kashmiri Saffron', 'Mysore Sandalwood Extract', 'Lotus Flower Seed Oil', 'Pure Vetiver', 'Cold-Pressed Sesame Oil'],
        benefits: ['Improves skin elasticity & firmness', 'Fades hyperpigmentation & dark spots', 'Restores natural golden radiance'],
        howToUse: 'Warm 3 to 4 drops between clean palms. Gently press onto cleansed face, neck, and décolletage before sleep using upward circular motions.',
        volume: '30ml / 1.0 fl oz',
        skinType: 'All Skin Types / Anti-Aging Focus',
        rating: 4.9,
        numReviews: 128,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        tags: ['serum', 'saffron', 'radiance', 'anti-aging', 'kumkumadi']
      },
      {
        title: 'Rose & Vetiver Dew Drops Moisture Nectar',
        slug: 'rose-vetiver-dew-drops-moisture-nectar',
        sku: 'SKU-ELX-002',
        subtitle: 'Hydrating Botanical Hydra-Gel Cream',
        brand: 'Élixir Botanicals',
        category: skincareCat,
        price: 2200,
        discountPrice: 1890,
        stock: 60,
        images: [
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'Light-as-air hydration powered by Kannauj Steam-Distilled Rose Petals, Hyaluronic Acid, and Wild Vetiver Root. Drenches dry cells in 48-hour moisture without heavy residue.',
        ingredients: ['Steam-Distilled Rose Hydrosol', 'Plant Hyaluronic Acid', 'Vetiver Extract', 'Centella Asiatica (Gotu Kola)', 'Niacinamide 5%'],
        benefits: ['Instant 48H plumping hydration', 'Calms redness & sensitivity', 'Restores skin moisture barrier'],
        howToUse: 'Smooth generously over cleansed face morning and evening. Perfect as a silky primer under sun protection or makeup.',
        volume: '50ml / 1.7 fl oz',
        skinType: 'Normal to Dry & Sensitive',
        rating: 4.8,
        numReviews: 94,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        tags: ['moisturizer', 'rose', 'hydrating', 'niacinamide']
      },
      {
        title: 'Kesh-Revitalize Bhringraj & Amla Hair Elixir',
        slug: 'kesh-revitalize-bhringraj-amla-hair-elixir',
        sku: 'SKU-ELX-003',
        subtitle: 'Intensive Scalp Strengthening & Growth Oil',
        brand: 'Élixir Botanicals',
        category: haircareCat,
        price: 1950,
        discountPrice: 1650,
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1608248597560-8438b4562c55?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'An authentic slow-cooked scalp elixir steeped with wild Bhringraj leaves, organic Amla berries, and Rosemary oil. Stimulates dormant hair follicles and combats premature graying.',
        ingredients: ['Fresh Bhringraj Herb', 'Wild Organic Amla', 'Cold-Pressed Virgin Coconut Oil', 'Rosemary Essential Oil', 'Brahmi Extract'],
        benefits: ['Reduces hair fall up to 85%', 'Boosts root circulation & hair density', 'Protects against environmental stress'],
        howToUse: 'Section scalp and massage warm oil into roots for 10 minutes. Leave overnight or for 2 hours before washing with our gentle shampoo.',
        volume: '100ml / 3.4 fl oz',
        skinType: 'All Hair & Scalp Types',
        rating: 4.9,
        numReviews: 210,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        tags: ['hair oil', 'bhringraj', 'scalp care', 'hair growth']
      },
      {
        title: 'Velvet Jasmine & Wild Almond Body Butter',
        slug: 'velvet-jasmine-wild-almond-body-butter',
        sku: 'SKU-ELX-004',
        subtitle: 'Rich Whipped Skin Nourishing Butter',
        brand: 'Élixir Botanicals',
        category: bodycareCat,
        price: 1800,
        discountPrice: 1550,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'Ultra-luxurious whipped body soufflé enriched with Raw Shea Butter, Sweet Almond Extract, and night-blooming Indian Jasmine flower extract.',
        ingredients: ['Raw Ghanaian Shea Butter', 'Press Sweet Almond Oil', 'Mogra Jasmine Distillate', 'Vitamin E (Tocopherol)'],
        benefits: ['Deeply hydrates dry parched skin', 'Leaves subtle velvety shimmer', 'Sensual jasmine floral scent'],
        howToUse: 'Apply liberally over damp body post-bath. Pay special attention to elbows, knees, and heels.',
        volume: '200g / 7.0 oz',
        skinType: 'Dry to Extra Dry Body Skin',
        rating: 4.7,
        numReviews: 76,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        tags: ['body butter', 'jasmine', 'nourishing']
      },
      {
        title: 'Sacred Frankincense & Lavender Candle Ritual',
        slug: 'sacred-frankincense-lavender-candle-ritual',
        sku: 'SKU-ELX-005',
        subtitle: '100% Hand-Poured Soy Wax Aromatherapy Candle',
        brand: 'Élixir Botanicals',
        category: wellnessCat,
        price: 2500,
        discountPrice: 2150,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'Elevate your space into a peaceful sanctuary. Hand-poured using pure soy wax, French Lavender essential oil, and Omani Frankincense resin.',
        ingredients: ['100% Eco Soy Wax', 'Pure Lavender Essential Oil', 'Sacred Frankincense Resin Oil', 'Unbleached Cotton Wick'],
        benefits: ['50+ Hours clean burn time', 'Promotes deep sleep & meditation', 'Soothes nervous tension'],
        howToUse: 'Trim wick to 1/4 inch before lighting. Allow wax pool to reach edges on initial burn.',
        volume: '300g / 10.5 oz',
        skinType: 'Home Wellness',
        rating: 4.9,
        numReviews: 43,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        tags: ['candle', 'aromatherapy', 'wellness', 'frankincense']
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log(`[Seeder]: Created ${products.length} Products.`);

    // 3. Seed Users (Admin & Customer)
    const adminUser = await User.create({
      name: 'Élixir Admin Master',
      email: 'admin@elixirbotanicals.com',
      password: 'Admin@123456',
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      addresses: [
        {
          fullName: 'Élixir Admin HQ',
          phone: '+91 98765 43210',
          street: '45 Lotus Botanical Boulevard, BKC',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400051',
          country: 'India',
          isDefault: true
        }
      ]
    });

    const demoUser = await User.create({
      name: 'Ananya Sharma',
      email: 'user@elixirbotanicals.com',
      password: 'User@123456',
      role: 'user',
      phone: '+91 98123 45678',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      addresses: [
        {
          fullName: 'Ananya Sharma',
          phone: '+91 98123 45678',
          street: 'Apartment 4B, Emerald Heights, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India',
          isDefault: true
        }
      ]
    });

    console.log('[Seeder]: Created Admin and Customer accounts.');

    // 4. Seed Coupons
    await Coupon.create([
      {
        code: 'LUXURY15',
        discountType: 'percentage',
        discountValue: 15,
        minimumPurchase: 2000,
        maxDiscount: 1000,
        expiryDate: new Date('2027-12-31'),
        usageLimit: 500,
        isActive: true
      },
      {
        code: 'WELCOME500',
        discountType: 'fixed',
        discountValue: 500,
        minimumPurchase: 2500,
        maxDiscount: 500,
        expiryDate: new Date('2027-12-31'),
        usageLimit: 1000,
        isActive: true
      }
    ]);

    console.log('[Seeder]: Created Coupons LUXURY15 & WELCOME500.');

    // 5. Seed Sample Reviews
    await Review.create([
      {
        product: products[0]._id,
        user: demoUser._id,
        userName: 'Ananya Sharma',
        userAvatar: demoUser.avatar,
        rating: 5,
        comment: 'This Golden Saffron serum is pure luxury in a glass bottle! My skin had an unbelievable lit-from-within radiance after just 3 days of use.'
      },
      {
        product: products[1]._id,
        user: demoUser._id,
        userName: 'Priya V.',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        rating: 5,
        comment: 'The rose dew moisture nectar smells heavenly like fresh steam-distilled roses. Extremely lightweight yet leaves skin plump all day long.'
      }
    ]);

    console.log('[Seeder]: Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
