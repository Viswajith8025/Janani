import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { teamMembers as staticTeamMembers } from '../data/team';
import { FadeIn, BlurIn, StaggerContainer, StaggerItem } from '../components/AnimatedText';
import { Shield, Award, Heart } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import { apiFetch } from '../config/api';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState(staticTeamMembers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await apiFetch('/team');
        if (res.data && res.data.length > 0) {
          setTeamMembers(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch team members, using fallback data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading && teamMembers.length === 0) {
    return (
      <div className="min-h-screen bg-earth-50 pt-32 pb-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-32 pb-20">
      <div className="container-luxury">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <FadeIn>
            <p className="text-label-gold mb-4">The Custodians of Wisdom</p>
          </FadeIn>
          <BlurIn>
            <h1 className="font-serif text-4xl md:text-6xl text-forest-900 mb-6">
              Meet Our <span className="italic text-forest-600 font-light">Practitioners</span>
            </h1>
          </BlurIn>
          <FadeIn delay={0.4}>
            <p className="text-forest-600/80 text-lg leading-relaxed">
              At Janani, healing is guided by masters of traditional arts. Each practitioner 
              carries a lineage of knowledge, dedicated to your personal transformation.
            </p>
          </FadeIn>
        </div>

        {/* Team Grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {teamMembers.map((member) => (
            <StaggerItem key={member.id || member._id}>
              <div className="group relative">
                <div className="grid sm:grid-cols-5 gap-8 items-center">
                  {/* Image Side */}
                  <div className="sm:col-span-2 relative aspect-[3/4] overflow-hidden bg-forest-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-forest-900/10 mix-blend-multiply" />
                  </div>

                  {/* Info Side */}
                  <div className="sm:col-span-3">
                    <div className="flex items-center gap-2 mb-2">
                       <Shield className="w-3.5 h-3.5 text-gold-600" />
                       <span className="text-label-gold !text-[10px]">{member.role}</span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-forest-900 mb-4">{member.name}</h2>
                    <p className="text-forest-600/80 text-sm leading-relaxed mb-6">
                      {member.bio}
                    </p>
                    
                    {member.specialties && member.specialties.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-forest-800 text-xs font-medium tracking-wider uppercase mb-3">Specialisms</p>
                        <div className="flex flex-wrap gap-2">
                          {member.specialties.map((spec) => (
                            <span key={spec} className="px-3 py-1 bg-white border border-forest-100 text-forest-600 text-[10px] tracking-wide uppercase">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Values Footer */}
        <div className="mt-24 pt-16 border-t border-forest-100">
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.2} direction="up" className="text-center md:text-left">
              <div className="w-12 h-12 bg-white shadow-elegant rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                <Heart className="w-6 h-6 text-forest-700" />
              </div>
              <h3 className="font-serif text-xl text-forest-900 mb-3">Compassionate Care</h3>
              <p className="text-forest-600/70 text-sm">Every treatment is delivered with deep empathy and personalized attention to your unique constitution.</p>
            </FadeIn>
            
            <FadeIn delay={0.4} direction="up" className="text-center md:text-left">
              <div className="w-12 h-12 bg-white shadow-elegant rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                <Award className="w-6 h-6 text-forest-700" />
              </div>
              <h3 className="font-serif text-xl text-forest-900 mb-3">Ancestral Mastery</h3>
              <p className="text-forest-600/70 text-sm">Our masters represent lifetimes of dedicated practice in traditional disciplines of healing.</p>
            </FadeIn>

            <FadeIn delay={0.6} direction="up" className="text-center md:text-left">
              <div className="w-12 h-12 bg-white shadow-elegant rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                <Shield className="w-6 h-6 text-forest-700" />
              </div>
              <h3 className="font-serif text-xl text-forest-900 mb-3">Authentic Lineage</h3>
              <p className="text-forest-600/70 text-sm">We preserve the purity of ancient wisdom while making it accessible for the modern traveler.</p>
            </FadeIn>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Magnetic>
            <motion.a
              href="/book"
              className="btn-premium rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Book a Consultation</span>
            </motion.a>
          </Magnetic>
        </div>
      </div>
    </div>
  );
};

export default Team;

