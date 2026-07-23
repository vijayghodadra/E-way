import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { fetchProductBySlugAPI } from '../api/queries';

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductBySlugAPI(slug);
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-96 bg-stone-100 rounded-3xl mb-8" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-playfair text-2xl font-semibold mb-4">Product Not Found</h2>
        <Link to="/shop" className="bg-primary text-white text-xs px-6 py-3 rounded-2xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`${product.title} added to cart!`, { icon: '🌿' });
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    navigate('/checkout');
  };

  return (
    <>
      <SEO
        title={product.title}
        description={product.description}
        image={product.images?.[0]}
        schema={{
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: product.title,
          image: product.images,
          description: product.description,
          brand: { '@type': 'Brand', name: 'Élixir Botanicals' },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: displayPrice,
            availability: 'https://schema.org/InStock'
          }
        }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-secondary/60 py-3 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-stone-500 flex items-center gap-1.5">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-800 truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery View (Left) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm relative group">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-rose-500 shadow-md transition-all z-10"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === idx ? 'border-primary scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Purchasing (Right) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="champagne-badge text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 mb-3">
                <Sparkles className="w-3 h-3" /> {product.category?.name || 'Botanical Formula'}
              </span>

              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-text leading-tight mb-2">
                {product.title}
              </h1>

              {product.subtitle && (
                <p className="text-xs sm:text-sm text-stone-500 font-medium mb-4">{product.subtitle}</p>
              )}

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 text-xs mb-6">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-stone-400 font-normal">({product.numReviews || 128} reviews)</span>
                </div>
                <span className="text-stone-300">|</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                </span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-4 mb-6 p-4 rounded-2xl bg-secondary/80 border border-stone-200/80">
                <span className="font-playfair text-3xl font-bold text-primary">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                {product.discountPrice > 0 && (
                  <span className="text-base text-stone-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
                {product.volume && (
                  <span className="text-xs text-stone-600 font-semibold ml-auto">
                    Net Vol: {product.volume}
                  </span>
                )}
              </div>

              {/* Description & Ingredients Tabs */}
              <div className="space-y-4 border-t border-b border-stone-200 py-6">
                <div className="flex gap-6 border-b border-stone-200 text-xs font-semibold mb-4">
                  {['description', 'ingredients', 'benefits', 'how to use'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 capitalize transition-all ${
                        activeTab === tab ? 'border-b-2 border-primary text-primary font-bold' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-stone-600 leading-relaxed font-light min-h-[100px]">
                  {activeTab === 'description' && <p>{product.description}</p>}
                  {activeTab === 'ingredients' && (
                    <ul className="space-y-1.5">
                      {product.ingredients?.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {ing}
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === 'benefits' && (
                    <ul className="space-y-1.5">
                      {product.benefits?.map((ben, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-accent" /> {ben}
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === 'how to use' && <p>{product.howToUse}</p>}
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded-2xl bg-stone-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-stone-600 hover:text-primary"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-stone-600 hover:text-primary"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white text-sm font-semibold py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-luxury flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Bag
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-accent text-stone-950 text-sm font-semibold px-6 py-4 rounded-2xl hover:bg-accent-light transition-all shadow-gold"
                >
                  Buy Now
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-4 pt-4 text-center text-[11px] font-medium text-stone-500 border-t border-stone-100">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-primary" /> Free Express Delivery
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-primary" /> 100% Organically Certified
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-primary" /> 14-Day Returns
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-stone-200 pt-16">
            <h3 className="font-playfair text-2xl font-bold text-text mb-8">
              Complementary Botanical Rituals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd._id} product={relProd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
