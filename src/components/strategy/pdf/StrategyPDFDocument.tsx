import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// ═══════════════════════════════════════════════════════
// PALETTE DE MARQUE
// ═══════════════════════════════════════════════════════
const BRAND = {
  primary: '#6366F1',      // Indigo MakeItAds
  primaryDark: '#4F46E5',  // Indigo foncé
  secondary: '#8B5CF6',    // Violet
  accent: '#10B981',       // Vert succès
  warning: '#F59E0B',      // Ambre
  danger: '#EF4444',       // Rouge
  ink: '#0F172A',          // Noir texte
  body: '#334155',         // Corps de texte
  muted: '#64748B',        // Texte secondaire
  subtle: '#94A3B8',       // Texte tertiaire
  border: '#E2E8F0',       // Bordures
  soft: '#F8FAFC',         // Fond doux
  softer: '#F1F5F9',       // Fond encore plus doux
};

// ═══════════════════════════════════════════════════════
// SANITIZATION — Supprime les tirets longs et caractères IA
// ═══════════════════════════════════════════════════════
function sanitize(text: string | null | undefined): string {
  if (!text) return '';
  return String(text)
    .replace(/\s—\s/g, ' : ')     // " — " devient " : "
    .replace(/—/g, ': ')           // tiret long seul devient ": "
    .replace(/–/g, '-')            // tiret moyen devient court
    .replace(/\s+/g, ' ')          // espaces multiples
    .trim();
}

// Extrait le prénom depuis la salutation "Bonjour Williams, ..."
function extractFirstName(salutation?: string): string {
  if (!salutation) return '';
  const m = salutation.match(/Bonjour\s+([^,]+)/i);
  return m?.[1]?.trim() || '';
}

// ═══════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════
const styles = StyleSheet.create({
  // ─── COVER ───
  coverPage: {
    backgroundColor: '#FFFFFF',
    padding: 0,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  coverTopBar: {
    height: 8,
    backgroundColor: BRAND.primary,
  },
  coverInner: {
    padding: 60,
    paddingTop: 50,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 80,
  },
  coverLogo: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
    letterSpacing: -0.5,
  },
  coverLogoDot: {
    color: BRAND.primary,
  },
  coverLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: BRAND.primary,
  },
  coverContent: {
    flex: 1,
  },
  coverEyebrow: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: BRAND.muted,
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
    lineHeight: 1.15,
    letterSpacing: -1,
    marginBottom: 24,
  },
  coverPreparedFor: {
    fontSize: 12,
    color: BRAND.muted,
    marginBottom: 8,
  },
  coverName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
    marginBottom: 40,
  },
  coverDivider: {
    height: 1,
    backgroundColor: BRAND.border,
    marginBottom: 24,
  },
  coverMetaRow: {
    flexDirection: 'row',
  },
  coverMetaCol: {
    flex: 1,
  },
  coverMetaLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: BRAND.subtle,
    marginBottom: 4,
  },
  coverMetaValue: {
    fontSize: 11,
    color: BRAND.ink,
  },
  coverFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    paddingTop: 16,
  },
  coverFooterText: {
    fontSize: 8,
    color: BRAND.subtle,
    letterSpacing: 0.5,
  },

  // ─── CONTENT PAGES ───
  page: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: BRAND.body,
    lineHeight: 1.55,
  },

  // ─── PAGE HEADER ───
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    marginBottom: 32,
  },
  pageHeaderLogo: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
  },
  pageHeaderLogoDot: {
    color: BRAND.primary,
  },
  pageHeaderRight: {
    fontSize: 8,
    color: BRAND.subtle,
    letterSpacing: 0.5,
  },

  // ─── SECTIONS ───
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  sectionNumber: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.primary,
    letterSpacing: 1,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
    letterSpacing: -0.3,
  },
  sectionIntro: {
    fontSize: 10,
    color: BRAND.muted,
    lineHeight: 1.6,
    marginBottom: 16,
  },

  // ─── CARDS ───
  card: {
    backgroundColor: BRAND.soft,
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
  },
  cardBorder: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: BRAND.muted,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 10,
    color: BRAND.body,
    lineHeight: 1.6,
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
    marginBottom: 6,
  },
  cardImpact: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.primary,
    marginTop: 6,
  },

  // ─── SUMMARY (EXECUTIVE) ───
  summaryBox: {
    backgroundColor: BRAND.soft,
    borderLeftWidth: 3,
    borderLeftColor: BRAND.primary,
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 11,
    color: BRAND.ink,
    lineHeight: 1.65,
  },

  // ─── KPI CARDS ROW ───
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 6,
    padding: 12,
  },
  kpiCardPrimary: {
    flex: 1,
    backgroundColor: BRAND.primary,
    borderWidth: 1,
    borderColor: BRAND.primary,
    borderRadius: 6,
    padding: 12,
  },
  kpiLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: BRAND.muted,
    marginBottom: 6,
  },
  kpiLabelPrimary: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    opacity: 0.85,
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
    letterSpacing: -0.5,
  },
  kpiValuePrimary: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  kpiSubtext: {
    fontSize: 8,
    color: BRAND.muted,
    marginTop: 4,
  },

  // ─── INSIGHTS / PRIORITIES ───
  insightItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BRAND.primary,
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingTop: 6,
    marginRight: 12,
  },
  insightBody: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 9.5,
    color: BRAND.body,
    lineHeight: 1.55,
    marginBottom: 4,
  },
  insightImpact: {
    fontSize: 8,
    color: BRAND.primary,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.3,
  },

  // ─── BADGES ───
  badge: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    backgroundColor: BRAND.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeWarning: {
    backgroundColor: BRAND.warning,
  },
  badgeDanger: {
    backgroundColor: BRAND.danger,
  },
  badgeSuccess: {
    backgroundColor: BRAND.accent,
  },

  // ─── PHASES ───
  phaseRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  phaseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BRAND.primary,
    color: BRAND.primary,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingTop: 8,
    marginRight: 12,
  },
  phaseBody: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
    marginBottom: 2,
  },
  phaseDuration: {
    fontSize: 8,
    color: BRAND.muted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  phaseAction: {
    fontSize: 9.5,
    color: BRAND.body,
    lineHeight: 1.5,
    marginBottom: 3,
    paddingLeft: 8,
  },

  // ─── BUDGET ───
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  budgetRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  budgetLabel: {
    fontSize: 10,
    color: BRAND.body,
  },
  budgetValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
  },
  budgetValueAccent: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.primary,
  },

  // ─── CIBLAGE ───
  ciblageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  ciblageItem: {
    width: '50%',
    marginBottom: 10,
  },
  ciblageLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: BRAND.muted,
    marginBottom: 3,
  },
  ciblageValue: {
    fontSize: 10,
    color: BRAND.ink,
    lineHeight: 1.5,
  },

  // ─── TEXTE SIMPLE ───
  text: {
    fontSize: 10,
    color: BRAND.body,
    lineHeight: 1.65,
    marginBottom: 10,
  },
  textSmall: {
    fontSize: 9,
    color: BRAND.muted,
    lineHeight: 1.55,
    marginBottom: 8,
  },

  // ─── DIVIDER ───
  divider: {
    height: 1,
    backgroundColor: BRAND.border,
    marginVertical: 20,
  },

  // ─── AVERTISSEMENTS ───
  warningBox: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 3,
    borderLeftColor: BRAND.warning,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 9.5,
    color: '#78350F',
    lineHeight: 1.55,
  },

  // ─── FOOTER ───
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    paddingTop: 10,
  },
  footerLeft: {
    fontSize: 7.5,
    color: BRAND.subtle,
    letterSpacing: 0.3,
  },
  footerRight: {
    fontSize: 7.5,
    color: BRAND.subtle,
    letterSpacing: 0.3,
  },

  // ─── LOCKED SECTION (DEMO) ───
  lockedBox: {
    backgroundColor: BRAND.soft,
    borderRadius: 6,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  lockedTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.ink,
    marginBottom: 4,
    textAlign: 'center',
  },
  lockedText: {
    fontSize: 9,
    color: BRAND.muted,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  lockedCta: {
    marginTop: 10,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.primary,
    letterSpacing: 0.3,
  },
});

// ═══════════════════════════════════════════════════════
// SOUS-COMPOSANTS
// ═══════════════════════════════════════════════════════
function PageHeader({ title }: { title: string }) {
  return (
    <View style={styles.pageHeader} fixed>
      <Text style={styles.pageHeaderLogo}>
        MakeIt<Text style={styles.pageHeaderLogoDot}>Ads</Text>
      </Text>
      <Text style={styles.pageHeaderRight}>{title}</Text>
    </View>
  );
}

function PageFooter({ pageLabel }: { pageLabel: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerLeft}>makeitads.pro  ·  Document confidentiel</Text>
      <Text style={styles.footerRight}>{pageLabel}</Text>
    </View>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionNumber}>{number}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════
// PROPS
// ═══════════════════════════════════════════════════════
interface Props {
  strategy: {
    title: string;
    type: string;
    platform: string | null;
    created_at: string;
    data: any;
  };
  userPlan: string;
  planLabel: string;
  userName?: string; // ← optionnel (fallback sur salutation)
}

// ═══════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════
export function StrategyPDFDocument({ strategy, userPlan, planLabel, userName }: Props) {
  const data = strategy.data || {};
  const isFlash = strategy.type === 'flash';
  const isFree = userPlan === 'free';

  const createdDate = new Date(strategy.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Prénom : prop > salutation > fallback
  const displayName =
    userName ||
    extractFirstName(data.salutation) ||
    'Utilisateur';

  const title = sanitize(strategy.title) || 'Stratégie publicitaire';

  // ─── Détermine les sections à afficher ───
  const hasExecutiveSummary = Boolean(data.executive_summary);
  const hasInsights = Array.isArray(data.insights) && data.insights.length > 0;
  const hasPriorities = Array.isArray(data.priorities) && data.priorities.length > 0;
  const hasActionPlan = Boolean(data.action_plan);
  const hasMarket = Boolean(data.analyse_marche);
  const hasTargeting = Boolean(data.ciblage_exact);
  const hasBudget = Boolean(data.budget || data.allocation_budget);
  const hasScripts = Array.isArray(data.scripts_whatsapp) && data.scripts_whatsapp.length > 0;
  const hasKpis = Array.isArray(data.kpis) && data.kpis.length > 0;
  const hasWarnings = Array.isArray(data.avertissements) && data.avertissements.length > 0;
  const hasCompetitor = Boolean(data.analyse_concurrentielle);
  const hasHooks = Array.isArray(data.hooks) && data.hooks.length > 0;
  const hasAudienceAnalysis = Boolean(data.analyse_audience);
  const hasGrowthStrategy = Boolean(data.strategie_croissance);

  // ─── Compose le numéro de page dynamiquement ───
  let pageCounter = 1; // cover = 1
  const pageNumbers = {
    cover: 1,
    get next() { pageCounter += 1; return pageCounter; },
  };
  const totalPages =
    1 + // cover
    (hasExecutiveSummary || hasInsights ? 1 : 0) +
    (hasPriorities || hasActionPlan ? 1 : 0) +
    (hasMarket || hasTargeting ? 1 : 0) +
    (hasBudget ? 1 : 0) +
    (hasScripts || hasKpis ? 1 : 0) +
    (hasCompetitor || hasHooks || hasAudienceAnalysis || hasGrowthStrategy ? 1 : 0) +
    (hasWarnings ? 1 : 0);

  // ═══════════════════════════════════════════════════
  return (
    <Document
      title={`Stratégie ${title} — MakeItAds`}
      author="MakeItAds"
      subject={`Stratégie publicitaire ${planLabel}`}
      creator="MakeItAds"
    >
      {/* ═══════════════════════════════════════════════ */}
      {/* PAGE 1 — COUVERTURE                              */}
      {/* ═══════════════════════════════════════════════ */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverTopBar} />
        <View style={styles.coverInner}>
          {/* Header cover */}
          <View style={styles.coverHeader}>
            <Text style={styles.coverLogo}>
              MakeIt<Text style={styles.coverLogoDot}>Ads</Text>
            </Text>
            <Text style={styles.coverLabel}>
              {isFlash ? 'Diagnostic Flash' : 'Stratégie complète'}
            </Text>
          </View>

          {/* Content cover */}
          <View style={styles.coverContent}>
            <Text style={styles.coverEyebrow}>Rapport stratégique</Text>
            <Text style={styles.coverTitle}>{title}</Text>

            <Text style={styles.coverPreparedFor}>Préparé pour</Text>
            <Text style={styles.coverName}>{displayName}</Text>

            <View style={styles.coverDivider} />

            <View style={styles.coverMetaRow}>
              <View style={styles.coverMetaCol}>
                <Text style={styles.coverMetaLabel}>Date de génération</Text>
                <Text style={styles.coverMetaValue}>{createdDate}</Text>
              </View>
              <View style={styles.coverMetaCol}>
                <Text style={styles.coverMetaLabel}>Formule</Text>
                <Text style={styles.coverMetaValue}>Plan {planLabel}</Text>
              </View>
              {strategy.platform && (
                <View style={styles.coverMetaCol}>
                  <Text style={styles.coverMetaLabel}>Plateforme</Text>
                  <Text style={styles.coverMetaValue}>{sanitize(strategy.platform)}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Footer cover */}
          <View style={styles.coverFooter}>
            <Text style={styles.coverFooterText}>makeitads.pro</Text>
            <Text style={styles.coverFooterText}>Document personnel et confidentiel</Text>
          </View>
        </View>
      </Page>

      {/* ═══════════════════════════════════════════════ */}
      {/* PAGE — SYNTHÈSE + INSIGHTS (Pro+)                 */}
      {/* ═══════════════════════════════════════════════ */}
      {(hasExecutiveSummary || hasInsights) && (
        <Page size="A4" style={styles.page}>
          <PageHeader title={title} />

          {/* Résumé exécutif */}
          {hasExecutiveSummary && (
            <View style={styles.section}>
              <SectionTitle number="01" title="Résumé exécutif" />

              {data.executive_summary.synthese && (
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryText}>
                    {sanitize(data.executive_summary.synthese)}
                  </Text>
                </View>
              )}

              <View style={styles.kpiRow}>
                <View style={styles.kpiCardPrimary}>
                  <Text style={styles.kpiLabelPrimary}>Préparation</Text>
                  <Text style={styles.kpiValuePrimary}>
                    {data.executive_summary.preparation ?? 0}/100
                  </Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Opportunité</Text>
                  <Text style={styles.kpiValue}>
                    {sanitize(data.executive_summary.opportunite) || '—'}
                  </Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Risque principal</Text>
                  <Text style={{ fontSize: 10, color: BRAND.ink, marginTop: 4, lineHeight: 1.4 }}>
                    {sanitize(data.executive_summary.risque_principal).slice(0, 80) || '—'}
                  </Text>
                </View>
              </View>

              {data.executive_summary.priorite && (
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Priorité immédiate</Text>
                  <Text style={styles.cardText}>
                    {sanitize(data.executive_summary.priorite)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Insights */}
          {hasInsights && (
            <View style={styles.section}>
              <SectionTitle number="02" title="Ce que nous avons identifié" />

              {data.insights.map((insight: any, i: number) => (
                <View key={i} style={styles.insightItem}>
                  <Text style={styles.insightNumber}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                  <View style={styles.insightBody}>
                    <Text style={styles.insightTitle}>
                      {sanitize(insight.titre)}
                    </Text>
                    <Text style={styles.insightText}>
                      {sanitize(insight.explication)}
                    </Text>
                    {insight.impact && (
                      <Text style={styles.insightImpact}>
                        Impact : {sanitize(insight.impact)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          <PageFooter pageLabel={`${pageNumbers.next} / ${totalPages}`} />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* PAGE — PRIORITÉS + PLAN D'ACTION                  */}
      {/* ═══════════════════════════════════════════════ */}
      {(hasPriorities || hasActionPlan) && (
        <Page size="A4" style={styles.page}>
          <PageHeader title={title} />

          {hasPriorities && (
            <View style={styles.section}>
              <SectionTitle number="03" title="Actions prioritaires" />

              {data.priorities.map((priority: any, i: number) => (
                <View key={i} style={styles.cardBorder}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: BRAND.ink, flex: 1 }}>
                      {sanitize(priority.titre)}
                    </Text>
                    <Text style={[
                      styles.badge,
                      priority.niveau?.includes('immédiate') ? styles.badgeDanger :
                      priority.niveau?.includes('tester') ? styles.badgeWarning :
                      styles.badgeSuccess
                    ]}>
                      {sanitize(priority.niveau)}
                    </Text>
                  </View>

                  <Text style={styles.cardLabel}>Pourquoi</Text>
                  <Text style={styles.cardText}>{sanitize(priority.pourquoi)}</Text>

                  <Text style={[styles.cardLabel, { marginTop: 8 }]}>Action concrète</Text>
                  <Text style={styles.cardText}>{sanitize(priority.action)}</Text>

                  {priority.impact_attendu && (
                    <>
                      <Text style={[styles.cardLabel, { marginTop: 8 }]}>Impact attendu</Text>
                      <Text style={[styles.cardText, { color: BRAND.primary, fontFamily: 'Helvetica-Bold' }]}>
                        {sanitize(priority.impact_attendu)}
                      </Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          )}

          {hasActionPlan && (
            <View style={styles.section}>
              <SectionTitle number="04" title="Plan d'exécution" />

              {[data.action_plan.phase_1, data.action_plan.phase_2, data.action_plan.phase_3]
                .filter(Boolean)
                .map((phase: any, i: number) => (
                  <View key={i} style={styles.phaseRow}>
                    <Text style={styles.phaseNumber}>{i + 1}</Text>
                    <View style={styles.phaseBody}>
                      <Text style={styles.phaseTitle}>{sanitize(phase.titre)}</Text>
                      <Text style={styles.phaseDuration}>{sanitize(phase.duree)}</Text>
                      {phase.actions?.map((action: string, j: number) => (
                        <Text key={j} style={styles.phaseAction}>
                          · {sanitize(action)}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
            </View>
          )}

          <PageFooter pageLabel={`${pageNumbers.next} / ${totalPages}`} />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* PAGE — MARCHÉ + CIBLAGE                           */}
      {/* ═══════════════════════════════════════════════ */}
      {(hasMarket || hasTargeting) && (
        <Page size="A4" style={styles.page}>
          <PageHeader title={title} />

          {hasMarket && (
            <View style={styles.section}>
              <SectionTitle number="05" title="Analyse du marché" />
              <Text style={styles.text}>{sanitize(data.analyse_marche)}</Text>
            </View>
          )}

          {hasTargeting && (
            <View style={styles.section}>
              <SectionTitle number="06" title="Ciblage précis" />

              <View style={styles.ciblageGrid}>
                {data.ciblage_exact.villes?.length > 0 && (
                  <View style={styles.ciblageItem}>
                    <Text style={styles.ciblageLabel}>Villes</Text>
                    <Text style={styles.ciblageValue}>
                      {data.ciblage_exact.villes.map(sanitize).join(', ')}
                    </Text>
                  </View>
                )}
                {data.ciblage_exact.ages && (
                  <View style={styles.ciblageItem}>
                    <Text style={styles.ciblageLabel}>Âges</Text>
                    <Text style={styles.ciblageValue}>
                      {sanitize(data.ciblage_exact.ages)}
                    </Text>
                  </View>
                )}
                {data.ciblage_exact.interets?.length > 0 && (
                  <View style={styles.ciblageItem}>
                    <Text style={styles.ciblageLabel}>Intérêts</Text>
                    <Text style={styles.ciblageValue}>
                      {data.ciblage_exact.interets.map(sanitize).join(', ')}
                    </Text>
                  </View>
                )}
                {data.ciblage_exact.comportements?.length > 0 && (
                  <View style={styles.ciblageItem}>
                    <Text style={styles.ciblageLabel}>Comportements</Text>
                    <Text style={styles.ciblageValue}>
                      {data.ciblage_exact.comportements.map(sanitize).join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <PageFooter pageLabel={`${pageNumbers.next} / ${totalPages}`} />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* PAGE — BUDGET                                     */}
      {/* ═══════════════════════════════════════════════ */}
      {hasBudget && (
        <Page size="A4" style={styles.page}>
          <PageHeader title={title} />

          <View style={styles.section}>
            <SectionTitle number="07" title="Allocation budgétaire" />

            {/* Résumé budget */}
            {data.budget && (
              <View style={styles.kpiRow}>
                {data.budget.montant_total > 0 && (
                  <View style={styles.kpiCardPrimary}>
                    <Text style={styles.kpiLabelPrimary}>Budget total</Text>
                    <Text style={styles.kpiValuePrimary}>
                      {Number(data.budget.montant_total).toLocaleString('fr-FR')}
                    </Text>
                    <Text style={{ fontSize: 8, color: '#FFFFFF', opacity: 0.85, marginTop: 2 }}>
                      {sanitize(data.budget.devise) || 'FCFA'}
                    </Text>
                  </View>
                )}
                {data.budget.cpc_estime > 0 && (
                  <View style={styles.kpiCard}>
                    <Text style={styles.kpiLabel}>CPC estimé</Text>
                    <Text style={styles.kpiValue}>
                      {Number(data.budget.cpc_estime).toLocaleString('fr-FR')}
                    </Text>
                    <Text style={styles.kpiSubtext}>{sanitize(data.budget.devise)}</Text>
                  </View>
                )}
                {data.budget.ventes_estimees > 0 && (
                  <View style={styles.kpiCard}>
                    <Text style={styles.kpiLabel}>Ventes visées</Text>
                    <Text style={styles.kpiValue}>{data.budget.ventes_estimees}</Text>
                    <Text style={styles.kpiSubtext}>estimations</Text>
                  </View>
                )}
              </View>
            )}

            {/* Répartition */}
            {data.budget?.repartition && data.budget.repartition.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.cardLabel, { marginBottom: 10 }]}>Répartition par poste</Text>
                {data.budget.repartition.map((item: any, i: number) => (
                  <View
                    key={i}
                    style={i === data.budget.repartition.length - 1 ? styles.budgetRowLast : styles.budgetRow}
                  >
                    <Text style={styles.budgetLabel}>{sanitize(item.poste)}</Text>
                    <Text style={styles.budgetValue}>
                      {item.pourcentage}%  ·  {Number(item.montant).toLocaleString('fr-FR')}{' '}
                      {sanitize(data.budget.devise)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Allocation texte */}
            {data.allocation_budget && (
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.cardLabel, { marginBottom: 8 }]}>Stratégie d&apos;allocation</Text>
                <Text style={styles.text}>{sanitize(data.allocation_budget)}</Text>
              </View>
            )}
          </View>

          {/* Conseil expert */}
          {data.conseil_expert && (
            <View style={styles.section}>
              <SectionTitle number="08" title="Conseil expert" />
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{sanitize(data.conseil_expert)}</Text>
              </View>
            </View>
          )}

          <PageFooter pageLabel={`${pageNumbers.next} / ${totalPages}`} />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* PAGE — SCRIPTS WHATSAPP + KPIs                    */}
      {/* ═══════════════════════════════════════════════ */}
      {(hasScripts || hasKpis) && (
        <Page size="A4" style={styles.page}>
          <PageHeader title={title} />

          {hasScripts && (
            <View style={styles.section}>
              <SectionTitle number="09" title="Scripts WhatsApp" />

              {data.scripts_whatsapp.map((script: string, i: number) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardLabel}>Script {i + 1}</Text>
                  <Text style={styles.cardText}>{sanitize(script)}</Text>
                </View>
              ))}
            </View>
          )}

          {hasKpis && (
            <View style={styles.section}>
              <SectionTitle number="10" title="Indicateurs clés" />

              {data.kpis.map((kpi: any, i: number) => (
                <View key={i} style={styles.cardBorder}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: BRAND.ink, flex: 1 }}>
                      {sanitize(kpi.nom)}
                    </Text>
                    <Text style={styles.badge}>{sanitize(kpi.objectif)}</Text>
                  </View>
                  <Text style={styles.cardText}>{sanitize(kpi.pourquoi)}</Text>
                </View>
              ))}
            </View>
          )}

          <PageFooter pageLabel={`${pageNumbers.next} / ${totalPages}`} />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* PAGE — SECTIONS PREMIUM/ÉLITE                     */}
      {/* ═══════════════════════════════════════════════ */}
      {(hasCompetitor || hasHooks || hasAudienceAnalysis || hasGrowthStrategy) && (
        <Page size="A4" style={styles.page}>
          <PageHeader title={title} />

          {hasCompetitor && (
            <View style={styles.section}>
              <SectionTitle number="11" title="Analyse concurrentielle" />
              <Text style={styles.text}>{sanitize(data.analyse_concurrentielle)}</Text>
            </View>
          )}

          {hasHooks && (
            <View style={styles.section}>
              <SectionTitle number="12" title="Variantes d'accroches" />
              {data.hooks.map((hook: string, i: number) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardLabel}>Hook {i + 1}</Text>
                  <Text style={styles.cardText}>&laquo; {sanitize(hook)} &raquo;</Text>
                </View>
              ))}
            </View>
          )}

          {hasAudienceAnalysis && (
            <View style={styles.section}>
              <SectionTitle number="13" title="Analyse d'audience" />
              <Text style={styles.text}>{sanitize(data.analyse_audience)}</Text>
            </View>
          )}

          {hasGrowthStrategy && (
            <View style={styles.section}>
              <SectionTitle number="14" title="Stratégie de croissance" />
              <Text style={styles.text}>{sanitize(data.strategie_croissance)}</Text>
            </View>
          )}

          <PageFooter pageLabel={`${pageNumbers.next} / ${totalPages}`} />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* PAGE — AVERTISSEMENTS + CTA                       */}
      {/* ═══════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <PageHeader title={title} />

        {hasWarnings && (
          <View style={styles.section}>
            <SectionTitle number="15" title="Points d'attention" />
            {data.avertissements.map((warning: string, i: number) => (
              <View key={i} style={styles.warningBox}>
                <Text style={styles.warningText}>{sanitize(warning)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CTA final */}
        <View style={styles.section}>
          <View
            style={{
              backgroundColor: BRAND.soft,
              borderRadius: 8,
              padding: 24,
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontFamily: 'Helvetica-Bold',
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: BRAND.primary,
                marginBottom: 10,
              }}
            >
              MakeItAds
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Helvetica-Bold',
                color: BRAND.ink,
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              Votre stratégie est prête.
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: BRAND.muted,
                textAlign: 'center',
                lineHeight: 1.6,
                maxWidth: 320,
                marginBottom: 16,
              }}
            >
              Générez une nouvelle stratégie à tout moment depuis votre dashboard MakeItAds. Chaque analyse enrichit votre historique et affine nos recommandations.
            </Text>
            <Text
              style={{
                fontSize: 9,
                fontFamily: 'Helvetica-Bold',
                color: BRAND.primary,
                letterSpacing: 0.5,
              }}
            >
              makeitads.pro  ·  support@makeitads.pro
            </Text>
          </View>
        </View>

        <PageFooter pageLabel={`${pageNumbers.next} / ${totalPages}`} />
      </Page>
    </Document>
  );
}