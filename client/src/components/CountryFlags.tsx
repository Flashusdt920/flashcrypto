import { Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Country {
  code: string;
  name: string;
  flag: string;
  users: number;
}

const countries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', users: 3847 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', users: 1923 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', users: 1456 },
  { code: 'FR', name: 'France', flag: '🇫🇷', users: 1234 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', users: 987 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', users: 876 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', users: 765 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', users: 654 },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', users: 543 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', users: 432 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', users: 321 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', users: 298 },
];

export default function CountryFlags() {
  const totalUsers = countries.reduce((sum, country) => sum + country.users, 0);

  return (
    <div className="bg-black/50 border border-purple-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Global Presence</h3>
        <span className="ml-auto text-purple-400 font-semibold">
          {totalUsers.toLocaleString()} Active Users
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {countries.map((country, index) => (
          <motion.div
            key={country.code}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-900/50 rounded-lg p-3 border border-gray-700 hover:border-purple-500/50 transition-all hover:bg-purple-900/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{country.flag}</span>
              <span className="text-white font-medium text-sm">{country.code}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Users className="w-3 h-3" />
              <span>{country.users.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Supported in 150+ countries</span>
          <span className="text-purple-400">24/7 Global Support</span>
        </div>
      </div>
    </div>
  );
}

export function CountrySelector({ value, onChange }: { value?: string; onChange?: (country: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Select Your Country</label>
      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-900 rounded-lg border border-gray-700">
        {countries.map((country) => (
          <button
            key={country.code}
            onClick={() => onChange?.(country.code)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              value === country.code 
                ? 'bg-purple-600 border-purple-400' 
                : 'bg-gray-800 hover:bg-gray-700 border-gray-600'
            } border`}
          >
            <span className="text-2xl mb-1">{country.flag}</span>
            <span className="text-xs text-white">{country.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
}