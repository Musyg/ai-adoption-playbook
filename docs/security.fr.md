# Sécurité des systèmes IA et agentiques

Le modèle n’est qu’un composant. Le périmètre de sécurité inclut les données, la récupération documentaire, la mémoire, les outils, les identités, l’interface, les journaux et les opérateurs.

## Menaces prioritaires

- injection de prompt directe ou indirecte ;
- divulgation d’informations sensibles ;
- empoisonnement des données, du contexte, de la mémoire ou des outils ;
- composant ou modèle compromis dans la chaîne d’approvisionnement ;
- traitement dangereux d’une sortie ;
- agence ou permissions excessives ;
- faiblesse des index, embeddings et contrôles d’accès ;
- désinformation ou citation trompeuse ;
- consommation non bornée ;
- exfiltration ou destruction par appel d’outil.

Un RAG, un prompt système ou un fine-tuning ne supprime pas l’injection.

## Architecture de contrôle minimale

1. **Identité** — compte de service distinct, authentification forte et attribution par utilisateur.
2. **Moindre privilège** — lecture seule par défaut, permissions temporaires et ressources explicitement autorisées.
3. **Frontières de confiance** — contenu récupéré et résultats d’outils traités comme données non fiables.
4. **Validation** — schémas et règles déterministes avant toute action.
5. **Approbation** — confirmation humaine explicite pour les actions sensibles ou irréversibles.
6. **Confinement** — sandbox, restrictions réseau, destinations et types de fichiers autorisés.
7. **Limites** — budget, nombre d’étapes, volume, fréquence, durée et coût.
8. **Secrets** — jamais dans le prompt ou la mémoire ; court terme et rotation possible.
9. **Observabilité** — entrée, version, décision, outil, paramètres, résultat et acteur, avec minimisation des données.
10. **Arrêt** — kill switch, révocation des accès, rollback et procédure manuelle testés.

## Tests avant pilote

- instructions malveillantes dans chaque source externe ;
- contournement des permissions et confusion d’identité ;
- destinations, extensions et paramètres non autorisés ;
- fuite par liens, rendu, citations ou métadonnées ;
- répétition, boucle, explosion de coût et épuisement des quotas ;
- données ou outils modifiés entre validation et action ;
- échec partiel, réponse vide, délai dépassé et état incohérent ;
- tentative de désactiver les logs, contrôles ou approbations.

Mapper les scénarios pertinents sur [OWASP GenAI](../references/sources.md#sécurité) et [MITRE ATLAS](../references/sources.md#sécurité), puis conserver les preuves et les limites des tests.

## Incident

Le [runbook](../templates/incident-runbook.fr.md) doit permettre de contenir, préserver les preuves, notifier les bons responsables, révoquer les accès, revenir au processus sûr et déterminer si une réévaluation ou un retrait est nécessaire.
