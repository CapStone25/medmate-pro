-- Drop the overly permissive public SELECT policy on search_history
DROP POLICY IF EXISTS "Anyone can count searches" ON public.search_history;

-- Create a security definer function to safely return search count
CREATE OR REPLACE FUNCTION public.get_search_history_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*) FROM public.search_history;
$$;