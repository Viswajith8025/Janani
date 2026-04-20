import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { blogPosts as staticBlogPosts } from '../data/blog';
import { FadeIn, BlurIn, StaggerContainer, StaggerItem } from '../components/AnimatedText';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import { apiFetch } from '../config/api';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState(staticBlogPosts);
  const [loading, setLoading] = useState(true);

  // Newsletter state
  const [subEmail, setSubEmail] = useState('');
  const [subState, setSubState] = useState('idle'); // idle|loading|success|duplicate|error

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiFetch('/blog');
        if (res.data && res.data.length > 0) {
          setBlogPosts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch blog posts, using fallback data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail || subState === 'loading') return;
    setSubState('loading');
    try {
      await apiFetch('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: subEmail }),
      });
      setSubState('success');
      setSubEmail('');
    } catch (err) {
      setSubState(err.status === 409 ? 'duplicate' : 'error');
    }
  };

  if (loading && blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-earth-50 pt-32 pb-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-earth-50 pt-32 pb-20">
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <FadeIn>
            <p className="text-label-gold mb-4">The Janani Journal</p>
          </FadeIn>
          <BlurIn>
            <h1 className="font-serif text-4xl md:text-6xl text-forest-900 mb-6">
              Lifestyle <span className="italic text-forest-600 font-light">Stories</span>
            </h1>
          </BlurIn>
          <FadeIn delay={0.4}>
            <p className="text-forest-600/80 text-lg leading-relaxed">
              Insights into the ancient wisdom of wellness, the serenity of nature, 
              and the transformative journey of the soul.
            </p>
          </FadeIn>
        </div>

        {/* Featured Post (Highlighted) */}
        {featuredPost && (
          <FadeIn delay={0.6} className="mb-20">
            <div className="group relative overflow-hidden bg-white shadow-elegant grid lg:grid-cols-2 gap-0">
              <div className="aspect-[16/9] lg:aspect-auto overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-forest-100 text-forest-700 text-[10px] font-medium tracking-widest uppercase">Featured</span>
                  <div className="flex items-center gap-1.5 text-forest-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-forest-900 mb-6 group-hover:text-forest-700 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-forest-600/80 mb-8 max-w-lg">
                  {featuredPost.excerpt}
                </p>
                <Magnetic strength={0.2}>
                  <button className="flex items-center gap-2 text-forest-800 font-medium tracking-wider uppercase text-sm group/btn">
                    Read Full Story
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </Magnetic>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Blog Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {otherPosts.map((post) => (
            <StaggerItem key={post.id || post._id}>
              <div className="group flex flex-col h-full bg-white shadow-elegant hover:shadow-premium transition-all duration-500 rounded-none overflow-hidden">
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-gold-600">
                      <Tag className="w-3 h-3" />
                      <span className="text-[10px] tracking-widest uppercase font-medium">{post.category}</span>
                    </div>
                    <span className="text-forest-400 text-[10px] uppercase tracking-wide">
                      {post.date || (post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '')}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-forest-900 mb-4 group-hover:text-forest-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-forest-600/70 text-sm mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                     <span className="text-forest-400 text-[10px] flex items-center gap-1">
                       <Clock className="w-3 h-3" /> {post.readTime}
                     </span>
                     <button className="text-forest-900 text-xs font-semibold tracking-wider uppercase group/link flex items-center gap-1">
                       Read More
                       <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                     </button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Newsletter / CTA */}
        <FadeIn delay={0.4} className="mt-24 bg-forest-900 p-12 md:p-20 text-center relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest-800/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Stay Connected to the Earth</h2>
            <p className="text-white/70 mb-10">Receive a seasonal curation of wellness wisdom, traditional recipes, and stories from the retreat directly in your inbox.</p>
            
            {subState === 'success' ? (
              <div className="bg-white/10 border border-white/20 p-6 backdrop-blur-sm">
                <p className="text-gold-400 font-medium">🌿 You're subscribed. Welcome to the Janani Journal!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <input 
                    type="email" 
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full bg-white/10 border border-white/20 px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors"
                    required
                  />
                  {subState === 'duplicate' && (
                    <p className="absolute top-full left-0 text-white/50 text-[10px] mt-1">Already subscribed.</p>
                  )}
                  {subState === 'error' && (
                    <p className="absolute top-full left-0 text-red-400 text-[10px] mt-1">Something went wrong.</p>
                  )}
                </div>
                <button 
                  disabled={subState === 'loading'}
                  className="px-10 py-4 bg-gold-500 text-white font-medium tracking-widest uppercase text-sm hover:bg-gold-600 transition-colors shrink-0 disabled:opacity-50"
                >
                  {subState === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Blog;

