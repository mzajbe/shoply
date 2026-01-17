export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: "Active" | "Draft" | "Archived";
};

export  const    allProducts: Product[] = [
  { id: "P001", name: "Wireless Headphones", sku: "WH-001", category: "Electronics", price: "$79.99", stock: 45, status: "Active" },
  { id: "P002", name: "USB-C Cable", sku: "USB-002", category: "Accessories", price: "$12.99", stock: 120, status: "Active" },
  { id: "P003", name: "Phone Stand", sku: "PS-003", category: "Accessories", price: "$24.99", stock: 0, status: "Active" },
  { id: "P004", name: "Laptop Case", sku: "LC-004", category: "Cases", price: "$49.99", stock: 32, status: "Active" },
  { id: "P005", name: "Screen Protector", sku: "SP-005", category: "Accessories", price: "$9.99", stock: 200, status: "Draft" },
  { id: "P006", name: "Bluetooth Speaker", sku: "BS-006", category: "Electronics", price: "$89.99", stock: 15, status: "Active" },
];