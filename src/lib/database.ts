import { createClient } from "@/lib/supabase";

// ✅ INTERFACES ÉLARGIES avec toutes les propriétés possibles

export interface Subscription {
  id: string;
  user_id: string;
  plan: "free" | "pro" | "premium";
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Strategy {
  id: string;
  user_id: string;
  title: string;
  industry: string;
  objective: string;
  data: any;
  calendar?: any[]; // ✅ AJOUTÉ pour calendar/page.tsx
  created_at: string;
  updated_at: string;
  [key: string]: any; // ✅ Permet toute propriété additionnelle
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  company_name?: string;
  onboarding_completed?: boolean;
  current_onboarding_step?: number;
  generation_completed?: boolean;
  first_strategy_created?: boolean;
  created_at?: string;
  updated_at?: string;
  // ✅ TOUTES les propriétés business ajoutées
  business_name?: string;
  website?: string;
  industry?: string;
  country?: string;
  target_audience?: string;
  business_description?: string;
  offer_description?: string;
  description?: string;
  price_range?: string;
  pricing_positioning?: string;
  main_goal?: string;
  goal?: string;
  revenue_range?: string;
  platforms?: string[];
  usp?: string;
  main_challenge?: string;
  services?: string[];
  goals?: string[];
  [key: string]: any; // ✅ Permet toute propriété additionnelle
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name?: string;
  website?: string;
  industry?: string;
  country?: string;
  target_audience?: string;
  business_description?: string;
  offer_description?: string;
  description?: string;
  price_range?: string;
  pricing_positioning?: string;
  main_goal?: string;
  goal?: string;
  revenue_range?: string;
  platforms?: string[];
  usp?: string;
  main_challenge?: string;
  services?: string[];
  goals?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface Competitor {
  id: string;
  strategy_id?: string;
  user_id: string;
  name: string;
  website?: string;
  country?: string;
  estimated_traffic?: number;
  market_position?: string;
  seo_visibility?: number;
  top_channels?: string[];
  main_offer?: string;
  strengths?: string[];
  weaknesses?: string[];
  unique_selling_proposition?: string;
  customer_sentiment?: string;
  growth_score?: number;
  trend_score?: number;
  competitive_threat?: string;
  advertising_activity?: any;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// ===== SUBSCRIPTIONS =====

export async function getUserSubscription(userId?: string): Promise<Subscription | null> {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }
  
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }

  return subscription;
}

// ===== STRATEGIES =====

export async function getUserStrategiesCount(userId?: string): Promise<number> {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;
    userId = user.id;
  }
  
  const { count, error } = await supabase
    .from("strategies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error counting strategies:", error);
    return 0;
  }

  return count || 0;
}

export async function getUserStrategies(userId?: string): Promise<Strategy[]> {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    userId = user.id;
  }
  
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching strategies:", error);
    return [];
  }

  return data || [];
}

// ✅ Alias pour getStrategies - accepte 0 ou 1 argument
export async function getStrategies(userId?: string): Promise<Strategy[]> {
  return getUserStrategies(userId);
}

export async function getStrategyById(strategyId?: string): Promise<Strategy | null> {
  const supabase = createClient();
  
  if (!strategyId) return null;
  
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("id", strategyId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching strategy:", error);
    return null;
  }

  return data;
}

// ✅ createStrategy flexible - accepte 1 ou 2 arguments
export async function createStrategy(
  userIdOrData?: string | any,
  strategyData?: any
): Promise<Strategy | null> {
  const supabase = createClient();
  
  let insertData: any = {};
  
  // Récupérer l'user ID si pas fourni
  let userId: string | null = null;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) userId = user.id;
  
  if (typeof userIdOrData === "string" && strategyData) {
    // createStrategy(userId, strategyData)
    insertData = { user_id: userIdOrData, ...strategyData };
  } else if (typeof userIdOrData === "object" && userIdOrData !== null) {
    // createStrategy(strategyData) - un seul argument objet
    insertData = { ...userIdOrData };
    if (!insertData.user_id && userId) {
      insertData.user_id = userId;
    }
  }
  
  if (!insertData.user_id) {
    console.error("No user_id for createStrategy");
    return null;
  }
  
  const { data, error } = await supabase
    .from("strategies")
    .insert({
      ...insertData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating strategy:", error);
    return null;
  }

  return data;
}

export async function updateStrategy(
  strategyId?: string,
  updates?: any
): Promise<boolean> {
  const supabase = createClient();
  
  if (!strategyId || !updates) return false;
  
  const { error } = await supabase
    .from("strategies")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", strategyId);

  if (error) {
    console.error("Error updating strategy:", error);
    return false;
  }

  return true;
}

export async function deleteStrategy(strategyId?: string): Promise<boolean> {
  const supabase = createClient();
  
  if (!strategyId) return false;
  
  const { error } = await supabase
    .from("strategies")
    .delete()
    .eq("id", strategyId);

  if (error) {
    console.error("Error deleting strategy:", error);
    return false;
  }

  return true;
}

// ===== USER PROFILES =====

export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

// ✅ getBusinessProfile - accepte 0 ou 1 argument
export async function getBusinessProfile(userId?: string): Promise<BusinessProfile | null> {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching business profile:", error);
    return null;
  }

  return data as BusinessProfile | null;
}

export async function updateUserProfile(
  userId?: string,
  updates?: any
): Promise<boolean> {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    userId = user.id;
  }
  
  if (!updates) return false;
  
  const { error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating profile:", error);
    return false;
  }

  return true;
}

// ✅ saveBusinessProfile - accepte 1 ou 2 arguments
export async function saveBusinessProfile(
  userIdOrData?: string | any,
  profileData?: any
): Promise<BusinessProfile | null> {
  const supabase = createClient();
  
  let userId: string | null = null;
  let data: any = {};
  
  const { data: { user } } = await supabase.auth.getUser();
  if (user) userId = user.id;
  
  if (typeof userIdOrData === "string" && profileData) {
    // saveBusinessProfile(userId, profileData)
    userId = userIdOrData;
    data = profileData;
  } else if (typeof userIdOrData === "object" && userIdOrData !== null) {
    // saveBusinessProfile(profileData) - un seul argument
    data = userIdOrData;
  }
  
  if (!userId) {
    console.error("No user_id for saveBusinessProfile");
    return null;
  }
  
  // Vérifier si le profil existe
  const existing = await getBusinessProfile(userId);
  
  if (existing) {
    const { data: updated, error } = await supabase
      .from("profiles")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating business profile:", error);
      return null;
    }

    return updated as BusinessProfile;
  } else {
    const { data: created, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating business profile:", error);
      return null;
    }

    return created as BusinessProfile;
  }
}

// ===== COMPETITORS =====

// ✅ getCompetitors - accepte 0, 1 ou 2 arguments
export async function getCompetitors(
  userIdOrStrategyId?: string,
  options?: { byStrategy?: boolean } | any
): Promise<Competitor[]> {
  const supabase = createClient();
  
  let userId: string | null = null;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) userId = user.id;
  
  let query = supabase
    .from("competitors")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.byStrategy && userIdOrStrategyId) {
    query = query.eq("strategy_id", userIdOrStrategyId);
  } else if (userIdOrStrategyId) {
    query = query.eq("user_id", userIdOrStrategyId);
  } else if (userId) {
    query = query.eq("user_id", userId);
  } else {
    return [];
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching competitors:", error);
    return [];
  }

  return data || [];
}

// ✅ createCompetitor - accepte 1 ou 2 arguments
export async function createCompetitor(
  userIdOrData?: string | any,
  competitorData?: any
): Promise<Competitor | null> {
  const supabase = createClient();
  
  let userId: string | null = null;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) userId = user.id;
  
  let data: any = {};
  
  if (typeof userIdOrData === "string" && competitorData) {
    // createCompetitor(userId, competitorData)
    data = { user_id: userIdOrData, ...competitorData };
  } else if (typeof userIdOrData === "object" && userIdOrData !== null) {
    // createCompetitor(competitorData) - un seul argument
    data = { ...userIdOrData };
    if (!data.user_id && userId) {
      data.user_id = userId;
    }
  }
  
  if (!data.user_id) {
    console.error("No user_id for createCompetitor");
    return null;
  }
  
  const { data: created, error } = await supabase
    .from("competitors")
    .insert({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating competitor:", error);
    return null;
  }

  return created;
}

// ✅ updateCompetitor - accepte 1 ou 2 arguments
export async function updateCompetitor(
  competitorIdOrData?: string | any,
  updates?: any
): Promise<boolean> {
  const supabase = createClient();
  
  if (typeof competitorIdOrData === "string" && updates) {
    const { error } = await supabase
      .from("competitors")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", competitorIdOrData);

    if (error) {
      console.error("Error updating competitor:", error);
      return false;
    }
    return true;
  }
  
  return false;
}

// ✅ deleteCompetitor
export async function deleteCompetitor(competitorId?: string): Promise<boolean> {
  const supabase = createClient();
  
  if (!competitorId) return false;
  
  const { error } = await supabase
    .from("competitors")
    .delete()
    .eq("id", competitorId);

  if (error) {
    console.error("Error deleting competitor:", error);
    return false;
  }

  return true;
}