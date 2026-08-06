import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixOrders() {
  console.log('🔧 Fixing orders data...\n');

  try {
    // Get all orders with their items
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(`Found ${orders.length} orders to check\n`);

    let fixedCount = 0;

    for (const order of orders) {
      const updates: any = {};
      let needsUpdate = false;

      console.log(`\nChecking order ${order.id.slice(-8)}:`);
      console.log(`  Current date: ${order.date}`);
      console.log(`  Current total: $${order.total}`);
      console.log(`  Current items: ${order.items}`);
      console.log(`  Order items count: ${order.orderItems?.length || 0}`);

      // Fix invalid or missing dates
      if (!order.date || order.date === 'Invalid Date' || order.date === '') {
        updates.date = order.createdAt.toISOString().split('T')[0];
        needsUpdate = true;
        console.log(`  ➜ Will fix date to: ${updates.date}`);
      }

      // Fix missing or zero totals
      if (!order.total || order.total === 0) {
        if (order.orderItems && order.orderItems.length > 0) {
          const calculatedTotal = order.orderItems.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
          );
          updates.total = calculatedTotal;
          needsUpdate = true;
          console.log(`  ➜ Will fix total to: $${calculatedTotal}`);
        }
      }

      // Fix missing items count
      if (!order.items || order.items === 0) {
        if (order.orderItems && order.orderItems.length > 0) {
          const itemCount = order.orderItems.reduce((sum, item) => sum + item.qty, 0);
          updates.items = itemCount;
          needsUpdate = true;
          console.log(`  ➜ Will fix items count to: ${itemCount}`);
        }
      }

      // Update the order if needed
      if (needsUpdate) {
        await prisma.order.update({
          where: { id: order.id },
          data: updates,
        });
        fixedCount++;
        console.log(`  ✅ Updated!`);
      } else {
        console.log(`  ✓ No fixes needed`);
      }
    }

    console.log(`\n✨ Fixed ${fixedCount} orders successfully!`);
  } catch (error) {
    console.error('❌ Error fixing orders:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixOrders();
