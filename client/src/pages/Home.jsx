import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Heart, Star, Award, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import SEO from '../components/SEO';
import { fetchProductsAPI, fetchCategoriesAPI } from '../api/queries';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          fetchProductsAPI(),
          fetchCategoriesAPI()
        ]);
        setProducts(prodData.products || []);
        setCategories(catData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <>
      <SEO
        title="Luxury Clean Beauty & Bio-Active Remedies"
        description="Experience the pinnacle of clean luxury skincare, herbal scalps elixirs, and cold-pressed botanical oils."
      />

      {/* Auto-Scrolling Animated Hero Banner */}
      <HeroSlider />

      {/* Featured Categories Showcase */}
      <section className="py-24 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100 relative overflow-hidden">
        {/* Ambient Decorative Background Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/10 border border-emerald-800/20 text-xs font-semibold tracking-widest text-emerald-900 uppercase mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> Curated Botanical Remedies
            </span>
            <h2 className="font-playfair text-3xl sm:text-5xl font-extrabold text-stone-900 leading-tight">
              Shop By Skin & Hair Concern
            </h2>
            <p className="mt-4 text-stone-600 text-sm sm:text-base font-light max-w-xl mx-auto">
              Slow-infused cold-pressed elixirs & bio-active formulations tailored to nourish, restore, and illuminate every skin & hair type.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => {
              // Custom metadata for luxury badges & tags based on slug
              const categoryMeta = {
                'botanical-skincare': {
                  badge: '✨ Radiance & Glow',
                  tags: ['#GlowElixirs', '#AntiAging'],
                  fallbackImg: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800'
                },
                'herbal-hair-care': {
                  badge: '🌿 Root Therapy',
                  tags: ['#HairGrowth', '#ScalpCare'],
                  fallbackImg: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800'
                },
                'artisanal-body-care': {
                  badge: '🌸 Velvety Moisture',
                  tags: ['#BodyButter', '#DeepHydration'],
                  fallbackImg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
                },
                'aromatherapy-wellness': {
                  badge: '🕯️ Calming Rituals',
                  tags: ['#PureEssential', '#SoyCandle'],
                  fallbackImg: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
                }
              }[cat.slug] || {
                badge: '✨ Clean Luxury',
                tags: ['#Organic', '#BioActive'],
                fallbackImg: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800'
              };

              return (
                <motion.div
                  key={cat._id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="group relative flex flex-col justify-between h-[420px] rounded-3xl overflow-hidden bg-stone-900 border border-stone-200/80 shadow-md hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-500"
                  >
                    {/* Background Category Image with Fallback */}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = categoryMeta.fallbackImg;
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/20 group-hover:from-stone-950 group-hover:via-stone-950/60 transition-all duration-500" />

                    {/* Top Header Card Info */}
                    <div className="relative z-10 p-6 flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-wider text-amber-200 bg-stone-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/30 shadow-sm">
                        {categoryMeta.badge}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors duration-300">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                    {/* Bottom Content Container */}
                    <div className="relative z-10 p-6 text-white bg-stone-950/40 backdrop-blur-[2px] border-t border-white/10 group-hover:bg-stone-950/75 group-hover:border-amber-400/30 transition-all duration-300">
                      {/* Concern Tags */}
                      <div className="flex gap-2 mb-2">
                        {categoryMeta.tags.map((t, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-medium text-amber-300/90 tracking-wide">
                            {t}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-playfair text-2xl font-bold mb-2 group-hover:text-amber-300 transition-colors">
                        {cat.name}
                      </h3>

                      <p className="text-xs text-stone-300 line-clamp-2 mb-4 font-light leading-relaxed">
                        {cat.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider group-hover:text-amber-200">
                          Explore Collection
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-300 group-hover:translate-x-1 transition-transform duration-300">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Sellers Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-2 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Iconic Formulation
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-text">
                Best Selling Botanical Masterpieces
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-4 md:mt-0 text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 uppercase tracking-wider"
            >
              View Full Store &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story & Ethos Banner */}
      <section className="py-28 bg-emerald-950 text-white relative overflow-hidden">
        {/* Background Glowing Orbs & Glass Highlights */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-emerald-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-amber-400" /> Our Botanical Philosophy
              </div>

              <h2 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-stone-100">
                Rooted In <span className="text-amber-300 italic font-normal">Ancient Alchemy</span>, Refined By Modern Science
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl">
                We slow-cook our extractions over traditional brass cauldrons for 21 days, steeping wild Kashmiri saffron, pure Mysore sandalwood, and bio-active herbs into nutrient-dense elixirs that restore your skin&apos;s natural cellular vitality.
              </p>

              {/* 4 Feature Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-amber-400/40 transition-colors">
                  <span className="font-playfair text-3xl font-extrabold text-amber-300 block">100%</span>
                  <p className="text-[11px] text-stone-300 mt-1 font-light leading-tight">Cold-Pressed Bio-Actives</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-amber-400/40 transition-colors">
                  <span className="font-playfair text-3xl font-extrabold text-amber-300 block">21 Days</span>
                  <p className="text-[11px] text-stone-300 mt-1 font-light leading-tight">Authentic Slow Infusion</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-amber-400/40 transition-colors">
                  <span className="font-playfair text-3xl font-extrabold text-amber-300 block">0%</span>
                  <p className="text-[11px] text-stone-300 mt-1 font-light leading-tight">Parabens & Toxins</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-amber-400/40 transition-colors">
                  <span className="font-playfair text-3xl font-extrabold text-amber-300 block">100%</span>
                  <p className="text-[11px] text-stone-300 mt-1 font-light leading-tight">Cruelty-Free Clean</p>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-amber-300 hover:scale-105 transition-all duration-300 group"
                >
                  Discover Full Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Multi-Layer Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Outer Decorative Ring */}
                <div className="absolute -inset-4 rounded-[40px] border border-amber-400/20 pointer-events-none" />

                {/* Main Showcase Image */}
                <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/20 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000"
                    alt="Botanical Extraction Process"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
                </div>

                {/* Floating Glassmorphic Badge 1 - Top Right */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="absolute -top-6 -right-4 sm:-right-6 bg-stone-900/90 backdrop-blur-xl border border-amber-400/40 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white max-w-[200px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-200">21-Day Ritual</h4>
                    <p className="text-[10px] text-stone-300 font-light">Traditional Brass Cauldron Infusion</p>
                  </div>
                </motion.div>

                {/* Floating Glassmorphic Badge 2 - Bottom Left */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute -bottom-6 -left-4 sm:-left-6 bg-emerald-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white max-w-[220px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600/40 flex items-center justify-center text-emerald-200 shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Dermatologist Tested</h4>
                    <p className="text-[10px] text-emerald-100 font-light">Hypoallergenic & Bio-Active Certified</p>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Reviews & Press Praise */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="flex justify-center items-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="font-playfair text-3xl font-bold text-text">
              Loved By Skin Connoisseurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'The Golden Saffron Elixir completely transformed my stubborn dark spots in 3 weeks. It feels like absolute liquid gold on the skin!',
                author: 'Dr. Radhika Roy',
                role: 'Dermatology Consultant'
              },
              {
                quote: 'The Rose Dew Nectar smells heavenly and gives me an effortless glass-skin glow without feeling heavy under makeup.',
                author: 'Meera Kapoor',
                role: 'Beauty Editor, Vogue Luxe'
              },
              {
                quote: 'The Bhringraj scalp oil rescued my postpartum hair loss. Highest quality botanical oil I have ever used.',
                author: 'Ananya Sharma',
                role: 'Verified Purchaser'
              }
            ].map((rev, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-stone-600 italic leading-relaxed mb-6">
                  "{rev.quote}"
                </p>
                <div>
                  <h4 className="font-playfair text-sm font-bold text-text">{rev.author}</h4>
                  <span className="text-[11px] text-muted">{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
