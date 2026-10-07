import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// ============================================
// STYLES PDF
// ============================================

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#18181B',
    lineHeight: 1.5,
  },

  // ─── Cover ───
  coverPage: {
    backgroundColor: '#FFFFFF',
    padding: 60,
    fontFamily: 'Helvetica',
    color: '#18181B',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverLabel: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#6366F1',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#18181B',
    lineHeight: 1.2,
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 12,
    color: '#71717A',
    marginBottom: 40,
  },
  coverMeta: {
    fontSize: 10,
    color: '#475569',
    marginTop: 6,
  },
  coverFooter: {
    fontSize: 9,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },

  // ─── Sections ───
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionSubtitle: {
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#6366F1',
    fontWeight: 'bold',
    marginBottom: 6,
  },

  // ─── Executive Summary ───
  summaryBox: {
    backgroundColor: '#F8F8FC',
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 11,
    color: '#18181B',
    lineHeight: 1.6,
  },

  // ─── Indicateurs ───
  indicatorsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  indicatorCard: {
    flex: 1,
    backgroundColor: '#F8F8FC',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  indicatorLabel: {
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#71717A',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  indicatorValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#18181B',
  },
  indicatorValueAccent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366F1',
  },

  // ─── Insights ───
  insightCard: {
    backgroundColor: '#F8F8FC',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
  },
  insightTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 6,
  },
  insightImpact: {
    fontSize: 8,
    color: '#6366F1',
    fontWeight: 'bold',
  },

  // ─── Priorités ───
  priorityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priorityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#18181B',
  },
  priorityBadge: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  priorityLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#71717A',
    marginTop: 4,
    marginBottom: 2,
  },
  priorityText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },

  // ─── Plan d'action ───
  phaseCard: {
    backgroundColor: '#F8F8FC',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  phaseTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 6,
  },
  phaseDuration: {
    fontSize: 8,
    color: '#6366F1',
    marginBottom: 6,
  },
  phaseAction: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 3,
    paddingLeft: 8,
  },

  // ─── Texte simple ───
  text: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 8,
  },

  // ─── Listes ───
  listItem: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 3,
    paddingLeft: 10,
  },

  // ─── Footer ───
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },

  // ─── Badge plan ───
  planBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#6366F1',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
});

// ============================================
// TYPES
// ============================================

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
}

// ============================================
// COMPOSANT
// ============================================

export function StrategyPDFDocument({ strategy, userPlan, planLabel }: Props) {
  const data = strategy.data || {};
  const isFlash = strategy.type === 'flash';
  const createdDate = new Date(strategy.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document
      title={`Stratégie MakeItAds — ${strategy.title}`}
      author="MakeItAds"
      subject={`Stratégie publicitaire ${planLabel}`}
      creator="MakeItAds"
    >
      {/* ═══════════════════════════════════════ */}
      {/* PAGE DE COUVERTURE */}
      {/* ═══════════════════════════════════════ */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.coverLabel}>MakeItAds · Stratégie Publicitaire</Text>
          <Text style={styles.coverTitle}>{strategy.title}</Text>
          <Text style={styles.coverSubtitle}>
            {isFlash ? 'Diagnostic Flash' : 'Stratégie Complète 360'}
          </Text>

          <View style={styles.planBadge}>
            <Text>PLAN {planLabel.toUpperCase()}</Text>
          </View>

          <View style={{ marginTop: 40 }}>
            <Text style={styles.coverMeta}>Date de génération : {createdDate}</Text>
            {strategy.platform && (
              <Text style={styles.coverMeta}>Plateforme ciblée : {strategy.platform}</Text>
            )}
          </View>
        </View>

        <View style={styles.coverFooter}>
          <Text>makeitads.pro</Text>
          <Text>Document confidentiel — usage personnel</Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════ */}
      {/* PAGE 2 — EXECUTIVE SUMMARY + INSIGHTS + PRIORITÉS */}
      {/* ═══════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        {/* Executive Summary */}
        {data.executive_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Résumé exécutif</Text>
            <Text style={styles.sectionTitle}>Votre stratégie en un coup d&apos;œil</Text>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                {data.executive_summary.synthese}
              </Text>
            </View>

            <View style={styles.indicatorsRow}>
              <View style={styles.indicatorCard}>
                <Text style={styles.indicatorLabel}>Préparation</Text>
                <Text style={styles.indicatorValueAccent}>
                  {data.executive_summary.preparation}/100
                </Text>
              </View>
              <View style={styles.indicatorCard}>
                <Text style={styles.indicatorLabel}>Opportunité</Text>
                <Text style={styles.indicatorValue}>
                  {data.executive_summary.opportunite}
                </Text>
              </View>
              <View style={styles.indicatorCard}>
                <Text style={styles.indicatorLabel}>Risque principal</Text>
                <Text style={{ fontSize: 9, color: '#18181B', marginTop: 2 }}>
                  {data.executive_summary.risque_principal}
                </Text>
              </View>
            </View>

            {data.executive_summary.priorite && (
              <View
                style={{
                  backgroundColor: '#EEF2FF',
                  borderRadius: 6,
                  padding: 10,
                  borderLeftWidth: 3,
                  borderLeftColor: '#6366F1',
                }}
              >
                <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#6366F1', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>
                  Priorité immédiate
                </Text>
                <Text style={{ fontSize: 10, color: '#18181B' }}>
                  {data.executive_summary.priorite}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Insights */}
        {data.insights && data.insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Analyse</Text>
            <Text style={styles.sectionTitle}>Ce que nous avons identifié</Text>

            {data.insights.map((insight: any, i: number) => (
              <View key={i} style={styles.insightCard}>
                <Text style={styles.insightTitle}>
                  {String(i + 1).padStart(2, '0')} — {insight.titre}
                </Text>
                <Text style={styles.insightText}>{insight.explication}</Text>
                <Text style={styles.insightImpact}>Impact : {insight.impact}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>MakeItAds · {strategy.title}</Text>
          <Text>Page 2</Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════ */}
      {/* PAGE 3 — PRIORITÉS + PLAN D'ACTION */}
      {/* ═══════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        {/* Priorités */}
        {data.priorities && data.priorities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Action</Text>
            <Text style={styles.sectionTitle}>Ce que vous devriez faire maintenant</Text>

            {data.priorities.map((priority: any, i: number) => (
              <View key={i} style={styles.priorityCard}>
                <View style={styles.priorityHeader}>
                  <Text style={styles.priorityTitle}>
                    {String(i + 1).padStart(2, '0')} — {priority.titre}
                  </Text>
                  <Text style={styles.priorityBadge}>{priority.niveau}</Text>
                </View>

                <Text style={styles.priorityLabel}>Pourquoi</Text>
                <Text style={styles.priorityText}>{priority.pourquoi}</Text>

                <Text style={styles.priorityLabel}>Action</Text>
                <Text style={styles.priorityText}>{priority.action}</Text>

                <Text style={styles.priorityLabel}>Impact attendu</Text>
                <Text style={styles.priorityText}>{priority.impact_attendu}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Plan d'action */}
        {data.action_plan && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Exécution</Text>
            <Text style={styles.sectionTitle}>Plan d&apos;action recommandé</Text>

            {[data.action_plan.phase_1, data.action_plan.phase_2, data.action_plan.phase_3]
              .filter(Boolean)
              .map((phase: any, i: number) => (
                <View key={i} style={styles.phaseCard}>
                  <Text style={styles.phaseTitle}>
                    Phase {i + 1} — {phase.titre}
                  </Text>
                  <Text style={styles.phaseDuration}>{phase.duree}</Text>
                  {phase.actions?.map((action: string, j: number) => (
                    <Text key={j} style={styles.phaseAction}>
                      • {action}
                    </Text>
                  ))}
                </View>
              ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>MakeItAds · {strategy.title}</Text>
          <Text>Page 3</Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════ */}
      {/* PAGE 4 — SECTIONS DÉTAILLÉES */}
      {/* ═══════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        {data.analyse_marche && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Marché</Text>
            <Text style={styles.sectionTitle}>Analyse du marché</Text>
            <Text style={styles.text}>{data.analyse_marche}</Text>
          </View>
        )}

        {data.ciblage_exact && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Audience</Text>
            <Text style={styles.sectionTitle}>Ciblage recommandé</Text>
            {data.ciblage_exact.villes && (
              <Text style={styles.listItem}>
                <Text style={{ fontWeight: 'bold' }}>Villes : </Text>
                {data.ciblage_exact.villes.join(', ')}
              </Text>
            )}
            {data.ciblage_exact.ages && (
              <Text style={styles.listItem}>
                <Text style={{ fontWeight: 'bold' }}>Âges : </Text>
                {data.ciblage_exact.ages}
              </Text>
            )}
            {data.ciblage_exact.interets && (
              <Text style={styles.listItem}>
                <Text style={{ fontWeight: 'bold' }}>Intérêts : </Text>
                {data.ciblage_exact.interets.join(', ')}
              </Text>
            )}
            {data.ciblage_exact.comportements && (
              <Text style={styles.listItem}>
                <Text style={{ fontWeight: 'bold' }}>Comportements : </Text>
                {data.ciblage_exact.comportements.join(', ')}
              </Text>
            )}
          </View>
        )}

        {data.allocation_budget && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Budget</Text>
            <Text style={styles.sectionTitle}>Allocation budgétaire</Text>
            <Text style={styles.text}>{data.allocation_budget}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>MakeItAds · {strategy.title}</Text>
          <Text>Page 4</Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════ */}
      {/* PAGE 5 — SCRIPTS WHATSAPP */}
      {/* ═══════════════════════════════════════ */}
      {data.scripts_whatsapp && data.scripts_whatsapp.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Conversion</Text>
            <Text style={styles.sectionTitle}>Scripts WhatsApp</Text>

            {data.scripts_whatsapp.map((script: string, i: number) => (
              <View key={i} style={styles.phaseCard}>
                <Text style={styles.phaseTitle}>Script {i + 1}</Text>
                <Text style={{ fontSize: 9, color: '#475569', lineHeight: 1.5 }}>
                  {script}
                </Text>
              </View>
            ))}
          </View>

          {data.conseil_expert && (
            <View style={styles.section}>
              <Text style={styles.sectionSubtitle}>Conseil</Text>
              <Text style={styles.sectionTitle}>Recommandation expert</Text>
              <Text style={styles.text}>{data.conseil_expert}</Text>
            </View>
          )}

          <View style={styles.footer} fixed>
            <Text>MakeItAds · {strategy.title}</Text>
            <Text>Page 5</Text>
          </View>
        </Page>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* PAGE 6 — KPIs + CONTENU FLASH */}
      {/* ═══════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        {data.kpis && data.kpis.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Mesure</Text>
            <Text style={styles.sectionTitle}>Indicateurs clés de performance</Text>

            {data.kpis.map((kpi: any, i: number) => (
              <View key={i} style={styles.priorityCard}>
                <View style={styles.priorityHeader}>
                  <Text style={styles.priorityTitle}>{kpi.nom}</Text>
                  <Text style={styles.priorityBadge}>{kpi.objectif}</Text>
                </View>
                <Text style={styles.priorityText}>{kpi.pourquoi}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sections Flash */}
        {isFlash && (
          <>
            {data.diagnostic && (
              <View style={styles.section}>
                <Text style={styles.sectionSubtitle}>Diagnostic</Text>
                <Text style={styles.sectionTitle}>Analyse initiale</Text>
                <Text style={styles.text}>{data.diagnostic}</Text>
              </View>
            )}

            {data.avatar_client && (
              <View style={styles.section}>
                <Text style={styles.sectionSubtitle}>Avatar</Text>
                <Text style={styles.sectionTitle}>Client idéal</Text>
                <Text style={styles.text}>{data.avatar_client}</Text>
              </View>
            )}

            {data.angle_publicitaire && (
              <View style={styles.section}>
                <Text style={styles.sectionSubtitle}>Angle</Text>
                <Text style={styles.sectionTitle}>Angle publicitaire</Text>
                <Text style={styles.text}>{data.angle_publicitaire}</Text>
              </View>
            )}
          </>
        )}

        <View style={styles.footer} fixed>
          <Text>MakeItAds · {strategy.title}</Text>
          <Text>Page 6</Text>
        </View>
      </Page>
    </Document>
  );
}