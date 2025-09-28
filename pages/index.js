import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useDarkMode } from "../context/DarkModeContext";
import {
  HiUserCircle as HiOutlineUserMd,
  HiShieldCheck as HiOutlineShieldCheck,
  HiChatAlt2 as HiOutlineChatAlt2,
  HiClipboardCheck as HiOutlineClipboardCheck,
  HiCalendar as HiOutlineCalendar,
  HiVideoCamera as HiOutlineVideoCamera,
  HiDocumentText as HiOutlineDocumentText,
  HiUser as HiOutlineUser,
  HiBeaker as HiOutlineBeaker,
  HiWifi as HiOutlineWifi,
  HiWifiOff as HiOutlineWifiOff,
  HiPhone as HiOutlinePhone,
  HiLocationMarker as HiOutlineLocationMarker,
} from "react-icons/hi";

// Enhanced Language Switcher with better accessibility
function LanguageSwitcher() {
  const router = useRouter();
  const { locale } = router;

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    hi: { name: 'हिन्दी', flag: '🇮🇳' },
    pa: { name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  };

  function changeLanguage(e) {
    const newLocale = e.target.value;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.push(router.pathname, router.pathname, { locale: newLocale });
  }

  return (
    <div className="relative inline-block">
      <label htmlFor="language-select" className="sr-only">
        Select Language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={changeLanguage}
        className="appearance-none px-6 py-3 pr-12 rounded-lg border-2 border-green-600 bg-white hover:bg-green-50 
                 text-green-800 text-lg font-medium cursor-pointer shadow-md transition-all duration-200 
                 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50
                 min-h-[56px] text-extra-large"
        aria-label="Language selection"
      >
        <option value="hi" className="font-hindi">🇮🇳 हिन्दी</option>
        <option value="pa" className="font-punjabi">🇮🇳 ਪੰਜਾਬੀ</option>
        <option value="en">🇺🇸 English</option>
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

// Connection Status Component
function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {isOnline ? <HiOutlineWifi className="w-5 h-5" /> : <HiOutlineWifiOff className="w-5 h-5" />}
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
}

// Emergency Contact Component
function EmergencyContact() {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3">
        <HiOutlinePhone className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="text-lg font-bold text-red-800">Emergency Contact</h3>
          <p className="text-red-700 text-large">
            Call 108 for medical emergency / आपातकाल में 108 पर कॉल करें
          </p>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function Home() {
  const { t } = useTranslation("common");
  const { isDarkMode } = useDarkMode();

  const cardData = [
    {
      href: "/hospital-chat",
      title: t("hospitalSupport"),
      desc: t("hospitalSupportDesc"),
      icon: <HiOutlineChatAlt2 className="w-10 h-10 text-blue-600" />,
      color: "blue",
      priority: true
    },
    {
      href: "/symptom-checker",
      title: t("symptomChecker"),
      desc: t("symptomCheckerDesc"),
      icon: <HiOutlineClipboardCheck className="w-10 h-10 text-green-600" />,
      color: "green",
      priority: true
    },
    {
      href: "/appointment",
      title: t("bookAppointment"),
      desc: t("bookAppointmentDesc"),
      icon: <HiOutlineCalendar className="w-10 h-10 text-purple-600" />,
      color: "purple",
      priority: true
    },
    {
      href: "/video-consult",
      title: t("videoConsult"),
      desc: t("videoConsultDesc"),
      icon: <HiOutlineVideoCamera className="w-10 h-10 text-red-500" />,
      color: "red",
      priority: true
    },
    {
      href: "/health-record",
      title: t("healthRecord"),
      desc: t("healthRecordDesc"),
      icon: <HiOutlineDocumentText className="w-10 h-10 text-indigo-600" />,
      color: "indigo",
      priority: false
    },
    {
      href: "/patient-view",
      title: t("patientView"),
      desc: t("patientViewDesc"),
      icon: <HiOutlineUser className="w-10 h-10 text-orange-500" />,
      color: "orange",
      priority: false
    },
    {
      href: "/pharmacy",
      title: t("pharmacy"),
      desc: t("pharmacyDesc"),
      icon: <HiOutlineBeaker className="w-10 h-10 text-pink-500" />,
      color: "pink",
      priority: false
    },
  ];

  const priorityCards = cardData.filter(card => card.priority);
  const otherCards = cardData.filter(card => !card.priority);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-green-50" style={{
      paddingTop: '80px', // Add padding for fixed header
      background: isDarkMode ? '#0f172a' : undefined,
      transition: 'background 0.3s ease'
    }}>
      <Header />
      <Head>
        <title>NabhaCare - Rural Healthcare Access Platform</title>
        <meta name="description" content="Telemedicine platform for rural healthcare access in Nabha, Punjab. Serving 173 villages with quality healthcare services." />
        <meta name="keywords" content="telemedicine, rural healthcare, Nabha, Punjab, health services, doctor consultation" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NabhaCare" />
      </Head>

      <ConnectionStatus />

      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b-2 border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/doctor-view" legacyBehavior>
              <a className="inline-flex items-center px-4 py-3 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors 
                           border-2 border-transparent hover:border-blue-200 text-large font-medium">
                <HiOutlineUserMd className="w-6 h-6 mr-2" />
                {t("doctorLogin")}
              </a>
            </Link>
            <Link href="/super-admin" legacyBehavior>
              <a className="inline-flex items-center px-4 py-3 rounded-lg text-green-700 hover:bg-green-50 transition-colors
                           border-2 border-transparent hover:border-green-200 text-large font-medium">
                <HiOutlineShieldCheck className="w-6 h-6 mr-2" />
                {t("adminLogin")}
              </a>
            </Link>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/ministry.png"
          alt="Healthcare Background"
          fill
          className="object-cover opacity-10 mix-blend-overlay"
          priority
          unoptimized
        />
      </div>

      <main className="flex flex-col items-center px-4 py-8 relative z-10">
        {/* Header with Logos */}
        <div className="w-full max-w-6xl mb-8 flex justify-between items-center">
          <div className="w-32 h-16 relative">
            <Image
              src="/images/ministry.png"
              alt="Punjab Government Logo"
              width={100}
              height={100}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          <div className="w-32 h-16 relative">
            <Image
              src="/images/punjab.png"
              alt="Ministry Logo"
              width={100}
              height={100}
              className="object-contain bg-white rounded-lg p-2"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Banner Section */}
        <div className="w-full max-w-6xl mb-8 relative rounded-2xl overflow-hidden shadow-xl">
          <div className="aspect-[21/9] relative">
            <Image
              src="/images/banner.jpg"
              alt="Healthcare Banner"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center">
              <div className="p-6 text-white max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-high-contrast">
                  Transforming Rural Healthcare
                </h2>
                <p className="text-lg md:text-xl text-white/95 text-large">
                  Bringing quality healthcare services to the doorsteps of 173 villages in Nabha
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="w-full max-w-6xl">
          <EmergencyContact />
        </div>

        {/* Multilingual Title */}
        <h1 className="mb-4 text-center">
          <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 drop-shadow-lg">
            <div className="mb-2">Welcome to Nabha Care</div>
            <div className="text-2xl md:text-3xl lg:text-4xl font-hindi text-green-700">
              नभा केयर में आपका स्वागत है
            </div>
            <div className="text-2xl md:text-3xl lg:text-4xl font-punjabi text-green-700">
              ਨਭਾ ਕੇਅਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ
            </div>
          </div>
        </h1>
        
        {/* Subtitle */}
        <div className="text-center mb-8 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-gray-700 text-large">
            <span className="font-semibold">Bridging healthcare gaps for 173 villages</span>
            <br />
            <span className="font-hindi text-green-700">173 गांवों में स्वास्थ्य सेवा का विस्तार</span>
            <br />
            <span className="font-punjabi text-green-700">173 ਪਿੰਡਾਂ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ ਦਾ ਵਿਸਤਾਰ</span>
          </p>
        </div>

        {/* Priority Services */}
        <div className="w-full max-w-6xl mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-6">
            Essential Services / आवश्यक सेवाएं / ਜ਼ਰੂਰੀ ਸੇਵਾਵਾਂ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {priorityCards.map((card, index) => (
              <Link href={card.href} key={index} legacyBehavior>
                <a className="card-simple hover:scale-105 transition-transform duration-200 group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors">
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-2 text-high-contrast">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-large leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Other Services */}
        <div className="w-full max-w-6xl mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-6">
            Additional Services / अतिरिक्त सेवाएं / ਹੋਰ ਸੇਵਾਵਾਂ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCards.map((card, index) => (
              <Link href={card.href} key={index} legacyBehavior>
                <a className="card-simple hover:scale-105 transition-transform duration-200 group">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-green-800 mb-2 text-high-contrast">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-large leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Location Info */}
        <div className="w-full max-w-6xl mb-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiOutlineLocationMarker className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-green-800">Service Area</h3>
            </div>
            <p className="text-green-700 text-large">
              Serving 173 villages in Nabha region, Punjab
              <br />
              <span className="font-hindi">पंजाब के नभा क्षेत्र के 173 गांवों में सेवा</span>
              <br />
              <span className="font-punjabi">ਪੰਜਾਬ ਦੇ ਨਭਾ ਖੇਤਰ ਦੇ 173 ਪਿੰਡਾਂ ਵਿੱਚ ਸੇਵਾ</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-gray-600 text-large text-center border-t-2 border-gray-200 pt-6 w-full max-w-6xl">
          <div className="mb-4">
            <p className="font-semibold text-gray-800">
              © {new Date().getFullYear()} Nabha Care • SIH Telemedicine Solution
            </p>
            <p className="text-large">
              In collaboration with <span className="font-semibold text-green-700">Punjab Government</span> &{" "}
              <span className="font-semibold text-green-700">Ministry of Health</span>
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <p>Accessible healthcare for rural communities</p>
            <p className="font-hindi">ग्रामीण समुदायों के लिए सुलभ स्वास्थ्य सेवा</p>
            <p className="font-punjabi">ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਲਈ ਪਹੁੰਚਯੋਗ ਸਿਹਤ ਸੇਵਾ</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
