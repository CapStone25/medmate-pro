import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const results: string[] = [];

    // Helper to create user and set role
    const createUserWithRole = async (
      email: string, password: string, name: string, role: "admin" | "user" | "company", companyName?: string
    ) => {
      const { data: authData, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });
      if (error && !error.message.includes("already")) {
        results.push(`Error creating ${email}: ${error.message}`);
        return null;
      }
      const userId = authData?.user?.id;
      if (!userId) {
        // Try to find existing user
        const { data: users } = await supabase.auth.admin.listUsers();
        const existing = users?.users?.find((u: any) => u.email === email);
        if (existing) {
          results.push(`${email} already exists`);
          return existing.id;
        }
        return null;
      }
      // Update role
      if (role !== "user") {
        await supabase.from("user_roles").update({ role }).eq("user_id", userId);
      }
      // Update profile
      if (companyName) {
        await supabase.from("profiles").update({ company_name: companyName }).eq("user_id", userId);
      }
      results.push(`Created ${email} as ${role}`);
      return userId;
    };

    // 1. Admin: Abdalraheem Ahmed
    const adminId = await createUserWithRole(
      "abdalraheemahmed@gmail.com", "12345", "Abdalraheem Ahmed", "admin"
    );

    // 2. Company 1: Ahmed Ezzat
    const company1UserId = await createUserWithRole(
      "AhmedEzzat@gmail.com", "12345", "Ahmed Ezzat", "company", "Ahmed Ezzat Pharma"
    );

    // 3. Company 2: Felopater Remon
    const company2UserId = await createUserWithRole(
      "FelopaterRemon@gmail.com", "12345", "Felopater Remon", "company", "Felopater Remon Pharma"
    );

    // Create company entries
    let company1Id: string | null = null;
    let company2Id: string | null = null;

    if (company1UserId) {
      const { data: existing } = await supabase.from("companies").select("id").eq("owner_id", company1UserId).maybeSingle();
      if (existing) {
        company1Id = existing.id;
      } else {
        const { data } = await supabase.from("companies").insert({ name: "Ahmed Ezzat Pharma", owner_id: company1UserId }).select().single();
        company1Id = data?.id || null;
      }
    }

    if (company2UserId) {
      const { data: existing } = await supabase.from("companies").select("id").eq("owner_id", company2UserId).maybeSingle();
      if (existing) {
        company2Id = existing.id;
      } else {
        const { data } = await supabase.from("companies").insert({ name: "Felopater Remon Pharma", owner_id: company2UserId }).select().single();
        company2Id = data?.id || null;
      }
    }

    // 4. Check if medicines already seeded
    const { count } = await supabase.from("medicines").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      results.push(`Medicines already seeded (${count} found)`);
      return new Response(JSON.stringify({ success: true, results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Seed medicines - split between two companies
    const company1Medicines = [
      { name: "Amoxicillin", generic_name: "Amoxicillin Trihydrate", category: "Antibiotic", description: "A penicillin-type antibiotic used to treat a wide variety of bacterial infections.", dosage: "250mg–500mg every 8 hours for 7–14 days", side_effects: ["Nausea", "Vomiting", "Diarrhea", "Skin rash", "Allergic reactions"], price: "$4.99", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: true, active_ingredient: "Amoxicillin Trihydrate", form: "Capsules", image_url: "amoxicillin", company_id: company1Id },
      { name: "Ibuprofen", generic_name: "Ibuprofen", category: "Pain Relief", description: "A nonsteroidal anti-inflammatory drug (NSAID) that reduces hormones causing inflammation and pain.", dosage: "200mg–400mg every 4–6 hours", side_effects: ["Stomach upset", "Nausea", "Dizziness", "Heartburn"], price: "$3.49", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: false, active_ingredient: "Ibuprofen", form: "Film-coated tablets", image_url: "ibuprofen", company_id: company1Id },
      { name: "Metformin", generic_name: "Metformin Hydrochloride", category: "Diabetes", description: "First-line oral antidiabetic medication for Type 2 diabetes.", dosage: "500mg–1000mg twice daily with meals", side_effects: ["Nausea", "Diarrhea", "Abdominal pain", "Metallic taste"], price: "$6.99", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: true, active_ingredient: "Metformin Hydrochloride", form: "Tablets", image_url: "metformin", company_id: company1Id },
      { name: "Omeprazole", generic_name: "Omeprazole Magnesium", category: "Digestive", description: "A proton pump inhibitor for GERD, peptic ulcers, and erosive esophagitis.", dosage: "20mg–40mg once daily before breakfast", side_effects: ["Headache", "Abdominal pain", "Nausea", "Diarrhea"], price: "$5.99", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: false, active_ingredient: "Omeprazole Magnesium", form: "Delayed-release capsules", image_url: "omeprazole", company_id: company1Id },
      { name: "Cetirizine", generic_name: "Cetirizine Hydrochloride", category: "Allergy", description: "A second-generation antihistamine that relieves allergy symptoms.", dosage: "10mg once daily", side_effects: ["Drowsiness", "Dry mouth", "Fatigue", "Headache"], price: "$4.29", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: false, active_ingredient: "Cetirizine Hydrochloride", form: "Film-coated tablets", image_url: "cetirizine", company_id: company1Id },
      { name: "Paracetamol", generic_name: "Acetaminophen", category: "Pain Relief", description: "A widely used analgesic and antipyretic for mild to moderate pain and fever.", dosage: "500mg–1000mg every 4–6 hours (max 4g/day)", side_effects: ["Nausea", "Stomach pain", "Loss of appetite", "Rash"], price: "$2.99", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: false, active_ingredient: "Paracetamol / Acetaminophen", form: "Tablets", image_url: "paracetamol", company_id: company1Id },
      { name: "Lisinopril", generic_name: "Lisinopril Dihydrate", category: "Blood Pressure", description: "An ACE inhibitor used to treat hypertension and heart failure.", dosage: "10mg–40mg once daily", side_effects: ["Dry cough", "Dizziness", "Headache", "Hyperkalemia"], price: "$7.49", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: true, active_ingredient: "Lisinopril", form: "Tablets", image_url: "lisinopril", company_id: company1Id },
      { name: "Aspirin", generic_name: "Acetylsalicylic Acid", category: "Pain Relief", description: "An NSAID used as analgesic, antipyretic, and anti-inflammatory agent.", dosage: "325mg–650mg every 4–6 hours; 81mg daily for cardiac", side_effects: ["GI irritation", "Bleeding risk", "Tinnitus"], price: "$2.49", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: false, active_ingredient: "Acetylsalicylic Acid", form: "Tablets", image_url: null, company_id: company1Id },
      { name: "Amlodipine", generic_name: "Amlodipine Besylate", category: "Blood Pressure", description: "A calcium channel blocker for hypertension and angina.", dosage: "5mg–10mg once daily", side_effects: ["Edema", "Flushing", "Headache", "Dizziness"], price: "$5.99", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: true, active_ingredient: "Amlodipine Besylate", form: "Tablets", image_url: null, company_id: company1Id },
      { name: "Gabapentin", generic_name: "Gabapentin", category: "Nerve Pain", description: "An anticonvulsant for neuropathic pain and partial seizures.", dosage: "300mg–600mg three times daily", side_effects: ["Dizziness", "Drowsiness", "Ataxia", "Fatigue"], price: "$9.99", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: true, active_ingredient: "Gabapentin", form: "Capsules", image_url: null, company_id: company1Id },
      { name: "Levothyroxine", generic_name: "Levothyroxine Sodium", category: "Thyroid", description: "Synthetic thyroid hormone for hypothyroidism.", dosage: "25mcg–200mcg once daily on empty stomach", side_effects: ["Weight loss", "Tremors", "Insomnia", "Tachycardia"], price: "$7.99", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: true, active_ingredient: "Levothyroxine Sodium", form: "Tablets", image_url: null, company_id: company1Id },
      { name: "Prednisone", generic_name: "Prednisone", category: "Anti-inflammatory", description: "A corticosteroid that suppresses inflammation and immune response.", dosage: "5mg–60mg daily, tapered gradually", side_effects: ["Weight gain", "Mood changes", "Insomnia", "Increased appetite"], price: "$5.49", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: true, active_ingredient: "Prednisone", form: "Tablets", image_url: null, company_id: company1Id },
      { name: "Loratadine", generic_name: "Loratadine", category: "Allergy", description: "A non-drowsy antihistamine for allergic rhinitis and urticaria.", dosage: "10mg once daily", side_effects: ["Headache", "Drowsiness (rare)", "Dry mouth"], price: "$3.99", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: false, active_ingredient: "Loratadine", form: "Tablets", image_url: null, company_id: company1Id },
      { name: "Sertraline", generic_name: "Sertraline Hydrochloride", category: "Mental Health", description: "An SSRI antidepressant for depression, OCD, PTSD, and anxiety.", dosage: "50mg–200mg once daily", side_effects: ["Nausea", "Insomnia", "Diarrhea", "Dizziness"], price: "$7.49", manufacturer: "Ahmed Ezzat Pharma", requires_prescription: true, active_ingredient: "Sertraline Hydrochloride", form: "Film-coated tablets", image_url: null, company_id: company1Id },
    ];

    const company2Medicines = [
      { name: "Atorvastatin", generic_name: "Atorvastatin Calcium Trihydrate", category: "Cholesterol", description: "A statin that lowers LDL cholesterol and triglycerides.", dosage: "10mg–80mg once daily", side_effects: ["Myalgia", "Arthralgia", "Diarrhea", "Nasopharyngitis"], price: "$8.99", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Atorvastatin Calcium", form: "Film-coated tablets", image_url: "atorvastatin", company_id: company2Id },
      { name: "Azithromycin", generic_name: "Azithromycin Dihydrate", category: "Antibiotic", description: "A macrolide antibiotic for respiratory tract and skin infections.", dosage: "500mg Day 1, then 250mg Days 2–5", side_effects: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain"], price: "$9.99", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Azithromycin Dihydrate", form: "Film-coated tablets", image_url: "azithromycin", company_id: company2Id },
      { name: "Salbutamol", generic_name: "Albuterol Sulfate", category: "Respiratory", description: "A bronchodilator for acute bronchospasm in asthma and COPD.", dosage: "100–200mcg (1–2 puffs) every 4–6 hours", side_effects: ["Tremor", "Tachycardia", "Headache", "Dizziness"], price: "$12.99", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Salbutamol Sulfate", form: "Metered-dose inhaler", image_url: "salbutamol", company_id: company2Id },
      { name: "Losartan", generic_name: "Losartan Potassium", category: "Blood Pressure", description: "An ARB for hypertension and diabetic nephropathy.", dosage: "25mg–100mg once daily", side_effects: ["Dizziness", "Hyperkalemia", "Fatigue", "Hypotension"], price: "$6.49", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Losartan Potassium", form: "Film-coated tablets", image_url: "losartan", company_id: company2Id },
      { name: "Ciprofloxacin", generic_name: "Ciprofloxacin Hydrochloride", category: "Antibiotic", description: "A fluoroquinolone antibiotic for UTIs, respiratory, and GI infections.", dosage: "250mg–750mg every 12 hours", side_effects: ["Nausea", "Diarrhea", "Tendinopathy", "CNS effects"], price: "$11.49", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Ciprofloxacin Hydrochloride", form: "Film-coated tablets", image_url: "ciprofloxacin", company_id: company2Id },
      { name: "Milga", generic_name: "Benfotiamine + B6 + B12", category: "Nerve Tonic", description: "Neurotropic vitamin combination for peripheral neuropathy.", dosage: "1–2 tablets daily after meals", side_effects: ["Mild GI upset", "Allergic reactions (rare)", "Headache"], price: "$8.50", manufacturer: "Felopater Remon Pharma", requires_prescription: false, active_ingredient: "Benfotiamine 40mg + Pyridoxine 60mg + Cyanocobalamin 250mcg", form: "Film-coated tablets", image_url: "milga", company_id: company2Id },
      { name: "Clopidogrel", generic_name: "Clopidogrel Bisulfate", category: "Blood Thinner", description: "An antiplatelet agent to prevent heart attacks and strokes.", dosage: "75mg once daily", side_effects: ["Bleeding", "Bruising", "Itching", "Headache"], price: "$14.99", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Clopidogrel Bisulfate", form: "Film-coated tablets", image_url: null, company_id: company2Id },
      { name: "Pantoprazole", generic_name: "Pantoprazole Sodium", category: "Digestive", description: "A PPI for GERD and erosive esophagitis.", dosage: "20mg–40mg once daily", side_effects: ["Headache", "Diarrhea", "Nausea", "Abdominal pain"], price: "$6.49", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Pantoprazole Sodium", form: "Delayed-release tablets", image_url: null, company_id: company2Id },
      { name: "Metoprolol", generic_name: "Metoprolol Tartrate", category: "Blood Pressure", description: "A beta-1 blocker for hypertension and angina.", dosage: "50mg–100mg twice daily", side_effects: ["Fatigue", "Dizziness", "Bradycardia", "Cold extremities"], price: "$4.99", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Metoprolol Tartrate", form: "Tablets", image_url: null, company_id: company2Id },
      { name: "Doxycycline", generic_name: "Doxycycline Hyclate", category: "Antibiotic", description: "A tetracycline antibiotic for acne, respiratory infections, and Lyme disease.", dosage: "100mg once or twice daily", side_effects: ["Photosensitivity", "Nausea", "Esophageal irritation"], price: "$8.49", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Doxycycline Hyclate", form: "Capsules", image_url: null, company_id: company2Id },
      { name: "Montelukast", generic_name: "Montelukast Sodium", category: "Respiratory", description: "A leukotriene receptor antagonist for asthma and allergic rhinitis.", dosage: "10mg once daily in the evening", side_effects: ["Headache", "Abdominal pain", "Behavioral changes"], price: "$11.99", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Montelukast Sodium", form: "Film-coated tablets", image_url: null, company_id: company2Id },
      { name: "Fluoxetine", generic_name: "Fluoxetine Hydrochloride", category: "Mental Health", description: "An SSRI for depression, OCD, bulimia, and panic disorder.", dosage: "20mg–80mg once daily", side_effects: ["Nausea", "Insomnia", "Anxiety", "Headache"], price: "$6.99", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Fluoxetine Hydrochloride", form: "Capsules", image_url: null, company_id: company2Id },
      { name: "Ranitidine", generic_name: "Ranitidine Hydrochloride", category: "Digestive", description: "An H2 receptor antagonist for stomach acid reduction.", dosage: "150mg twice daily or 300mg at bedtime", side_effects: ["Headache", "Constipation", "Diarrhea", "Dizziness"], price: "$4.49", manufacturer: "Felopater Remon Pharma", requires_prescription: false, active_ingredient: "Ranitidine Hydrochloride", form: "Tablets", image_url: null, company_id: company2Id },
      { name: "Diclofenac", generic_name: "Diclofenac Sodium", category: "Pain Relief", description: "An NSAID for pain, inflammation, and arthritis.", dosage: "50mg 2–3 times daily", side_effects: ["GI upset", "Headache", "Dizziness", "Edema"], price: "$5.99", manufacturer: "Felopater Remon Pharma", requires_prescription: true, active_ingredient: "Diclofenac Sodium", form: "Enteric-coated tablets", image_url: null, company_id: company2Id },
    ];

    const allMedicines = [...company1Medicines, ...company2Medicines];

    const { error: insertErr } = await supabase.from("medicines").insert(allMedicines as any);
    if (insertErr) {
      results.push(`Medicine insert error: ${insertErr.message}`);
    } else {
      results.push(`Seeded ${allMedicines.length} medicines (${company1Medicines.length} for Ahmed Ezzat, ${company2Medicines.length} for Felopater Remon)`);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
