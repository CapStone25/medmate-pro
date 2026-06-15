-- 1) Remove public exposure of companies.owner_id; replace with count-only RPC
DROP POLICY IF EXISTS "Anyone can count companies" ON public.companies;

CREATE OR REPLACE FUNCTION public.get_companies_count()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT count(*)::bigint FROM public.companies;
$$;

REVOKE ALL ON FUNCTION public.get_companies_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_companies_count() TO anon, authenticated;

-- 2) Add explicit INSERT policy on profiles scoped to the signed-in user
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
