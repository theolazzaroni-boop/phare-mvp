import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const clientId = '44bbbb25-5353-4b32-9db2-a2c62275f591';
const weekStart = new Date('2026-03-09T00:00:00.000Z');

await prisma.post.deleteMany({ where: { profileId: clientId, weekStart } });

await prisma.post.createMany({
  data: [
    {
      profileId: clientId,
      weekStart,
      dayOfWeek: 1,
      publishTime: '08:00',
      status: 'READY',
      postType: 'Avant / Après',
      title: 'Une maison "abîmée" — 18 mois plus tard',
      content: `On a reçu les clés d'une maison de 1965 dans le Jura.
Le client avait un mot pour la décrire : "abîmée".

On avait un autre mot : "potentiel".

18 mois plus tard, voici ce qu'elle est devenue.

→ Murs porteurs ouverts sans toucher à la charpente
→ Isolation par l'extérieur : -60% sur la facture de chauffage
→ Chêne massif au sol, taillé dans un arbre abattu sur la parcelle

Le plus difficile dans ce métier ?
Convaincre un propriétaire que ce qu'il voit comme un problème est parfois la meilleure chose dans la maison.

Cette maison avait des murs en pierre de 60cm. On les a gardés.
Ils régulent la température mieux que n'importe quel système moderne.

Vous avez un projet de rénovation qui vous semble compliqué ? 📩`,
    },
    {
      profileId: clientId,
      weekStart,
      dayOfWeek: 2,
      publishTime: '08:00',
      status: 'READY',
      postType: 'Opinion',
      title: 'Pourquoi on est plus chers — et pourquoi ça vaut le coup',
      content: `Question qu'on nous pose souvent : "Pourquoi vous êtes plus chers que les autres ?"

Voici notre réponse honnête.

Un client nous a montré 3 devis pour sa rénovation :
→ 85 000€
→ 92 000€
→ 147 000€ (nous)

Il a choisi le moins cher. Chantier arrêté au bout de 3 mois. Malfaçons sur la toiture. Reprise complète : 68 000€ supplémentaires.

Total final : 153 000€. Pour un résultat inférieur à ce qu'on lui avait proposé.

Ce qu'on vend n'est pas un prix. C'est une certitude : le chantier sera livré comme prévu, à la date prévue, sans mauvaise surprise.

Dans la rénovation, le moins cher est rarement le moins cher. 📌`,
    },
    {
      profileId: clientId,
      weekStart,
      dayOfWeek: 3,
      publishTime: '12:00',
      status: 'READY',
      postType: 'Coulisses',
      title: 'Coulisses : fenêtres sur mesure dans un corps de ferme du XVIIIe',
      content: `Coulisses de chantier 👇

Ce matin, pose des fenêtres sur un corps de ferme du XVIIIe siècle à Lons-le-Saunier.

Le défi : des ouvertures de 1847, pas une n'est d'équerre.
Chaque fenêtre est fabriquée sur mesure, à 2mm près.

Notre menuisier est sur ce chantier depuis 6h. Il finira vers 19h.
Pas parce qu'on l'y oblige — parce qu'il sait que la lumière de fin de journée lui permettra de vérifier l'alignement parfaitement.

C'est ça, un artisan qui aime son métier.

📍 Lons-le-Saunier, Jura`,
    },
    {
      profileId: clientId,
      weekStart,
      dayOfWeek: 5,
      publishTime: '08:00',
      status: 'READY',
      postType: 'Témoignage',
      title: 'Michel nous recommande à sa fille — 8 ans après',
      content: `Il y a 8 ans, on a rénové la maison de Michel.

La semaine dernière, il nous a appelés pour nous dire que sa fille venait d'acheter la maison voisine.

"Elle veut que ce soit vous."

On ne fait pas de publicité. On n'a pas de commercial.
80% de nos chantiers viennent de recommandations comme celle-là.

Ce n'est pas une stratégie. C'est la conséquence d'un seul principe : livrer exactement ce qu'on a promis, sans exception.

Merci Michel. Et bienvenue à Camille. 🤝`,
    },
  ],
});

console.log('✅ 4 posts créés pour la semaine du 9 mars (Rennov)');
await prisma.$disconnect();
