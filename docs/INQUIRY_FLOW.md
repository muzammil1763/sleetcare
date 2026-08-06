# 📞 Inquiry Flow - Complete Guide

## Overview
The **"Inquire Now"** button allows customers to request information about products or services **without placing an actual order**. This is for B2B customers who want to discuss requirements, pricing, or customization before purchasing.

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INQUIRY FLOW (NOT AN ORDER)                       │
└─────────────────────────────────────────────────────────────────────┘

1. CUSTOMER VIEWS PRODUCT/SERVICE
   ↓
   📱 /products/[id] OR /services/[slug]
   - Customer sees product/service details
   - Clicks "Inquire Now" button
   - Selects quantity (for products)
   ↓

2. INQUIRY FORM APPEARS
   ↓
   📝 InquiryForm component
   - Form fields:
     • Full name (required)
     • Email (required)
     • Phone (required)
     • Company (optional)
     • Message/Requirements (optional)
   - Shows item name and quantity
   ↓

3. CUSTOMER SUBMITS FORM
   ↓
   🔄 POST /api/inquiries
   - Payload: {
       name: string,
       email: string,
       phone: string,
       company: string,
       message: string,
       type: "product" | "service",
       itemName: string,
       itemId: string,
       qty: number
     }
   ↓

4. BACKEND PROCESSING
   ↓
   🔧 /api/inquiries/route.ts
   
   Step 1: Validate required fields
   └─ name, email, phone must be present
   
   Step 2: Create inquiry data JSON
   └─ inquiryData = {
       type: "product" | "service",
       itemId: product/service ID,
       itemName: product/service name,
       phone: customer phone,
       company: company name,
       message: customer message,
       qty: quantity requested,
       submittedAt: ISO timestamp
     }
   
   Step 3: Store as "fake order" in Order table
   └─ prisma.order.create({
       customer: name,
       email: email,
       status: "Pending",
       total: 0,  // ← Always $0 (not a real order)
       items: qty,
       date: "INQUIRY:" + JSON.stringify(inquiryData)  // ← Special format
     })
   
   ⚠️ NOTE: Inquiries are stored in the Order table with:
      - total = 0
      - date field starts with "INQUIRY:"
      - No OrderItems created
      - Stock is NOT decremented
   ↓

5. WHATSAPP NOTIFICATION
   ↓
   📱 Client-side
   
   Step 1: Fetch WhatsApp number from settings
   └─ GET /api/settings → contact_whatsapp
   
   Step 2: Format message
   └─ For Product:
       "📦 Product Inquiry - OMNiLYNK
        ━━━━━━━━━━━━━━━━━━━━
        Product: [name]
        Quantity: [qty]
        Name: [customer name]
        Email: [email]
        Phone: [phone]
        Company: [company]
        Message: [message]
        ━━━━━━━━━━━━━━━━━━━━
        Sent from omnilynk.io"
   
   └─ For Service:
       "🔧 Service Inquiry - OMNiLYNK
        ━━━━━━━━━━━━━━━━━━━━
        Service: [name]
        Name: [customer name]
        Email: [email]
        Phone: [phone]
        Company: [company]
        Message: [message]
        ━━━━━━━━━━━━━━━━━━━━
        Sent from omnilynk.io"
   
   Step 3: Open WhatsApp
   └─ window.open(`https://wa.me/${number}?text=${message}`)
   ↓

6. CONFIRMATION
   ↓
   ✅ Success message shown
   - "Inquiry Received"
   - "Thank you! Our team will reach out to you soon."
   - Option to "Send another"
   ↓

7. ADMIN VIEWS INQUIRY
   ↓
   👨‍💼 /admin/inquiries page
   - Lists all inquiries (orders where date starts with "INQUIRY:")
   - Shows: customer name, email, item, type, date
   - Can view full inquiry details
   - Can update status or delete

```

---

## 🔑 Key Differences: Inquiry vs Order

| Feature | Inquiry | Real Order |
|---------|---------|------------|
| **Button** | "Inquire Now" | "Checkout" |
| **Total Amount** | $0 | Calculated price + tax |
| **Stock** | NOT decremented | Decremented |
| **OrderItems** | None created | Created with prices |
| **Date Field** | `"INQUIRY:{json}"` | `"YYYY-MM-DD"` |
| **Payment** | No payment | Payment required |
| **Purpose** | Request info | Purchase products |
| **WhatsApp** | Opens immediately | Opens after order |

---

## 🗄️ Database Storage

### How Inquiries are Stored

Inquiries are stored in the **Order** table with a special format:

```typescript
{
  id: "abc123",
  customer: "John Doe",
  email: "john@example.com",
  status: "Pending",
  total: 0,  // ← Always zero
  items: 2,  // ← Quantity requested
  date: "INQUIRY:{\"type\":\"product\",\"itemId\":\"xyz\",\"itemName\":\"Forge K1\",\"phone\":\"+1555000\",\"company\":\"Acme\",\"message\":\"Need bulk pricing\",\"qty\":2,\"submittedAt\":\"2026-04-30T10:00:00.000Z\"}",
  createdAt: "2026-04-30T10:00:00.000Z",
  updatedAt: "2026-04-30T10:00:00.000Z"
}
```

### Why This Design?

**Pros:**
- ✅ Reuses existing Order table (no new model needed)
- ✅ Admin can see inquiries alongside orders
- ✅ Can track inquiry status (Pending, Processing, etc.)
- ✅ Simple to implement

**Cons:**
- ❌ Mixes inquiries with real orders
- ❌ Requires filtering to separate them
- ❌ Date field is misused for JSON storage
- ❌ No proper relational structure

### Better Alternative (Future Improvement)

Create a separate **Inquiry** model:

```prisma
model Inquiry {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  email       String
  phone       String
  company     String?
  message     String?
  type        String   // "product" | "service"
  itemId      String   @db.ObjectId
  itemName    String
  qty         Int      @default(1)
  status      InquiryStatus @default(New)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum InquiryStatus {
  New
  Contacted
  Quoted
  Converted
  Closed
}
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/(site)/products/[id]/page.tsx` | Product detail with "Inquire Now" |
| `app/(site)/services/[slug]/page.tsx` | Service detail with "Inquire Now" |
| `components/site/InquiryForm.tsx` | Inquiry form component |
| `app/api/inquiries/route.ts` | Inquiry submission API |
| `app/admin/inquiries/page.tsx` | Admin inquiry management |

---

## 🔄 API Endpoints

### Submit Inquiry
```typescript
POST /api/inquiries
Body: {
  name: string,
  email: string,
  phone: string,
  company?: string,
  message?: string,
  type: "product" | "service",
  itemName: string,
  itemId: string,
  qty?: number
}
Response: Order object (with INQUIRY: prefix in date)
```

### Get All Inquiries
```typescript
GET /api/inquiries
Response: Order[] (filtered by date.startsWith("INQUIRY:"))
```

---

## 💡 Example Inquiry Flow

### Customer Side:
1. Browse products at `/products`
2. Click "Forge K1 Industrial PC" → `/products/abc123`
3. See price: $1,899
4. Select quantity: 5 units
5. Click "Inquire Now" button
6. Fill form:
   - Name: Sarah Johnson
   - Email: sarah@techcorp.com
   - Phone: +1 555 1234
   - Company: TechCorp Industries
   - Message: "Need bulk pricing for 50+ units"
7. Click "Send Inquiry"
8. WhatsApp opens with pre-filled message
9. See confirmation: "Inquiry Received"

### Business Side (WhatsApp):
Receives message:
```
📦 Product Inquiry - OMNiLYNK
━━━━━━━━━━━━━━━━━━━━
Product: Forge K1 Industrial PC
Quantity: 5
Name: Sarah Johnson
Email: sarah@techcorp.com
Phone: +1 555 1234
Company: TechCorp Industries
Message: Need bulk pricing for 50+ units
━━━━━━━━━━━━━━━━━━━━
Sent from omnilynk.io
```

### Admin Side:
1. Login to `/admin`
2. Go to `/admin/inquiries`
3. See new inquiry from Sarah Johnson
4. View details: product, quantity, message
5. Contact customer via email/phone/WhatsApp
6. Provide quote and negotiate
7. Update status: New → Contacted → Quoted
8. If customer agrees, create real order manually

---

## 🔍 How to Identify Inquiries vs Orders

### In Code:
```typescript
// Check if it's an inquiry
const isInquiry = order.date.startsWith('INQUIRY:');

// Parse inquiry data
if (isInquiry) {
  const jsonStr = order.date.replace('INQUIRY:', '');
  const inquiryData = JSON.parse(jsonStr);
  console.log(inquiryData.itemName);  // Product/service name
  console.log(inquiryData.phone);     // Customer phone
  console.log(inquiryData.message);   // Customer message
}

// Filter inquiries from orders
const realOrders = orders.filter(o => !o.date.startsWith('INQUIRY:'));
const inquiries = orders.filter(o => o.date.startsWith('INQUIRY:'));
```

### In Admin:
- **Orders page** (`/admin/orders`): Shows only real orders (inquiries filtered out)
- **Inquiries page** (`/admin/inquiries`): Shows only inquiries

---

## 🚀 Inquiry to Order Conversion

When a customer decides to purchase after inquiry:

### Manual Process (Current):
1. Admin receives inquiry via WhatsApp
2. Admin contacts customer
3. Admin provides quote/pricing
4. Customer agrees
5. Admin manually creates order in system OR
6. Customer places order through website

### Automated Process (Future Enhancement):
1. Admin sends quote via system
2. Customer receives email with quote
3. Customer clicks "Accept Quote"
4. System converts inquiry to order
5. Customer proceeds to payment
6. Order is created automatically

---

## 📞 WhatsApp Integration

### How It Works:
1. Inquiry form submits to API
2. API saves inquiry to database
3. Client fetches WhatsApp number from settings
4. Client formats message with inquiry details
5. Client opens WhatsApp with pre-filled message
6. Customer can send message or close window

### WhatsApp Number Configuration:
- Stored in: Site Settings (`/admin/settings`)
- Key: `contact_whatsapp`
- Format: `+1234567890` (with country code)

---

## 🛡️ Security & Validation

1. **Required Fields**: Name, email, phone must be provided
2. **Email Validation**: Ensures valid email format
3. **Phone Format**: Accepts any format (validated on display)
4. **XSS Protection**: All inputs sanitized
5. **Rate Limiting**: Should be added to prevent spam

---

## 🚀 Future Enhancements

- [ ] Separate Inquiry model (not stored as Order)
- [ ] Email notifications to admin on new inquiry
- [ ] Auto-reply email to customer
- [ ] Inquiry status workflow (New → Contacted → Quoted → Converted)
- [ ] Quote generation system
- [ ] Inquiry to order conversion button
- [ ] Inquiry analytics dashboard
- [ ] Follow-up reminders for admin
- [ ] Customer inquiry history
- [ ] Bulk inquiry export (CSV/Excel)

---

## ❓ FAQ

**Q: Why are inquiries stored as orders?**
A: It's a simple implementation that reuses existing infrastructure. A better approach would be a separate Inquiry model.

**Q: Do inquiries affect product stock?**
A: No, stock is only decremented for real orders, not inquiries.

**Q: Can customers track their inquiry?**
A: Not currently. They receive confirmation but no tracking page.

**Q: How do I convert an inquiry to an order?**
A: Currently manual - contact customer and have them place order through website.

**Q: Can I disable the inquiry feature?**
A: Yes, remove the "Inquire Now" button from product/service detail pages.

---

## 📞 Support

For questions about the inquiry flow, contact the development team or refer to the codebase documentation.
