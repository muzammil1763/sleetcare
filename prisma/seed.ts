import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Real Unsplash images — women's fashion / unstitched suits
const IMAGES = {
  lawn1:    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
  lawn2:    'https://images.unsplash.com/photo-1594938298603-c8148c4b4f7b?w=800&q=80',
  lawn3:    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
  chiffon1: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80',
  chiffon2: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80',
  khaddar1: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  khaddar2: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
  silk1:    'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b4b4?w=800&q=80',
  silk2:    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  linen1:   'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
  organza1: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
  organza2: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
};

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Cleaning existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.engineeringService.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.homeStats.deleteMany();
  await prisma.slaStats.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();
  // Clear vlogs
  try { await (prisma as any).vlog.deleteMany(); } catch {}

  // 1. Admin User
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@majestic.com',
      password: hashedPassword,
      role: 'Admin',
      status: 'Active',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // 2. Categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Lawn',    description: 'Lightweight summer lawn suits — breathable and vibrant' } }),
    prisma.category.create({ data: { name: 'Chiffon', description: 'Sheer and graceful chiffon suits for formal occasions' } }),
    prisma.category.create({ data: { name: 'Khaddar', description: 'Warm and textured khaddar suits for winter' } }),
    prisma.category.create({ data: { name: 'Silk',    description: 'Luxurious silk suits for weddings and grand occasions' } }),
    prisma.category.create({ data: { name: 'Linen',   description: 'Crisp and elegant linen suits for all seasons' } }),
    prisma.category.create({ data: { name: 'Organza', description: 'Delicate organza suits with intricate embroidery' } }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // 3. Products with Unsplash images
  console.log('👗 Creating products...');
  const products = await Promise.all([

    // ── LAWN ──
    prisma.product.create({
      data: {
        name: 'Gulbahar Embroidered Lawn Suit',
        category: 'Lawn',
        price: 4850,
        stock: 35,
        image: IMAGES.lawn1,
        images: [IMAGES.lawn2, IMAGES.lawn3],
        shortDesc: '3-piece embroidered lawn with chiffon dupatta',
        description: 'A stunning 3-piece lawn suit featuring delicate floral embroidery on the shirt front and sleeves. Paired with a printed lawn trouser and a beautifully embroidered chiffon dupatta. Perfect for summer gatherings and casual outings.',
        fabric: 'Lawn',
        pieces: 3,
        embroidery: 'Embroidered',
        occasion: 'Casual',
        season: 'Summer',
        color: 'Dusty Rose',
        specs: [
          { label: 'Fabric',     value: '100% Pure Lawn' },
          { label: 'Pieces',     value: '3 (Shirt + Trouser + Dupatta)' },
          { label: 'Embroidery', value: 'Front & Sleeves Embroidered' },
          { label: 'Dupatta',    value: 'Embroidered Chiffon' },
          { label: 'Occasion',   value: 'Casual / Day Wear' },
          { label: 'Season',     value: 'Summer' },
        ],
        icon: 'Package',
        active: true,
        order: 1,
        videoUrl: 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bahar-e-Naz Digital Print Lawn',
        category: 'Lawn',
        price: 3250,
        stock: 50,
        image: IMAGES.lawn2,
        images: [IMAGES.lawn1],
        shortDesc: '3-piece digital printed lawn suit',
        description: 'Vibrant digital printed lawn suit with an all-over floral pattern. The shirt features a bold print with contrast borders, paired with a printed trouser and a soft cotton dupatta. Ideal for everyday elegance.',
        fabric: 'Lawn',
        pieces: 3,
        embroidery: 'Printed',
        occasion: 'Casual',
        season: 'Summer',
        color: 'Teal & Gold',
        specs: [
          { label: 'Fabric',     value: 'Premium Lawn' },
          { label: 'Pieces',     value: '3 (Shirt + Trouser + Dupatta)' },
          { label: 'Print',      value: 'Digital Reactive Print' },
          { label: 'Dupatta',    value: 'Printed Cotton Voile' },
          { label: 'Occasion',   value: 'Casual / Office Wear' },
          { label: 'Season',     value: 'Summer' },
        ],
        icon: 'Package',
        active: true,
        order: 2,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Roshni Embroidered Lawn 2-Piece',
        category: 'Lawn',
        price: 2950,
        stock: 42,
        image: IMAGES.lawn3,
        images: [],
        shortDesc: '2-piece embroidered lawn shirt with trouser',
        description: 'A chic 2-piece lawn suit with a beautifully embroidered neckline and hem. The shirt is crafted from premium lawn fabric with a subtle texture, paired with a plain dyed trouser for a clean, modern look.',
        fabric: 'Lawn',
        pieces: 2,
        embroidery: 'Embroidered',
        occasion: 'Casual',
        season: 'Summer',
        color: 'Ivory White',
        specs: [
          { label: 'Fabric',     value: 'Premium Lawn' },
          { label: 'Pieces',     value: '2 (Shirt + Trouser)' },
          { label: 'Embroidery', value: 'Neckline & Hem Embroidered' },
          { label: 'Occasion',   value: 'Casual / Office Wear' },
          { label: 'Season',     value: 'Summer' },
        ],
        icon: 'Package',
        active: true,
        order: 3,
      },
    }),

    // ── CHIFFON ──
    prisma.product.create({
      data: {
        name: 'Shaam-e-Noor Heavy Embroidered Chiffon',
        category: 'Chiffon',
        price: 12500,
        stock: 18,
        image: IMAGES.chiffon1,
        images: [IMAGES.chiffon2],
        shortDesc: '3-piece heavy embroidered chiffon suit',
        description: 'An exquisite 3-piece chiffon suit adorned with heavy thread and zari embroidery across the shirt. The intricate floral motifs are complemented by a raw silk trouser and a heavily embroidered chiffon dupatta with four-sided border. Perfect for formal dinners and evening events.',
        fabric: 'Chiffon',
        pieces: 3,
        embroidery: 'Heavy Embroidered',
        occasion: 'Formal',
        season: 'All Season',
        color: 'Midnight Blue',
        specs: [
          { label: 'Fabric',     value: 'Premium Chiffon' },
          { label: 'Pieces',     value: '3 (Shirt + Trouser + Dupatta)' },
          { label: 'Embroidery', value: 'Heavy Thread & Zari Work' },
          { label: 'Trouser',    value: 'Raw Silk' },
          { label: 'Dupatta',    value: 'Embroidered Chiffon with 4-Side Border' },
          { label: 'Occasion',   value: 'Formal / Evening Wear' },
        ],
        icon: 'Package',
        active: true,
        order: 4,
        videoUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Noor-e-Jahan Printed Chiffon',
        category: 'Chiffon',
        price: 6800,
        stock: 28,
        image: IMAGES.chiffon2,
        images: [IMAGES.chiffon1],
        shortDesc: '3-piece printed chiffon with embroidered neckline',
        description: 'Graceful printed chiffon suit featuring an all-over floral print with a hand-embroidered neckline. The flowing chiffon fabric drapes beautifully, making it ideal for formal gatherings and parties.',
        fabric: 'Chiffon',
        pieces: 3,
        embroidery: 'Printed with Embroidered Neckline',
        occasion: 'Party Wear',
        season: 'All Season',
        color: 'Blush Pink',
        specs: [
          { label: 'Fabric',     value: 'Chiffon' },
          { label: 'Pieces',     value: '3 (Shirt + Trouser + Dupatta)' },
          { label: 'Print',      value: 'All-Over Floral Print' },
          { label: 'Embroidery', value: 'Hand-Embroidered Neckline' },
          { label: 'Occasion',   value: 'Party Wear / Formal' },
        ],
        icon: 'Package',
        active: true,
        order: 5,
      },
    }),

    // ── KHADDAR ──
    prisma.product.create({
      data: {
        name: 'Sard Mausam Embroidered Khaddar',
        category: 'Khaddar',
        price: 5500,
        stock: 30,
        image: IMAGES.khaddar1,
        images: [IMAGES.khaddar2],
        shortDesc: '3-piece embroidered khaddar winter suit',
        description: 'Stay warm and stylish with this beautifully embroidered khaddar suit. The thick, textured fabric is perfect for cold winters, featuring intricate embroidery on the shirt front and sleeves. Paired with a plain khaddar trouser and a warm wool shawl.',
        fabric: 'Khaddar',
        pieces: 3,
        embroidery: 'Embroidered',
        occasion: 'Casual',
        season: 'Winter',
        color: 'Warm Camel',
        specs: [
          { label: 'Fabric',     value: 'Premium Khaddar' },
          { label: 'Pieces',     value: '3 (Shirt + Trouser + Shawl)' },
          { label: 'Embroidery', value: 'Front & Sleeves Embroidered' },
          { label: 'Shawl',      value: 'Wool Blend' },
          { label: 'Occasion',   value: 'Casual / Winter Wear' },
          { label: 'Season',     value: 'Winter' },
        ],
        icon: 'Package',
        active: true,
        order: 6,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Khushbu-e-Khaddar Printed Suit',
        category: 'Khaddar',
        price: 3800,
        stock: 40,
        image: IMAGES.khaddar2,
        images: [],
        shortDesc: '2-piece printed khaddar suit',
        description: 'A cozy 2-piece khaddar suit with a bold geometric print. The thick khaddar fabric provides warmth while the modern print keeps the look fresh and contemporary. Perfect for winter office wear.',
        fabric: 'Khaddar',
        pieces: 2,
        embroidery: 'Printed',
        occasion: 'Casual',
        season: 'Winter',
        color: 'Forest Green',
        specs: [
          { label: 'Fabric',     value: 'Khaddar' },
          { label: 'Pieces',     value: '2 (Shirt + Trouser)' },
          { label: 'Print',      value: 'Geometric Block Print' },
          { label: 'Occasion',   value: 'Casual / Office Wear' },
          { label: 'Season',     value: 'Winter' },
        ],
        icon: 'Package',
        active: true,
        order: 7,
      },
    }),

    // ── SILK ──
    prisma.product.create({
      data: {
        name: 'Majestic Bridal Silk Suit',
        category: 'Silk',
        price: 28500,
        stock: 10,
        image: IMAGES.silk1,
        images: [IMAGES.silk2],
        shortDesc: '3-piece luxury bridal silk with heavy embroidery',
        description: 'The epitome of luxury — this bridal silk suit features the finest pure silk fabric adorned with intricate zardozi and resham embroidery. The heavily embroidered shirt is paired with a silk trouser and a stunning embroidered silk dupatta with kiran border.',
        fabric: 'Silk',
        pieces: 3,
        embroidery: 'Zardozi & Resham',
        occasion: 'Bridal',
        season: 'All Season',
        color: 'Ivory & Gold',
        specs: [
          { label: 'Fabric',     value: 'Pure Silk' },
          { label: 'Pieces',     value: '3 (Shirt + Trouser + Dupatta)' },
          { label: 'Embroidery', value: 'Zardozi, Resham & Dabka Work' },
          { label: 'Dupatta',    value: 'Silk with Kiran Border' },
          { label: 'Occasion',   value: 'Bridal / Wedding' },
          { label: 'Finishing',  value: 'Hand-Crafted' },
        ],
        icon: 'Package',
        active: true,
        order: 8,
        videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Raat Ki Rani Silk Party Suit',
        category: 'Silk',
        price: 16500,
        stock: 15,
        image: IMAGES.silk2,
        images: [IMAGES.silk1],
        shortDesc: '3-piece embroidered silk suit for parties',
        description: 'Dazzle at every party with this stunning embroidered silk suit. The rich silk fabric catches the light beautifully, while the intricate thread embroidery adds a touch of opulence. Paired with a silk trouser and a sheer organza dupatta.',
        fabric: 'Silk',
        pieces: 3,
        embroidery: 'Thread Embroidered',
        occasion: 'Party Wear',
        season: 'All Season',
        color: 'Deep Burgundy',
        specs: [
          { label: 'Fabric',     value: 'Premium Silk' },
          { label: 'Pieces',     value: '3 (Shirt + Trouser + Dupatta)' },
          { label: 'Embroidery', value: 'Thread & Sequin Work' },
          { label: 'Dupatta',    value: 'Organza with Embroidered Border' },
          { label: 'Occasion',   value: 'Party Wear / Formal' },
        ],
        icon: 'Package',
        active: true,
        order: 9,
      },
    }),

    // ── LINEN ──
    prisma.product.create({
      data: {
        name: 'Sada Bahar Linen Suit',
        category: 'Linen',
        price: 4200,
        stock: 38,
        image: IMAGES.linen1,
        images: [],
        shortDesc: '3-piece embroidered linen suit — all season',
        description: 'Crisp and elegant, this linen suit is perfect for all seasons. The natural linen fabric is breathable in summer and warm enough for mild winters. Features a subtle embroidered neckline and cuffs, paired with a plain linen trouser and a cotton dupatta.',
        fabric: 'Linen',
        pieces: 3,
        embroidery: 'Embroidered',
        occasion: 'Casual',
        season: 'All Season',
        color: 'Natural Beige',
        specs: [
          { label: 'Fabric',     value: 'Premium Linen' },
          { label: 'Pieces',     value: '3 (Shirt + Trouser + Dupatta)' },
          { label: 'Embroidery', value: 'Neckline & Cuffs Embroidered' },
          { label: 'Occasion',   value: 'Casual / Office Wear' },
          { label: 'Season',     value: 'All Season' },
        ],
        icon: 'Package',
        active: true,
        order: 10,
      },
    }),

    // ── ORGANZA ──
    prisma.product.create({
      data: {
        name: 'Sitara Organza Formal Suit',
        category: 'Organza',
        price: 18500,
        stock: 12,
        image: IMAGES.organza1,
        images: [IMAGES.organza2],
        shortDesc: '3-piece heavy embroidered organza suit',
        description: 'A breathtaking organza suit featuring heavy floral embroidery with sequins and pearls. The delicate organza fabric creates a dreamy, ethereal look perfect for weddings and formal events.',
        fabric: 'Organza',
        pieces: 3,
        embroidery: 'Heavy Embroidered with Sequins & Pearls',
        occasion: 'Formal',
        season: 'All Season',
        color: 'Champagne',
        specs: [
          { label: 'Fabric',     value: 'Premium Organza' },
          { label: 'Pieces',     value: '3 (Shirt + Trouser + Dupatta)' },
          { label: 'Embroidery', value: 'Floral with Sequins & Pearls' },
          { label: 'Trouser',    value: 'Raw Silk' },
          { label: 'Dupatta',    value: 'Embroidered Organza' },
          { label: 'Occasion',   value: 'Wedding / Formal Events' },
        ],
        icon: 'Package',
        active: true,
        order: 11,
        videoUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Noor-e-Subah Organza 2-Piece',
        category: 'Organza',
        price: 9800,
        stock: 20,
        image: IMAGES.organza2,
        images: [IMAGES.organza1],
        shortDesc: '2-piece embroidered organza shirt with trouser',
        description: 'Elegant 2-piece organza suit with a beautifully embroidered shirt featuring delicate floral motifs. The sheer organza fabric is layered over a silk lining for comfort and modesty.',
        fabric: 'Organza',
        pieces: 2,
        embroidery: 'Embroidered',
        occasion: 'Party Wear',
        season: 'All Season',
        color: 'Sage Green',
        specs: [
          { label: 'Fabric',     value: 'Organza over Silk Lining' },
          { label: 'Pieces',     value: '2 (Shirt + Trouser)' },
          { label: 'Embroidery', value: 'Delicate Floral Motifs' },
          { label: 'Trouser',    value: 'Plain Silk' },
          { label: 'Occasion',   value: 'Party Wear / Semi-Formal' },
        ],
        icon: 'Package',
        active: true,
        order: 12,
      },
    }),
  ]);
  console.log('✅ Products created:', products.length);

  // 4. Social Links
  console.log('🔗 Creating social links...');
  await Promise.all([
    prisma.socialLink.create({ data: { platform: 'Facebook',  url: 'https://www.facebook.com/Sleetcare',  icon: 'Facebook',  label: 'Follow on Facebook',  active: true, order: 1 } }),
    prisma.socialLink.create({ data: { platform: 'Instagram', url: 'https://www.instagram.com/sleetcare', icon: 'Instagram', label: 'Follow on Instagram', active: true, order: 2 } }),
  ]);
  console.log('✅ Social links created');

  // 5. Home Stats
  console.log('📊 Creating home stats...');
  await Promise.all([
    prisma.homeStats.create({ data: { key: 'happy_customers',   value: '10,000+',  label: 'Happy Customers',  icon: 'Users'   } }),
    prisma.homeStats.create({ data: { key: 'products_sold',     value: '25,000+',  label: 'Suits Sold',       icon: 'Package' } }),
    prisma.homeStats.create({ data: { key: 'satisfaction_rate', value: '98%',      label: 'Satisfaction Rate',icon: 'Star'    } }),
    prisma.homeStats.create({ data: { key: 'delivery_time',     value: '2–4 Days', label: 'Average Delivery', icon: 'Truck'   } }),
  ]);
  console.log('✅ Home stats created');

  // 6. Site Settings
  console.log('⚙️  Creating site settings...');
  await prisma.siteSettings.createMany({
    data: [
      { key: 'contact_email',    value: 'hello@sleetcare.com' },
      { key: 'contact_phone',    value: '+92 300 8662833' },
      { key: 'contact_whatsapp', value: '923008662833' },
      { key: 'contact_address',  value: 'Faisalabad, Punjab, Pakistan' },
      { key: 'company_tagline',  value: 'Clean beauty. Conscious choices. Confidence, naturally.' },
    ],
  });
  console.log('✅ Site settings created');

  // 7. Vlogs
  console.log('🎬 Creating vlogs...');
  await Promise.all([
    prisma.vlog.create({
      data: {
        title: 'Summer Lawn Collection 2025 — Unboxing & Styling',
        description: 'Join us as we unbox our brand new Summer Lawn Collection 2025. Watch how our team styles each suit and get inspired for your next look. Featuring embroidered lawn, digital prints, and chiffon dupattas.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
        active: true,
        order: 1,
      },
    }),
    prisma.vlog.create({
      data: {
        title: 'Behind the Scenes — How Our Embroidery is Made',
        description: 'Take an exclusive look inside our embroidery studio. From hand-drawn motifs to the final stitch, discover the craftsmanship that goes into every Majestic suit. A true labour of love.',
        videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        thumbnail: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80',
        active: true,
        order: 2,
      },
    }),
    prisma.vlog.create({
      data: {
        title: 'Winter Khaddar & Silk — New Arrivals Lookbook',
        description: 'Our winter collection is here! Watch our full lookbook featuring warm khaddar suits, luxurious silk formals, and cozy linen casuals. Perfect for the season ahead.',
        videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        active: true,
        order: 3,
      },
    }),
    prisma.vlog.create({
      data: {
        title: 'How to Style an Unstitched Suit — 5 Ways',
        description: 'Not sure how to get your unstitched suit stitched? Our fashion expert shares 5 different silhouettes and styling ideas — from classic straight cut to modern A-line and palazzo.',
        videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        active: true,
        order: 4,
      },
    }),
    prisma.vlog.create({
      data: {
        title: 'Bridal Silk Collection — Wedding Season Special',
        description: 'Wedding season is here and we have the most stunning bridal silk suits for you. Watch our special bridal lookbook featuring zardozi work, resham embroidery, and pure silk fabrics.',
        videoUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
        thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
        active: true,
        order: 5,
      },
    }),
    prisma.vlog.create({
      data: {
        title: 'Fabric Guide — Lawn vs Chiffon vs Organza',
        description: 'Confused about which fabric to choose? In this video we break down the differences between lawn, chiffon, and organza — when to wear each, how they feel, and which occasions they suit best.',
        videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
        thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
        active: true,
        order: 6,
      },
    }),
  ]);
  console.log('✅ Vlogs created: 6');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Admin Credentials:');
  console.log('   Email:    admin@majestic.com');
  console.log('   Password: admin123');
  console.log('\n🖼️  All products use real Unsplash images');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
