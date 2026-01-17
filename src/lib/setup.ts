import pool from './db';

// Hardcoded data to seed (unchanged)
const INITIAL_STATS = [
  { label: "Total Sales", value: "$24,320", delta: "+12%" },
  { label: "Orders", value: "1,342", delta: "+3%" },
  { label: "Avg. Order", value: "$48.12", delta: "-1%" },
  { label: "Visitors", value: "9,204", delta: "+8%" },
];

const INITIAL_ORDERS = [
  { id: "1007", customer: "Nadia Rahman", email: "nadia@example.com", total: "$79.99", status: "Paid", date: "Dec 30, 2025" },
  { id: "1006", customer: "Ahmed Hassan", email: "ahmed@example.com", total: "$159.99", status: "Pending", date: "Dec 29, 2025" },
  { id: "1005", customer: "Sarah Johnson", email: "sarah@example.com", total: "$89.99", status: "Paid", date: "Dec 28, 2025" },
  { id: "1004", customer: "Maya Patel", email: "maya@example.com", total: "$19.99", status: "Paid", date: "Dec 27, 2025" },
  { id: "1003", customer: "Liam Smith", email: "liam@example.com", total: "$299.99", status: "Refunded", date: "Dec 26, 2025" },
  { id: "1002", customer: "John Doe", email: "john@example.com", total: "$49.50", status: "Pending", date: "Dec 25, 2025" },
  { id: "1001", customer: "Ayesha Khan", email: "ayesha@example.com", total: "$129.00", status: "Paid", date: "Dec 24, 2025" },
];

const INITIAL_PRODUCTS = [
  { id: "P001", name: "Premium Leather Wallet", sku: "LW-001", category: "Accessories", price: "$49.99", stock: 120, status: "Active" },
  { id: "P002", name: "Wireless Headphones", sku: "WH-200", category: "Electronics", price: "$129.00", stock: 45, status: "Active" },
  { id: "P003", name: "Organic Cotton T-Shirt", sku: "TS-100", category: "Apparel", price: "$24.50", stock: 0, status: "Draft" },
  { id: "P004", name: "Ceramic Coffee Mug", sku: "CM-050", category: "Home", price: "$14.99", stock: 85, status: "Active" },
  { id: "P005", name: "Sports Water Bottle", sku: "WB-010", category: "Fitness", price: "$18.00", stock: 200, status: "Active" },
];

const INITIAL_CAMPAIGNS = [
  { id: "M001", name: "Holiday Sale Push", type: "Email", status: "Active", reach: "15,234", conversions: "1,245", roi: "245%" },
  { id: "M002", name: "Instagram Ad Campaign", type: "Social", status: "Active", reach: "89,123", conversions: "3,421", roi: "189%" },
  { id: "M003", name: "Google Shopping Ads", type: "Ads", status: "Active", reach: "124,567", conversions: "8,945", roi: "312%" },
  { id: "M004", name: "Summer Collection Promo", type: "Email", status: "Ended", reach: "22,340", conversions: "1,834", roi: "198%" },
  { id: "M005", name: "New Year Deal", type: "Social", status: "Scheduled", reach: "0", conversions: "0", roi: "—" },
];

const INITIAL_CUSTOMERS = [
  { id: "C001", name: "Nadia Rahman", email: "nadia@example.com", spent: "$540.00", joined: "Oct 2025" },
  { id: "C002", name: "Ahmed Hassan", email: "ahmed@example.com", spent: "$1,200.50", joined: "Nov 2025" },
  { id: "C003", name: "Sarah Johnson", email: "sarah@example.com", spent: "$89.99", joined: "Dec 2025" },
];

export async function setupDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        content JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        total VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create stats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stats (
        label VARCHAR(50) PRIMARY KEY,
        value VARCHAR(50) NOT NULL,
        delta VARCHAR(50)
      );
    `);

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price VARCHAR(50) NOT NULL,
        stock INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create campaigns table
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        reach VARCHAR(50) DEFAULT '0',
        conversions VARCHAR(50) DEFAULT '0',
        roi VARCHAR(50) DEFAULT '—',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create customers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        spent VARCHAR(50) DEFAULT '$0.00',
        joined VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create store settings table (Updated with more fields)
    // Dropping first to force schema update in dev environment
    await client.query('DROP TABLE IF EXISTS store_settings');
    await client.query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id SERIAL PRIMARY KEY,
        store_name VARCHAR(255) DEFAULT 'Shoply Store',
        currency VARCHAR(10) DEFAULT 'USD',
        email VARCHAR(255) DEFAULT 'support@shoply.com',
        payment_stripe BOOLEAN DEFAULT false,
        payment_paypal BOOLEAN DEFAULT false,
        shipping_rate VARCHAR(50) DEFAULT '0.00',
        notifications_email BOOLEAN DEFAULT true
      );
    `);

    // Seeding Logic (Unchanged for other tables)
    // ... Orders ...
    const ordersCheck = await client.query('SELECT COUNT(*) FROM orders');
    if (parseInt(ordersCheck.rows[0].count) === 0) {
      console.log('Seeding orders...');
      for (const order of INITIAL_ORDERS) {
        await client.query(
          'INSERT INTO orders (id, customer, email, total, status, date) VALUES ($1, $2, $3, $4, $5, $6)',
          [order.id, order.customer, order.email, order.total, order.status, order.date]
        );
      }
    }

    // ... Stats ...
    const statsCheck = await client.query('SELECT COUNT(*) FROM stats');
    if (parseInt(statsCheck.rows[0].count) === 0) {
      console.log('Seeding stats...');
      for (const stat of INITIAL_STATS) {
        await client.query(
          'INSERT INTO stats (label, value, delta) VALUES ($1, $2, $3)',
          [stat.label, stat.value, stat.delta]
        );
      }
    }

    // ... Products ...
    const productsCheck = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(productsCheck.rows[0].count) === 0) {
      console.log('Seeding products...');
      for (const p of INITIAL_PRODUCTS) {
        await client.query(
          'INSERT INTO products (id, name, sku, category, price, stock, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [p.id, p.name, p.sku, p.category, p.price, p.stock, p.status]
        );
      }
    }

    // ... Campaigns ...
    const campaignsCheck = await client.query('SELECT COUNT(*) FROM campaigns');
    if (parseInt(campaignsCheck.rows[0].count) === 0) {
      console.log('Seeding campaigns...');
      for (const c of INITIAL_CAMPAIGNS) {
        await client.query(
          'INSERT INTO campaigns (id, name, type, status, reach, conversions, roi) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [c.id, c.name, c.type, c.status, c.reach, c.conversions, c.roi]
        );
      }
    }

    // ... Customers ...
    const customersCheck = await client.query('SELECT COUNT(*) FROM customers');
    if (parseInt(customersCheck.rows[0].count) === 0) {
      console.log('Seeding customers...');
      for (const c of INITIAL_CUSTOMERS) {
        await client.query(
          'INSERT INTO customers (id, name, email, spent, joined) VALUES ($1, $2, $3, $4, $5)',
          [c.id, c.name, c.email, c.spent, c.joined]
        );
      }
    }

    // Seed Settings (Ensure one row exists with new fields)
    const settingsCheck = await client.query('SELECT COUNT(*) FROM store_settings');
    if (parseInt(settingsCheck.rows[0].count) === 0) {
      console.log('Seeding settings...');
      await client.query(
        'INSERT INTO store_settings (store_name, currency, email, payment_stripe, payment_paypal, shipping_rate, notifications_email) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        ['My Awesome Store', 'USD', 'admin@example.com', true, false, '15.00', true]
      );
    }

    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}
