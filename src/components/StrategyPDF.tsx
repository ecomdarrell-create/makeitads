import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Utiliser Helvetica (police par défaut, toujours disponible)
const styles = StyleSheet.create({
  // ===== STYLES GÉNÉRAUX =====
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },
  
  // ===== COVER PAGE =====
  coverPage: {
    padding: 60,
    backgroundColor: "#0f0f1a",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  coverLogo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 10,
    letterSpacing: 2,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 60,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 1.3,
  },
  coverMeta: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 40,
  },
  coverScore: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#8b5cf6",
    marginBottom: 10,
  },
  coverScoreLabel: {
    fontSize: 14,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  coverDate: {
    position: "absolute",
    bottom: 60,
    fontSize: 10,
    color: "#64748b",
  },
  
  // ===== HEADER STANDARD =====
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #6366f1",
    paddingBottom: 15,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 5,
  },
  strategyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 5,
  },
  meta: {
    fontSize: 10,
    color: "#64748b",
  },
  
  // ===== SECTIONS =====
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 8,
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
    marginTop: 15,
  },
  text: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.6,
    marginBottom: 5,
  },
  textBold: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 5,
  },
  bullet: {
    fontSize: 10,
    color: "#334155",
    marginLeft: 15,
    marginBottom: 4,
  },
  
  // ===== CARTES =====
  card: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 6,
  },
  
  // ===== METRICS =====
  metricsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  metricBox: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  
  // ===== BUDGET BARS =====
  budgetItem: {
    marginBottom: 10,
  },
  budgetHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  budgetLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
  },
  budgetPercent: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#6366f1",
  },
  budgetBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  budgetFill: {
    height: "100%",
    backgroundColor: "#6366f1",
  },
  
  // ===== COMPETITORS =====
  competitorCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  competitorName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
  },
  competitorMeta: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 8,
  },
  strengthsWeaknesses: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  swColumn: {
    flex: 1,
  },
  swTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
  },
  strengthsTitle: {
    color: "#10b981",
  },
  weaknessesTitle: {
    color: "#ef4444",
  },
  swItem: {
    fontSize: 9,
    color: "#334155",
    marginBottom: 2,
    marginLeft: 10,
  },
  
  // ===== PERSONAS =====
  personaCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  personaName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 8,
  },
  personaGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  personaColumn: {
    flex: 1,
  },
  personaLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  personaText: {
    fontSize: 10,
    color: "#334155",
    marginBottom: 6,
  },
  
  // ===== CAMPAIGNS =====
  campaignCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    borderLeft: "3px solid #6366f1",
  },
  campaignPlatform: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  campaignHeadline: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
  },
  campaignText: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.5,
    marginBottom: 6,
  },
  campaignMeta: {
    fontSize: 9,
    color: "#64748b",
  },
  
  // ===== AD COPY =====
  adCopyBox: {
    backgroundColor: "#f1f5f9",
    borderLeft: "3px solid #6366f1",
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
  adCopyText: {
    fontSize: 10,
    color: "#1e293b",
    lineHeight: 1.5,
  },
  adCopyMeta: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 4,
  },
  
  // ===== ROADMAP =====
  roadmapItem: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  roadmapNumber: {
    width: 24,
    height: 24,
    backgroundColor: "#6366f1",
    color: "#ffffff",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: "bold",
    flexShrink: 0,
  },
  roadmapContent: {
    flex: 1,
  },
  roadmapTask: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 3,
  },
  roadmapMeta: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 2,
  },
  roadmapResults: {
    fontSize: 9,
    color: "#10b981",
  },
  
  // ===== RECOMMENDATIONS =====
  recommendationCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  recommendationHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  recommendationTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
  },
  recommendationBadge: {
    fontSize: 8,
    padding: "2 6",
    borderRadius: 3,
    textTransform: "uppercase",
  },
  recommendationBadgeHigh: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },
  recommendationBadgeMedium: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
  },
  recommendationBadgeLow: {
    backgroundColor: "#d1fae5",
    color: "#059669",
  },
  recommendationText: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.5,
  },
  
  // ===== AI RECOMMENDATION =====
  aiRecommendationBox: {
    backgroundColor: "#f8fafc",
    border: "2px solid #6366f1",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  aiTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 8,
  },
  aiOpportunity: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  aiMetrics: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  aiMetric: {
    flex: 1,
  },
  aiMetricLabel: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 2,
  },
  aiMetricValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
  },
  
  // ===== FOOTER =====
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
  },
  watermark: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#cbd5e1",
  },
  
  // ===== UTILS =====
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 15,
  },
});

interface StrategyPDFProps {
  strategy: any;
  isFree: boolean;
}

export default function StrategyPDF({ strategy, isFree }: StrategyPDFProps) {
  // Extraire les données
  const overview = strategy.overview || {};
  const market = strategy.market || {};
  const competitors = strategy.competitors || [];
  const personas = strategy.personas || [];
  const audience = strategy.audience || {};
  const campaigns = strategy.campaigns || [];
  const creative = strategy.creative || {};
  const analytics = strategy.analytics || {};
  const roadmap = strategy.roadmap || [];
  const recommendations = strategy.recommendations || [];
  const aiRecommendation = strategy.aiRecommendation || {};

  return (
    <Document>
      {/* ===== PAGE 1 : COVER ===== */}
      <Page style={styles.coverPage}>
        <Text style={styles.coverLogo}>MakeItAds</Text>
        <Text style={styles.coverSubtitle}>AI Marketing Strategist</Text>
        
        <View style={{ marginBottom: 40 }}>
          <Text style={styles.coverTitle}>
            {strategy.name || "Marketing Strategy"}
          </Text>
          <Text style={styles.coverMeta}>
            {strategy.industry || "Industry"} • {strategy.country || "Global"}
          </Text>
          <Text style={styles.coverMeta}>
            Budget: ${strategy.budget?.toLocaleString() || 0}/month
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.coverScore}>
            {overview.marketScore || 0}
          </Text>
          <Text style={styles.coverScoreLabel}>Market Score</Text>
        </View>

        <Text style={styles.coverDate}>
          Generated on {new Date().toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </Text>
      </Page>

      {/* ===== PAGE 2 : EXECUTIVE SUMMARY ===== */}
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>MakeItAds</Text>
          <Text style={styles.strategyName}>Executive Summary</Text>
          <Text style={styles.meta}>
            {strategy.name || "Untitled Strategy"} • {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Business Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Overview</Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Industry:</Text> {strategy.industry || "Not specified"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Location:</Text> {strategy.city ? `${strategy.city}, ` : ""}{strategy.country || "Not specified"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Monthly Budget:</Text> ${strategy.budget?.toLocaleString() || 0}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Primary Goal:</Text> {strategy.goal || "Not specified"}
          </Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Market Score</Text>
              <Text style={styles.metricValue}>{overview.marketScore || 0}/100</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Growth Potential</Text>
              <Text style={styles.metricValue}>{overview.growthPotential || "N/A"}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Est. ROI</Text>
              <Text style={styles.metricValue}>{overview.estimatedROI || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Market Overview */}
        {market.marketSize && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Overview</Text>
            <Text style={styles.text}>
              <Text style={styles.textBold}>Market Size:</Text> {market.marketSize}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.textBold}>Growth Rate:</Text> {market.growthRate ? `${market.growthRate}% annually` : "N/A"}
            </Text>
            {market.trends && market.trends.length > 0 && (
              <View>
                <Text style={styles.subsectionTitle}>Key Trends</Text>
                {market.trends.slice(0, 3).map((trend: string, i: number) => (
                  <Text key={i} style={styles.bullet}>• {trend}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* AI Recommendation Highlight */}
        {aiRecommendation.opportunity && (
          <View style={styles.aiRecommendationBox}>
            <Text style={styles.aiTitle}>AI Strategic Recommendation</Text>
            <Text style={styles.aiOpportunity}>{aiRecommendation.opportunity}</Text>
            <View style={styles.aiMetrics}>
              <View style={styles.aiMetric}>
                <Text style={styles.aiMetricLabel}>Confidence</Text>
                <Text style={styles.aiMetricValue}>{aiRecommendation.confidence || "N/A"}</Text>
              </View>
              <View style={styles.aiMetric}>
                <Text style={styles.aiMetricLabel}>Expected Result</Text>
                <Text style={styles.aiMetricValue}>{aiRecommendation.result || "N/A"}</Text>
              </View>
              <View style={styles.aiMetric}>
                <Text style={styles.aiMetricLabel}>Priority</Text>
                <Text style={styles.aiMetricValue}>{aiRecommendation.priority || "N/A"}</Text>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          © {new Date().getFullYear()} MakeItAds • AI Marketing Strategist • Page 2
        </Text>
      </Page>

      {/* ===== PAGE 3 : MARKET ANALYSIS ===== */}
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>MakeItAds</Text>
          <Text style={styles.strategyName}>Market Analysis</Text>
          <Text style={styles.meta}>
            {strategy.name || "Untitled Strategy"}
          </Text>
        </View>

        {/* Market Size & Growth */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Size & Growth</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Market Size</Text>
              <Text style={styles.metricValue}>{market.marketSize || "N/A"}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Growth Rate</Text>
              <Text style={styles.metricValue}>{market.growthRate ? `${market.growthRate}%` : "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Trends */}
        {market.trends && market.trends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Trends (2024-2025)</Text>
            {market.trends.map((trend: string, i: number) => (
              <Text key={i} style={styles.bullet}>• {trend}</Text>
            ))}
          </View>
        )}

        {/* Opportunities */}
        {market.opportunities && market.opportunities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Opportunities</Text>
            {market.opportunities.map((opp: string, i: number) => (
              <Text key={i} style={styles.bullet}>• {opp}</Text>
            ))}
          </View>
        )}

        {/* Threats */}
        {market.threats && market.threats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Threats</Text>
            {market.threats.map((threat: string, i: number) => (
              <Text key={i} style={styles.bullet}>• {threat}</Text>
            ))}
          </View>
        )}

        {/* Customer Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Insights</Text>
          
          {market.customerPainPoints && market.customerPainPoints.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.subsectionTitle}>Customer Pain Points</Text>
              {market.customerPainPoints.map((pain: string, i: number) => (
                <Text key={i} style={styles.bullet}>• {pain}</Text>
              ))}
            </View>
          )}

          {market.buyingMotivations && market.buyingMotivations.length > 0 && (
            <View>
              <Text style={styles.subsectionTitle}>Buying Motivations</Text>
              {market.buyingMotivations.map((motivation: string, i: number) => (
                <Text key={i} style={styles.bullet}>• {motivation}</Text>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} MakeItAds • AI Marketing Strategist • Page 3
        </Text>
      </Page>

      {/* ===== PAGE 4 : COMPETITOR INTELLIGENCE ===== */}
      {competitors.length > 0 && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>MakeItAds</Text>
            <Text style={styles.strategyName}>Competitor Intelligence</Text>
            <Text style={styles.meta}>
              {strategy.name || "Untitled Strategy"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Competitive Landscape</Text>
            <Text style={styles.text}>
              Analysis of {competitors.length} key competitors in your market
            </Text>
          </View>

          {competitors.slice(0, 5).map((competitor: any, index: number) => (
            <View key={index} style={styles.competitorCard}>
              <Text style={styles.competitorName}>{competitor.name}</Text>
              <Text style={styles.competitorMeta}>
                {competitor.position} • {competitor.website || "Website not available"}
              </Text>
              
              <View style={styles.strengthsWeaknesses}>
                <View style={styles.swColumn}>
                  <Text style={[styles.swTitle, styles.strengthsTitle]}>Strengths</Text>
                  {competitor.strengths?.slice(0, 3).map((s: string, i: number) => (
                    <Text key={i} style={styles.swItem}>• {s}</Text>
                  ))}
                </View>
                <View style={styles.swColumn}>
                  <Text style={[styles.swTitle, styles.weaknessesTitle]}>Weaknesses</Text>
                  {competitor.weaknesses?.slice(0, 3).map((w: string, i: number) => (
                    <Text key={i} style={styles.swItem}>• {w}</Text>
                  ))}
                </View>
              </View>

              {competitor.opportunity !== undefined && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.textBold}>
                    Opportunity Score: {competitor.opportunity}%
                  </Text>
                </View>
              )}
            </View>
          ))}

          <Text style={styles.footer}>
            © {new Date().getFullYear()} MakeItAds • AI Marketing Strategist • Page 4
          </Text>
        </Page>
      )}

      {/* ===== PAGE 5 : AUDIENCE PERSONAS ===== */}
      {(personas.length > 0 || audience.primaryPersona) && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>MakeItAds</Text>
            <Text style={styles.strategyName}>Audience Personas</Text>
            <Text style={styles.meta}>
              {strategy.name || "Untitled Strategy"}
            </Text>
          </View>

          {personas.slice(0, 2).map((persona: any, index: number) => (
            <View key={index} style={styles.personaCard}>
              <Text style={styles.personaName}>
                {index === 0 ? "Primary Persona" : "Secondary Persona"}: {persona.name}
              </Text>
              
              <View style={styles.personaGrid}>
                <View style={styles.personaColumn}>
                  <Text style={styles.personaLabel}>Demographics</Text>
                  <Text style={styles.personaText}>
                    Age: {persona.age || "N/A"}
                  </Text>
                  <Text style={styles.personaText}>
                    Gender: {persona.gender || "N/A"}
                  </Text>
                  <Text style={styles.personaText}>
                    Income: {persona.income || "N/A"}
                  </Text>
                  <Text style={styles.personaText}>
                    Occupation: {persona.occupation || "N/A"}
                  </Text>
                </View>

                <View style={styles.personaColumn}>
                  <Text style={styles.personaLabel}>Goals & Pain Points</Text>
                  {persona.goals?.slice(0, 2).map((g: string, i: number) => (
                    <Text key={i} style={styles.bullet}>• {g}</Text>
                  ))}
                  {persona.painPoints?.slice(0, 2).map((p: string, i: number) => (
                    <Text key={i} style={styles.bullet}>• {p}</Text>
                  ))}
                </View>
              </View>

              {persona.preferredChannels && persona.preferredChannels.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.personaLabel}>Preferred Channels</Text>
                  <Text style={styles.personaText}>{persona.preferredChannels.join(", ")}</Text>
                </View>
              )}

              {persona.buyingBehavior && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.personaLabel}>Buying Behavior</Text>
                  <Text style={styles.personaText}>{persona.buyingBehavior}</Text>
                </View>
              )}
            </View>
          ))}

          {audience.demographics && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Market Demographics</Text>
              {Object.entries(audience.demographics).map(([key, value]: [string, any]) => (
                <Text key={key} style={styles.text}>
                  <Text style={styles.textBold}>{key}:</Text> {String(value)}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.footer}>
            © {new Date().getFullYear()} MakeItAds • AI Marketing Strategist • Page 5
          </Text>
        </Page>
      )}

      {/* ===== PAGE 6 : BUDGET ALLOCATION ===== */}
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>MakeItAds</Text>
          <Text style={styles.strategyName}>Budget Allocation</Text>
          <Text style={styles.meta}>
            {strategy.name || "Untitled Strategy"} • Total: ${strategy.budget?.toLocaleString() || 0}/month
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Distribution</Text>
          
          {overview.budgetSplit && Object.entries(overview.budgetSplit).map(([platform, percentage]: [string, any]) => {
            const dollarAmount = strategy.budget ? Math.round((strategy.budget * percentage) / 100) : 0;
            return (
              <View key={platform} style={styles.budgetItem}>
                <View style={styles.budgetHeader}>
                  <Text style={styles.budgetLabel}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
                  <Text style={styles.budgetPercent}>{percentage}% (${dollarAmount.toLocaleString()})</Text>
                </View>
                <View style={styles.budgetBar}>
                  <View style={[styles.budgetFill, { width: `${percentage}%` }]} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.divider} />

        {/* Allocation Strategy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allocation Strategy</Text>
          <Text style={styles.text}>
            The budget allocation is optimized based on your target audience, industry benchmarks, 
            and expected ROI. Primary focus is on platforms where your audience is most active 
            and engaged.
          </Text>
        </View>

        {/* Expected Outcomes */}
        {overview.estimatedROI && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expected Outcomes</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Projected ROI</Text>
              <Text style={styles.text}>{overview.estimatedROI} within 90 days</Text>
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          © {new Date().getFullYear()} MakeItAds • AI Marketing Strategist • Page 6
        </Text>
      </Page>

      {/* ===== PAGES 7-8 : CAMPAIGNS & CREATIVE ===== */}
      {campaigns.length > 0 && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>MakeItAds</Text>
            <Text style={styles.strategyName}>Campaign Strategy</Text>
            <Text style={styles.meta}>
              {strategy.name || "Untitled Strategy"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Planned Campaigns</Text>
            <Text style={styles.text}>
              {campaigns.length} strategic campaigns designed to achieve your goals
            </Text>
          </View>

          {campaigns.slice(0, 5).map((campaign: any, index: number) => (
            <View key={index} style={styles.campaignCard}>
              <Text style={styles.campaignPlatform}>{campaign.platform}</Text>
              <Text style={styles.campaignHeadline}>{campaign.headline}</Text>
              <Text style={styles.campaignText}>{campaign.text}</Text>
              <View style={styles.campaignMeta}>
                <Text>Budget: {campaign.budget} • Reach: {campaign.reach}</Text>
                <Text>Objective: {campaign.objective} • Duration: {campaign.duration || "Ongoing"}</Text>
              </View>
            </View>
          ))}

          <Text style={styles.footer}>
            © {new Date().getFullYear()} MakeItAds • AI Marketing Strategist • Page 7
          </Text>
        </Page>
      )}

      {/* ===== CREATIVE DIRECTION ===== */}
      {creative.adCopy && creative.adCopy.length > 0 && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>MakeItAds</Text>
            <Text style={styles.strategyName}>Creative Direction</Text>
            <Text style={styles.meta}>
              {strategy.name || "Untitled Strategy"}
            </Text>
          </View>

          {/* Ad Copy Examples */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ad Copy Examples</Text>
            {creative.adCopy.slice(0, 4).map((copy: any, index: number) => (
              <View key={index} style={styles.adCopyBox}>
                <Text style={styles.textBold}>{copy.headline}</Text>
                <Text style={styles.adCopyText}>{copy.primaryText}</Text>
                {copy.cta && (
                  <Text style={styles.adCopyMeta}>CTA: {copy.cta}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Visual Direction */}
          {creative.visualDirection && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Visual Direction</Text>
              <Text style={styles.text}>{creative.visualDirection}</Text>
            </View>
          )}

          {/* Brand Voice */}
          {creative.brandVoice && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Brand Voice</Text>
              <Text style={styles.text}>{creative.brandVoice}</Text>
            </View>
          )}

          {/* Color Palette */}
          {creative.colorPalette && creative.colorPalette.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color Palette</Text>
              <Text style={styles.text}>{creative.colorPalette.join(", ")}</Text>
            </View>
          )}

          <Text style={styles.footer}>
            © {new Date().getFullYear()} MakeItAds • AI Marketing Strategist • Page 8
          </Text>
        </Page>
      )}

      {/* ===== PAGE 9 : 90-DAY ROADMAP ===== */}
      {roadmap.length > 0 && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>MakeItAds</Text>
            <Text style={styles.strategyName}>90-Day Roadmap</Text>
            <Text style={styles.meta}>
              {strategy.name || "Untitled Strategy"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Action Plan</Text>
            <Text style={styles.text}>
              Month-by-month implementation plan to achieve your goals
            </Text>
          </View>

          {roadmap.slice(0, 6).map((item: any, index: number) => (
            <View key={index} style={styles.roadmapItem}>
              <View style={styles.roadmapNumber}>{index + 1}</View>
              <View style={styles.roadmapContent}>
                <Text style={styles.roadmapTask}>{item.task}</Text>
                <Text style={styles.roadmapMeta}>{item.month} • Priority: {item.priority}</Text>
                {item.impact && <Text style={styles.text}>Impact: {item.impact}</Text>}
                {item.difficulty && <Text style={styles.text}>Difficulty: {item.difficulty}</Text>}
                <Text style={styles.roadmapResults}>Expected: {item.results}</Text>
              </View>
            </View>
          ))}

          <Text style={styles.footer}>
            © {new Date().getFullYear()} MakeItAds • AI Marketing Strategist • Page 9
          </Text>
        </Page>
      )}

      {/* ===== PAGE 10 : RECOMMENDATIONS & CONCLUSION ===== */}
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>MakeItAds</Text>
          <Text style={styles.strategyName}>Strategic Recommendations</Text>
          <Text style={styles.meta}>
            {strategy.name || "Untitled Strategy"}
          </Text>
        </View>

        {/* Top Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Recommendations</Text>
            {recommendations.slice(0, 5).map((rec: any, index: number) => (
              <View key={index} style={styles.recommendationCard}>
                <View style={styles.recommendationHeader}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <Text style={[
                    styles.recommendationBadge,
                    rec.priority === "high" ? styles.recommendationBadgeHigh :
                    rec.priority === "medium" ? styles.recommendationBadgeMedium :
                    styles.recommendationBadgeLow
                  ]}>
                    {rec.priority}
                  </Text>
                </View>
                <Text style={styles.recommendationText}>{rec.description}</Text>
                {rec.expectedImpact && (
                  <Text style={styles.textBold}>Expected Impact: {rec.expectedImpact}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Analytics & KPIs */}
        {analytics.kpis && analytics.kpis.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
            {analytics.kpis.map((kpi: any, index: number) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{kpi.name}</Text>
                <Text style={styles.text}>Target: {kpi.target}</Text>
                {kpi.current && <Text style={styles.text}>Current: {kpi.current}</Text>}
              </View>
            ))}
            {analytics.reportingCadence && (
              <Text style={styles.text}>
                <Text style={styles.textBold}>Reporting Cadence:</Text> {analytics.reportingCadence}
              </Text>
            )}
          </View>
        )}

        {/* Conclusion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Text style={styles.text}>
            1. Review and approve this strategy
          </Text>
          <Text style={styles.text}>
            2. Set up tracking and analytics
          </Text>
          <Text style={styles.text}>
            3. Launch initial campaigns
          </Text>
          <Text style={styles.text}>
            4. Monitor performance weekly
          </Text>
          <Text style={styles.text}>
            5. Optimize based on data
          </Text>
        </View>

        {/* Final AI Recommendation */}
        {aiRecommendation.opportunity && (
          <View style={styles.aiRecommendationBox}>
            <Text style={styles.aiTitle}>Final AI Recommendation</Text>
            <Text style={styles.aiOpportunity}>{aiRecommendation.opportunity}</Text>
            <View style={styles.aiMetrics}>
              <View style={styles.aiMetric}>
                <Text style={styles.aiMetricLabel}>Confidence</Text>
                <Text style={styles.aiMetricValue}>{aiRecommendation.confidence}</Text>
              </View>
              <View style={styles.aiMetric}>
                <Text style={styles.aiMetricLabel}>Result</Text>
                <Text style={styles.aiMetricValue}>{aiRecommendation.result}</Text>
              </View>
              <View style={styles.aiMetric}>
                <Text style={styles.aiMetricLabel}>Priority</Text>
                <Text style={styles.aiMetricValue}>{aiRecommendation.priority}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Watermark for Free users */}
        {isFree && (
          <Text style={styles.watermark}>
            Generated with MakeItAds • Upgrade to Pro to remove watermark
          </Text>
        )}

        <Text style={styles.footer}>
          © {new Date().getFullYear()} MakeItAds • AI Marketing Strategist • Final Page
        </Text>
      </Page>
    </Document>
  );
}