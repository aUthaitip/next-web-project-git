const fs = require('fs');
const path = require('path');

const thLocales = require('/Users/ice/Final-Project/locales/th.json');
const enLocales = require('/Users/ice/Final-Project/locales/en.json');

const dataDir = '/Users/ice/Final-Project/data/home';
fs.mkdirSync(dataDir, { recursive: true });

const componentsDir = '/Users/ice/Final-Project/components/home';

const componentsToRefactor = [
  {
    name: 'AboutClinic',
    keys: ['aboutImageAlt', 'aboutTitle', 'aboutText', 'aboutLi1', 'aboutLi2', 'aboutLi3']
  },
  {
    name: 'ContactForm',
    keys: ['sendError', 'sendSuccess', 'contactTitle', 'contactSubtitle', 'namePlaceholder', 'phonePlaceholder', 'emailPlaceholder', 'selectService', 'svcCheckup', 'svcEmergency', 'svcGrooming', 'notesPlaceholder', 'sendBtn']
  },
  {
    name: 'FaqSection',
    keys: ['faqTitle', 'faq1q', 'faq1a', 'faq2q', 'faq2a']
  },
  {
    name: 'Hero',
    keys: ['heroSubtitle', 'heroDesc', 'heroImageAlt']
  },
  {
    name: 'LocationSection',
    keys: ['locationTitle']
  },
  {
    name: 'MedicalServices',
    keys: ['svc1Title', 'svc1Desc', 'svc2Title', 'svc2Desc', 'svc3Title', 'svc3Desc', 'svc4Title', 'svc4Desc', 'svc5Title', 'svc5Desc', 'servicesTitle']
  },
  {
    name: 'QuickCta',
    keys: ['ctaOnlineTitle', 'ctaOnlineDesc', 'ctaOnlineBtn', 'ctaEmergencyTitle', 'ctaEmergencyBadge', 'ctaEmergencyDesc', 'ctaPopularTitle', 'ctaLink1', 'ctaLink2', 'ctaLink3']
  },
  {
    name: 'SpecializedFeatures',
    keys: ['specializedTitle', 'eyeCareTitle', 'eyeCareDesc', 'neuroCenterTitle', 'neuroCenterDesc', 'cardioCenterTitle', 'cardioCenterDesc', 'diagImagingTitle', 'diagImagingDesc']
  }
];

function camelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

for (const comp of componentsToRefactor) {
  const compName = comp.name;
  const dataName = camelCase(compName) + 'Data';
  const dataPath = path.join(dataDir, `${compName}.ts`);
  
  let typeDef = `export interface ${compName}Data {\n`;
  comp.keys.forEach(k => {
    typeDef += `  ${k}: string;\n`;
  });
  typeDef += `}\n\n`;

  let thData = `  th: {\n`;
  comp.keys.forEach(k => {
    thData += `    ${k}: ${JSON.stringify(thLocales.home[k] || '')},\n`;
  });
  thData += `  },\n`;

  let enData = `  en: {\n`;
  comp.keys.forEach(k => {
    enData += `    ${k}: ${JSON.stringify(enLocales.home[k] || '')},\n`;
  });
  enData += `  }\n`;

  const dataFileContent = `${typeDef}export const ${dataName}: Record<'th' | 'en', ${compName}Data> = {\n${thData}${enData}};\n`;
  
  fs.writeFileSync(dataPath, dataFileContent, 'utf-8');

  // Rewrite component
  const compPath = path.join(componentsDir, `${compName}.tsx`);
  let compCode = fs.readFileSync(compPath, 'utf-8');
  
  // Add import
  const importStatement = `import { ${dataName} } from '@/data/home/${compName}';\n`;
  
  // Need to handle both normal and 'use client'; components
  if (compCode.startsWith("'use client';")) {
    compCode = compCode.replace("'use client';\n", `'use client';\n${importStatement}`);
  } else {
    compCode = importStatement + compCode;
  }
  
  // Replace const { t } = useLanguage(); with const { lang } = useLanguage();\n  const data = ${dataName}[lang];
  compCode = compCode.replace(/const { t } = useLanguage\(\);/g, `const { lang } = useLanguage();\n  const data = ${dataName}[lang];`);
  
  // Replace t('home.someKey') with data.someKey
  // Also handle t("home.someKey") just in case
  comp.keys.forEach(k => {
    const regex1 = new RegExp(`t\\('home.${k}'\\)`, 'g');
    const regex2 = new RegExp(`t\\("home.${k}"\\)`, 'g');
    compCode = compCode.replace(regex1, `data.${k}`);
    compCode = compCode.replace(regex2, `data.${k}`);
  });
  
  fs.writeFileSync(compPath, compCode, 'utf-8');
}
