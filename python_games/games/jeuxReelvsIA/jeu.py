import streamlit as st
import random
import os


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def resolve_image_path(relative_path):
    normalized = relative_path.replace("\\", "/")
    parts = [part for part in normalized.split("/") if part]
    return os.path.join(BASE_DIR, *parts)

class image_jeu:
    def __init__(self, chemin, reponse, difficulte, explication):
        self.chemin = resolve_image_path(chemin)
        self.reponse = reponse
        self.difficulte = difficulte
        self.xp = {"Facile": 10, "Moyen": 20, "Difficile": 30}.get(difficulte, 0)
        self.explication = explication


# Images Faciles (facile + simple)
images_faciles = [
    image_jeu("liste images/image_cafe_mistral_facile.jpg", "IA", "Facile", "🎯 L'anse (la poignée) fondante : Regardez à droite, la poignée fusionne bizarrement avec la tasse. Impossible de passer son doigt dedans !🎯 La fumée nuage de coton : La vapeur est beaucoup trop épaisse et parfaite pour être réelle.🎯 Le bord déformé : En haut à gauche, le bord de la tasse n'est pas rond et la limite avec le café est toute floue.🎯 Le fond ultra-flou (le cache-misère) : L'IA a rendu l'arrière-plan très flou pour éviter de dessiner un vrai décor et faire des erreurs.La règle d'or pour les joueurs : Zoomez sur les détails et les raccords (là où deux choses se touchent), c'est là que l'IA se trompe !"),

    image_jeu("liste images/image_femme_marche_gemini_simple1.png", "IA", "Facile", "🎯 Le texte extraterrestre : Regardez les panneaux ! FRÚITS DÉ SAISØN avec des accents qui n'existent pas en français (Ú, Ø). Et sur l'ardoise en bas à gauche : CÉRİSES DORIOJINE... L'IA a beaucoup de mal à écrire correctement.🎯 Le figurant cyclope : Zoomez sur l'homme en veste bleue à droite en arrière-plan... Il n'a qu'un seul œil au milieu du front ! L'IA crée souvent des monstres en arrière-plan quand elle manque de détails.🎯 Le visage fondu : Juste à côté de notre cyclope, la femme blonde a le visage complètement effacé et déformé.🎯 La main en pâte à modeler : Regardez la main de la femme au premier plan qui tient le sac : ses doigts n'ont pas de vraie structure et se mélangent avec le tissu du sac.La règle d'or pour les joueurs : Lisez toujours les petits textes et inspectez les visages des personnages au second plan, l'IA les bâcle presque toujours !"),

    image_jeu("liste images/image_lion_mistral_facile.jpg", "IA", "Facile", "🎯 Les yeux de travers : Zoomez bien sur les yeux du lion. Les pupilles ne sont pas symétriques et n'ont pas la même forme (l'œil à gauche est un peu écrasé). C'est un grand classique des IA !🎯 Le corps 'brouillon' : Regardez les pattes avant. Celle de gauche (pour nous) ressemble à un gros poteau poilu qui disparaît dans l'herbe sans vraie structure, et on a beaucoup de mal à voir comment les autres pattes s'attachent au corps. L'anatomie est complètement floue sous la crinière.🎯 L'effet 'shampooing L'Oréal' : La crinière est beaucoup trop propre, brillante et parfaitement éclairée (un halo doré irréaliste). Dans la savane, la nature est beaucoup plus brute et poussiéreuse ! La règle d'or pour les joueurs : Méfiez-vous des images 'trop parfaites' avec des éclairages incroyables. Et surtout, regardez toujours les yeux : c'est souvent là que l'IA trahit son manque de logique."),

    image_jeu("liste images/Amseterdam_relle.jpg", "REELLE", "Facile", "✅ L'épreuve ultime du vélo : C'est le boss final pour une IA ! Regardez les deux vélos au premier plan. Les rayons des roues sont réguliers, ils ne fusionnent pas entre eux. Le carter (la protection) de la chaîne du vélo de gauche est solide. Les IA détestent les objets avec autant de lignes croisées et en font systématiquement une bouillie de métal.✅ Les câbles de freins logiques : Observez le guidon du vélo de droite. On voit très bien les câbles de freins qui descendent le long du cadre de manière tout à fait logique. Une IA dessine souvent un câble qui part d'un point... et qui s'évapore dans les airs sans jamais s'attacher nulle part !✅ L'architecture au cordeau : Zoomez sur les maisons étroites en briques au fond (au centre de l'image). Les fenêtres sont parfaitement alignées, rectangulaires et de la bonne taille. Malgré la distance, la perspective est respectée. L'IA a la fâcheuse habitude de tordre les bâtiments lointains ou de faire fondre les fenêtres.✅ L'explication du faux (Le filtre HDR) : Pourquoi l'image a-t-elle l'air si bizarre alors ? Le photographe a poussé les réglages de couleur (la saturation et le contraste) à fond pour donner un effet carte postale spectaculaire. C'est ce qui donne ce côté un peu plastique ou peinture.La règle d'or pour les joueurs : Ne confondez pas un 'filtre Instagram' ou une photo trop colorée avec une IA ! Les couleurs mentent, mais la géométrie complexe (comme celle d'un vélo ou des câbles) dit toujours la vérité. Si un vélo est mécaniquement parfait, c'est que la photo est vraie !"),

    image_jeu("liste images/image_rue_grok_simple.jpg", "IA", "Facile", "🎯 La main et le gobelet mutants : Regardez la main qui tient le café. Les doigts fusionnent avec le carton, ils sont beaucoup trop longs et n'ont pas d'ongles définis. C'est de la bouillie !🎯 L'éclairage magique (et impossible) : Le soleil se couche en arrière-plan et éclaire la femme de dos. Elle devrait donc être à contre-jour, presque entièrement dans l'ombre (comme une silhouette sombre). Pourtant, son visage, son t-shirt et le gobelet sont bien visibles. L'IA triche souvent avec la lumière.🎯 Les passants fantômes : Zoomez sur les personnes qui marchent sur les pavés, à droite en arrière-plan. Leurs jambes se mélangent bizarrement, ils ressemblent à des taches de peinture fondues sans corps logique.🎯 La barrière qui fond : Regardez la rambarde métallique noire à gauche. Les barreaux verticaux se fondent de manière hasardeuse dans le bord en pierre, et certains disparaissent à moitié.La règle d'or pour les joueurs : Vérifiez toujours d'où vient la lumière (le soleil, une lampe) ! Si le personnage est éclairé d'un côté où il n'y a pas de source lumineuse, c'est l'IA qui s'est trompée."),

    image_jeu("liste images/image_femme_bibliothèque_ia_gemini_moyen.png", "IA", "Facile", "🎯 La PREUVE directe : Le filigrane ! Regardez tout en bas à droite. Le petit logo en forme d'étoile blanche à quatre branches est la signature de l'IA Gemini (Google). C'est la preuve absolue !🎯 Le texte fictif : Lisez le titre du livre : THE KINGS OF GHOSTS. C'est lisible, bravo l'IA ! Mais lisez le nom de l'auteur : EDWARD VONSCHLIFFER. C'est un nom inventé. Et en dessous, les lignes sont juste du texte de remplissage illisible.🎯 Les dos de livres mutants : Regardez les tranches des livres sur les étagères à gauche. Le texte dessus est souvent du pur gribouillage aléatoire et les symboles ne correspondent à rien de réel. La règle d'or : Même si l'image est belle, les logos officiels (filigranes) ne mentent pas. Et si vous lisez du texte inventé ou illisible, l'IA n'est jamais loin !"),
]


# Images Moyennes
images_moyennes = [
    image_jeu("liste images/image_chat_grok_moyen.jpg", "IA", "Moyen", "🎯 La fenêtre magique (et tordue) : Regardez bien le cadre blanc de la fenêtre. Le joint noir sur la vitre s'arrête net et disparaît par endroits. Et sur le bord en bas à gauche, il y a une sorte de vis ou de loquet métallique incrusté dans le plastique qui ne sert absolument à rien et ne correspond à aucun mécanisme réel.🎯 Les pattes en pâte à modeler : Zoomez sur les pattes avant du chat. Elles forment un seul gros bloc de poils où on ne distingue ni les vrais doigts, ni les griffes. Elles ont l'air de fondre sur le rebord de la fenêtre. L'IA a beaucoup de mal avec les extrémités (pattes, mains).🎯 Le balcon qui traverse la vitre : Regardez la rambarde noire du balcon à l'extérieur. Si vous suivez la ligne, elle ne correspond pas de l'autre côté du cadre de la fenêtre, et elle a l'air de se mélanger bizarrement avec le reflet et la structure même de la vitre.La règle d'or pour les joueurs : Quand le sujet principal (comme le chat) est trop parfait, cherchez l'erreur dans le décor derrière lui ! L'IA concentre tous ses efforts sur le personnage et bâcle complètement l'architecture ou la géométrie autour."),

    image_jeu("liste images/image_enfant_gouter_chatgpt_moyen.png", "IA", "Moyen", "🎯 La main mutante : Regardez la main du garçon posée sur l'épaule de la petite fille. Les doigts n'ont aucune logique ! Ils sont déformés, fondent avec le vêtement et la position des articulations est impossible. C'est l'erreur numéro 1 des IA.🎯 La tasse ovale : Tout en bas au centre, regardez la petite tasse blanche avec le liquide sombre. Son bord supérieur n'est pas du tout rond ou régulier, il est cabossé, et l'intérieur semble flotter bizarrement.🎯 Le repas en plastique : Regardez les croissants en bas à gauche. Ils sont beaucoup trop lisses et parfaits, sans aucune vraie croûte ou texture feuilletée de boulangerie. Pareil pour les pancakes qui semblent faits de mousse. La règle d'or pour les joueurs : Les mains sont le pire cauchemar de l'intelligence artificielle ! Comptez toujours les doigts et vérifiez les articulations. C'est le moyen le plus rapide de démasquer une fausse image."),
    
    image_jeu("liste images/image_femme_cafe_moyen1.png", "IA", "Moyen", "🎯 La main mutante (encore et toujours) : Zoomez sur la main qui tient la tasse de café. C'est une vraie catastrophe anatomique ! Les doigts semblent fusionner avec la céramique, on ne sait pas où est passé le pouce, et la prise en main est physiquement impossible.🎯 Le carnet extraterrestre : Regardez le carnet ouvert sur la table au premier plan. L'écriture n'en est pas une : ce sont des gribouillis et des vagues qui ne forment aucune lettre connue. L'IA imite l'apparence du texte de loin, mais ça s'effondre de près.🎯 Le téléphone fondu : Observez le smartphone posé à côté du carnet. Ses bords ne sont pas du tout droits ou réguliers, et il semble étrangement épais par endroits, comme s'il était fait en cire molle.🎯 L'illusion du tableau noir : Regardez le menu écrit à la craie derrière elle (DAILY SPECIA...). Les gros mots passent encore, mais regardez les lignes en dessous : les lettres se transforment très vite en taches blanches complètement illisibles.La règle d'or pour les joueurs : Ne vous laissez pas hypnotiser par un grand sourire au centre de l'image ! Scannez toujours les objets du quotidien posés au premier plan (carnet, téléphone, tasse) : ce sont les pires ennemis de l'IA."),

    image_jeu("liste images/image_mami_mistral_moyen.jpg", "IA", "Moyen", "🎯 Le regard asymétrique (le miroir de l'IA) : Plongez dans ses yeux ! Zoomez au maximum sur les pupilles (le rond noir). Elles ne sont pas parfaitement rondes. Encore plus flagrant : regardez le reflet blanc de la lumière à l'intérieur. Il n'a pas du tout la même forme ni la même position dans l'œil gauche et l'œil droit. C'est physiquement impossible avec une seule source de lumière !🎯 Les rides dessinées : L'IA a voulu en faire trop pour faire plus vrai que nature. Regardez les rides sous les yeux et sur les pommettes : elles s'entrecroisent parfois de manière anarchique, comme des coups de crayon, plutôt que de suivre la logique des muscles du visage. La peau a un aspect parcheminé presque excessif.🎯 Le pull en bouillie : Regardez le col de son pull beige tout en bas à droite. Les mailles du tricot disparaissent et fondent complètement pour devenir une simple texture floue sans aucune logique de fil. L'IA a concentré tous ses efforts sur le visage et a totalement bâclé le vêtement ! La règle d'or pour les joueurs : Regardez toujours la personne droit dans les yeux et zoomez sur les pupilles ! Les reflets de lumière trahissent presque toujours l'intelligence artificielle car elle ne comprend pas la géométrie de la lumière."),

    image_jeu("liste images/image_rue_mistral_moyen.jpg", "IA", "Moyen", "🎯 La boutique des extraterrestres : Regardez l'enseigne du grand magasin éclairé à gauche. Que dit-elle ? Poconnnronos ? L'IA essaie d'imiter l'apparence des lettres de loin, mais quand on zoome, c'est une suite de caractères impossibles à prononcer.🎯 Les rails fantômes : Au milieu de la rue pavée, il y a deux longues lignes creusées qui ressemblent à des rails de tramway. Mais regardez bien : il n'y a pas de métal, c'est juste un motif de pavés qui s'enfonce de manière absurde, et ces lignes fondent et disparaissent au loin sans logique.🎯 Les voitures qui fondent : Observez la file de voitures garées à gauche. La première voiture sombre passe encore, mais regardez celles de derrière ! Elles fusionnent entre elles, leurs formes deviennent molles et les roues se mélangent avec le trottoir et la rue. C'est de la tôle en pâte à modeler !🎯 La lumière tricheuse : Le soleil se couche pile en face, tout au bout de la rue. Normalement, la rue et les passants devraient être à contre-jour (très sombres, presque comme des ombres chinoises). Pourtant, tout est parfaitement éclairé, et les réverbères brillent à fond alors qu'il fait encore très jour. La règle d'or pour les joueurs : Lisez toujours les panneaux dans la rue ! L'IA est incapable d'écrire correctement des mots cohérents en arrière-plan. Et regardez toujours ce qui se passe au loin : l'IA est forte au premier plan, mais elle bâcle complètement le fond de l'image !"),

    image_jeu("liste images/imge_croissant_grok_moyen.jpg", "IA", "Moyen", "🎯 La tasse en verre impossible : Regardez bien la tasse de café à droite. Son anse (la poignée) fond complètement dans le verre d'une manière totalement illogique. De plus, on a l'impression que le café sombre rentre en partie dans l'anse, ce qui défie les lois de la physique !🎯 La vapeur dessin animé : La fumée qui sort du café forme des vagues parfaites, très nettes et symétriques. La vraie vapeur d'eau chaude se dissipe rapidement pour former un brouillard léger, pas des fils de fumée bien dessinés.🎯 Le robinet extraterrestre : Cherchez dans le fond flou, à gauche, au-dessus de l'évier. Le robinet ressemble à un drôle de tuyau courbé qui ne mène nulle part et n'a pas de bec verseur. L'IA invente souvent des formes vagues pour boucher les trous en arrière-plan.🎯 Des miettes ou des copeaux de bois ? Les petites miettes éparpillées sur la planche à découper ne ressemblent pas à de la vraie pâte feuilletée légère. On dirait plutôt des petits bouts de plastique ou des copeaux de bois durs et plats.La règle d'or pour les joueurs : Les objets transparents (le verre, les bocaux) et les liquides sont de véritables cauchemars pour l'IA ! Vérifiez toujours les reflets, les poignées et le niveau du liquide : si c'est tordu ou que ça fond, c'est généré par ordinateur."),

    image_jeu("liste images/mamie_chat_hatgpt_moyen.png", "IA", "Moyen", "🎯 La main disparue (et la patte collée) : Regardez le bras de la dame à droite de l'image (sa manche beige). La manche se termine, mais... où est passée sa main pour soutenir le chat ? À la place, on a une patte blanche de chat qui semble posée là, flottant et se mélangeant bizarrement au tissu de la veste.🎯 La fusion joue-chat : Zoomez là où la tête du chat touche le visage de la dame. L'oreille du chat (côté droit pour lui) a presque disparu, fusionnant complètement avec les cheveux gris et la joue de la femme. L'IA n'a pas su tracer la limite entre les deux.🎯 Les doigts saucisses : Observez la main de la femme qui tient le chat (à gauche). Les doigts sont très étranges : ils n'ont pas de vraies jointures, la bague semble tordre le doigt, et l'ongle du pouce se perd dans les poils du chat.🎯 La boucle d'oreille douloureuse : Regardez l'anneau doré à son oreille droite. Il ne passe pas dans le trou du lobe, il a l'air d'être incrusté en plein milieu de la chair de l'oreille ! La règle d'or pour les joueurs : Quand il y a un câlin ou un contact physique dans une image, zoomez immédiatement sur la zone où les deux corps se touchent. L'IA a énormément de mal à séparer les textures (les poils et la peau, par exemple) et finit toujours par les faire fondre ensemble."),

    image_jeu("liste images/paysage_reel.jpg", "REEL", "Moyen", "✅ Le test du miroir (le pire cauchemar de l'IA) : Regardez la silhouette du marcheur au centre et son reflet juste en dessous. L'angle des jambes, le petit espace de lumière entre elles, la posture... tout correspond mathématiquement. Les IA détestent les reflets complexes ! Elles ont souvent tendance à décaler le reflet, à changer sa forme, ou à oublier de refléter certains morceaux.✅ La texture cachée sous l'eau : Observez le sol au tout premier plan (en bas de l'image). Même si c'est un miroir parfait pour les nuages, on arrive encore à deviner les petites irrégularités et les cristaux de sel sous l'eau. Une IA aurait opté pour la facilité en dessinant un sol complètement lisse et plat, comme une patinoire ou un écran de téléphone.✅ Les nuages chaotiques : Le ciel est rempli de nuages aux formes très complexes et aléatoires. Dans les images générées par IA (comme on l'a vu avec la fumée du café), les nuages ont souvent un aspect trop sculpté, trop parfait ou répétitif. Ici, c'est le chaos naturel de la météo.La règle d'or pour les joueurs : Les miroirs et les flaques d'eau sont les meilleurs détecteurs de mensonge ! Si un reflet est géométriquement parfait et logique jusque dans les moindres détails, vous regardez très probablement une vraie photo."),

    image_jeu("liste images/plage_reel.jpg", "REEL", "Moyen", "✅ Le chaos des traces de pas : Regardez le sable au premier plan. Il est rempli de traces de pas qui se croisent, s'effacent à moitié et sont toutes différentes. C'est le résultat logique du passage de nombreux touristes. L'IA a beaucoup de mal avec ce genre de détails : elle a tendance à faire des traces trop régulières (comme un tampon) ou des trous qui fondent étrangement dans le sable.✅ L'ombre tachetée : Observez l'ombre projetée sur le sable au premier plan. Elle n'est pas unie, elle est tachetée de petits points de lumière. C'est exactement l'ombre que produisent les feuilles d'un arbre situé hors-champ, derrière le photographe.✅ Les bateaux à l'horizon : Zoomez sur l'eau au pied des gros rochers. On y distingue très clairement des petits bateaux (des longtail boats typiques de la région). Ils flottent de manière logique, ont une forme cohérente et on devine même la structure à l'arrière. L'IA a la fâcheuse habitude de transformer les petits objets lointains en taches de peinture indéfinissables.✅ La végétation accrochée : Regardez les arbres et les buissons sur les falaises. Malgré la distance, la texture des feuilles et la façon dont les plantes s'accrochent à la roche restent naturelles et irrégulières, sans devenir une bouillie verte informe.La règle d'or pour les joueurs : Ne confondez pas 'Photo retouchée' et 'Photo générée par IA' ! On peut booster les couleurs d'une vraie photo pour la rendre plus belle. Pour démasquer l'IA, cherchez la logique physique des choses : des traces de pas chaotiques et des petits détails au loin bien définis sont d'excellents signes de réalité."),




]


# Images Difficiles
images_difficiles = [
    image_jeu("liste images/image_boulanger_gemini_difficile1.png", "IA", "Difficile", "🎯 Les mains dans le pétrin : Zoomez sur les mains du boulanger. C'est le chaos ! Sur sa main gauche (à droite pour nous), les doigts se fondent dans la pâte et l'index est complètement tordu. Sur l'autre main, essayez de compter les doigts ou de trouver le pouce : ça ressemble à des saucisses qui fusionnent.🎯 Le Pain de Pagne : Lisez le tableau noir en arrière-plan. Il propose du PAIN DE PAGNE (au lieu de Pain de Campagne, le pagne étant un vêtement africain, c'est très drôle !). De plus, lisez le texte sur le côté du tout premier sac de farine à gauche : l'IA a bégayé et écrit MININNTEERIE.🎯 La balance fantôme : Regardez l'objet gris posé sur la table, à côté des planches en bois. Ça ressemble à une balance pour peser la pâte, mais il manque un détail crucial : il n'y a aucun écran pour lire le poids ! C'est juste un bloc de métal absurde. La règle d'or pour les joueurs : Même quand la photo ressemble à une publicité de très haute qualité, l'IA reste très mauvaise en orthographe et en anatomie. Comptez toujours les doigts et lisez tous les panneaux !"),

    image_jeu("liste images/image_hommefemme_chatgpt_difficile.png", "IA", "Difficile", "🎯 Le syndrome des dents de piano : Zoomez sur le grand sourire du jeune homme à gauche. Comptez ses dents ou regardez leur forme... Il y en a beaucoup trop ! Et surtout, au lieu d'être bien séparées, elles semblent fusionner pour former une grande bande blanche unie vers le fond de sa bouche. Les IA ont énormément de mal à dessiner des dentitions réalistes.🎯 La fusion capillaire : Regardez l'endroit exact où la joue du garçon touche les cheveux de la fille. Les cheveux bruns n'ont pas de vraie logique de mèches : ils se transforment en une masse floue et semblent fondre directement dans la peau du garçon.🎯 Le vêtement en trompe-l'œil : Observez la poche de la chemise en jean du garçon (à notre gauche). Il y a un bouton métallique blanc, mais à quoi est-il attaché ? Le rabat de la poche n'a aucune épaisseur, on dirait qu'il est juste peint sur le tissu. De plus, la couture s'arrête net au niveau du bouton.🎯 Le flou cache-misère (encore lui !) : Comme d'habitude, l'arrière-plan (la mer, le sable, la colline) est plongé dans un flou total pour éviter d'avoir à dessiner des détails compliqués comme des vagues ou des passants.La règle d'or pour les joueurs : Méfiez-vous toujours des grands sourires parfaits ! Les IA ont la fâcheuse habitude de rajouter des dents ou de les transformer en une barrière blanche sans séparation. Le dentiste est le meilleur enquêteur contre l'IA !"),

    image_jeu("liste images/image_homme_difficile_grok.jpg", "IA", "Difficile", "🎯 Le journal illisible : Regardez dans le coin en bas à gauche. Il tient ce qui ressemble à un journal ou un menu. Même si c'est censé être un peu flou à cause de la mise au point, on voit clairement que le texte n'est composé que de grosses lignes noires baveuses qui ne forment aucune vraie lettre.🎯 L'oreille fondante : Observez ce qu'il reste de son oreille sur la droite de l'image. Elle n'a pas vraiment de forme logique (le cartilage n'est pas défini), elle ressemble juste à un bout de peau molle qui se fond bizarrement avec la tempe et les petits cheveux gris.🎯 La moustache imprimée : Zoomez juste au-dessus de sa lèvre supérieure. Contrairement à la barbe sur son menton où l'on distingue bien les poils, la moustache ressemble plutôt à une tache grise continue ou à de la saleté incrustée dans la peau. L'IA a complètement raté la texture à cet endroit précis.🎯 La pupille cabossée (le grand classique) : Plongez dans ses yeux ! Si on zoome très fort sur la pupille de son œil gauche (celui de droite pour nous), on remarque qu'elle n'est pas parfaitement ronde, son contour supérieur est irrégulier.La règle d'or pour les joueurs : Face à un portrait hyper-réaliste, ne restez pas bloqués sur le centre du visage (le nez, les joues) car c'est là que l'IA est la plus forte ! Cherchez les erreurs aux extrémités de l'image : les oreilles, le bord des cheveux, les vêtements ou les objets tenus en main."),

image_jeu("liste images/desert_difficile.jpg", "RELLE", "Difficile", "✅ Les traces de pneus implacables : Regardez les traces de roues qui partent vers la gauche. Elles filent droit vers l'horizon en respectant parfaitement les règles de la perspective. Surtout, elles écrasent les croûtes de sel de manière logique, sans jamais fusionner ou fondre avec elles. L'IA déteste gérer deux textures qui se croisent sur une longue distance.✅ La géométrie imparfaite de la nature : Le sol est craquelé en formant des polygones. Si c'était une IA, ces formes seraient soit beaucoup trop symétriques (comme un carrelage de salle de bain), soit elles deviendraient de la bouillie floue au bout de quelques mètres. Ici, le motif reste net et naturel, même au loin.✅ Le subtil mirage à l'horizon : Tout au fond à droite, les petites montagnes semblent flotter au-dessus du sol. C'est un vrai phénomène optique (un mirage) typique des déserts de sel chauffés par le soleil. Une IA a tendance à en faire trop avec des montagnes géantes ou dramatiques, elle invente rarement des phénomènes optiques aussi subtils et réalistes. La règle d'or pour les joueurs : Méfiez-vous de vos préjugés ! Parfois, c'est la nature elle-même qui a l'air irréelle. Cherchez des traces de passage humain (traces de pas, de pneus) : si elles suivent une perspective parfaite sur un sol compliqué, c'est souvent une vraie photo."),

image_jeu("liste images/mont_roraima_difficile.png", "RELLE", "Difficile", "✅ La géologie implacable : Regardez attentivement les parois des falaises à gauche. On y voit des strates très nettes, c'est-à-dire des lignes horizontales de roches empilées. Dans les images générées par IA, ces lignes géométriques sur de grandes surfaces finissent souvent par fondre, se croiser de manière illogique ou devenir floues. Ici, la roche semble avoir une vraie structure solide.✅ Les nuages imparfaits : Observez la brume et les nuages dans le vide. Ils n'ont pas des formes parfaites de petits cotons ronds (comme on l'a vu sur le café ou le croissant). La brume s'accroche de manière très inégale et réaliste aux parois de la montagne.✅ Le rocher au premier plan : Regardez le gros bloc plat posé sur le bord de la falaise juste à côté du personnage. Sa texture, ses fissures et la façon dont la lumière tape dessus sont très cohérentes avec le reste de l'environnement. L'IA a souvent du mal à gérer l'éclairage de manière égale entre le tout premier plan et l'arrière-plan très lointain.La question piège pour les joueurs : Est-ce que l'image a l'air irréelle parce que c'est une IA, ou est-ce simplement parce que la nature est capable de créer des paysages dignes d'un film fantastique ?"),
]




if "images_par_niveau" not in st.session_state:
    faciles = images_faciles[:]
    moyennes = images_moyennes[:]
    difficiles = images_difficiles[:]
    random.shuffle(faciles)
    random.shuffle(moyennes)
    random.shuffle(difficiles)
    st.session_state.images_par_niveau = {
        "Facile": faciles,
        "Moyen": moyennes,
        "Difficile": difficiles,
    }

if "niveau_choisi" not in st.session_state:
    st.session_state.niveau_choisi = "Facile"

st.selectbox("Choisis ton niveau", ["Facile", "Moyen", "Difficile"], key="niveau_choisi")

if "niveau_actif" not in st.session_state:
    st.session_state.niveau_actif = st.session_state.niveau_choisi
    st.session_state.numero_image = 0

if st.session_state.niveau_actif != st.session_state.niveau_choisi:
    st.session_state.niveau_actif = st.session_state.niveau_choisi
    st.session_state.numero_image = 0
    st.session_state.a_repondu = False
    st.session_state.dernier_resultat = None
    st.session_state.message_resultat = ""

images_jeu = st.session_state.images_par_niveau[st.session_state.niveau_choisi]

if "xp_total" not in st.session_state:
    st.session_state.xp_total = 0
if "numero_image" not in st.session_state:
    st.session_state.numero_image = 0
if "bonnes_reponses" not in st.session_state:
    st.session_state.bonnes_reponses = 0
if "total_reponses" not in st.session_state:
    st.session_state.total_reponses = 0

if st.session_state.numero_image >= len(images_jeu):
    st.success("Partie terminée !")
    st.stop()

image_actuelle = images_jeu[st.session_state.numero_image]

col_gauche, col_espace, col_droite = st.columns([1.4, 0.2, 1])
with col_gauche:
    st.write(f"Ton XP total : {st.session_state.xp_total}")
    st.write(f"Bonnes réponses : {st.session_state.bonnes_reponses}/{st.session_state.total_reponses}")
with col_droite:
    st.markdown(
        f"<div style='text-align: right;'>Question : {st.session_state.numero_image + 1}/{len(images_jeu)}</div>",
        unsafe_allow_html=True,
    )
    st.markdown(
        f"<div style='text-align: right;'>Niveau : {image_actuelle.difficulte}</div>",
        unsafe_allow_html=True,
    )

st.image(image_actuelle.chemin, use_container_width=True)

explication_formatee = (
    image_actuelle.explication
    .replace("🎯", "\n\n🎯")
    .replace("✅", "\n\n✅")
    .strip()
)

# On crée une mémoire pour savoir si le joueur a cliqué ou pas
if "a_repondu" not in st.session_state:
    st.session_state.a_repondu = False
if "dernier_resultat" not in st.session_state:
    st.session_state.dernier_resultat = None
if "message_resultat" not in st.session_state:
    st.session_state.message_resultat = ""

# --- SI LE JOUEUR N'A PAS ENCORE RÉPONDU ---
if not st.session_state.a_repondu:
    # On met les deux boutons côte à côte
    col1, col_espace_btn_1, col_espace_btn_2, col2 = st.columns([1, 0.35, 0.35, 1])
    
    with col1:
        if st.button("🤖 C'est une IA !", use_container_width=True):
            st.session_state.total_reponses += 1
            if image_actuelle.reponse == "IA":
                st.session_state.dernier_resultat = "success"
                st.session_state.message_resultat = f"✅ Bonne réponse ! +{image_actuelle.xp} XP"
                st.session_state.xp_total += image_actuelle.xp
                st.session_state.bonnes_reponses += 1
            else:
                st.session_state.dernier_resultat = "error"
                st.session_state.message_resultat = f"❌ Mauvaise réponse. C'était : {image_actuelle.reponse}"
            
            st.session_state.a_repondu = True # On mémorise qu'il a cliqué
            st.rerun() # On rafraîchit la page pour afficher l'explication
            
    with col2:
        # 2. ON AJOUTE LE BOUTON POUR LES VRAIES PHOTOS
        if st.button("📸 C'est une vraie photo !", use_container_width=True):
            st.session_state.total_reponses += 1
            # Attention, dans ton code tu as écrit "REELLE" pour l'image du National Geographic
            if image_actuelle.reponse in ["REELLE", "REEL", "RELLE"]:
                st.session_state.dernier_resultat = "success"
                st.session_state.message_resultat = f"✅ Bonne réponse ! +{image_actuelle.xp} XP"
                st.session_state.xp_total += image_actuelle.xp
                st.session_state.bonnes_reponses += 1
            else:
                st.session_state.dernier_resultat = "error"
                st.session_state.message_resultat = f"❌ Mauvaise réponse. C'était : {image_actuelle.reponse}"
            
            st.session_state.a_repondu = True
            st.rerun()

# --- SI LE JOUEUR VIENT DE RÉPONDRE ---
else:
    if st.session_state.dernier_resultat == "success":
        st.success(st.session_state.message_resultat)
    elif st.session_state.dernier_resultat == "error":
        st.error(st.session_state.message_resultat)

    # 3. ON AFFICHE TON EXPLICATION TRANQUILLEMENT
    st.markdown(f"💡 **Explication :**\n\n{explication_formatee}")
    
    # On met un bouton pour passer à la suite quand il a fini de lire
    if st.button("Passer à l'image suivante ➡️"):
        st.session_state.numero_image += 1
        st.session_state.a_repondu = False # On remet le bouton à zéro pour la prochaine image
        st.session_state.dernier_resultat = None
        st.session_state.message_resultat = ""
        st.rerun()