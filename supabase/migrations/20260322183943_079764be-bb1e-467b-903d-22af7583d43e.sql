CREATE POLICY "Anyone can count profiles" ON public.profiles FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can count companies" ON public.companies FOR SELECT TO public USING (true);