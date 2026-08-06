# 🛒 Product Order Flow - Complete Guide

## Overview
This document explains the complete flow of how a customer orders products in your IoT e-commerce system.

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER JOURNEY                             │
└─────────────────────────────────────────────────────────────────────┘

1. BROWSE PRODUCTS
   ↓
   📱 /products page
   - Customer views all products
   - Products loaded from: GET /api/products
   - Displays: name, category, price, stock, image
   ↓

2. VIEW PRODUCT DETAILS
   ↓
   📱 /products/[id] page
   - Customer clicks on a product
   - Shows: full description, specs, price
   - "Add to Cart" button available
   ↓

3. ADD TO CART
   ↓
   🛒 Client-side action (AppStore)
   - addToCart(productId, qty) called
   - Cart stored in localStorage: "OMNiLYNK.cart.v2"
   - Cart structure: [{ productId: string, qty: number }]
   - No API call - purely client-side
   ↓

4. VIEW CART
   ↓
   📱 /cart page
   - Shows all cart items with product details
   - Calculates:
     • Subtotal = sum of (price × qty)
     • Tax = subtotal × 8%
     • Total = subtotal + tax
   - Can update quantities or remove items
   - "Checkout" button to proceed
   ↓

5. CHECKOUT
   ↓
   📱 /checkout page
   - Customer fills form:
     • Contact: name, email, phone, company
     • Shipping: address, city, zip, country
   - Shows order summary
   - "Place Order" button
   ↓

6. PLACE ORDER
   ↓
   🔄 placeOrder() function called
   - Sends: POST /api/orders
   - Payload: {
       customer: name,
       email: email,
       items: [{ productId, qty }]
     }
   ↓

7. ORDER PROCESSING (Backend)
   ↓
   🔧 /api/orders/route.ts
   
   Step 1: Validate data with Zod schema
   ├─ customer: string (required)
   ├─ email: email format (required)
   └─ items: array of { productId, qty }
   
   Step 2: Fetch product prices from database
   └─ prisma.product.findMany({ where: { id: { in: productIds } } })
   
   Step 3: Calculate totals
   ├─ total = sum of (product.price × item.qty)
   ├─ totalWithTax = total × 1.08 (8% tax)
   └─ itemCount = sum of all quantities
   
   Step 4: Create order in database
   └─ prisma.order.create({
       data: {
         customer,
         email,
         total: totalWithTax,
         items: itemCount,
         date: "YYYY-MM-DD",
         status: "Pending",
         orderItems: {
           create: [{ productId, qty, price }]
         }
       }
     })
   
   Step 5: Update product stock
   └─ For each item:
       prisma.product.update({
         where: { id: productId },
         data: { stock: { decrement: qty } }
       })
   
   Step 6: Return order object
   └─ Response: { id, customer, email, total, items, date, status }
   ↓

8. POST-ORDER ACTIONS
   ↓
   📱 Client-side
   
   Action 1: Send WhatsApp notification (optional)
   ├─ Fetches WhatsApp number from settings
   ├─ Formats order details message
   └─ Opens WhatsApp with pre-filled message
   
   Action 2: Clear cart
   └─ clearCart() - removes all items from localStorage
   
   Action 3: Redirect to order confirmation
   └─ router.push(`/order/${order.id}`)
   ↓

9. ORDER CONFIRMATION
   ↓
   📱 /order/[id] page
   - Shows order details
   - Order ID, customer info, items, total
   - Status: "Pending"
   ↓

10. ADMIN MANAGEMENT
    ↓
    👨‍💼 /admin/orders page
    - Admin views all orders
    - Can update order status:
      • Pending → Processing → Shipped → Delivered
      • Or: Cancelled
    - View order details with item breakdown
    - Update: PUT /api/orders/[id] { status }

```

---

## 🗄️ Database Schema

### Order Model
```prisma
model Order {
  id         String      @id @default(auto()) @map("_id") @db.ObjectId
  customer   String      // Customer name
  email      String      // Customer email
  status     OrderStatus @default(Pending)
  total      Float       // Total amount with tax
  items      Int         // Total quantity of items
  date       String      // Order date (YYYY-MM-DD)
  userId     String?     @db.ObjectId
  user       User?       @relation(fields: [userId], references: [id])
  orderItems OrderItem[] // Related order items
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  orderId   String  @db.ObjectId
  order     Order   @relation(fields: [orderId], references: [id])
  productId String  @db.ObjectId
  product   Product @relation(fields: [productId], references: [id])
  qty       Int     // Quantity ordered
  price     Float   // Price at time of order
}

enum OrderStatus {
  Pending
  Processing
  Shipped
  Delivered
  Cancelled
}
```

---

## 🔑 Key Features

### 1. **Client-Side Cart**
- Cart stored in browser localStorage
- Persists across page refreshes
- No login required to add items
- Key: `"OMNiLYNK.cart.v2"`

### 2. **Price Snapshot**
- Product price at order time is saved in `OrderItem.price`
- If product price changes later, order history remains accurate

### 3. **Stock Management**
- Stock automatically decremented when order is placed
- Uses Prisma's `{ decrement: qty }` for atomic updates
- Prevents overselling

### 4. **Tax Calculation**
- 8% tax applied automatically
- Formula: `totalWithTax = subtotal × 1.08`

### 5. **Order Status Workflow**
```
Pending → Processing → Shipped → Delivered
   ↓
Cancelled (can be set at any stage)
```

### 6. **WhatsApp Integration**
- Optional notification sent to business WhatsApp
- Opens WhatsApp with pre-filled order details
- Number fetched from site settings

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/(site)/products/page.tsx` | Product listing page |
| `app/(site)/products/[id]/page.tsx` | Product detail page |
| `app/(site)/cart/page.tsx` | Shopping cart |
| `app/(site)/checkout/page.tsx` | Checkout form |
| `app/(site)/order/[id]/page.tsx` | Order confirmation |
| `app/admin/orders/page.tsx` | Admin order management |
| `app/api/orders/route.ts` | Order creation API |
| `app/api/orders/[id]/route.ts` | Order update API |
| `store/AppStore.tsx` | Global state management |

---

## 🔄 API Endpoints

### Create Order
```typescript
POST /api/orders
Body: {
  customer: string,
  email: string,
  items: [{ productId: string, qty: number }]
}
Response: Order object
```

### Get All Orders
```typescript
GET /api/orders
Response: Order[]
```

### Get Single Order
```typescript
GET /api/orders/[id]
Response: Order with orderItems
```

### Update Order Status
```typescript
PUT /api/orders/[id]
Body: { status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" }
Response: Updated Order
```

---

## 💡 Example Order Flow

### Customer Side:
1. Browse products at `/products`
2. Click "Aegis F1 Firewall" → `/products/abc123`
3. Click "Add to Cart" (qty: 2)
4. Go to `/cart` → See 2 × Aegis F1 = $2,598
5. Click "Checkout" → `/checkout`
6. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +1 555 0000
   - Address: 123 Main St, City, 12345, USA
7. Click "Place Order"
8. WhatsApp opens with order details
9. Redirected to `/order/xyz789`
10. See confirmation: "Order Placed Successfully!"

### Admin Side:
1. Login to `/admin`
2. Go to `/admin/orders`
3. See new order from John Doe
4. Click eye icon to view details
5. Update status: Pending → Processing
6. Later: Processing → Shipped
7. Finally: Shipped → Delivered

---

## 🛡️ Security & Validation

1. **Input Validation**: Zod schema validates all order data
2. **Stock Check**: Prevents negative stock (min: 1)
3. **Price Integrity**: Prices fetched from database, not client
4. **Email Validation**: Ensures valid email format
5. **Atomic Updates**: Stock decrements use database transactions

---

## 🚀 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications for order status changes
- [ ] Order tracking with shipping provider APIs
- [ ] Invoice generation (PDF)
- [ ] Customer order history (requires user accounts)
- [ ] Inventory alerts when stock is low
- [ ] Discount codes / coupons
- [ ] Multiple shipping options
- [ ] Order cancellation by customer

---

## 📞 Support

For questions about the order flow, contact the development team or refer to the codebase documentation.
