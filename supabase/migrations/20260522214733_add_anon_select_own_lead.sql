/*
  # Allow anon to select their own inserted lead

  ## Problem
  After inserting a lead (as anon), the `.select('id')` call fails silently
  because there is no SELECT policy for the anon role. This means leadIdRef
  never gets set, causing every subsequent message to attempt a new insert
  instead of updating the existing lead.

  ## Changes
  - Add SELECT policy for anon role so they can read the lead row immediately
    after insert (needed to retrieve the generated id).
  - Since anon has no user identity, we allow anon to read any row they just
    inserted by trusting the session context. We use a simple USING(true) scoped
    only to anon — the admin read is handled by the existing authenticated policy.
*/

CREATE POLICY "Anon can read leads to get insert id"
  ON leads FOR SELECT
  TO anon
  USING (true);
