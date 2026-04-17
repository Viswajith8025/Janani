import { motion } from 'framer-motion';

const AnimatedText = ({
  text,
  className = '',
  delay = 0,
  type = 'words', // 'words', 'chars', 'lines'
  once = true,
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.19, 1, 0.22, 1],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const splitText = () => {
    if (type === 'words') {
      return text.split(' ');
    }
    return text.split('');
  };

  const items = splitText();

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={variants}
          className="inline-block"
          style={{ marginRight: type === 'words' ? '0.25em' : '0' }}
        >
          {item === ' ' ? '\u00A0' : item}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const FadeIn = ({
  children,
  delay = 0,
  duration = 1,
  direction = 'up',
  className = '',
  once = true,
}) => {
  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({
  children,
  delay = 0,
  className = '',
  once = true,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once, amount: 0.2 }}
    transition={{
      duration: 1,
      delay,
      ease: [0.19, 1, 0.22, 1],
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({
  children,
  className = '',
  staggerDelay = 0.1,
  delay = 0,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className = '',
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.19, 1, 0.22, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

export const ParallaxImage = ({
  children,
  className = '',
  speed = 0.5,
}) => (
  <motion.div
    className={className}
    initial={{ y: 0 }}
    whileInView={{ y: -50 * speed }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{
      duration: 1,
      ease: 'linear',
    }}
  >
    {children}
  </motion.div>
);

export const BlurIn = ({
  children,
  delay = 0,
  duration = 1.2,
  className = '',
  once = true,
}) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
    whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    viewport={{ once, amount: 0.2 }}
    transition={{
      duration,
      delay,
      ease: [0.19, 1, 0.22, 1],
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SplitReveal = ({
  children,
  delay = 0,
  className = '',
  once = true,
}) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div
      initial={{ y: '100%' }}
      whileInView={{ y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </motion.div>
  </div>
);

export default AnimatedText;
