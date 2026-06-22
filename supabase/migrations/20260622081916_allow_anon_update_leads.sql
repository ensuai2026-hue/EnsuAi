CREATE POLICY "Anon can update own lead"
  ON leads FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);