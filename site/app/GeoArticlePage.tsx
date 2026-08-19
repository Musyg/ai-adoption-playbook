"use client";

import {
  geoArticlePath,
  getAlternateArticle,
  getRelatedArticles,
  type GeoArticle,
} from "./geo-content";

const repository = "https://github.com/Musyg/ai-adoption-playbook";

export function GeoArticlePage({ article }: { article: GeoArticle }) {
  const alternate = getAlternateArticle(article);
  const related = getRelatedArticles(article);
  const deploymentBase = typeof window !== "undefined" && window.location.pathname.startsWith("/ai-adoption-playbook/")
    ? "/ai-adoption-playbook"
    : "";
  const sitePath = (pathname: string) => `${deploymentBase}${pathname}`;
  const homePath = article.locale === "fr" ? "/fr/" : "/";
  const copy = article.locale === "fr"
    ? {
        skip: "Aller au contenu",
        home: "Playbook",
        method: "Méthode",
        cases: "Cas d’école",
        breadcrumb: "Guides pratiques",
        updated: "Mis à jour",
        takeaways: "À retenir",
        contents: "Dans ce guide",
        caseLabel: "CAS D’ÉCOLE",
        sources: "Sources et limites",
        sourceIntro: "Ces sources bornent la réponse. Elles ne transforment pas un cas publié en promesse pour votre organisation.",
        related: "Continuer avec",
        fullPlaybook: "Ouvrir le playbook complet",
        repository: "Voir les preuves sur GitHub",
        footer: "La preuve avant l’autonomie.",
      }
    : {
        skip: "Skip to content",
        home: "Playbook",
        method: "Method",
        cases: "Worked cases",
        breadcrumb: "Practical guides",
        updated: "Updated",
        takeaways: "Key takeaways",
        contents: "In this guide",
        caseLabel: "WORKED EXAMPLE",
        sources: "Sources and limits",
        sourceIntro: "These sources bound the answer. They do not turn one published case into a promise for your organization.",
        related: "Continue with",
        fullPlaybook: "Open the full playbook",
        repository: "Review the evidence on GitHub",
        footer: "Evidence before autonomy.",
      };

  return (
    <div className="geo-page">
      <a className="skip-link" href="#main">{copy.skip}</a>
      <header className="geo-header">
        <a className="brand" href={sitePath(homePath)} aria-label="AI Adoption Playbook"><span aria-hidden="true" />MUSYG · AI ADOPTION</a>
        <nav aria-label={article.locale === "fr" ? "Navigation de l’article" : "Article navigation"}>
          <a href={sitePath(homePath)}>{copy.home}</a>
          <a href={sitePath(`${homePath}#method`)}>{copy.method}</a>
          <a href={sitePath(`${homePath}#case`)}>{copy.cases}</a>
          {alternate ? <a className="lang" href={sitePath(geoArticlePath(alternate))} lang={alternate.locale}>{alternate.locale.toUpperCase()}</a> : null}
        </nav>
      </header>

      <main id="main">
        <article>
          <header className="geo-hero">
            <nav className="geo-breadcrumb" aria-label={article.locale === "fr" ? "Fil d’Ariane" : "Breadcrumb"}>
              <a href={sitePath(homePath)}>{copy.home}</a><span>/</span><span>{copy.breadcrumb}</span>
            </nav>
            <p className="eyebrow">{article.eyebrow}</p>
            <h1>{article.title}</h1>
            <p className="geo-answer">{article.answer}</p>
            <div className="geo-meta"><span>{copy.updated} {article.updated}</span><span>{article.readingTime}</span><span>Musyg</span></div>
          </header>

          <div className="geo-layout">
            <aside className="geo-rail">
              <p>{copy.contents}</p>
              <a href="#answer">{copy.takeaways}</a>
              <a href="#comparison">{article.comparison.caption}</a>
              {article.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.title}>{section.title}</a>)}
              <a href="#example">{article.caseStudy.title}</a>
              <a href="#sources">{copy.sources}</a>
            </aside>

            <div className="geo-content">
              <section className="geo-takeaways" id="answer" aria-labelledby="takeaways-title">
                <p className="eyebrow">{copy.takeaways}</p>
                <h2 id="takeaways-title">{article.title}</h2>
                <ol>{article.takeaways.map((takeaway, index) => <li key={takeaway}><span>0{index + 1}</span><p>{takeaway}</p></li>)}</ol>
              </section>

              <section className="geo-comparison" id="comparison" aria-labelledby="comparison-title">
                <h2 id="comparison-title">{article.comparison.caption}</h2>
                <div className="geo-table-wrap">
                  <table>
                    <thead><tr>{article.comparison.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
                    <tbody>{article.comparison.rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              </section>

              {article.sections.map((section, index) => (
                <section className="geo-section" id={`section-${index + 1}`} key={section.title}>
                  <span>0{index + 1}</span><div><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                </section>
              ))}

              <section className="geo-case" id="example" aria-labelledby="case-title">
                <p className="eyebrow">{copy.caseLabel}</p>
                <h2 id="case-title">{article.caseStudy.title}</h2>
                <p>{article.caseStudy.text}</p>
                <ul>{article.caseStudy.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul>
              </section>

              <section className="geo-sources" id="sources" aria-labelledby="sources-title">
                <div><p className="eyebrow">{copy.sources}</p><h2 id="sources-title">{copy.sources}</h2><p>{copy.sourceIntro}</p></div>
                <ol>{article.sources.map((source, index) => <li key={source.url}><span>0{index + 1}</span><div><a href={source.url}>{source.label} ↗</a><p>{source.note}</p></div></li>)}</ol>
              </section>

              <section className="geo-related" aria-labelledby="related-title">
                <p className="eyebrow">{copy.related}</p><h2 id="related-title">{copy.related}</h2>
                <div>{related.map((item) => <a href={sitePath(geoArticlePath(item))} key={item.id}><span>{item.eyebrow}</span><strong>{item.title}</strong><em>{item.description}</em></a>)}</div>
              </section>

              <div className="geo-actions">
                <a className="button primary" href={sitePath(homePath)}>{copy.fullPlaybook}</a>
                <a className="button secondary" href={repository}>{copy.repository}</a>
              </div>
            </div>
          </div>
        </article>
      </main>

      <footer className="geo-footer"><strong>AI ADOPTION PLAYBOOK</strong><span>{copy.footer}</span><a href={repository}>GitHub ↗</a></footer>
    </div>
  );
}
