/*
  # Add contact & order fields to leads table

  Adds columns to capture lead contact info and order intent
  collected after AI DNA analysis is complete.

  ## Changes
  - `phone` (text) - WhatsApp/phone number
  - `email` (text) - email address
  - `budget` (text) - estimated budget
  - `product_type` (text) - type of product interested in
  - `quantity` (text) - quantity / number of SKUs wanted
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'phone') THEN
    ALTER TABLE leads ADD COLUMN phone text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'email') THEN
    ALTER TABLE leads ADD COLUMN email text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'budget') THEN
    ALTER TABLE leads ADD COLUMN budget text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'product_type') THEN
    ALTER TABLE leads ADD COLUMN product_type text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'quantity') THEN
    ALTER TABLE leads ADD COLUMN quantity text;
  END IF;
END $$;
