-- Remove public exposure of profiles
DROP POLICY IF EXISTS "Anyone can count profiles" ON public.profiles;

-- Create a safe count function instead
CREATE OR REPLACE FUNCTION public.get_profiles_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*) FROM public.profiles;
$$;

-- Add explicit restrictive INSERT policy on user_roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
