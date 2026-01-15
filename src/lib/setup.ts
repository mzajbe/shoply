import pool from './db';

// Hardcoded data to seed
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

    // Create stats table (simplistic key-value storage for demo)
    await client.query(`
      CREATE TABLE IF NOT EXISTS stats (
        label VARCHAR(50) PRIMARY KEY,
        value VARCHAR(50) NOT NULL,
        delta VARCHAR(50)
      );
    `);

    // Seed Data Check
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
