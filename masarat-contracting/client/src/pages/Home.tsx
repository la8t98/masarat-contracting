import {
  ArrowDown,
  ArrowLeft,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Layers3,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BrandMark } from "../components/BrandMark";
import { Header } from "../components/Header";
import { Reveal } from "../components/Reveal";
import {
  company,
  faqs,
  gallery,
  navigation,
  projects,
  services,
  siteCopy,
  statistics,
  type Language,
} from "../data/siteContent";

const serviceIcons = {
  layers: Layers3,
  route: Route,
  refresh: ArrowDown,
  shield: ShieldCheck,
  parking: Menu,
  building: Building2,
};

function SectionHeading({ eyebrow, title, body, light = false }: { eyebrow: string; title: string; body?: string; light?: boolean }) {
  return (
    <div className={`section-heading${light ? " section-heading--light" : ""}`}>
      <span className="eyebrow"><i />{eyebrow}</span>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}

function AnimatedStat({ value, suffix, label, note }: { value: number; suffix: string; label: string; note: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const duration = 700;
      const frame = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="stat" ref={ref}>
      <strong>{shown}{suffix}</strong>
      <span>{label}</span>
      <small>{note}</small>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("masarat-language") === "en" ? "en" : "ar"));
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [formState, setFormState] = useState<"idle" | "error" | "success">("idle");
  const [backToTop, setBackToTop] = useState(false);
  const copy = siteCopy[language];
  const direction = language === "ar" ? "rtl" : "ltr";
  const isArabic = language === "ar";

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.title = isArabic ? "مسارات | مقاولات الأسفلت والطرق" : "Masarat | Asphalt & Road Contracting";
    localStorage.setItem("masarat-language", language);
  }, [direction, isArabic, language]);

  useEffect(() => {
    const update = () => setBackToTop(window.scrollY > 650);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex((index) => index === null ? null : (index + (isArabic ? -1 : 1) + gallery.length) % gallery.length);
      if (event.key === "ArrowLeft") setLightboxIndex((index) => index === null ? null : (index + (isArabic ? 1 : -1) + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isArabic, lightboxIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => setReviewIndex((index) => (index + 1) % 3), 6500);
    return () => window.clearInterval(timer);
  }, []);

  const toggleLanguage = () => setLanguage((current) => current === "ar" ? "en" : "ar");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const valid = name.length > 1 && phone.length >= 7 && /^\S+@\S+\.\S+$/.test(email) && message.length >= 8;
    setFormState(valid ? "success" : "error");
    if (valid) form.reset();
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.englishName,
    alternateName: company.arabicName,
    description: isArabic ? "شركة مسارات لمقاولات الأسفلت والطرق في الرياض." : "Masarat is a Saudi asphalt and road contracting company headquartered in Riyadh.",
    address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
    areaServed: company.serviceAreas[language],
    telephone: "+966556143573",
    sameAs: [company.whatsappUrl],
    url: "https://www.example.com/",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isArabic ? "خدمات مسارات" : "Masarat services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.title[language], description: service.description[language] },
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question[language],
      acceptedAnswer: { "@type": "Answer", text: faq.answer[language] },
    })),
  };

  const testimonials = [0, 1, 2].map((index) => ({
    quote: copy.quotePlaceholder,
    name: `${copy.customerPlaceholder} ${String(index + 1).padStart(2, "0")}`,
    company: copy.companyPlaceholder,
  }));

  return (
    <div className={`site ${isArabic ? "site--arabic" : "site--english"}`} dir={direction}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      {loading && (
        <div className="intro-screen" role="status" aria-label={company.arabicName}>
          <div className="intro-screen__road" />
          <div className="intro-screen__content">
            <BrandMark language={language} inverse />
            <span className="intro-screen__line" />
            <p>{isArabic ? "مقاولات الأسفلت والطرق" : "Asphalt & Road Contracting"}</p>
          </div>
        </div>
      )}

      <div className="scroll-progress" aria-hidden="true" />
      <Header language={language} onLanguageChange={toggleLanguage} />

      <main>
        <section id="home" className="hero" aria-labelledby="hero-title">
          <img className="hero__image" src={company.images.hero} alt={isArabic ? "طريق أسفلت جديد في مشهد صحراوي سعودي" : "New asphalt road in a Saudi desert landscape"} fetchPriority="high" />
          <div className="hero__overlay" />
          <div className="hero__grid" aria-hidden="true" />
          <div className="container hero__content">
            <div className="hero__copy">
              <span className="eyebrow eyebrow--light"><i />{copy.heroEyebrow}</span>
              <h1 id="hero-title">{copy.heroTitle}</h1>
              <p>{copy.heroDescription}</p>
              <div className="hero__actions">
                <button type="button" className="button button--gold" onClick={() => scrollTo("contact")}>{copy.primaryCta}<ArrowLeft size={17} /></button>
                <button type="button" className="button button--ghost" onClick={() => scrollTo("projects")}>{copy.secondaryCta}<ArrowDown size={17} /></button>
              </div>
              <a className="whatsapp-inline" href={company.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> {copy.whatsappCta}</a>
            </div>
            <aside className="hero__aside" aria-label={copy.areas}>
              <div className="hero__aside-rule" />
              <span>{copy.areas}</span>
              <strong>{copy.heroMeta.map((area) => <em key={area}>{area}</em>)}</strong>
            </aside>
          </div>
          <button className="hero__scroll-cue" type="button" onClick={() => scrollTo("about")}>
            <span>{copy.scrollCue}</span><i><ArrowDown size={16} /></i>
          </button>
        </section>

        <section id="about" className="about section-pad" aria-labelledby="about-title">
          <div className="container about__layout">
            <Reveal className="about__visual" delay={80}>
              <div className="about__image-frame">
                <img src={company.images.detail} alt={isArabic ? "تفاصيل سطح أسفلت وخط طريق" : "Asphalt surface and road-marking detail"} loading="lazy" />
                <div className="about__image-note"><Route size={18} /><span>{isArabic ? "من الموقع إلى المسار" : "From site to route"}</span></div>
              </div>
              <div className="about__monogram" aria-hidden="true">م</div>
            </Reveal>
            <Reveal className="about__content" delay={160}>
              <SectionHeading eyebrow={copy.aboutEyebrow} title={copy.aboutTitle} />
              <p className="about__lead">{copy.aboutLead}</p>
              <p>{copy.aboutBody}</p>
              <div className="about__features">
                {copy.expertise.map((item, index) => (
                  <div key={item.title} className="feature-line"><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><p>{item.text}</p></div></div>
                ))}
              </div>
              <p className="editorial-note"><Sparkles size={15} /> {copy.aboutNote}</p>
            </Reveal>
          </div>
        </section>

        <section id="services" className="services section-pad" aria-labelledby="services-title">
          <div className="container">
            <Reveal><SectionHeading eyebrow={copy.servicesEyebrow} title={copy.servicesTitle} body={copy.servicesText} /></Reveal>
            <div className="service-grid">
              {services.map((service, index) => {
                const Icon = serviceIcons[service.icon];
                return <Reveal key={service.icon} className="service-card" delay={index * 55} as="article">
                  <span className="service-card__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="service-card__icon"><Icon size={25} strokeWidth={1.45} /></span>
                  <h3>{service.title[language]}</h3>
                  <p>{service.description[language]}</p>
                  <span className="service-card__arrow"><ArrowLeft size={17} /></span>
                </Reveal>;
              })}
            </div>
          </div>
        </section>

        <section id="projects" className="projects section-pad" aria-labelledby="projects-title">
          <div className="container">
            <Reveal><SectionHeading eyebrow={copy.projectsEyebrow} title={copy.projectsTitle} body={copy.projectsText} /></Reveal>
            <div className="project-grid">
              {projects.map((project, index) => (
                <Reveal key={project.title.en} className={`project-card project-card--${index + 1}`} delay={index * 85} as="article">
                  <img src={project.image} alt={project.alt[language]} loading="lazy" />
                  <div className="project-card__shade" />
                  <div className="project-card__content">
                    <div><span className="project-card__category">{project.category[language]}</span><h3>{project.title[language]}</h3></div>
                    <div className="project-card__info"><span><MapPin size={14} />{project.location[language]}</span><p>{project.description[language]}</p></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="gallery section-pad" aria-labelledby="gallery-title">
          <div className="container gallery__layout">
            <Reveal className="gallery__intro"><SectionHeading eyebrow={copy.galleryEyebrow} title={copy.galleryTitle} body={copy.galleryText} /></Reveal>
            <div className="gallery__grid">
              {gallery.map((item, index) => (
                <Reveal key={item.image} className={`gallery__item gallery__item--${index + 1}`} delay={index * 65}>
                  <button type="button" onClick={() => setLightboxIndex(index)} aria-label={`${copy.viewProject}: ${item.alt[language]}`}>
                    <img src={item.image} alt={item.alt[language]} loading="lazy" />
                    <span><ExternalLink size={18} /></span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="metrics section-pad" aria-labelledby="metrics-title">
          <div className="metrics__texture" style={{ backgroundImage: `url(${company.images.detail})` }} />
          <div className="container metrics__layout">
            <Reveal><SectionHeading light eyebrow={copy.statEyebrow} title={copy.statTitle} body={copy.statText} /></Reveal>
            <div className="metrics__grid">
              {statistics.map((stat, index) => <AnimatedStat key={stat.label.en} value={stat.value} suffix={stat.suffix} label={stat.label[language]} note={copy.statEdit} />)}
            </div>
          </div>
        </section>

        <section className="why section-pad" aria-labelledby="why-title">
          <div className="container why__layout">
            <Reveal className="why__statement"><SectionHeading eyebrow={copy.whyEyebrow} title={copy.whyTitle} /><div className="why__stamp"><span>م</span><i /></div></Reveal>
            <Reveal className="why__list" delay={120}>
              {copy.whyItems.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><Check size={18} /></div>)}
            </Reveal>
          </div>
        </section>

        <section id="reviews" className="reviews section-pad" aria-labelledby="reviews-title">
          <div className="container reviews__layout">
            <Reveal><SectionHeading eyebrow={copy.reviewsEyebrow} title={copy.reviewsTitle} body={copy.reviewsText} /></Reveal>
            <Reveal className="testimonial" delay={140}>
              <div className="testimonial__stars" aria-label="5 out of 5 placeholder rating">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" />)}</div>
              <blockquote>“{testimonials[reviewIndex].quote}”</blockquote>
              <div className="testimonial__footer"><div className="testimonial__avatar">{String(reviewIndex + 1).padStart(2, "0")}</div><div><strong>{testimonials[reviewIndex].name}</strong><span>{testimonials[reviewIndex].company}</span></div><div className="testimonial__controls"><button onClick={() => setReviewIndex((reviewIndex + 2) % 3)} aria-label={copy.previous}><ChevronRight size={18} /></button><button onClick={() => setReviewIndex((reviewIndex + 1) % 3)} aria-label={copy.next}><ChevronLeft size={18} /></button></div></div>
              <div className="testimonial__pager">{testimonials.map((_, index) => <button key={index} onClick={() => setReviewIndex(index)} className={reviewIndex === index ? "active" : ""} aria-label={`Review ${index + 1}`} />)}</div>
            </Reveal>
          </div>
        </section>

        <section id="faq" className="faq section-pad" aria-labelledby="faq-title">
          <div className="container faq__layout">
            <Reveal><SectionHeading eyebrow={copy.faqEyebrow} title={copy.faqTitle} /></Reveal>
            <Reveal className="faq__items" delay={110}>
              {faqs.map((faq, index) => <details key={faq.question.en}><summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question[language]}<ChevronDownIcon /></summary><p>{faq.answer[language]}</p></details>)}
            </Reveal>
          </div>
        </section>

        <section className="cta-band" aria-labelledby="cta-title">
          <div className="container cta-band__layout">
            <div><span className="eyebrow eyebrow--light"><i />{copy.ctaEyebrow}</span><h2 id="cta-title">{copy.ctaTitle}</h2><p>{copy.ctaText}</p></div>
            <a href={company.whatsappUrl} target="_blank" rel="noreferrer" className="button button--gold"><MessageCircle size={19} /> {copy.whatsappCta}</a>
          </div>
        </section>

        <section id="contact" className="contact section-pad" aria-labelledby="contact-title">
          <div className="container">
            <Reveal><SectionHeading eyebrow={copy.contactEyebrow} title={copy.contactTitle} body={copy.contactText} /></Reveal>
            <div className="contact__layout">
              <Reveal className="contact__details" delay={90}>
                <a className="contact-detail" href={company.whatsappUrl} target="_blank" rel="noreferrer"><span><MessageCircle size={20} /></span><div><small>{copy.contactCards[0]}</small><strong dir="ltr">{company.whatsappDisplay}</strong></div><ArrowLeft size={17} /></a>
                <div className="contact-detail"><span><Mail size={20} /></span><div><small>{copy.contactCards[1]}</small><strong>{company.email}</strong></div></div>
                <div className="contact-detail"><span><MapPin size={20} /></span><div><small>{copy.contactCards[2]}</small><strong>{company.headquarters[language]}</strong></div></div>
                <div className="service-area"><span>{copy.areas}</span><div>{company.serviceAreas[language].map((area) => <b key={area}>{area}</b>)}</div></div>
              </Reveal>
              <Reveal className="contact__form-wrap" delay={160}>
                <h3>{copy.contactFormTitle}</h3>
                <form onSubmit={submitForm} noValidate>
                  <label>{copy.name}<input name="name" type="text" placeholder={copy.namePlaceholder} autoComplete="name" /></label>
                  <label>{copy.phone}<input name="phone" type="tel" placeholder={copy.phonePlaceholder} autoComplete="tel" inputMode="tel" /></label>
                  <label>{copy.email}<input name="email" type="email" placeholder={copy.emailPlaceholder} autoComplete="email" /></label>
                  <label>{copy.message}<textarea name="message" placeholder={copy.messagePlaceholder} rows={4} /></label>
                  <button className="button button--green" type="submit">{copy.submit}<ArrowLeft size={17} /></button>
                  {formState !== "idle" && <p className={`form-message form-message--${formState}`} role="status">{formState === "success" ? copy.formSuccess : copy.formError}</p>}
                  <p className="form-note"><ShieldCheck size={14} />{copy.contactFormNote}</p>
                </form>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__top">
          <div className="footer__brand"><BrandMark language={language} inverse /><p>{copy.footerText}</p></div>
          <div className="footer__links"><span>{isArabic ? "استكشف" : "Explore"}</span>{navigation.slice(0, 5).map((item) => <button type="button" key={item.id} onClick={() => scrollTo(item.id)}>{item[language]}</button>)}</div>
          <div className="footer__contact"><span>{isArabic ? "تواصل مباشر" : "Direct contact"}</span><a href={company.whatsappUrl} target="_blank" rel="noreferrer">{company.whatsappDisplay}</a><a href={`mailto:${company.email}`}>{company.email}</a></div>
        </div>
        <div className="container footer__bottom"><p>{copy.footerDisclaimer}</p><span>© {new Date().getFullYear()} {company.arabicName} — {copy.rights}</span></div>
      </footer>

      <a className="floating-whatsapp" href={company.whatsappUrl} target="_blank" rel="noreferrer" aria-label={copy.openWhatsapp}><MessageCircle size={24} /><span>{copy.whatsappCta}</span></a>
      {backToTop && <button className="back-top" type="button" onClick={() => scrollTo("home")} aria-label={copy.backTop}><ChevronUp size={20} /></button>}

      {lightboxIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={gallery[lightboxIndex].alt[language]}>
          <button className="lightbox__backdrop" type="button" onClick={() => setLightboxIndex(null)} aria-label={copy.close} />
          <div className="lightbox__content"><img src={gallery[lightboxIndex].image} alt={gallery[lightboxIndex].alt[language]} /><button className="lightbox__close" type="button" onClick={() => setLightboxIndex(null)} aria-label={copy.close}><X size={23} /></button><button className="lightbox__previous" type="button" onClick={() => setLightboxIndex((lightboxIndex + gallery.length - 1) % gallery.length)} aria-label={copy.previous}><ChevronRight size={26} /></button><button className="lightbox__next" type="button" onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)} aria-label={copy.next}><ChevronLeft size={26} /></button><span className="lightbox__caption">{gallery[lightboxIndex].alt[language]}</span></div>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon() {
  return <ChevronUp className="faq-chevron" size={19} strokeWidth={1.6} />;
}
