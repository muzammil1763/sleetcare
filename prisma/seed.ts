import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
  try { await (prisma as any).vlog.deleteMany(); } catch {}
  console.log('✅ Data cleared');

  // 1. Admin User
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@sleetcare.com',
      password: hashedPassword,
      role: 'Admin',
      status: 'Active',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // 2. Social Links
  console.log('🔗 Creating social links...');
  await Promise.all([
    prisma.socialLink.create({ data: { platform: 'Facebook',  url: 'https://www.facebook.com/Sleetcare',  icon: 'Facebook',  label: 'Follow on Facebook',  active: true, order: 1 } }),
    prisma.socialLink.create({ data: { platform: 'Instagram', url: 'https://www.instagram.com/sleetcare', icon: 'Instagram', label: 'Follow on Instagram', active: true, order: 2 } }),
  ]);
  console.log('✅ Social links created');

  // 3. Home Stats
  console.log('📊 Creating home stats...');
  await Promise.all([
    prisma.homeStats.create({ data: { key: 'happy_customers',   value: '10K+',  label: 'Happy Customers',     icon: 'Users'   } }),
    prisma.homeStats.create({ data: { key: 'products_sold',     value: '50+',   label: 'Premium Products',    icon: 'Package' } }),
    prisma.homeStats.create({ data: { key: 'satisfaction_rate', value: '100%',  label: 'Cruelty Free',        icon: 'Heart'   } }),
    prisma.homeStats.create({ data: { key: 'delivery_time',     value: '25+',   label: 'Countries Served',    icon: 'Globe'   } }),
  ]);
  console.log('✅ Home stats created');

  // 4. Site Settings
  console.log('⚙️  Creating site settings...');
  await prisma.siteSettings.createMany({
    data: [
      { key: 'contact_email',    value: 'hello@sleetcare.com' },
      { key: 'contact_phone',    value: '+92 300 8662833' },
      { key: 'contact_whatsapp', value: '923008662833' },
      { key: 'contact_address',  value: 'Faisalabad, Punjab, Pakistan' },
      { key: 'company_tagline',  value: 'Clean beauty. Conscious choices. Confidence, naturally.' },
      { key: 'company_name',     value: 'Sleet Care' },
    ],
  });
  console.log('✅ Site settings created');

  // 5. Vlogs
  console.log('🎬 Creating vlogs...');
  await Promise.all([
    (prisma as any).vlog.create({
      data: {
        title: 'Behind the Scenes — How Our Formulas Are Made',
        description: 'Take an exclusive look inside our formulation lab. From ingredient sourcing to stability testing, discover the science behind every Sleet Care product.',
        videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
        active: true,
        order: 1,
      },
    }),
    (prisma as any).vlog.create({
      data: {
        title: 'Your Skincare Routine — Morning and Night',
        description: 'Our cosmetic chemist walks you through the perfect morning and night skincare routine using Sleet Care products — cleanse, treat, seal.',
        videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        thumbnail: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
        active: true,
        order: 2,
      },
    }),
    (prisma as any).vlog.create({
      data: {
        title: 'What\'s Never in Our Bottles — Ingredient Transparency',
        description: 'We walk through our full exclusion list — parabens, synthetic fragrance, SLS/SLES and more — and explain why each one was permanently removed.',
        videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
        thumbnail: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
        active: true,
        order: 3,
      },
    }),
  ]);
  console.log('✅ Vlogs created: 3');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Admin Credentials:');
  console.log('   Email:    admin@sleetcare.com');
  console.log('   Password: admin123');
  console.log('\n💡 Products and categories are empty — add them via the admin panel.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
