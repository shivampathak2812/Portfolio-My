import {
  EMAIL,
  GITHUB_URL,
  JOB_TITLE,
  LINKEDIN_URL,
  PROFILE_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./site";

// Schema.org structured data describing the person behind the portfolio.
// Only facts already shown on the site / resume are used here.
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      image: `${SITE_URL}${PROFILE_IMAGE}`,
      jobTitle: JOB_TITLE,
      description:
        "Data & AI Engineer with hands-on experience in Python, SQL, Machine Learning, Data Science, LLMs, RAG, FastAPI, and PostgreSQL.",
      email: `mailto:${EMAIL}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      worksFor: {
        "@type": "Organization",
        name: "Silicon Interfaces Pvt. Ltd.",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Graphic Era Hill University",
      },
      knowsAbout: [
        "Artificial Intelligence",
        "Generative AI",
        "Large Language Models",
        "Retrieval-Augmented Generation",
        "Machine Learning",
        "Data Science",
        "Data Engineering",
        "Data Analytics",
        "Python",
        "SQL",
        "FastAPI",
        "PostgreSQL",
        "ETL Pipelines",
        "Apache Airflow",
      ],
      sameAs: [LINKEDIN_URL, GITHUB_URL],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: `${SITE_URL}/`,
      name: `${SITE_NAME} — ${JOB_TITLE}`,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
      inLanguage: "en",
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so no string in the payload can close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
