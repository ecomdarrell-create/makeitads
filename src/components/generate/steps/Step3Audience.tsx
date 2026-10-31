import { useState, useMemo } from 'react';
import { FormData } from '../types';
import { RequiredLabel } from '../RequiredLabel';
import { Country, City } from 'country-state-city';

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function Step3Audience({ formData, updateFormData }: StepProps) {
  // On récupère tous les pays
  const allCountries = useMemo(() => Country.getAllCountries(), []);
  
  // On stocke les pays sélectionnés sous forme de tableau
  const selectedCountries = formData.country ? formData.country.split(', ') : [];

  // On récupère les villes des pays sélectionnés
  const availableCities = useMemo(() => {
    let cities: any[] = [];
    selectedCountries.forEach((countryName) => {
      const country = allCountries.find(c => c.name === countryName);
      if (country) {
        cities = [...cities, ...City.getCitiesOfCountry(country.isoCode) || []];
      }
    });
    // Trier les villes par ordre alphabétique
    return cities.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCountries, allCountries]);

  const handleCountryToggle = (countryName: string) => {
    let newSelected;
    if (selectedCountries.includes(countryName)) {
      newSelected = selectedCountries.filter(c => c !== countryName);
    } else {
      newSelected = [...selectedCountries, countryName];
    }
    updateFormData({ country: newSelected.join(', ') });
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Liste des pays (Multi-select avec checkboxes) */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            <RequiredLabel>Pays ciblés</RequiredLabel>
          </label>
          <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto p-2 bg-white">
            {allCountries.map((c) => (
              <label key={c.isoCode} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(c.name)}
                  onChange={() => handleCountryToggle(c.name)}
                  className="rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1]"
                />
                <span className="text-sm text-gray-700">{c.name}</span>
              </label>
            ))}
          </div>
          {selectedCountries.length > 0 && (
            <p className="mt-1 text-[10px] text-gray-500">
              {selectedCountries.length} pays sélectionné(s)
            </p>
          )}
        </div>

        {/* Liste des villes (basée sur les pays sélectionnés) */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            Ville / région
          </label>
          <select
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            disabled={selectedCountries.length === 0}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Sélectionnez une ville...</option>
            {availableCities.map((city) => (
              <option key={`${city.name}-${city.countryCode}`} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {selectedCountries.length === 0 && (
            <p className="mt-1 text-[10px] text-amber-600">
              Sélectionnez d&apos;abord un pays.
            </p>
          )}
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