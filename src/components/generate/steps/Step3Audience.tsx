import { useState, useMemo, useRef, useEffect } from 'react';
import { FormData } from '../types';
import { RequiredLabel } from '../RequiredLabel';
import { Country, City } from 'country-state-city';
import { Search, X, CheckCircle2, Info } from 'lucide-react';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

// ✅ Fonction utilitaire pour traduire les codes pays en français
function getFrenchCountryName(isoCode: string, defaultName: string): string {
  try {
    // Utilise l'API native de traduction (supportée par les navigateurs modernes et Node.js)
    return new Intl.DisplayNames(['fr'], { type: 'region' }).of(isoCode) || defaultName;
  } catch {
    return defaultName;
  }
}

export function Step3Audience({ formData, updateFormData }: StepProps) {
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);

  // On récupère tous les pays
  const allCountries = useMemo(() => Country.getAllCountries(), []);
  
  // On stocke les pays sélectionnés (sous forme de tableau de noms anglais pour la DB)
  const selectedCountries = formData.country ? formData.country.split(', ') : [];

  // ✅ Filtrage des pays (recherche en français ou en anglais)
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return allCountries;
    const lower = countrySearch.toLowerCase();
    return allCountries.filter((c) => {
      const frName = getFrenchCountryName(c.isoCode, c.name).toLowerCase();
      return frName.includes(lower) || c.name.toLowerCase().includes(lower);
    });
  }, [countrySearch, allCountries]);

  // ✅ Récupération des villes basées sur les pays sélectionnés
  const availableCities = useMemo(() => {
    let cities: any[] = [];
    selectedCountries.forEach((countryName) => {
      const country = allCountries.find((c) => c.name === countryName);
      if (country) {
        cities = [...cities, ...(City.getCitiesOfCountry(country.isoCode) || [])];
      }
    });
    return cities.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCountries, allCountries]);

  // ✅ Filtrage des villes pour la recherche
  const filteredCities = useMemo(() => {
    if (!citySearch) return availableCities;
    const lower = citySearch.toLowerCase();
    return availableCities.filter((c) => c.name.toLowerCase().includes(lower));
  }, [citySearch, availableCities]);

  const handleCountryToggle = (countryName: string) => {
    let newSelected;
    if (selectedCountries.includes(countryName)) {
      newSelected = selectedCountries.filter((c) => c !== countryName);
    } else {
      // ✅ Limite à 2 pays max
      if (selectedCountries.length >= 2) {
        alert("Vous pouvez sélectionner jusqu'à 2 pays maximum pour affiner votre ciblage et éviter d'avoir une liste de villes trop longue.");
        return;
      }
      newSelected = [...selectedCountries, countryName];
    }
    updateFormData({ country: newSelected.join(', ') });
    
    // Si on désélectionne un pays, on vide la ville si elle n'appartient plus aux nouveaux pays
    if (formData.city && !newSelected.includes(countryName)) {
      // Optionnel : vérifier si la ville appartient toujours, sinon vider
      const isValidCity = City.getCitiesOfCountry(newSelected.length > 0 ? allCountries.find(c => c.name === newSelected[0])?.isoCode || '' : '')?.some(c => c.name === formData.city);
      if (!isValidCity) updateFormData({ city: '' });
    }
  };

  // Fermer le dropdown de ville si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          À qui voulez-vous vendre ?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Un ciblage précis augmente vos chances de conversion.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          <RequiredLabel>Client idéal (description)</RequiredLabel>
        </label>
        <textarea
          value={formData.idealClient}
          required
          onChange={(e) => updateFormData({ idealClient: e.target.value })}
          placeholder="Ex: Femmes actives 25-40 ans, soucieuses de leur apparence..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Sexe
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData({ gender: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Sélectionnez...</option>
            <option value="men">Hommes</option>
            <option value="women">Femmes</option>
            <option value="all">Tous</option>
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Tranche d&apos;âge
          </label>
          <input
            type="text"
            value={formData.ageRange}
            onChange={(e) => updateFormData({ ageRange: e.target.value })}
            placeholder="25-40"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ✅ LISTE DES PAYS (Recherche + Trad FR + Max 2) */}
        <div className="flex flex-col">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 flex items-center justify-between">
            <span><RequiredLabel>Pays ciblés</RequiredLabel></span>
            <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              2 maximum
            </span>
          </label>
          
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Barre de recherche de pays */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-slate-50/50">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Rechercher un pays..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              {countrySearch && (
                <button onClick={() => setCountrySearch('')} className="text-gray-400 hover:text-gray-600">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            
            {/* Liste des pays filtrés */}
            <div className="h-48 overflow-y-auto p-2">
              {filteredCountries.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-4">Aucun pays trouvé.</p>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = selectedCountries.includes(c.name);
                  const frName = getFrenchCountryName(c.isoCode, c.name);
                  return (
                    <label 
                      key={c.isoCode} 
                      className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${isSelected ? 'bg-[#6366F1]/10' : 'hover:bg-slate-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCountryToggle(c.name)}
                        className="rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1]"
                      />
                      <span className="text-sm text-gray-700">{frName}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
          {selectedCountries.length > 0 && (
            <p className="mt-1.5 text-[10px] text-emerald-600 font-medium">
              {selectedCountries.length} pays sélectionné(s)
            </p>
          )}
        </div>

        {/* ✅ LISTE DES VILLES (Recherche intelligente) */}
        <div className="flex flex-col">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Ville / région
          </label>
          
          <div className="relative" ref={cityInputRef}>
            <div className={`flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white ${selectedCountries.length === 0 ? 'opacity-50 cursor-not-allowed' : 'focus-within:ring-2 focus-within:ring-[#6366F1] focus-within:border-transparent'}`}>
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder={selectedCountries.length === 0 ? "Choisissez un pays d'abord" : "Rechercher une ville..."}
                value={formData.city || citySearch}
                onChange={(e) => {
                  const val = e.target.value;
                  setCitySearch(val);
                  updateFormData({ city: val }); // On met à jour directement pour l'input
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                disabled={selectedCountries.length === 0}
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              {formData.city && (
                <button 
                  onClick={() => { updateFormData({ city: '' }); setCitySearch(''); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Dropdown de recherche de villes */}
            {showCityDropdown && selectedCountries.length > 0 && (
              <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl">
                {filteredCities.length === 0 ? (
                  <p className="text-xs text-center text-gray-400 py-3">Aucune ville trouvée.</p>
                ) : (
                  filteredCities.map((city) => (
                    <div
                      key={`${city.name}-${city.countryCode}`}
                      onClick={() => {
                        updateFormData({ city: city.name });
                        setCitySearch('');
                        setShowCityDropdown(false);
                      }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-slate-50 cursor-pointer"
                    >
                      {city.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {selectedCountries.length === 0 ? (
            <p className="mt-1 text-[10px] text-amber-600 flex items-center gap-1">
              <Info className="h-3 w-3" /> Sélectionnez d'abord un pays.
            </p>
          ) : availableCities.length > 0 ? (
            <p className="mt-1 text-[10px] text-gray-500">
              {availableCities.length} villes disponibles dans les pays choisis.
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Pouvoir d&apos;achat approximatif
        </label>
        <select
          value={formData.purchasingPower}
          onChange={(e) => updateFormData({ purchasingPower: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="low">Faible</option>
          <option value="medium">Moyen</option>
          <option value="high">Élevé</option>
          <option value="very_high">Très élevé</option>
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
          Comment ces clients découvrent-ils actuellement votre produit ?
        </label>
        <select
          value={formData.discoveryChannel}
          onChange={(e) => updateFormData({ discoveryChannel: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="google">Google</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="word_of_mouth">Bouche-à-oreille</option>
          <option value="other">Autre</option>
        </select>
      </div>
    </div>
  );
}