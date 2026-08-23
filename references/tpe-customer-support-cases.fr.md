# Note de preuves — Support client assisté par IA dans une petite structure

Dernière vérification : **18 août 2026**.

Cette note documente les cas publiés utilisés pour rendre le
[cas synthétique TPE](../examples/fr/tpe-demandes-clients.md) plausible. Elle
sépare les observations publiées, leur provenance et ce qu’elles ne permettent
pas de conclure.

## Cas et études retenus

| Source | Observation utile | Limite de transfert |
|---|---|---|
| [RIS d.o.o. — European Digital Innovation Hubs Network](https://european-digital-innovation-hubs.ec.europa.eu/knowledge-hub/success-stories/ai-powered-digital-assistant-customer-support) | Une PME croate de 10 à 49 personnes a testé la classification des courriels, la recherche dans une base interne et des brouillons relus par les agents. Le cas annonce 50–60 % de charge manuelle en moins, des réponses standard plus rapides de 70 % et jusqu’à 40 % d’escalades en moins. | Cas de succès publié par le réseau ayant accompagné le pilote. Les définitions, dénominateurs, intervalles et données brutes ne sont pas fournis ; ces chiffres ne sont pas un benchmark. |
| [Brynjolfsson, Li et Raymond — *Generative AI at Work*, QJE 2025](https://academic.oup.com/qje/article/140/2/889/7990658) | Déploiement échelonné auprès de 5 172 agents de support : +15 % de problèmes résolus par heure en moyenne. Les gains sont hétérogènes ; les personnes moins expérimentées progressent davantage, tandis que les plus expérimentées obtiennent de faibles gains de vitesse et de légères baisses de qualité. | Grande organisation, conversations synchrones et assistant entraîné sur un corpus très riche. L’effet moyen ne prédit ni le gain d’une TPE, ni celui d’un workflow de courriel. |
| [Bach et al. — brouillons LLM dans l’industrie maritime](https://arxiv.org/abs/2412.12732) | Étude réelle combinant observations, entretiens, enquête et similarité textuelle. Les brouillons peuvent fluidifier le travail, mais nécessitent souvent des modifications importantes dans un domaine spécialisé et critique. La décision finale reste humaine. | Étude exploratoire dans un domaine expert et critique. Elle renseigne surtout les modes d’échec et la nécessité de supervision, pas un gain de temps transférable. |
| [Dillon et al. — *Shifting Work Patterns with Generative AI*, NBER 2025](https://www.nber.org/papers/w33795) | Expérience auprès de 7 137 travailleurs dans 66 organisations. Dans la seconde moitié des six mois, les 80 % d’utilisateurs actifs du groupe traité passent environ deux heures de moins par semaine dans la messagerie. Aucun changement de quantité ou de composition des tâches n’est détecté au niveau agrégé. | Outil bureautique général et organisations de tailles variées. Le temps individuel économisé ne prouve pas un changement de performance du support client ni une économie financière. |
| [Elcome — Microsoft Customer Story](https://www.microsoft.com/en/customers/story/18986-elcome-international-microsoft-365-copilot) | L’entreprise décrit des usages de résumé, rédaction multilingue et communication client. Elle indique être passée d’un objectif de réponse de 24 heures à huit heures. | Témoignage promotionnel du fournisseur, entreprise de 50 à 999 personnes, sans protocole ni groupe de comparaison publié. Il illustre un usage, pas un effet causal. |
| [Glucovibes — étude de cas OCDE](https://www.oecd.org/en/publications/digital-for-smes-case-studies_d65e57f4-en/how-digital-tools-transformed-the-customer-service-of-a-spanish-health-sme_4e6d786c-en.html) | Cette jeune PME de santé maintient une relation client étroite par courriel, chat et échanges directs tout en investissant dans l’IA pour l’analyse de données. | L’IA n’y est pas évaluée comme copilote de courriel. Le cas soutient la conservation du lien humain, pas les métriques du pilote fictif. |

## Conséquences pour le scénario synthétique

Ces sources conduisent à cinq choix prudents :

1. conserver le copilote dans l’outil de travail existant ;
2. combiner règles, corpus approuvé et brouillon plutôt que commencer par un
   agent doté de droits d’action ;
3. mesurer correction, escalade et qualité par type de demande, pas seulement le
   temps moyen ;
4. retenir un gain synthétique de 22 %, supérieur à l’effet moyen du grand essai
   mais très inférieur aux annonces du cas RIS ;
5. refuser toute extrapolation sur les incidents rares, l’emploi, le retour sur
   investissement annuel ou une future automatisation.

## Statut des chiffres du cas

Les volumes, coûts, seuils et résultats d’Atelier Horizon restent fictifs. Ils
ont été recalibrés à partir des ordres de grandeur publiés, puis volontairement
placés dans une zone où la décision n’est pas évidente : le pilote apporte de la
valeur, mais le taux de correction reste assez élevé pour bloquer l’envoi
automatique.
