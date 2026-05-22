/*
  # Allow authenticated users to delete leads

  Adds a DELETE RLS policy so admin users can remove lead records.
*/

CREATE POLICY "Authenticated users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);
