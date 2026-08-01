# SPIMARIMMO — Synthèse exécutive de la nouvelle orientation

**Préparé pour:** revue CTO / direction  
**Date:** 29 juillet 2026  
**Statut:** `PROPOSITION_STRATÉGIQUE`

## Conclusion

La nouvelle mission repositionne correctement `spimarimmo.com` : le site doit devenir
un outil commercial B2B destiné en priorité aux promoteurs immobiliers marocains.

La question structurante n'est plus seulement :

> Comment inscrire davantage de visiteurs ?

Elle devient :

> Comment démontrer à un promoteur que sa participation à un salon SPIMAR constitue
> un investissement commercial crédible, organisé et mesurable ?

## Diagnostic actuel

Le site public met principalement en avant :

- la promesse destinée aux MRE;
- les prochains événements;
- l'inscription des visiteurs;
- les avantages liés à la visite.

Cette logique soutient l'acquisition de visiteurs, mais elle n'apporte pas encore aux
directions générales, commerciales et marketing les éléments nécessaires pour décider
d'un budget exposant important.

Le réseau digital présente également des signes de fragmentation : pages pays très
inégales, événements expirés encore visibles, informations et dates difficiles à
gouverner, et absence visible d'un processus centralisé de preuve et de suivi.

## Recommandation

Construire une plateforme à deux parcours :

### Parcours prioritaire — Exposants

- pourquoi exposer;
- prochains marchés internationaux;
- qualité et qualification de l'audience;
- campagnes et visibilité;
- méthode avant/pendant/après;
- études de cas et témoignages;
- offres Standard, Premium et Sponsor;
- brochure, rendez-vous et demande de proposition.

### Parcours secondaire — Visiteurs

- trouver le salon correspondant;
- découvrir les exposants;
- consulter le programme;
- obtenir les informations pratiques;
- se préinscrire.

## Hiérarchie recommandée de la page d'accueil

1. Promesse B2B et film réel des salons.
2. Chiffres vérifiés.
3. Cartes fortes des prochains salons par pays/ville.
4. Pourquoi exposer avec SPIMAR.
5. Étude de cas principale.
6. Méthode avant/pendant/après.
7. Système de visibilité.
8. Compréhension du marché MRE.
9. Promoteurs et partenaires.
10. Témoignages vidéo et galerie réelle.
11. Offres exposants.
12. Ressources, FAQ et insights.
13. Prise de rendez-vous et contact.

Les cartes événements doivent devenir une composante visuelle majeure, et non une
simple liste secondaire.

## Preuve et ROI

La crédibilité de la plateforme dépend de définitions précises :

```text
inscriptions
→ profils vérifiés
→ présences physiques
→ interactions
→ leads qualifiés
→ opportunités
→ réservations/ventes attribuées
```

Ces étapes ne doivent jamais être confondues. Chaque chiffre public devra contenir une
source, une période, une définition et une validation.

Les données publiques disponibles confirment l'importance économique et la taille de
la diaspora, mais ne prouvent pas à elles seules le ROI de SPIMAR. Le site aura donc
besoin de données propriétaires : check-ins, rendez-vous, leads, suivi commercial,
satisfaction et études de cas.

## Direction UX/UI

La référence WellExpo reste pertinente pour :

- la typographie forte;
- les compositions éditoriales asymétriques;
- le rythme clair/sombre;
- les images documentaires;
- les détails techniques;
- le mouvement contrôlé.

Elle ne doit pas imposer son architecture de conférence. La nouvelle interface devra
absorber la profondeur B2B du brief sans devenir dense ou générique.

La direction recommandée est moderne, sophistiquée et détaillée, mais non luxueuse :
jaune SPIMAR comme énergie de marque, environnements sombres pour l'événement et la
preuve, chapitres clairs pour la lecture, cartes pays distinctives, et expérience
complète sur desktop comme sur mobile.

## Architecture digitale

Recommandation :

- une nouvelle application Next.js;
- un seul système de composants;
- `spimarimmo.com` comme plateforme globale;
- les sous-domaines comme expériences locales;
- résolution du domaine et de la langue par configuration;
- un CMS éditorial central;
- PostgreSQL/Supabase pour leads, consentements, rendez-vous et suivi;
- cycle automatique des événements;
- formulaires sécurisés;
- analytics par audience, pays, édition et campagne.

Changer uniquement Gatsby vers Next.js ne suffira pas. La valeur vient surtout de la
gouvernance des contenus, des événements, des preuves et des leads.

## Décisions demandées

1. Valider les parcours Exposants/Visiteurs et leur priorité.
2. Confirmer les pays et éditions actives.
3. Désigner les responsables des chiffres, offres, cas clients et médias.
4. Confirmer le CRM et le processus commercial.
5. Lancer l'audit du CMS actuel.
6. Valider l'architecture de la homepage avant les nouveaux écrans UI.

## Prochaine production

Après validation de cette base :

1. wireframes B2B desktop, mobile et RTL;
2. contenus réalistes avec emplacements de preuve;
3. nouvelle exploration high-fidelity inspirée de WellExpo;
4. design system;
5. package d'implémentation Claude Code.

Le développement ne doit pas commencer avant la validation de la stratégie, de la
preuve, de l'UX et de la direction visuelle.

