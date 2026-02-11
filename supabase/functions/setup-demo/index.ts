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

    // 1. Create admin user
    const { data: adminAuth, error: adminErr } = await supabase.auth.admin.createUser({
      email: "admin@rxvault.com",
      password: "Admin123!",
      email_confirm: true,
      user_metadata: { name: "Admin User" },
    });
    if (adminErr && !adminErr.message.includes("already")) {
      results.push(`Admin error: ${adminErr.message}`);
    } else if (adminAuth?.user) {
      await supabase.from("user_roles").update({ role: "admin" }).eq("user_id", adminAuth.user.id);
      results.push("Admin created: admin@rxvault.com / Admin123!");
    }

    // 2. Create regular user
    const { data: userAuth, error: userErr } = await supabase.auth.admin.createUser({
      email: "user@rxvault.com",
      password: "User123!",
      email_confirm: true,
      user_metadata: { name: "Ahmed Hassan" },
    });
    if (userErr && !userErr.message.includes("already")) {
      results.push(`User error: ${userErr.message}`);
    } else {
      results.push("User created: user@rxvault.com / User123!");
    }

    // 3. Create company user
    const { data: companyAuth, error: companyErr } = await supabase.auth.admin.createUser({
      email: "company@evapharma.com",
      password: "Company123!",
      email_confirm: true,
      user_metadata: { name: "EVA Pharma" },
    });

    let companyId: string | null = null;
    if (companyErr && !companyErr.message.includes("already")) {
      results.push(`Company error: ${companyErr.message}`);
    } else if (companyAuth?.user) {
      // Update role to company
      await supabase.from("user_roles").update({ role: "company" }).eq("user_id", companyAuth.user.id);
      await supabase.from("profiles").update({ company_name: "EVA Pharma" }).eq("user_id", companyAuth.user.id);

      // Create company
      const { data: companyData } = await supabase
        .from("companies")
        .insert({ name: "EVA Pharma", owner_id: companyAuth.user.id })
        .select()
        .single();
      companyId = companyData?.id || null;
      results.push("Company created: company@evapharma.com / Company123!");
    }

    // Check if already existing
    if (!companyId) {
      const { data: existingCompany } = await supabase.from("companies").select("id").limit(1).maybeSingle();
      companyId = existingCompany?.id || null;
    }

    // 4. Check if medicines already seeded
    const { count } = await supabase.from("medicines").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      results.push(`Medicines already seeded (${count} found)`);
      return new Response(JSON.stringify({ success: true, results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Seed 28 medicines
    const medicines = [
      { name: "Amoxicillin", generic_name: "Amoxicillin Trihydrate", category: "Antibiotic", description: "A penicillin-type antibiotic used to treat a wide variety of bacterial infections including ear, nose, throat, urinary tract, and skin infections. It works by inhibiting bacterial cell wall synthesis.", dosage: "250mg–500mg every 8 hours for 7–14 days", side_effects: ["Nausea", "Vomiting", "Diarrhea", "Skin rash", "Allergic reactions"], price: "$4.99", manufacturer: "Teva Pharmaceuticals", requires_prescription: true, active_ingredient: "Amoxicillin Trihydrate", form: "Capsules", image_url: "amoxicillin", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Ibuprofen", generic_name: "Ibuprofen", category: "Pain Relief", description: "A nonsteroidal anti-inflammatory drug (NSAID) that reduces hormones causing inflammation and pain. Commonly prescribed for headaches, dental pain, menstrual cramps, muscle aches, and arthritis.", dosage: "200mg–400mg every 4–6 hours (max 1200mg/day OTC)", side_effects: ["Stomach upset", "Nausea", "Dizziness", "Heartburn", "GI bleeding (rare)"], price: "$3.49", manufacturer: "Advil / Pfizer", requires_prescription: false, active_ingredient: "Ibuprofen", form: "Film-coated tablets", image_url: "ibuprofen", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Metformin", generic_name: "Metformin Hydrochloride", category: "Diabetes", description: "First-line oral antidiabetic medication for Type 2 diabetes. It decreases hepatic glucose production, intestinal glucose absorption, and improves insulin sensitivity.", dosage: "500mg–1000mg twice daily with meals", side_effects: ["Nausea", "Diarrhea", "Abdominal pain", "Metallic taste", "Vitamin B12 deficiency"], price: "$6.99", manufacturer: "Bristol-Myers Squibb", requires_prescription: true, active_ingredient: "Metformin Hydrochloride", form: "Tablets", image_url: "metformin", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Lisinopril", generic_name: "Lisinopril Dihydrate", category: "Blood Pressure", description: "An ACE inhibitor used to treat hypertension, heart failure, and to improve survival post-myocardial infarction. Relaxes blood vessels for smoother blood flow.", dosage: "10mg–40mg once daily", side_effects: ["Dry cough", "Dizziness", "Headache", "Hyperkalemia", "Angioedema (rare)"], price: "$7.49", manufacturer: "Merck & Co.", requires_prescription: true, active_ingredient: "Lisinopril", form: "Tablets", image_url: "lisinopril", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Omeprazole", generic_name: "Omeprazole Magnesium", category: "Digestive", description: "A proton pump inhibitor that blocks the enzyme system responsible for secreting hydrochloric acid. Used to treat GERD, peptic ulcers, and erosive esophagitis.", dosage: "20mg–40mg once daily before breakfast", side_effects: ["Headache", "Abdominal pain", "Nausea", "Diarrhea", "Flatulence"], price: "$5.99", manufacturer: "AstraZeneca", requires_prescription: false, active_ingredient: "Omeprazole Magnesium", form: "Delayed-release capsules", image_url: "omeprazole", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Cetirizine", generic_name: "Cetirizine Hydrochloride", category: "Allergy", description: "A second-generation antihistamine that relieves allergy symptoms including runny nose, sneezing, itchy/watery eyes, and urticaria. Selective H1 receptor inhibitor with minimal sedation.", dosage: "10mg once daily", side_effects: ["Drowsiness", "Dry mouth", "Fatigue", "Headache", "Pharyngitis"], price: "$4.29", manufacturer: "Johnson & Johnson (Zyrtec)", requires_prescription: false, active_ingredient: "Cetirizine Hydrochloride", form: "Film-coated tablets", image_url: "cetirizine", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Atorvastatin", generic_name: "Atorvastatin Calcium Trihydrate", category: "Cholesterol", description: "An HMG-CoA reductase inhibitor (statin) that lowers LDL cholesterol and triglycerides while raising HDL cholesterol. Prescribed for hyperlipidemia.", dosage: "10mg–80mg once daily", side_effects: ["Myalgia", "Arthralgia", "Diarrhea", "Nasopharyngitis", "Elevated liver enzymes"], price: "$8.99", manufacturer: "Pfizer (Lipitor)", requires_prescription: true, active_ingredient: "Atorvastatin Calcium", form: "Film-coated tablets", image_url: "atorvastatin", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Paracetamol", generic_name: "Acetaminophen", category: "Pain Relief", description: "A widely used analgesic and antipyretic that inhibits COX enzymes in the central nervous system. Effective for mild to moderate pain relief and fever reduction.", dosage: "500mg–1000mg every 4–6 hours (max 4g/day)", side_effects: ["Nausea", "Stomach pain", "Loss of appetite", "Rash", "Hepatotoxicity (overdose)"], price: "$2.99", manufacturer: "GlaxoSmithKline (Panadol)", requires_prescription: false, active_ingredient: "Paracetamol / Acetaminophen", form: "Tablets", image_url: "paracetamol", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Azithromycin", generic_name: "Azithromycin Dihydrate", category: "Antibiotic", description: "A macrolide antibiotic that inhibits bacterial protein synthesis. Used for respiratory tract infections, skin infections, otitis media, and STIs.", dosage: "500mg Day 1, then 250mg Days 2–5", side_effects: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "QT prolongation (rare)"], price: "$9.99", manufacturer: "Pfizer (Zithromax)", requires_prescription: true, active_ingredient: "Azithromycin Dihydrate", form: "Film-coated tablets", image_url: "azithromycin", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Salbutamol", generic_name: "Albuterol Sulfate", category: "Respiratory", description: "A short-acting β2-adrenergic receptor agonist bronchodilator. Relaxes airway smooth muscle to relieve acute bronchospasm in asthma and COPD.", dosage: "100–200mcg (1–2 puffs) every 4–6 hours as needed", side_effects: ["Tremor", "Tachycardia", "Headache", "Dizziness", "Hypokalemia"], price: "$12.99", manufacturer: "GlaxoSmithKline (Ventolin)", requires_prescription: true, active_ingredient: "Salbutamol Sulfate", form: "Metered-dose inhaler", image_url: "salbutamol", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Losartan", generic_name: "Losartan Potassium", category: "Blood Pressure", description: "An angiotensin II receptor blocker (ARB) that prevents vasoconstrictive effects of angiotensin II. Used for hypertension and diabetic nephropathy.", dosage: "25mg–100mg once daily", side_effects: ["Dizziness", "Hyperkalemia", "Fatigue", "Upper respiratory infection", "Hypotension"], price: "$6.49", manufacturer: "Merck & Co. (Cozaar)", requires_prescription: true, active_ingredient: "Losartan Potassium", form: "Film-coated tablets", image_url: "losartan", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Ciprofloxacin", generic_name: "Ciprofloxacin Hydrochloride", category: "Antibiotic", description: "A second-generation fluoroquinolone antibiotic with broad-spectrum activity. Used for UTIs, respiratory infections, and GI infections.", dosage: "250mg–750mg every 12 hours for 7–14 days", side_effects: ["Nausea", "Diarrhea", "Tendinopathy", "CNS effects", "Photosensitivity"], price: "$11.49", manufacturer: "Bayer AG (Cipro)", requires_prescription: true, active_ingredient: "Ciprofloxacin Hydrochloride", form: "Film-coated tablets", image_url: "ciprofloxacin", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Milga", generic_name: "Benfotiamine + Vitamin B6 + Vitamin B12", category: "Nerve Tonic", description: "A neurotropic vitamin combination for peripheral neuropathy, nerve inflammation, and vitamin B deficiency. Contains Benfotiamine 40mg, Vitamin B6 60mg, and B12 250mcg.", dosage: "1–2 tablets daily after meals", side_effects: ["Mild GI upset", "Allergic skin reactions (rare)", "Headache", "Nausea"], price: "$8.50", manufacturer: "EVA Pharma", requires_prescription: false, active_ingredient: "Benfotiamine 40mg + Pyridoxine 60mg + Cyanocobalamin 250mcg", form: "Film-coated tablets (40 tablets)", image_url: "milga", sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Aspirin", generic_name: "Acetylsalicylic Acid", category: "Pain Relief", description: "An NSAID used as analgesic, antipyretic, and anti-inflammatory. Low doses are used for cardiovascular protection against heart attacks and strokes.", dosage: "325mg–650mg every 4–6 hours; 81mg daily for cardiac", side_effects: ["GI irritation", "Bleeding risk", "Tinnitus", "Reye's syndrome (children)", "Allergic reactions"], price: "$2.49", manufacturer: "Bayer AG", requires_prescription: false, active_ingredient: "Acetylsalicylic Acid", form: "Tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Amlodipine", generic_name: "Amlodipine Besylate", category: "Blood Pressure", description: "A calcium channel blocker that relaxes blood vessels and improves blood flow. Used for hypertension and angina pectoris.", dosage: "5mg–10mg once daily", side_effects: ["Edema", "Flushing", "Headache", "Dizziness", "Fatigue"], price: "$5.99", manufacturer: "Pfizer (Norvasc)", requires_prescription: true, active_ingredient: "Amlodipine Besylate", form: "Tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Clopidogrel", generic_name: "Clopidogrel Bisulfate", category: "Blood Thinner", description: "An antiplatelet agent that inhibits blood clot formation. Used to prevent heart attacks and strokes in patients with cardiovascular disease.", dosage: "75mg once daily", side_effects: ["Bleeding", "Bruising", "Itching", "Headache", "Diarrhea"], price: "$14.99", manufacturer: "Sanofi (Plavix)", requires_prescription: true, active_ingredient: "Clopidogrel Bisulfate", form: "Film-coated tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Levothyroxine", generic_name: "Levothyroxine Sodium", category: "Thyroid", description: "A synthetic thyroid hormone replacement for hypothyroidism. Restores normal thyroid hormone levels to maintain metabolism and energy.", dosage: "25mcg–200mcg once daily on empty stomach", side_effects: ["Weight loss", "Tremors", "Insomnia", "Tachycardia", "Anxiety"], price: "$7.99", manufacturer: "AbbVie (Synthroid)", requires_prescription: true, active_ingredient: "Levothyroxine Sodium", form: "Tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Pantoprazole", generic_name: "Pantoprazole Sodium", category: "Digestive", description: "A proton pump inhibitor for GERD, erosive esophagitis, and Zollinger-Ellison syndrome. Reduces stomach acid production for healing and symptom relief.", dosage: "20mg–40mg once daily", side_effects: ["Headache", "Diarrhea", "Nausea", "Abdominal pain", "Flatulence"], price: "$6.49", manufacturer: "Wyeth (Protonix)", requires_prescription: true, active_ingredient: "Pantoprazole Sodium", form: "Delayed-release tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Metoprolol", generic_name: "Metoprolol Tartrate", category: "Blood Pressure", description: "A selective beta-1 blocker used for hypertension, angina, heart failure, and post-MI protection. Slows heart rate and reduces blood pressure.", dosage: "50mg–100mg twice daily", side_effects: ["Fatigue", "Dizziness", "Bradycardia", "Cold extremities", "Depression"], price: "$4.99", manufacturer: "AstraZeneca (Lopressor)", requires_prescription: true, active_ingredient: "Metoprolol Tartrate", form: "Tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Doxycycline", generic_name: "Doxycycline Hyclate", category: "Antibiotic", description: "A tetracycline antibiotic effective against a wide range of bacteria. Used for acne, respiratory infections, Lyme disease, and malaria prevention.", dosage: "100mg once or twice daily", side_effects: ["Photosensitivity", "Nausea", "Esophageal irritation", "Diarrhea", "Tooth discoloration"], price: "$8.49", manufacturer: "Pfizer", requires_prescription: true, active_ingredient: "Doxycycline Hyclate", form: "Capsules", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Loratadine", generic_name: "Loratadine", category: "Allergy", description: "A second-generation antihistamine for allergic rhinitis and chronic urticaria. Non-drowsy formula provides 24-hour allergy relief.", dosage: "10mg once daily", side_effects: ["Headache", "Drowsiness (rare)", "Dry mouth", "Fatigue", "Nervousness"], price: "$3.99", manufacturer: "Bayer (Claritin)", requires_prescription: false, active_ingredient: "Loratadine", form: "Tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Prednisone", generic_name: "Prednisone", category: "Anti-inflammatory", description: "A corticosteroid that suppresses the immune system and reduces inflammation. Used for asthma, allergies, arthritis, inflammatory bowel disease, and autoimmune conditions.", dosage: "5mg–60mg daily, tapered gradually", side_effects: ["Weight gain", "Mood changes", "Insomnia", "Increased appetite", "Osteoporosis (long-term)"], price: "$5.49", manufacturer: "Various manufacturers", requires_prescription: true, active_ingredient: "Prednisone", form: "Tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Gabapentin", generic_name: "Gabapentin", category: "Nerve Pain", description: "An anticonvulsant used for neuropathic pain, postherpetic neuralgia, and as adjunctive therapy for partial seizures. Modulates calcium channels.", dosage: "300mg–600mg three times daily", side_effects: ["Dizziness", "Drowsiness", "Ataxia", "Fatigue", "Peripheral edema"], price: "$9.99", manufacturer: "Pfizer (Neurontin)", requires_prescription: true, active_ingredient: "Gabapentin", form: "Capsules", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Sertraline", generic_name: "Sertraline Hydrochloride", category: "Mental Health", description: "A selective serotonin reuptake inhibitor (SSRI) antidepressant for major depressive disorder, OCD, PTSD, social anxiety, and panic disorder.", dosage: "50mg–200mg once daily", side_effects: ["Nausea", "Insomnia", "Diarrhea", "Dizziness", "Sexual dysfunction"], price: "$7.49", manufacturer: "Pfizer (Zoloft)", requires_prescription: true, active_ingredient: "Sertraline Hydrochloride", form: "Film-coated tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Fluconazole", generic_name: "Fluconazole", category: "Antifungal", description: "A triazole antifungal for candidiasis, cryptococcal meningitis, and fungal infections. Inhibits fungal cell membrane synthesis.", dosage: "150mg single dose or 50mg–200mg daily", side_effects: ["Nausea", "Headache", "Abdominal pain", "Diarrhea", "Liver enzyme elevation"], price: "$6.99", manufacturer: "Pfizer (Diflucan)", requires_prescription: true, active_ingredient: "Fluconazole", form: "Capsules", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Diclofenac", generic_name: "Diclofenac Sodium", category: "Pain Relief", description: "An NSAID with potent analgesic and anti-inflammatory properties. Used for osteoarthritis, rheumatoid arthritis, acute pain, and dysmenorrhea.", dosage: "50mg two to three times daily", side_effects: ["GI upset", "Headache", "Dizziness", "Edema", "Elevated liver enzymes"], price: "$5.49", manufacturer: "Novartis (Voltaren)", requires_prescription: true, active_ingredient: "Diclofenac Sodium", form: "Enteric-coated tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Ranitidine", generic_name: "Ranitidine Hydrochloride", category: "Digestive", description: "An H2 receptor antagonist that reduces stomach acid production. Used for peptic ulcers, GERD, and conditions involving excessive acid production.", dosage: "150mg twice daily or 300mg at bedtime", side_effects: ["Headache", "Dizziness", "Constipation", "Diarrhea", "Nausea"], price: "$4.49", manufacturer: "Sanofi (Zantac)", requires_prescription: false, active_ingredient: "Ranitidine Hydrochloride", form: "Film-coated tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
      { name: "Montelukast", generic_name: "Montelukast Sodium", category: "Respiratory", description: "A leukotriene receptor antagonist for asthma prevention and allergic rhinitis. Blocks inflammatory mediators in the airways.", dosage: "10mg once daily in the evening", side_effects: ["Headache", "Abdominal pain", "Behavioral changes", "Upper respiratory infection", "Cough"], price: "$11.99", manufacturer: "Merck (Singulair)", requires_prescription: true, active_ingredient: "Montelukast Sodium", form: "Film-coated tablets", image_url: null, sign_language_video_url: "https://www.youtube.com/embed/RHWv4MwGOZE", company_id: companyId },
    ];

    const { error: insertErr } = await supabase.from("medicines").insert(medicines);
    if (insertErr) {
      results.push(`Medicine insert error: ${insertErr.message}`);
    } else {
      results.push(`${medicines.length} medicines seeded successfully`);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
