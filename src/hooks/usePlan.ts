import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { isAdmin } from "@/config/admins";

export type PlanType = "free" | "pro" | "premium" | "enterprise";

export interface UserPlan {
  type: PlanType;
  plan: PlanType;
  current_period_end?: string;
  strategies_used: number;
  strategies_limit: number;
}

const FREE_PLAN: UserPlan = {
  type: "free",
  plan: "free",
  strategies_used: 0,
  strategies_limit: 1,
};

export function usePlan() {
  const [plan, setPlan] = useState<UserPlan>(FREE_PLAN);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setPlan(FREE_PLAN);
        setLoading(false);
        return;
      }

      const userEmail = user.email?.toLowerCase();
      if (userEmail && isAdmin(userEmail)) {
        setPlan({
          type: "enterprise",
          plan: "enterprise",
          current_period_end: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          strategies_used: 0,
          strategies_limit: 9999,
        });
        setLoading(false);
        return;
      }

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();

      const { count: strategiesCount } = await supabase
        .from("strategies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const now = new Date();
      const periodEnd = subscription?.current_period_end 
        ? new Date(subscription.current_period_end) 
        : null;
      
      let userPlan = (subscription?.plan || "free") as PlanType;
      
      if (periodEnd && periodEnd < now && userPlan !== "free") {
        userPlan = "free";
      }

      const strategiesLimit = 
        userPlan === "enterprise" ? 9999 :
        userPlan === "premium" ? 999 :
        userPlan === "pro" ? 10 :
        1;

      setPlan({
        type: userPlan,
        plan: userPlan,
        current_period_end: subscription?.current_period_end || undefined,
        strategies_used: strategiesCount || 0,
        strategies_limit: strategiesLimit,
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setPlan(FREE_PLAN);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();

    const supabase = createClient();
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event: string) => {  // ✅ TYPE AJOUTÉ
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          fetchPlan();
        } else if (event === "SIGNED_OUT") {
          setPlan(FREE_PLAN);
          setLoading(false);
        }
      }
    );

    return () => {
      authSubscription.unsubscribe();
    };
  }, [fetchPlan]);

  const refresh = useCallback(() => {
    return fetchPlan();
  }, [fetchPlan]);

  const isFree = plan.type === "free";
  const isPro = plan.type === "pro";
  const isPremium = plan.type === "premium";
  const isEnterprise = plan.type === "enterprise";
  const isPaid = plan.type !== "free";
  const quotaReached = isFree && plan.strategies_used >= plan.strategies_limit;
  const quotaRemaining = Math.max(0, plan.strategies_limit - plan.strategies_used);

  return {
    plan,
    loading,
    error,
    refresh,
    isFree,
    isPro,
    isPremium,
    isEnterprise,
    isPaid,
    quotaReached,
    quotaRemaining,
  };
}