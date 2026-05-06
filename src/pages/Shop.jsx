import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Star, Heart, ArrowLeft, Filter, Search, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn, ScaleIn } from '../components/AnimatedText';
import Magnetic from '../components/Magnetic';

const products = [
  {
    id: 1,
    name: 'Artisan Bamboo Water Bottle',
    category: 'Lifestyle',
    price: 45,
    rating: 4.8,
    reviews: 124,
    description: 'Hand-crafted from sustainable Kerala bamboo, treated with natural oils for durability and a smooth finish. Naturally antimicrobial and eco-friendly.',
    image: '/assets/shop/bamboo_products_boutique.png',
    tag: 'Best Seller',
  },
  {
    id: 2,
    name: 'Traditional Clay Mud Pot',
    category: 'Cookware',
    price: 65,
    rating: 4.9,
    reviews: 86,
    description: 'Ancient heritage cookware for authentic slow-cooking. Infuses your meals with essential minerals and deepens the flavor profiles of traditional recipes.',
    image: '/assets/shop/mud_pots_artisan.png',
    tag: 'Artisan Choice',
  },
  {
    id: 3,
    name: 'Heritage Coir Dress',
    category: 'Fashion',
    price: 185,
    rating: 5.0,
    reviews: 42,
    description: 'A masterpiece of sustainable fashion. Woven from high-quality coconut fiber and blended with organic cotton for a unique texture and exceptional comfort.',
    image: '/assets/shop/coir_dress_textiles.png',
    tag: 'Limited Edition',
  },
  {
    id: 4,
    name: 'Bamboo Kitchen Set',
    category: 'Lifestyle',
    price: 35,
    rating: 4.7,
    reviews: 156,
    description: 'Complete set of organic bamboo utensils. Lightweight, durable, and completely biodegradable.',
    image: '/assets/shop/bamboo_products_boutique.png',
    tag: 'New Arrival',
  },
  {
    id: 5,
    name: 'Earth-Pit Clay Tureen',
    category: 'Cookware',
    price: 120,
    rating: 4.9,
    reviews: 28,
    description: 'Large hand-sculpted clay tureen designed for communal dining. Maintains heat for hours using the natural insulation of high-grade river clay.',
    image: '/assets/shop/mud_pots_artisan.png',
    tag: 'Premium',
  },
  {
    id: 6,
    name: 'Organic Fiber Shawl',
    category: 'Fashion',
    price: 95,
    rating: 4.8,
    reviews: 64,
    description: 'Soft, breathable shawl woven from pineapple and coir fibers. A testament to Janani’s commitment to innovative sustainable textiles.',
    image: '/assets/shop/coir_dress_textiles.png',
    tag: 'Sustainable Luxury',
  },
];

const categories = ['All', 'Lifestyle', 'Cookware', 'Fashion'];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-earth-50 pt-24 md:pt-32 pb-20">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <FadeIn>
              <p className="text-label-gold mb-4">Boutique at Janani</p>
            </FadeIn>
            <div className="overflow-hidden mb-4">
              <motion.h1 
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest-900 leading-tight"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              >
                The <span className="italic text-forest-600 font-light">Artisan</span> Collection
              </motion.h1>
            </div>
            <FadeIn delay={0.2}>
              <p className="text-forest-600/70 text-lg leading-relaxed">
                Take a piece of the retreat’s essence home with you. Every item is slow-crafted 
                using sustainable materials and ancestral techniques.
              </p>
            </FadeIn>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 group-focus-within:text-forest-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white border border-earth-200 rounded-full text-sm text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-200 transition-all w-full md:w-64 shadow-elegant"
              />
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative w-12 h-12 bg-forest-800 text-white rounded-full flex items-center justify-center hover:bg-forest-900 transition-colors shadow-premium"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-earth-50">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories */}
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-forest-800 text-white shadow-premium'
                    : 'bg-white text-forest-600 hover:bg-earth-100 border border-earth-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group bg-white overflow-hidden shadow-elegant hover:shadow-premium transition-all duration-500"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-square overflow-hidden bg-earth-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Tags */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-forest-800 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                      {product.category}
                    </span>
                    {product.tag && (
                      <span className="px-3 py-1 bg-gold-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-forest-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    <Heart className="w-5 h-5" />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/60 to-transparent">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-white text-forest-900 py-3 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-forest-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl text-forest-900 group-hover:text-forest-700 transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-forest-900 font-serif text-xl">${product.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-gold-500 fill-gold-500' : 'text-earth-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-forest-400 ml-1">({product.reviews} reviews)</span>
                  </div>

                  <p className="text-forest-600/70 text-sm leading-relaxed mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <Link to={`/shop/${product.id}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-800 hover:text-forest-600 transition-colors group/link">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-forest-950/40 backdrop-blur-sm z-[60]"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-premium flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-earth-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-forest-800" />
                  <h2 className="font-serif text-2xl text-forest-900">Your Basket</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-earth-50 transition-colors">
                  <X className="w-5 h-5 text-forest-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-earth-50 rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag className="w-8 h-8 text-forest-200" />
                    </div>
                    <p className="text-forest-400 font-serif text-lg mb-2">Your basket is empty</p>
                    <p className="text-forest-300 text-sm max-w-[200px]">Looks like you haven't added any artisan pieces yet.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-earth-50 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-forest-900 font-medium text-sm truncate pr-4">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-forest-300 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-forest-400 text-xs mb-3">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-earth-50 px-3 py-1 rounded-full">
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-forest-400 hover:text-forest-800 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-forest-800 text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-forest-400 hover:text-forest-800 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-forest-900 font-medium">${item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 md:p-8 bg-earth-50/50 border-t border-earth-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-forest-600 font-medium">Subtotal</span>
                  <span className="text-forest-900 font-serif text-2xl">${cartTotal}</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  className="w-full bg-forest-800 text-white py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-forest-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-premium"
                >
                  Checkout
                </button>
                <p className="text-center text-forest-400 text-[10px] mt-4 uppercase tracking-widest">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
