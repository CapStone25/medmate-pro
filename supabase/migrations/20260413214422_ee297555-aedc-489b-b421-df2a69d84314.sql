
-- Add NULL guard to has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN _user_id IS NULL THEN false
  ELSE EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  ) END;
$$;

-- Add NULL guard to get_user_company_id function
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN _user_id IS NULL THEN NULL::uuid
  ELSE (SELECT id FROM public.companies WHERE owner_id = _user_id LIMIT 1)
  END;
$$;
