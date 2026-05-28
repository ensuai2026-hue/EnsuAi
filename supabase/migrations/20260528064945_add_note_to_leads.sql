/*
  # Add note column to leads table

  Adds a `note` text column to store background/context about the lead
  (e.g. their job, experience, community size) collected during the AI conversation.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'note'
  ) THEN
    ALTER TABLE leads ADD COLUMN note text;
  END IF;
END $$;
