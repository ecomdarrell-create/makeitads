import { BusinessProfile } from "./types";

export function buildStrategyPrompt(profile: BusinessProfile): string {
  const {
    name,
    industry,
    country,
    city,
    budget,
    goals,
    targetAudience,
    idealCustomer,
    customerPainPoints,
    products,
    services,
    businessModel,
    competitors,
    competitiveAdvantages,
    marketingChannels,
    existingChannels,
    tone,
    brandPositioning,
    positioningStatement,
    maturity,
    additionalNotes,
    keyChallenges,
    uniqueValueProposition,
  } = profile;

  const formatList = (items?: string[], defaultValue = "Not specified"): string => {
    if (!items || items.length === 0) return defaultValue;
    return items.map((item) => `• ${item}`).join("\n");
  };

  const formatInlineList = (items?: string[], defaultValue = "Not specified"): string => {
    if (!items || items.length === 0) return defaultValue;
    return items.join(", ");
  };

  // Génération d'un seed aléatoire pour varier les résultats
  const randomSeed = Math.floor(Math.random() * 10000);

  return `
You are a Senior Marketing Strategist with 20+ years of experience at top-tier agencies (McKinsey, BCG, Ogilvy, WPP). You specialize in creating hyper-personalized, data-driven marketing strategies.

CRITICAL INSTRUCTION: You MUST create a strategy that is UNIQUE to this specific business. Two businesses in the same industry MUST receive completely different strategies with DIFFERENT scores, metrics, and recommendations based on their unique context.

RANDOM SEED FOR VARIABILITY: ${randomSeed}
Use this seed to generate unique market scores, growth rates, and metrics that vary between 60-95 (not always the same number).

${`
## BUSINESS PROFILE:
### Core Information
- **Business Name**: "${name}"
- **Industry**: "${industry}"
- **Location**: ${city ? `${city}, ${country}` : country}
- **Business Model**: ${businessModel || "Not specified"}
- **Maturity Stage**: ${maturity ? maturity.charAt(0).toUpperCase() + maturity.slice(1) : "Not specified"}
- **Monthly Budget**: $${budget.toLocaleString()}

### Strategic Direction
- **Primary Goals**: 
${formatList(goals)}
- **Target Audience**: "${targetAudience}"
- **Ideal Customer Profile**: 
${idealCustomer || "Not specified"}

### Customer Intelligence
- **Customer Pain Points**: 
${formatList(customerPainPoints)}

### Offer & Value Proposition
- **Products**: 
${formatList(products)}
- **Services**: 
${formatList(services)}
- **Unique Value Proposition**: 
${uniqueValueProposition || "Not specified"}
- **Competitive Advantages**: 
${formatList(competitiveAdvantages)}

### Market Position
- **Brand Positioning**: ${brandPositioning || "Not specified"}
- **Positioning Statement**: 
${positioningStatement || "Not specified"}
- **Brand Tone**: "${tone || "Professional"}"

### Competitive Landscape
- **Known Competitors**: 
${formatList(competitors)}

### Marketing Infrastructure
- **Preferred Channels**: ${formatInlineList(marketingChannels)}
- **Currently Using**: ${formatInlineList(existingChannels)}

### Challenges & Context
- **Key Challenges**: 
${formatList(keyChallenges)}
- **Additional Context**: 
${additionalNotes || "None"}
`}

## YOUR STRATEGIC TASK:

Create a COMPREHENSIVE, ACTIONABLE, and HYPER-PERSONALIZED marketing strategy that:

1. **Generates UNIQUE market scores** between 60-95 based on the specific business context (not always 78)
2. **Identifies REAL competitors** in ${city ? city + ", " : ""}${country} for the ${industry} industry
3. **Provides REALISTIC metrics** that vary based on the business size, budget, and market conditions
4. **Creates DETAILED ad copy** with at least 3-4 sentences per ad, not just headlines
5. **Addresses specific customer pain points** mentioned in the profile
6. **Leverages competitive advantages** to differentiate from competitors
7. **Considers maturity stage** (${maturity || "unknown"}) for realistic recommendations
8. **Uses the exact budget** of $${budget.toLocaleString()} allocated realistically

## REQUIRED ANALYSIS SECTIONS:

### 1. Market Analysis
- Market size SPECIFIC to ${industry} in ${city ? city + ", " : ""}${country} (research real data)
- Growth rate with realistic percentage (vary between 5-25% based on industry)
- Current trends (2024-2025) specific to this market
- Opportunities UNIQUE to this business
- Threats specific to their competitive landscape
- Customer pain points (use the ones provided + add insights)
- Buying motivations specific to their target audience

### 2. Competitor Intelligence
- **SEARCH FOR REAL COMPETITORS** in ${city ? city + ", " : ""}${country} for ${industry}
- For each competitor provide:
  * Real website URL if known
  * Estimated market share (realistic percentage)
  * Estimated monthly traffic (realistic numbers based on business size)
  * Advertising activity (Active/Moderate/Low/None)
  * Position (Leader/Challenger/Niche)
  * Strengths and weaknesses
  * Opportunity score (0-100, vary based on actual competitive gap)
- Identify gaps they can exploit

### 3. Audience Personas
- Create 2 detailed personas based on the ideal customer profile
- Include demographics, behaviors, pain points, goals, preferred channels
- Make them specific to ${city ? city + ", " : ""}${country} market

### 4. Campaign Strategy
- 4-6 campaigns across platforms
- Each campaign must include:
  * **DETAILED ad copy** (3-4 sentences minimum, not just headlines)
  * Specific customer pain points addressed
  * Competitive advantages leveraged
  * Brand tone matched (${tone || "Professional"})
  * Target persona specified
  * Realistic budget allocation from $${budget.toLocaleString()}
  * Estimated reach (realistic numbers)

### 5. Creative Direction
- **LONG-FORM ad copy examples** (150-200 words per ad)
- Visual direction aligned with brand tone
- Color palette suggestions
- Messaging framework

### 6. Budget Allocation
- Exact dollar amounts per channel (must total $${budget.toLocaleString()})
- Percentages per platform (must total 100%)
- Justification for allocation based on maturity stage and goals

### 7. Analytics Plan
- KPIs aligned with stated goals
- Tracking setup recommendations
- Reporting cadence

### 8. 90-Day Roadmap
- Month-by-month action plan
- Prioritized by impact and effort
- Realistic for their maturity stage
- Specific tasks, not generic advice

### 9. Strategic Recommendations
- 3-5 high-impact recommendations
- Each must address key challenges or leverage competitive advantages
- Include confidence scores (0-100, vary based on recommendation quality)
- Prioritize by effort vs. impact

### 10. AI Recommendation
- Single most important opportunity
- Confidence level (realistic percentage)
- Expected result (specific, measurable)
- Priority level

## OUTPUT FORMAT:

Return ONLY valid JSON (no markdown, no backticks, no explanations) following this EXACT structure:

{
  "businessName": "${name}",
  "industry": "${industry}",
  "country": "${country}",
  "city": "${city || ""}",
  "budget": ${budget},
  
  "overview": {
    "marketScore": number (60-95, UNIQUE based on business context, NOT always 78),
    "growthPotential": "Low" | "Medium" | "High" | "Very High",
    "competition": "Low" | "Medium" | "High" | "Very High",
    "estimatedROI": "percentage (realistic based on industry and budget)",
    "budgetSplit": {
      "meta": number (percentage),
      "google": number (percentage),
      "tiktok": number (percentage),
      "linkedin": number (percentage),
      "other": number (percentage)
    }
  },
  
  "market": {
    "marketSize": "dollar amount with context (research real data for ${industry} in ${country})",
    "growthRate": number (5-25%, realistic for ${industry}),
    "trends": ["trend 1", "trend 2", "trend 3", "trend 4"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "threats": ["threat 1", "threat 2", "threat 3"],
    "customerPainPoints": ["pain point 1", "pain point 2", "pain point 3"],
    "buyingMotivations": ["motivation 1", "motivation 2", "motivation 3"]
  },
  
  "competitors": [
    {
      "name": "REAL Competitor Name in ${country}",
      "website": "real website URL if known",
      "share": "realistic market share percentage",
      "traffic": "realistic monthly traffic estimate",
      "ads": "Active" | "Moderate" | "Low" | "None",
      "position": "Leader" | "Challenger" | "Niche",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "opportunity": number (0-100, vary based on actual gap),
      "estimatedTraffic": number,
      "seoVisibility": number (0-100),
      "topChannels": ["channel 1", "channel 2"],
      "mainOffer": "their main offer",
      "uniqueSellingProposition": "their USP",
      "customerSentiment": "positive" | "neutral" | "negative",
      "growthScore": number (0-100),
      "trendScore": number (0-100),
      "competitiveThreat": "low" | "medium" | "high",
      "advertisingActivity": {
        "googleAds": boolean,
        "metaAds": boolean,
        "linkedinAds": boolean,
        "tiktokAds": boolean
      }
    }
  ],
  
  "audience": {
    "primaryPersona": {
      "name": "Persona Name",
      "age": "age range",
      "gender": "Any" | "Male" | "Female" | "Mixed",
      "income": "income range",
      "occupation": "job title/field",
      "goals": ["goal 1", "goal 2"],
      "painPoints": ["pain 1", "pain 2"],
      "preferredChannels": ["channel 1", "channel 2"],
      "buyingBehavior": "description of how they buy"
    },
    "secondaryPersona": {
      "name": "Persona Name",
      "age": "age range",
      "gender": "Any" | "Male" | "Female" | "Mixed",
      "income": "income range",
      "occupation": "job title/field",
      "goals": ["goal 1", "goal 2"],
      "painPoints": ["pain 1", "pain 2"],
      "preferredChannels": ["channel 1", "channel 2"],
      "buyingBehavior": "description of how they buy"
    },
    "demographics": {
      "location": "${city ? city + ", " : ""}${country}",
      "language": "primary language",
      "device": "mobile/desktop split",
      "timezone": "timezone info"
    },
    "behaviors": ["behavior 1", "behavior 2", "behavior 3"],
    "interests": ["interest 1", "interest 2", "interest 3"]
  },
  
  "personas": [
    {
      "name": "Persona 1",
      "age": "age range",
      "gender": "Any" | "Male" | "Female" | "Mixed",
      "income": "income range",
      "occupation": "job title/field",
      "goals": ["goal 1", "goal 2"],
      "painPoints": ["pain 1", "pain 2"],
      "preferredChannels": ["channel 1", "channel 2"],
      "buyingBehavior": "description"
    },
    {
      "name": "Persona 2",
      "age": "age range",
      "gender": "Any" | "Male" | "Female" | "Mixed",
      "income": "income range",
      "occupation": "job title/field",
      "goals": ["goal 1", "goal 2"],
      "painPoints": ["pain 1", "pain 2"],
      "preferredChannels": ["channel 1", "channel 2"],
      "buyingBehavior": "description"
    }
  ],
  
  "campaigns": [
    {
      "platform": "Meta" | "Google" | "TikTok" | "LinkedIn" | "Other",
      "headline": "compelling headline",
      "text": "DETAILED ad copy text (3-4 sentences minimum, 100-150 words, not just a headline)",
      "cta": "Call to Action",
      "hook": "hook type (Problem-Solution, Social Proof, etc.)",
      "objective": "Awareness" | "Consideration" | "Conversion",
      "budget": "dollar amount",
      "reach": "estimated reach (realistic number)",
      "targetPersona": "which persona this targets",
      "duration": "campaign duration"
    }
  ],
  
  "creative": {
    "adCopy": [
      {
        "platform": "platform name",
        "headline": "headline",
        "primaryText": "LONG-FORM ad text (150-200 words minimum, detailed and persuasive)",
        "cta": "CTA button text",
        "hook": "hook type",
        "tone": "${tone || "Professional"}"
      }
    ],
    "visualDirection": "description of visual style",
    "brandVoice": "description of brand voice",
    "colorPalette": ["#color1", "#color2", "#color3"]
  },
  
  "analytics": {
    "kpis": [
      { "name": "KPI name", "target": "target value", "trend": "up" | "down" | "neutral" }
    ],
    "trackingSetup": ["tool 1", "tool 2", "tool 3"],
    "reportingCadence": "how often to report"
  },
  
  "roadmap": [
    {
      "month": "Month 1",
      "task": "main task",
      "priority": "High" | "Medium" | "Low",
      "impact": "impact description",
      "difficulty": "Easy" | "Medium" | "Hard",
      "results": "expected results"
    }
  ],
  
  "recommendations": [
    {
      "category": "category name",
      "priority": "high" | "medium" | "low",
      "title": "recommendation title",
      "description": "detailed description",
      "expectedImpact": "expected impact",
      "effort": "low" | "medium" | "high",
      "confidence": number (60-95, vary based on recommendation quality)
    }
  ],
  
  "aiRecommendation": {
    "opportunity": "top opportunity description",
    "confidence": "percentage (realistic)",
    "result": "expected result (specific, measurable)",
    "priority": "High" | "Medium" | "Low"
  }
}

## CRITICAL RULES:

1. **UNIQUENESS**: This strategy MUST be unique to "${name}". Use their specific competitive advantages, positioning, and challenges to differentiate.
2. **VARIABILITY**: Market scores must vary between 60-95 based on business context. NOT always 78.
3. **REAL COMPETITORS**: Search for REAL competitors in ${city ? city + ", " : ""}${country} for ${industry}. Provide real websites and realistic metrics.
4. **SPECIFICITY**: Be specific to ${industry} in ${city ? city + ", " : ""}${country}. No generic advice.
5. **BUDGET ACCURACY**: Use the EXACT budget of $${budget.toLocaleString()}. All allocations must sum to this amount.
6. **PERCENTAGE ACCURACY**: All percentages in budgetSplit must sum to exactly 100.
7. **BRAND ALIGNMENT**: Match the brand tone: "${tone || "Professional"}" throughout all messaging.
8. **GOAL FOCUS**: Address the stated goals: ${formatInlineList(goals)}.
9. **AUDIENCE PRECISION**: Target the ideal customer profile provided, not generic audiences.
10. **PAIN POINT RESOLUTION**: Address the specific customer pain points mentioned.
11. **COMPETITIVE LEVERAGE**: Use their competitive advantages to differentiate from competitors.
12. **MATURITY APPROPRIATENESS**: Recommendations must be realistic for their maturity stage (${maturity || "unknown"}).
13. **CHANNEL OPTIMIZATION**: Build on existing channels (${formatInlineList(existingChannels)}) while expanding strategically.
14. **CHALLENGE RESOLUTION**: Address key challenges with specific solutions.
15. **REALISM**: Provide realistic, actionable recommendations, not wishful thinking.
16. **DATA ACCURACY**: Use current market data and trends (2024-2025).
17. **LONG-FORM COPY**: Ad copy must be 150-200 words minimum, not just headlines.
18. **JSON ONLY**: Return ONLY valid JSON - no markdown, no explanations, no text outside the JSON object.

Now generate the complete, hyper-personalized strategy for "${name}":
`;
}