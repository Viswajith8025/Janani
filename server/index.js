import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// ─── API Routes ─────────────────────────────────────────────────────────────

// Fallback Mock Data
const mockExperiences = [
  { id: 1, title: 'Mud Houses', description: 'Stay in eco-friendly clay cottages', longDescription: 'Immerse yourself in the primitive elegance of our hand-sculpted mud houses. Crafted using ancestral Kerala techniques, these dwellings breathe naturally with the earth, maintaining a perfect, cool sanctuary for restoration.', icon: 'Mountain', image: '/assets/experiences/mudhouse.png', cta: 'Explore More' },
  { id: 2, title: 'Yoga Center', description: 'Daily sessions for inner peace', longDescription: 'Our Yoga Shala is a temple of sacred geometry, situated where the forest breeze meets the morning sun. Guided by resident masters, you will embark on a journey of breath and spirit, aligning your physical form with the higher self.', icon: 'Sun', image: '/assets/experiences/yogacenter.png', cta: 'View Sessions' },
  { id: 3, title: 'Kalari Center', description: 'Ancient movement & strength training', longDescription: 'Step into the traditional earth-pit arena of Kalarippayattu, the world’s oldest martial art. Under the guidance of Gurukkals, you will learn the art of animal-postures and fluid strikes that build immense physical power and mental focus.', icon: 'Flame', image: '/assets/experiences/kalaricenter.png', cta: 'Learn the Art' },
  { id: 4, title: 'Music Therapy', description: 'Healing through sound & vibration', longDescription: 'Experience the cellular resonance of ancient frequencies in our dedicated Sound Sanctuary. Through the use of Tibetan singing bowls, traditional percussion, and Vedic chanting, we dissolve the energetic blockages held within the body.', icon: 'Wind', image: '/assets/experiences/musical.jpeg', cta: 'Experience Sound' },
  { id: 5, title: 'Ayurvedic Therapy', description: 'Traditional holistic healing', longDescription: 'Journey through the 5,000-year-old science of life with our master physicians. Each treatment is an alchemical blend of organic medicinal oils and hand-picked herbs, tailored precisely to your unique Dosha.', icon: 'Droplets', image: '/assets/experiences/ayurvediccenter.png', cta: 'Consult Doctor' },
  { id: 6, title: 'Mud Bath & Detox', description: 'Natural cleansing & rejuvenation', longDescription: 'Surrender to the primitive healing power of the earth with our ancestral mud rituals. Using mineral-rich clay sourced from traditional Kerala pits, this therapy detoxifies the skin and grounds the spirit.', icon: 'Leaf', image: '/assets/experiences/mudbath.png', cta: 'Start Detox' },
  { id: 7, title: 'Library', description: 'Grow your Knowledge', longDescription: 'A quiet sanctuary of wisdom nestled within the forest canopy. Our library houses a curated collection of ancient Vedic manuscripts, traditional wellness scrolls, and modern holistic literature.', icon: 'Heart', image: '/assets/experiences/library.jpeg', cta: 'Browse Wisdom' },
  { id: 8, title: 'Spiritual Center', description: 'Gather for talks & gatherings', longDescription: 'A sacred space for collective awakening. The Spiritual Center hosts morning chants, evening philosophy talks, and silent meditation circles. It is the heart of Janani’s community.', icon: 'Heart', image: '/assets/experiences/spiritualcenter.jpeg', cta: 'Join Circle' },
  { id: 9, title: 'Stage', description: 'Cultural performances & events', longDescription: 'Experience the living heritage of Kerala under the velvet sky. Our open-air stage hosts classical dance such as Kathakali and Mohiniyattam, as well as traditional musical ensembles.', icon: 'Heart', image: '/assets/experiences/stage.jpeg', cta: 'Watch Culture' },
  { id: 10, title: 'Business Centre', description: 'Shop our products', longDescription: 'An artisan boutique showcasing the slow-crafted products of Janani’s organic gardens. From hand-pressed oils and medicinal tinctures to traditional textiles and hand-sculpted pottery.', icon: 'Heart', image: '/assets/experiences/bussinesscenter.jpeg', cta: 'Visit Boutique' },
  { id: 11, title: 'Pools & Meditation Zones', description: 'Immerse in calm waters', longDescription: 'Discover hidden springs of tranquility scattered throughout our forest grounds. Our meditation pools are fed by natural mountain water, offering a sanctuary for silent contemplation and water therapy.', icon: 'Moon', image: '/assets/experiences/pool.jpeg', cta: 'Find Stillness' },
];

const mockGallery = [
  { id: 1, src: '/assets/experiences/pool.jpeg', alt: 'Janani Lifestyle retreat entrance at golden hour', span: 'col-span-2 row-span-2' },
  { id: 2, src: '/assets/experiences/mudhouse.png', alt: 'Traditional mud house accommodation', span: 'col-span-1 row-span-1' },
  { id: 3, src: '/assets/experiences/ayurvediccenter.png', alt: 'Ayurvedic treatment session', span: 'col-span-1 row-span-1' },
  { id: 4, src: '/assets/experiences/yogacenter.png', alt: 'Yoga session in open-air shala', span: 'col-span-1 row-span-2' },
  { id: 5, src: '/assets/about/about.jpg', alt: 'Aerial view of the retreat in Wayanad', span: 'col-span-1 row-span-1' },
  { id: 6, src: '/assets/hero/hero-bg.png', alt: 'Resort gardens at dusk', span: 'col-span-1 row-span-1' },
];

const mockTestimonials = [
  { id: 1, name: 'Priya Sharma', location: 'Mumbai, India', quote: 'Janani was a life-changing experience. The mud houses, the Ayurvedic treatments, the silence of the forest — everything came together to create a retreat I will never forget.', rating: 5, initials: 'PS', stay: '7-Day Detox Retreat' },
  { id: 2, name: 'Michael Chen', location: 'Singapore', quote: 'As someone who has visited wellness retreats across Southeast Asia, Janani stands out for its authenticity. The Kalarippayattu sessions and sound healing baths were unlike anything I have experienced before.', rating: 5, initials: 'MC', stay: '5-Day Wellness Escape' },
  { id: 3, name: 'Sarah Williams', location: 'London, UK', quote: 'The team at Janani truly understands holistic wellness. From the organic meals sourced from their gardens to the sunrise yoga overlooking the mountains.', rating: 5, initials: 'SW', stay: '10-Day Transformation' },
  { id: 4, name: 'Rahul Menon', location: 'Chennai, India', quote: 'I came for the Ayurveda treatments and stayed for the peace. The practitioners here have deep knowledge and genuine care. My chronic back pain reduced significantly.', rating: 5, initials: 'RM', stay: '14-Day Ayurveda Program' },
  { id: 5, name: 'Emma Laurent', location: 'Paris, France', quote: 'Wayanad is magical, and Janani is its crown jewel. The nature walks through the spice plantations, the cooking classes, the meditation under ancient trees.', rating: 5, initials: 'EL', stay: '7-Day Nature Immersion' },
  { id: 6, name: 'David Nakamura', location: 'Tokyo, Japan', quote: 'The perfect balance of structure and freedom. Morning yoga, afternoon treatments, evening meditation — yet I always felt I could simply sit and listen to the forest.', rating: 5, initials: 'DN', stay: '5-Day Silent Retreat' },
];

app.get('/api/v1/experiences', (req, res) => {
  res.json({ success: true, data: mockExperiences });
});

app.get('/api/v1/gallery', (req, res) => {
  res.json({ success: true, data: mockGallery });
});

app.get('/api/v1/testimonial', (req, res) => {
  res.json({ success: true, data: mockTestimonials });
});

app.post('/api/v1/booking', (req, res) => {
  const bookingRef = `JAN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  res.json({ success: true, message: 'Booking request received', data: { bookingRef } });
});

app.post('/api/v1/payment/order', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      orderId: 'order_mock_' + Date.now(),
      amount: 1000,
      currency: 'USD',
      keyId: 'rzp_test_mock',
      description: 'Retreat Booking'
    } 
  });
});

app.post('/api/v1/payment/verify', (req, res) => {
  res.json({ success: true, message: 'Payment verified' });
});

app.get('/api/v1/team', (req, res) => {
  res.json({ success: true, data: [
    { _id: '1', name: 'Dr. Arjun Nair', role: 'Founder & Director', image: '/assets/team/founder.jpg', bio: 'Visionary leader with 20+ years in holistic wellness and Ayurvedic medicine.' },
    { _id: '2', name: 'Priya Menon', role: 'Head of Yoga & Meditation', image: '/assets/team/yoga.jpg', bio: 'Certified yoga master specializing in traditional Hatha and restorative practices.' },
    { _id: '3', name: 'Rajan Pillai', role: 'Kalari Gurukal', image: '/assets/team/kalari.jpg', bio: 'Third-generation Kalarippayattu master preserving Kerala\'s ancient martial art.' },
    { _id: '4', name: 'Dr. Lakshmi Das', role: 'Chief Ayurvedic Physician', image: '/assets/team/ayurveda.jpg', bio: 'Expert in Panchakarma therapy with deep knowledge of traditional herbal formulations.' },
  ]});
});

app.get('/api/v1/blog', (req, res) => {
  res.json({ success: true, data: [
    { _id: '1', title: 'The Ancient Science of Mud Houses', excerpt: 'Discover how clay architecture naturally regulates temperature and promotes wellness.', image: '/assets/gallery/img1.jpg', date: '2026-04-15', author: 'Dr. Arjun Nair' },
    { _id: '2', title: 'Kalarippayattu: More Than Martial Arts', excerpt: 'How Kerala\'s oldest martial art heals the body and sharpens the mind.', image: '/assets/gallery/img2.jpg', date: '2026-04-20', author: 'Rajan Pillai' },
    { _id: '3', title: 'Forest Bathing at Janani', excerpt: 'The science behind Shinrin-yoku and why our forest trails are designed for healing.', image: '/assets/gallery/img3.jpg', date: '2026-05-01', author: 'Priya Menon' },
  ]});
});

// ─── Uploads directory ──────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── Multer config ──────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `id-proof-${uniqueSuffix}${ext}`);
  },
});

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const fileFilter = (_req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPG, PNG, WebP, and PDF are allowed.'),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// ─── Route: Upload ID Proof ─────────────────────────────────────────────────
app.post('/api/upload-id', upload.single('idProof'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  // Optionally log booking metadata alongside file
  const { idType, guestName } = req.body;
  console.log(`✅ ID uploaded | Guest: ${guestName} | Type: ${idType} | File: ${req.file.filename}`);

  return res.status(200).json({
    success: true,
    message: 'ID proof uploaded successfully.',
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
    idType,
  });
});

// ─── Error handler ───────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5 MB.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🌿 Janani Upload Server running at http://localhost:${PORT}`);
});
