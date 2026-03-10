# Phare — Vision Produit & Roadmap 24 mois
*Document de référence interne — Mars 2026*

---

## 1. MISSION

**Phare démocratise l'accès à une stratégie d'acquisition digitale de qualité pour les PMEs et TPEs B2B qui n'ont ni le temps, ni l'expertise, ni les moyens d'y aller seules.**

Nous ne construisons pas un outil marketing de plus. Nous construisons le signal collectif qui guide les entreprises dans les eaux tumultueuses des réseaux sociaux — un phare qui s'allume plus fort à chaque nouveau navire qui passe.

---

## 2. THÈSE PRODUIT

### Pourquoi maintenant
- LinkedIn et Instagram sont devenus les canaux d'acquisition B2B dominants
- Les PMEs le savent mais ne savent pas comment s'en emparer
- Les outils existants (Waalaxy, Taplio, HubSpot) supposent une expertise préalable
- L'IA rend pour la première fois possible de générer une stratégie personnalisée à coût quasi nul
- La réglementation (CSRD, transparence) pousse même les PMEs à documenter leur présence

### Pourquoi nous
- Le fondateur a instrumenté la croissance de scale-ups en tant que RevOps — il a vécu ce problème de l'intérieur
- Background mathématiques appliquées = capacité à construire des modèles de signal sur des petits volumes de données
- Positionnement unique : nous partons de la stratégie (le cerveau), pas de l'exécution (les bras)

### Ce que nous ne sommes pas
- Nous ne sommes pas un scheduler (Buffer, Hootsuite)
- Nous ne sommes pas un CRM (HubSpot, Pipedrive)
- Nous ne sommes pas une agence déguisée en SaaS
- Nous ne sommes pas un générateur de contenu générique (Jasper, Copy.ai)

---

## 3. LE PHARE — MÉCANIQUE CENTRALE

### Le signal collectif

Chaque post publié via Phare est une donnée. Chaque performance trackée est un signal. Chaque lead généré est une validation.

```
INDIVIDUEL                    COLLECTIF
─────────────────────────────────────────────────
Rennov publie → 847 vues    ┐
Cabinet A publie → 1200 vues ├─→ Phare détecte :
Artisan B publie → 320 vues  ┘  "Avant/Après + chiffre = 3×
                                  meilleures performances dans
                                  verticale rénovation/artisanat"
                                        ↓
                              Mise à jour stratégie
                              de tous les clients
                              de la verticale
```

### Les dimensions du signal

Chaque post publié est taggué sur 6 dimensions :

| Dimension | Valeurs | Usage |
|---|---|---|
| Verticale | Rénovation, Conseil, Industrie, Services... | Benchmark sectoriel |
| Pilier | Transformation, Éducation, Coulisses, Témoignage | Optimisation contenu |
| Format | Texte, Carrousel, Vidéo, Image | Recommandation format |
| Canal | LinkedIn, Instagram | Allocation énergie |
| Accroche | Question, Chiffre, Histoire, Affirmation | A/B testing naturel |
| Résultat | Vues, Engagement, Connexions, Leads | Mesure d'impact |

### La flywheel

```
+ de clients → + de données → signal plus précis
     ↑                               ↓
meilleure rétention ← meilleures recommandations
```

Chaque nouveau client enrichit l'intelligence collective pour tous les autres. C'est un avantage compétitif qui s'auto-renforce — impossible à racheter, impossible à copier sans les années de données derrière.

---

## 4. PRINCIPES PRODUIT

**P1 — La valeur avant le login**
Le brief gratuit est utile sans créer de compte. L'email digest hebdo est utile sans ouvrir l'app. La valeur arrive sans friction.

**P2 — Zéro expertise requise**
Matteo le rénovateur ne sait pas ce qu'est un "funnel". L'interface ne lui demande jamais de le savoir. On parle son langage.

**P3 — L'outil vient te chercher**
Phare n'attend pas que le client se connecte. Il envoie le digest. Il notifie d'un lead. Il met à jour la stratégie. La valeur est push, pas pull.

**P4 — La stratégie vivante**
Rien n'est figé. Les recommandations évoluent avec les performances. Ce qu'on conseillait en mois 1 peut être différent en mois 4 — et c'est une feature, pas un bug.

**P5 — Chaque donnée sert le collectif**
Toute performance trackée améliore les recommandations de tous. Le client n'est pas seul — il navigue avec des milliers d'autres entreprises.

**P6 — ROI visible et concret**
Le client doit pouvoir répondre à la question "combien ça m'a rapporté ce mois-ci ?" en 10 secondes. Sans ça, il churne.

---

## 5. ARCHITECTURE PRODUIT

### Les 4 couches

```
┌─────────────────────────────────────────────┐
│  COUCHE 4 — INTELLIGENCE COLLECTIVE         │
│  Benchmarks verticaux · Signal posts ·      │
│  Mises à jour stratégie automatiques        │
├─────────────────────────────────────────────┤
│  COUCHE 3 — MONITORING & RÉTENTION         │
│  Dashboard vivant · Digest hebdo ·          │
│  Score de momentum · Alertes leads          │
├─────────────────────────────────────────────┤
│  COUCHE 2 — EXÉCUTION                       │
│  Rédaction posts assistée · Calendrier ·    │
│  Séquences outreach · Marketplace freelance │
├─────────────────────────────────────────────┤
│  COUCHE 1 — STRATÉGIE                       │
│  Formulaire onboarding · Génération AI ·    │
│  ICP · Piliers · Canaux · Feuille de route  │
└─────────────────────────────────────────────┘
```

Le MVP couvre la Couche 1 entièrement et la Couche 2 partiellement.
L'avantage compétitif réside dans la Couche 4.

---

## 6. ROADMAP FEATURES — 24 MOIS

### PHASE 0 — Fondations (M0 → M3)
*Objectif : MVP live, premiers clients payants, validation de la WTP*

**M1**
- [ ] Formulaire onboarding intelligent (15 questions, logique conditionnelle)
- [ ] Moteur de génération stratégie via Claude API
- [ ] Page stratégie web app (version gratuite + premium)
- [ ] Auth Supabase (magic link)
- [ ] Stripe — paiement €150/mois
- [ ] Infrastructure de tagging des posts (poser les fondations data)

**M2**
- [ ] Assistant rédaction posts LinkedIn (basé sur les piliers générés)
- [ ] Calendrier éditorial interactif
- [ ] Dashboard basique (saisie manuelle métriques)
- [ ] Email de bienvenue + onboarding sequence (3 emails)

**M3**
- [ ] Digest hebdomadaire automatique (email lundi matin)
- [ ] Tracking UTM pour attribution leads
- [ ] Page publique de la stratégie (shareable link)
- [ ] 50 clients beta recrutés manuellement

---

### PHASE 1 — Rétention (M3 → M6)
*Objectif : churn < 5%, NPS > 40, product-market fit confirmé*

**M4**
- [ ] Stratégie vivante V1 : détection pilier sous-performant + suggestion de pivot
- [ ] Score de momentum mensuel (0-100) visible sur le dashboard
- [ ] Notification in-app "Votre stratégie a été mise à jour"
- [ ] Assistant outreach LinkedIn (3 templates personnalisés par secteur)

**M5**
- [ ] Benchmark vertical V1 : comparaison engagement vs moyenne secteur
- [ ] Mini-campagnes saisonnières générées automatiquement
- [ ] Marketplace freelances V1 (répertoire simple, 20 profils)
- [ ] Referral program : 1 mois offert par client recommandé

**M6**
- [ ] Dashboard enrichi : courbes de progression, heatmap jours/heures
- [ ] Rapport mensuel automatique PDF "Voici votre mois"
- [ ] Instagram : intégration manuelle + recommandations adaptées
- [ ] **Milestone : 200 clients payants · €35k MRR**

---

### PHASE 2 — Intelligence (M6 → M12)
*Objectif : signal collectif actif, différenciation data défendable*

**M7-M8**
- [ ] Signal collectif V1 : top posts par verticale alimentent les suggestions
- [ ] A/B testing naturel des accroches (détection patterns qui performent)
- [ ] Phare Score : note de qualité du profil LinkedIn client + recommandations
- [ ] LinkedIn OAuth : import automatique des métriques de base

**M9-M10**
- [ ] Stratégie vivante V2 : réécriture automatique mensuelle des piliers sous-performants
- [ ] Détection d'opportunités : "3 de vos connexions ont liké ce type de contenu cette semaine"
- [ ] Assistant vidéo : briefs automatiques pour Reels/stories à partir des piliers
- [ ] Tier Pro+ à €299/mois (multi-canaux + analytics avancés)

**M11-M12**
- [ ] Signal collectif V2 : benchmarks par sous-verticale (ex: rénovation haut de gamme vs standard)
- [ ] Prédiction de performance : score estimé avant publication
- [ ] Marketplace freelances V2 : matching automatique selon verticale et besoins
- [ ] PWA mobile (dashboard + digest consultables sur téléphone)
- [ ] **Milestone : 600 clients payants · €100k MRR**

---

### PHASE 3 — Plateforme (M12 → M18)
*Objectif : expansion verticales, premier canal B2B partnerships, €200k MRR*

**M13-M14**
- [ ] API partenaires : intégration native pour experts-comptables et CCI
- [ ] Multi-comptes : gestion de plusieurs entreprises (agences, groupes)
- [ ] Tier Agence à €499/mois (10 comptes clients gérés)
- [ ] Blog SEO : 50 articles sur acquisition digitale PME (trafic organique)

**M15-M16**
- [ ] Instagram OAuth : métriques automatisées
- [ ] Campagnes événementielles : Phare détecte les salons/événements locaux et génère des contenus adaptés
- [ ] Intégration CRM légère : suivi des leads dans Phare (sans dépendance externe)
- [ ] Certification Phare : badge "Stratégie validée Phare" pour les clients actifs

**M17-M18**
- [ ] Signal collectif V3 : corrélations entre types de posts et conversion en leads réels
- [ ] Rapport ROI annuel automatique : "Phare vous a généré X leads, soit €Y de CA potentiel"
- [ ] Programme ambassadeurs : clients à fort engagement deviennent cas d'étude publics
- [ ] **Milestone : 1 200 clients payants · €210k MRR**

---

### PHASE 4 — Scale (M18 → M24)
*Objectif : internationalisation, €400k MRR, position de leader*

**M19-M21**
- [ ] Belgique + Suisse francophone : localisation légère, partenariats locaux
- [ ] TikTok/YouTube Shorts : extension du signal collectif à ces canaux
- [ ] Phare Intelligence API : vente de données sectorielles agrégées aux cabinets RH et fédérations
- [ ] Intégration Google Business Profile pour PMEs B2C en parallèle

**M22-M24**
- [ ] Espagne / Italie : MVP marché hispanophone et italophone
- [ ] Modèle white label pour banques et assureurs (distribution PME existante)
- [ ] Prédiction leads : scoring prédictif basé sur comportement LinkedIn avant conversion
- [ ] **Milestone : 2 500 clients payants · €430k MRR · €5M ARR**

---

## 7. ROADMAP ACQUISITION CLIENTS — 24 MOIS

### PHASE 0 — Amorçage manuel (M0 → M3)
*50 clients, CAC < €50, 100% organique*

**Canaux**
- Built in public LinkedIn : documenter la construction de Phare en temps réel (posts hebdo sur les décisions produit, les premiers clients, les échecs)
- Réseau personnel direct : pitcher les 20 premières PMEs du réseau immédiat
- Beta fermée : 10 clients "fondateurs" recrutés à la main, prix réduit €99/mois à vie, accès direct au fondateur

**Métriques cibles**
- 500 abonnés LinkedIn sur le compte Phare
- 10 clients fondateurs M2, 50 clients payants M3
- Taux de conversion brief gratuit → payant : objectif 15%

---

### PHASE 1 — Content-led growth (M3 → M9)
*200 → 600 clients, CAC < €100*

**Canaux principaux**

*LinkedIn (owned media)*
- 5 posts/semaine sur le compte Phare : résultats clients (avec permission), insights du signal collectif, coulisses produit
- Objectif : 5 000 abonnés M6, 15 000 abonnés M12
- Chaque post = preuve que Phare fonctionne = acquisition organique

*Partenariats prescripteurs*
- Experts-comptables : ils voient leurs clients PME galérer avec leur acquisition. Phare = outil qu'ils recommandent. Commission 20% première année.
- CCI (Chambres de Commerce) : partenariats régionaux, Phare présenté dans les programmes d'accompagnement PME
- Réseau BNI / clubs d'entrepreneurs locaux : présentation dans 10 clubs → 5-10 clients chacun

*Referral program*
- 1 mois offert par client recommandé (côté parrain ET filleul)
- Objectif : 30% des nouveaux clients via referral à M9

*Viralité produit*
- Watermark discret sur les stratégies partagées "Généré par Phare"
- Page publique de la stratégie shareable → trafic entrant
- Objectif : 15% des signups via viralité organique

**Métriques cibles**
- M6 : 200 clients payants, €35k MRR
- M9 : 400 clients payants, €65k MRR
- CAC moyen : €80

---

### PHASE 2 — Paid + SEO (M9 → M15)
*600 → 1 200 clients, CAC < €150*

**Canaux**

*SEO organique*
- Blog : 50 articles sur "comment générer des leads sur LinkedIn pour [secteur]"
- Ciblage longue traîne : "stratégie LinkedIn rénovation", "posts LinkedIn artisan", etc.
- Objectif : 5 000 visiteurs organiques/mois à M15

*Paid acquisition (test)*
- Meta Ads : ciblage dirigeants PME 35-55 ans, France
- Budget test : €3 000/mois, objectif CAC < €120
- Message : "Votre stratégie LinkedIn en 30 minutes, gratuite"
- A/B test landing pages

*Webinaires*
- 1 webinaire mensuel "Comment générer des leads sur LinkedIn sans y passer des heures"
- Co-animé avec un client Phare emblématique
- 200 inscrits → 20 nouveaux clients par webinaire

*PR & media*
- Placement dans : Les Échos Entrepreneurs, BFM Business PME, podcasts entrepreneurs
- Angle : "La startup qui remplace le directeur marketing des PMEs à €150/mois"

**Métriques cibles**
- M12 : 600 clients payants, €100k MRR
- M15 : 1 000 clients payants, €170k MRR
- Mix canaux : 40% organique, 30% partenariats, 20% paid, 10% referral

---

### PHASE 3 — Distribution à l'échelle (M15 → M24)
*1 200 → 2 500 clients, expansion géographique*

**Canaux**

*API partenaires (levier majeur)*
- Intégration dans les portails clients de 3 grandes banques françaises (Crédit Agricole, BNP, CIC ont tous des programmes PME)
- Intégration dans les outils d'experts-comptables (Sage, Cegid)
- Distribution indirecte à des centaines de milliers de PMEs via ces réseaux
- Modèle revenue share : 30% pour le partenaire

*Communauté*
- Slack/Discord privé des clients Phare : partage des meilleurs posts, entraide, networking
- Événement annuel "Phare Summit" : 200 dirigeants PME, speakers, cas clients
- Crée un sentiment d'appartenance → réduit le churn

*International*
- Belgique + Suisse : même langue, même problème, partenariats locaux CCI
- CAC identique France, marché additionnel +30%

**Métriques cibles**
- M18 : 1 200 clients, €210k MRR
- M21 : 1 800 clients, €310k MRR
- M24 : 2 500 clients, €430k MRR · **€5M ARR**

---

## 8. MILESTONES CLÉS

| Milestone | Mois | MRR | Clients | Signification |
|---|---|---|---|---|
| MVP live | M3 | €5k | 35 | Validation technique |
| PMF signal | M6 | €35k | 200 | Churn < 5%, NPS > 40 |
| Signal collectif actif | M9 | €65k | 400 | Data flywheel enclenché |
| Rentabilité | M10 | €80k | 500 | Cashflow positif |
| €100k MRR | M12 | €100k | 600 | Marque établie |
| Partenariats actifs | M15 | €170k | 1 000 | Distribution scalée |
| Leader français | M18 | €210k | 1 200 | Top of mind PME |
| €5M ARR | M24 | €430k | 2 500 | Expansion internationale |

---

## 9. RISQUES & MITIGATIONS

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Churn > 5% | Moyenne | Fort | Digest hebdo + stratégie vivante dès M3 |
| CAC explose en paid | Moyenne | Moyen | Partenariats prescripteurs comme canal principal |
| Waalaxy copie le positionnement | Forte | Moyen | Avance data + marque + verticale PME non-tech |
| LinkedIn restreint API | Forte | Moyen | Saisie manuelle + CSV en fallback permanent |
| Qualité IA insuffisante | Faible | Fort | Itérations prompt engineering continues |
| Concurrent bien financé | Faible | Fort | Vitesse d'exécution + base clients fidélisée |

---

## 10. ÉQUIPE CIBLE & TIMING RECRUTEMENT

| Profil | Recrutement | Rôle |
|---|---|---|
| CTO | M1 | Architecture technique, lead dev |
| Dev Full-Stack #1 | M2 | Build MVP, features core |
| Dev Full-Stack #2 | M5 | Scale produit, features retention |
| GTM #1 (Growth) | M4 | Content, partnerships, acquisition |
| Customer Success #1 | M6 | Onboarding, churn prevention |
| GTM #2 (Sales) | M8 | Outbound partenariats, CCI, experts-comptables |
| CPO | M10 | Vision produit, roadmap, UX |
| Ops | M12 | Finance, juridique, process internes |
| Dev Full-Stack #3 | M14 | Intelligence collective, ML features |
| GTM #3 (International) | M20 | Belgique, Suisse, expansion |

*Équipe complète : 10 personnes à M20*

---

*Phare — Guider les entreprises là où les autres se perdent.*
