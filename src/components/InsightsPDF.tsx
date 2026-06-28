import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },
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
  reportTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 5,
  },
  meta: {
    fontSize: 10,
    color: "#64748b",
  },
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
  insightCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    borderLeft: "3px solid #6366f1",
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.5,
  },
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
});

interface InsightsPDFProps {
  stats: {
    totalStrategies: number;
    avgMarketScore: number;
    industries: string[];
    totalCompetitors: number;
    totalCampaigns: number;
    avgROI: number;
  };
  insights: Array<{
    type: "success" | "warning" | "info";
    title: string;
    description: string;
  }>;
  competitors: Array<{
    name: string;
    position?: string;
    opportunity?: number;
    strengths?: string[];
    weaknesses?: string[];
  }>;
  recentActivities: Array<{
    title: string;
    industry: string;
    marketScore?: number;
    created_at: string;
  }>;
  userName: string;
}

export default function InsightsPDF({ 
  stats, 
  insights, 
  competitors, 
  recentActivities,
  userName 
}: InsightsPDFProps) {
  const generatedDate = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  return (
    <Document>
      {/* PAGE 1 : COVER */}
      <Page style={styles.coverPage}>
        <Text style={styles.coverLogo}>MakeItAds</Text>
        <Text style={styles.coverSubtitle}>Strategy Insights Report</Text>
        
        <View style={{ marginBottom: 40 }}>
          <Text style={styles.coverTitle}>
            Strategic Performance Analysis
          </Text>
          <Text style={styles.coverMeta}>
            Prepared for {userName}
          </Text>
          <Text style={styles.coverMeta}>
            {stats.totalStrategies} {stats.totalStrategies === 1 ? "strategy" : "strategies"} analyzed
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.coverScore}>
            {stats.avgMarketScore}
          </Text>
          <Text style={styles.coverScoreLabel}>Average Market Score</Text>
        </View>

        <Text style={styles.coverDate}>
          Generated on {generatedDate}
        </Text>
      </Page>

      {/* PAGE 2 : EXECUTIVE SUMMARY */}
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>MakeItAds</Text>
          <Text style={styles.reportTitle}>Executive Summary</Text>
          <Text style={styles.meta}>
            Strategic Performance Overview • {generatedDate}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Avg. Market Score</Text>
              <Text style={styles.metricValue}>{stats.avgMarketScore}/100</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Strategies</Text>
              <Text style={styles.metricValue}>{stats.totalStrategies}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Industries</Text>
              <Text style={styles.metricValue}>{stats.industries.length}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Competitors</Text>
              <Text style={styles.metricValue}>{stats.totalCompetitors}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Campaigns</Text>
              <Text style={styles.metricValue}>{stats.totalCampaigns}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Avg. ROI</Text>
              <Text style={styles.metricValue}>{stats.avgROI > 0 ? `${stats.avgROI}%` : "N/A"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Industry Coverage</Text>
          <Text style={styles.text}>
            Your portfolio covers {stats.industries.length} different {stats.industries.length === 1 ? "industry" : "industries"}:
          </Text>
          {stats.industries.map((industry, i) => (
            <Text key={i} style={styles.bullet}>• {industry}</Text>
          ))}
        </View>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} MakeItAds • Strategy Insights Report • Page 2
        </Text>
      </Page>

      {/* PAGE 3 : AI INSIGHTS */}
      {insights.length > 0 && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>MakeItAds</Text>
            <Text style={styles.reportTitle}>AI-Powered Insights</Text>
            <Text style={styles.meta}>
              Strategic recommendations based on your data
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Insights</Text>
            {insights.map((insight, i) => (
              <View key={i} style={styles.insightCard}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightText}>{insight.description}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.footer}>
            © {new Date().getFullYear()} MakeItAds • Strategy Insights Report • Page 3
          </Text>
        </Page>
      )}

      {/* PAGE 4 : COMPETITOR INTELLIGENCE */}
      {competitors.length > 0 && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>MakeItAds</Text>
            <Text style={styles.reportTitle}>Competitor Intelligence</Text>
            <Text style={styles.meta}>
              Analysis of {competitors.length} competitors across your strategies
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Competitive Landscape</Text>
            {competitors.slice(0, 8).map((comp, i) => (
              <View key={i} style={styles.competitorCard}>
                <Text style={styles.competitorName}>{comp.name}</Text>
                {comp.position && (
                  <Text style={styles.text}>Position: {comp.position}</Text>
                )}
                {comp.opportunity !== undefined && (
                  <Text style={styles.textBold}>Opportunity Score: {comp.opportunity}%</Text>
                )}
                {comp.strengths && comp.strengths.length > 0 && (
                  <View>
                    <Text style={styles.textBold}>Strengths:</Text>
                    {comp.strengths.slice(0, 2).map((s, j) => (
                      <Text key={j} style={styles.bullet}>• {s}</Text>
                    ))}
                  </View>
                )}
                {comp.weaknesses && comp.weaknesses.length > 0 && (
                  <View>
                    <Text style={styles.textBold}>Weaknesses:</Text>
                    {comp.weaknesses.slice(0, 2).map((w, j) => (
                      <Text key={j} style={styles.bullet}>• {w}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          <Text style={styles.footer}>
            © {new Date().getFullYear()} MakeItAds • Strategy Insights Report • Page 4
          </Text>
        </Page>
      )}

      {/* PAGE 5 : RECENT ACTIVITY */}
      {recentActivities.length > 0 && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>MakeItAds</Text>
            <Text style={styles.reportTitle}>Recent Activity</Text>
            <Text style={styles.meta}>
              Your latest strategic activities
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest Strategies</Text>
            {recentActivities.map((activity, i) => (
              <View key={i} style={styles.competitorCard}>
                <Text style={styles.competitorName}>{activity.title}</Text>
                <Text style={styles.text}>
                  Industry: {activity.industry}
                </Text>
                {activity.marketScore !== undefined && (
                  <Text style={styles.textBold}>
                    Market Score: {activity.marketScore}/100
                  </Text>
                )}
                <Text style={styles.text}>
                  Created: {new Date(activity.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.footer}>
            © {new Date().getFullYear()} MakeItAds • Strategy Insights Report • Final Page
          </Text>
        </Page>
      )}
    </Document>
  );
}