import { company, type Language } from "../data/siteContent";

type BrandMarkProps = {
  language: Language;
  compact?: boolean;
  inverse?: boolean;
};

export function BrandMark({ language, compact = false, inverse = false }: BrandMarkProps) {
  return (
    <a className={`brand-mark${inverse ? " brand-mark--inverse" : ""}`} href="#home" aria-label={`${company.arabicName} — ${company.englishName}`}>
      <span className="brand-mark__symbol" aria-hidden="true">
        <svg viewBox="0 0 42 42" fill="none">
          <path d="M7 34C13.5 29.5 17 24.5 18.6 19.2C20.1 14.5 23.5 10.5 32.5 7" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
          <path d="M13 34C18.5 29.8 21.8 25.1 23.3 19.8C24.6 15.2 27 11.5 35 8" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
          <path d="M24.5 30.5h9" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="brand-mark__type">
          <strong>{language === "ar" ? company.arabicName : company.englishName}</strong>
          <small>{language === "ar" ? company.englishName : company.arabicName}</small>
        </span>
      )}
    </a>
  );
}
