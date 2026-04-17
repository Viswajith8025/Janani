import { motion } from 'framer-motion';

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      className="group h-full p-4 md:p-8 bg-white/5 border border-white/10 backdrop-blur-sm
                 hover:bg-white/10 hover:border-gold-500/30
                 transition-all duration-500 cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="w-10 h-10 md:w-14 md:h-14 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-3 md:mb-6
                      group-hover:bg-gold-500/20 group-hover:border-gold-500/30
                      transition-all duration-500"
      >
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold-400 group-hover:text-gold-300 transition-colors" />
      </div>

      <h3 className="font-serif text-base md:text-xl text-white mb-1 md:mb-3 group-hover:text-gold-200 transition-colors"
      >
        {feature.title}
      </h3>

      <p className="text-white/50 text-xs md:text-sm leading-relaxed"
      >
        {feature.description}
      </p>

      {/* Hover Line */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-gradient group-hover:w-full transition-all duration-700 ease-out-expo" />
    </motion.div>
  );
};

export default FeatureCard;
