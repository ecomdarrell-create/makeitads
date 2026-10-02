export interface FormData {
  // Step 1: Company
  companyName: string;
  companyDescription: string;
  sector: string;
  companyAge: string;
  companySize: string;
  
  // Step 2: Offer
  mainProduct: string;
  price: string;
  promoPrice: string;
  margin: string;
  whyChooseYou: string;
  problemSolved: string;
  mainDifference: string;
  isCommercialized: string;
  whatWorks: string;
  whatDoesntWork: string;
  
  // Step 3: Audience
  idealClient: string;
  gender: string;
  ageRange: string;
  country: string;
  city: string;
  professionalSituation: string;
  purchasingPower: string;
  interests: string;
  mainProblems: string;
  purchaseMotivations: string;
  objections: string;
  discoveryChannel: string;
  
  // Step 4: Market
  mainCountry: string;
  geographicZone: string;
  competitionLevel: string;
  competitors: string;
  admiredCompany: string;
  currentPosition: string;
  
  // Step 5: Objective
  mainObjective: string;
  numericObjective: string;
  deadline: string;
  priority: string;
  
  // Step 6: Campaign
  platform: string;
  dailyBudget: string;
  totalBudget: string;
  duration: string;
  adObjective: string;
  destination: string;
  hasActiveCampaign: string;
  currentBudget: string;
  currentResults: string;
  cpl: string;
  cpa: string;
  ctr: string;
  roas: string;
  
  // Step 7: Creative
  communicationTone: string;
  usedMessages: string;
  successfulMessages: string;
  failedMessages: string;
  availableContent: string;
  hasSpokesperson: string;
  mainArguments: string;
  
  // Step 8: Context
  budgetConstraints: string;
  geographicConstraints: string;
  regulatoryConstraints: string;
  communicationConstraints: string;
  seasonality: string;
  upcomingPromotions: string;
  launchDate: string;
  additionalInfo: string;
}

export const initialFormData: FormData = {
  companyName: '',
  companyDescription: '',
  sector: '',
  companyAge: '',
  companySize: '',
  mainProduct: '',
  price: '',
  promoPrice: '',
  margin: '',
  whyChooseYou: '',
  problemSolved: '',
  mainDifference: '',
  isCommercialized: '',
  whatWorks: '',
  whatDoesntWork: '',
  idealClient: '',
  gender: '',
  ageRange: '',
  country: '',
  city: '',
  professionalSituation: '',
  purchasingPower: '',
  interests: '',
  mainProblems: '',
  purchaseMotivations: '',
  objections: '',
  discoveryChannel: '',
  mainCountry: '',
  geographicZone: '',
  competitionLevel: '',
  competitors: '',
  admiredCompany: '',
  currentPosition: '',
  mainObjective: '',
  numericObjective: '',
  deadline: '',
  priority: '',
  platform: '',
  dailyBudget: '',
  totalBudget: '',
  duration: '',
  adObjective: '',
  destination: '',
  hasActiveCampaign: '',
  currentBudget: '',
  currentResults: '',
  cpl: '',
  cpa: '',
  ctr: '',
  roas: '',
  communicationTone: '',
  usedMessages: '',
  successfulMessages: '',
  failedMessages: '',
  availableContent: '',
  hasSpokesperson: '',
  mainArguments: '',
  budgetConstraints: '',
  geographicConstraints: '',
  regulatoryConstraints: '',
  communicationConstraints: '',
  seasonality: '',
  upcomingPromotions: '',
  launchDate: '',
  additionalInfo: '',
};