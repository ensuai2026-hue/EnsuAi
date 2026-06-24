/*
  # Tabs content tables: scientists and gallery_items

  1. New Tables
    - `scientists`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `role` (text, not null)
      - `bio` (text)
      - `image_url` (text)
      - `expertise` (text)
      - `display_order` (int, default 0)
      - `created_at` (timestamptz, default now)
    - `gallery_items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `caption` (text)
      - `image_url` (text, not null)
      - `category` (text)
      - `display_order` (int, default 0)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on both tables
    - Public read access (anon + authenticated SELECT) since this is brand-facing content
    - Authenticated INSERT/UPDATE/DELETE for admin management
*/

CREATE TABLE IF NOT EXISTS scientists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  bio text DEFAULT '',
  image_url text DEFAULT '',
  expertise text DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scientists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_scientists" ON scientists FOR SELECT TO anon USING (true);
CREATE POLICY "auth_select_scientists" ON scientists FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_scientists" ON scientists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_scientists" ON scientists FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_scientists" ON scientists FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT '',
  caption text DEFAULT '',
  image_url text NOT NULL,
  category text DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_gallery" ON gallery_items FOR SELECT TO anon USING (true);
CREATE POLICY "auth_select_gallery" ON gallery_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_gallery" ON gallery_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_gallery" ON gallery_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_gallery" ON gallery_items FOR DELETE TO authenticated USING (true);
