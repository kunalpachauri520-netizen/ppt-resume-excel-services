/*
  # Create orders table for Kunal's Services

  1. New Tables
    - `orders`
      - `id` (text, primary key) - Unique order ID (e.g., ORD1234567890)
      - `name` (text) - Customer full name
      - `email` (text) - Customer email address
      - `phone` (text) - Customer phone number
      - `service` (text) - Service type (PPT, Resume, Excel Data Entry, YouTube Video Editing, YouTube Clip)
      - `pages` (integer) - Number of pages/slides/clips
      - `design` (text) - Template design preference (Minimal, Modern, Creative)
      - `notes` (text) - Additional notes from customer
      - `deadline` (date) - Order deadline
      - `amount` (numeric) - Total amount in rupees
      - `status` (text) - Order status (pending, completed, cancelled)
      - `created_at` (timestamptz) - Order creation timestamp
  
  2. Security
    - Enable RLS on `orders` table
    - Add policy for public to insert orders (anyone can place an order)
    - Add policy for public to read orders (for dashboard display)
*/

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  pages integer NOT NULL DEFAULT 0,
  design text DEFAULT 'Minimal',
  notes text DEFAULT '',
  deadline date NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read orders"
  ON orders
  FOR SELECT
  TO anon
  USING (true);