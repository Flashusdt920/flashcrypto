import { useState, createContext, useContext } from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Language {
  code: string;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', direction: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', direction: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', direction: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', direction: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', direction: 'ltr' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' },
];

// Translations object
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome to Bolt Flasher',
    dashboard: 'Dashboard',
    send: 'Send',
    transactions: 'Transactions',
    settings: 'Settings',
    logout: 'Logout',
    balance: 'Balance',
    available: 'Available',
    pending: 'Pending',
    total: 'Total',
    sendTransaction: 'Send Transaction',
    recipient: 'Recipient Address',
    amount: 'Amount',
    network: 'Network',
    flashFee: 'Flash Fee',
    confirm: 'Confirm',
    cancel: 'Cancel',
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
  },
  es: {
    welcome: 'Bienvenido a Bolt Flasher',
    dashboard: 'Panel',
    send: 'Enviar',
    transactions: 'Transacciones',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    balance: 'Saldo',
    available: 'Disponible',
    pending: 'Pendiente',
    total: 'Total',
    sendTransaction: 'Enviar Transacción',
    recipient: 'Dirección del destinatario',
    amount: 'Cantidad',
    network: 'Red',
    flashFee: 'Tarifa Flash',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    success: 'Éxito',
    error: 'Error',
    loading: 'Cargando...',
  },
  fr: {
    welcome: 'Bienvenue chez Bolt Flasher',
    dashboard: 'Tableau de bord',
    send: 'Envoyer',
    transactions: 'Transactions',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    balance: 'Solde',
    available: 'Disponible',
    pending: 'En attente',
    total: 'Total',
    sendTransaction: 'Envoyer une transaction',
    recipient: 'Adresse du destinataire',
    amount: 'Montant',
    network: 'Réseau',
    flashFee: 'Frais Flash',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    success: 'Succès',
    error: 'Erreur',
    loading: 'Chargement...',
  },
  zh: {
    welcome: '欢迎使用 Bolt Flasher',
    dashboard: '仪表板',
    send: '发送',
    transactions: '交易',
    settings: '设置',
    logout: '登出',
    balance: '余额',
    available: '可用',
    pending: '待处理',
    total: '总计',
    sendTransaction: '发送交易',
    recipient: '接收地址',
    amount: '金额',
    network: '网络',
    flashFee: '闪电费',
    confirm: '确认',
    cancel: '取消',
    success: '成功',
    error: '错误',
    loading: '加载中...',
  },
  ar: {
    welcome: 'مرحبا بك في Bolt Flasher',
    dashboard: 'لوحة القيادة',
    send: 'إرسال',
    transactions: 'المعاملات',
    settings: 'الإعدادات',
    logout: 'تسجيل خروج',
    balance: 'الرصيد',
    available: 'متاح',
    pending: 'قيد الانتظار',
    total: 'المجموع',
    sendTransaction: 'إرسال المعاملة',
    recipient: 'عنوان المستلم',
    amount: 'المبلغ',
    network: 'الشبكة',
    flashFee: 'رسوم الفلاش',
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    success: 'نجاح',
    error: 'خطأ',
    loading: 'جاري التحميل...',
  },
};

// Language Context
const LanguageContext = createContext<{
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
}>({
  currentLanguage: languages[0],
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    const lang = languages.find(l => l.code === saved) || languages[0];
    return lang;
  });

  const setLanguage = (code: string) => {
    const lang = languages.find(l => l.code === code);
    if (lang) {
      setCurrentLanguage(lang);
      localStorage.setItem('language', code);
      document.documentElement.dir = lang.direction;
    }
  };

  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage.code] || translations.en;
    return langTranslations[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <Select value={currentLanguage.code} onValueChange={setLanguage}>
        <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="bg-black/50 rounded-lg p-4">
      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
        <Globe className="w-5 h-5 text-purple-400" />
        Language Settings
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`p-3 rounded-lg border transition-colors ${
              currentLanguage.code === lang.code
                ? 'bg-purple-600/20 border-purple-500 text-white'
                : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
            }`}
          >
            <div className="text-2xl mb-1">{lang.flag}</div>
            <div className="text-sm">{lang.name}</div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Select your preferred language for the interface
      </p>
    </div>
  );
}