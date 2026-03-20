import streamlit as st
import random
import os


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Configuration de la page
st.set_page_config(page_title="Quiz Histoire de l'IA", page_icon="🧠")

# --- BASE DE DONNÉES DES QUESTIONS ---
# (Ajoutez vos questions ici pour atteindre 20 par niveau)
questions_facile = [
    {"q": "Qui est considéré comme l'un des pères de l'IA et a créé le test d'imitation ?", "options": ["Bill Gates", "Alan Turing", "Steve Jobs", "Elon Musk"], "r": "Alan Turing", "ex": "Alan Turing a publié 'Computing Machinery and Intelligence' en 1950."},
    {"q": "Que signifie l'acronyme IA ?", "options": ["Informatique Avancée", "Intelligence Artificielle", "Interaction Automatique", "Interface Aléatoire"], "r": "Intelligence Artificielle", "ex": "C'est la capacité d'une machine à imiter l'intelligence humaine."},
    {"q": "Quelle IA a rendu l'IA générative célèbre fin 2022 ?", "options": ["Siri", "Alexa", "ChatGPT", "Cortana"], "r": "ChatGPT", "ex": "Lancé par OpenAI, il a atteint 100 millions d'utilisateurs en un temps record."},
    {"q": "Qui a écrit les 'Trois lois de la robotique' ?", "options": ["Isaac Asimov", "Jules Verne", "H.G. Wells", "Arthur C. Clarke"], "r": "Isaac Asimov", "ex": "Ces lois sont apparues dans sa nouvelle 'Cercle vicieux' en 1942."},
    {"q": "En 1997, quelle machine d'IBM a battu Kasparov aux échecs ?", "options": ["Watson", "AlphaGo", "Deep Blue", "Blue Gene"], "r": "Deep Blue", "ex": "C'était la première fois qu'un champion du monde perdait contre une machine."},
    {"q": "Comment appelle-t-on une IA capable de faire une seule tâche (ex: jouer aux échecs) ?", "options": ["IA Forte", "IA Faible", "IA Générale", "Super IA"], "r": "IA Faible", "ex": "L'IA actuelle est dite 'faible' ou 'étroite' car elle est spécialisée."},
    {"q": "Quel géant du web a racheté DeepMind en 2014 ?", "options": ["Microsoft", "Apple", "Facebook", "Google"], "r": "Google", "ex": "DeepMind est le créateur d'AlphaGo."},
    {"q": "Quelle est la technologie derrière la reconnaissance faciale ?", "options": ["Le Bluetooth", "Le Wi-Fi", "L'IA (Vision par ordinateur)", "La radio"], "r": "L'IA (Vision par ordinateur)", "ex": "L'IA analyse les traits du visage pour identifier une personne."},
    {"q": "Comment appelle-t-on un robot qui ressemble à un humain ?", "options": ["Un automate", "Un humanoïde", "Un drone", "Une puce"], "r": "Un humanoïde", "ex": "Exemple : le robot Sophia ou Optimus de Tesla."},
    {"q": "Quelle IA assistante trouve-t-on sur les iPhones ?", "options": ["Alexa", "Google Assistant", "Siri", "Bixby"], "r": "Siri", "ex": "Siri a été intégrée à l'iPhone en 2011."},
    {"q": "Quel jeu de société millénaire a été conquis par l'IA en 2016 ?", "options": ["Le Monopoly", "Le Go", "Le Scrabble", "Les Dames"], "r": "Le Go", "ex": "AlphaGo a battu Lee Sedol, un exploit car le Go est extrêmement complexe."},
    {"q": "L'IA peut-elle apprendre par elle-même avec des données ?", "options": ["Oui, c'est le Machine Learning", "Non, elle doit être programmée ligne par ligne", "Seulement si elle est branchée sur secteur", "Uniquement dans les films"], "r": "Oui, c'est le Machine Learning", "ex": "Le Machine Learning permet d'apprendre sans programmation explicite."},
    {"q": "Quelle entreprise a été co-fondée par Elon Musk pour la recherche en IA ?", "options": ["NASA", "OpenAI", "Intel", "Nvidia"], "r": "OpenAI", "ex": "Musk a quitté le conseil d'administration d'OpenAI en 2018."},
    {"q": "Quelle partie de l'IA imite le cerveau humain ?", "options": ["Les fils de fer", "Les réseaux de neurones", "Le disque dur", "Le ventilateur"], "r": "Les réseaux de neurones", "ex": "Ce sont des algorithmes inspirés par la structure des neurones biologiques."},
    {"q": "Dans quel film une IA nommée HAL 9000 prend le contrôle ?", "options": ["Star Wars", "2001, l'Odyssée de l'espace", "Matrix", "Iron Man"], "r": "2001, l'Odyssée de l'espace", "ex": "Un classique de Stanley Kubrick sorti en 1968."},
    {"q": "L'IA est-elle capable de générer des images à partir de texte ?", "options": ["Non, c'est impossible", "Oui (ex: Midjourney ou DALL-E)", "Seulement en noir et blanc", "Uniquement des formes géométriques"], "r": "Oui (ex: Midjourney ou DALL-E)", "ex": "On appelle cela des modèles de diffusion."},
    {"q": "Comment appelle-t-on les textes qu'on donne à une IA pour obtenir un résultat ?", "options": ["Un code", "Un prompt", "Une commande", "Un script"], "r": "Un prompt", "ex": "L'art de rédiger des prompts s'appelle le Prompt Engineering."},
    {"q": "Quel terme désigne une IA qui dépasse l'intelligence humaine ?", "options": ["La singularité", "Le bug", "L'apocalypse", "Le cloud"], "r": "La singularité", "ex": "C'est le point hypothétique où la croissance technologique devient incontrôlable."},
    {"q": "L'IA est-elle utilisée dans les voitures autonomes ?", "options": ["Non", "Oui", "Uniquement pour la radio", "Uniquement pour les essuie-glaces"], "r": "Oui", "ex": "L'IA permet à la voiture d'analyser son environnement et de prendre des décisions."},
    {"q": "L'IA peut-elle faire des erreurs ?", "options": ["Jamais", "Oui (on parle d'hallucinations)", "Seulement le mardi", "Uniquement s'il n'y a plus de batterie"], "r": "Oui (on parle d'hallucinations)", "ex": "Une IA peut inventer des faits de manière très convaincante."}
]
questions_intermediaire = [
    {"q": "Où et quand est né officiellement le terme 'Intelligence Artificielle' ?", "options": ["MIT en 1960", "Dartmouth en 1956", "Stanford en 1950", "Oxford en 1948"], "r": "Dartmouth en 1956", "ex": "Lors d'un atelier d'été organisé par John McCarthy."},
    {"q": "Comment appelle-t-on les périodes de baisse d'intérêt pour l'IA ?", "options": ["L'automne de l'IA", "L'hiver de l'IA", "Le désert numérique", "Le crash boursier"], "r": "L'hiver de l'IA", "ex": "Il y a eu deux hivers majeurs (1974-80 et 1987-93)."},
    {"q": "Quel chatbot de 1966 imitait une psychothérapeute ?", "options": ["Alice", "ELIZA", "SmarterChild", "Tay"], "r": "ELIZA", "ex": "Créé par Joseph Weizenbaum au MIT."},
    {"q": "Quel est le but des 'systèmes experts' des années 80 ?", "options": ["Jouer aux jeux vidéo", "Reproduire le raisonnement d'un expert humain", "Miner du Bitcoin", "Créer des sites web"], "r": "Reproduire le raisonnement d'un expert humain", "ex": "Ils utilisaient des règles 'Si... Alors...'."},
    {"q": "Que signifie le 'Deep' dans Deep Learning ?", "options": ["C'est très compliqué", "Il y a plusieurs couches de neurones", "C'est stocké au fond du serveur", "C'est une IA sous-marine"], "r": "Il y a plusieurs couches de neurones", "ex": "Plus il y a de couches cachées, plus l'apprentissage est 'profond'."},
    {"q": "Quelle IA d'IBM a gagné au jeu Jeopardy! en 2011 ?", "options": ["Deep Blue", "Watson", "HAL", "Jarvis"], "r": "Watson", "ex": "Watson a battu les deux plus grands champions du jeu américain."},
    {"q": "Quel chercheur français a reçu le Prix Turing pour ses travaux sur le Deep Learning ?", "options": ["Luc Julia", "Yann LeCun", "Cédric Villani", "Hubert Curien"], "r": "Yann LeCun", "ex": "Il est le père des réseaux de neurones convolutifs (CNN)."},
    {"q": "Qu'est-ce qu'un 'Réseau de Neurones Convolutif' (CNN) ?", "options": ["Une IA pour le texte", "Une IA spécialisée dans l'image", "Une IA pour la musique", "Une IA pour la météo"], "r": "Une IA spécialisée dans l'image", "ex": "Ils sont essentiels pour la vision par ordinateur."},
    {"q": "En quelle année le projet Google Brain a-t-il appris à reconnaître des chats sur YouTube ?", "options": ["2005", "2012", "2018", "2020"], "r": "2012", "ex": "Le système a appris sans qu'on lui dise ce qu'était un chat."},
    {"q": "Quel est le nom du test qui a succédé au test de Turing pour la créativité ?", "options": ["Le test d'Ada", "Le test de Lovelace", "Le test de Turing 2.0", "Le test de Picasso"], "r": "Le test de Lovelace", "ex": "Il examine si une IA peut produire quelque chose d'original qu'elle n'a pas été programmée pour faire."},
    {"q": "Qu'est-ce que l'apprentissage 'supervisé' ?", "options": ["L'IA apprend seule", "L'IA apprend avec des données étiquetées par l'humain", "Un humain surveille l'écran de l'IA", "L'IA est interdite aux mineurs"], "r": "L'IA apprend avec des données étiquetées par l'humain", "ex": "On lui donne l'image ET le nom de l'objet pour qu'elle apprenne."},
    {"q": "Quel était le problème de l'IA 'Tay' de Microsoft sur Twitter ?", "options": ["Elle ne répondait pas", "Elle est devenue raciste en 24h à cause des utilisateurs", "Elle a supprimé son compte", "Elle a essayé d'acheter Twitter"], "r": "Elle est devenue raciste en 24h à cause des utilisateurs", "ex": "Cela a montré les dangers de l'apprentissage non supervisé sur internet."},
    {"q": "Quel composant matériel (hardware) a permis l'explosion du Deep Learning ?", "options": ["Le processeur (CPU)", "La carte graphique (GPU)", "La souris", "Le lecteur CD"], "r": "La carte graphique (GPU)", "ex": "Leurs calculs en parallèle sont parfaits pour les réseaux de neurones."},
    {"q": "Qui a fondé DeepMind ?", "options": ["Demis Hassabis", "Sam Altman", "Mark Zuckerberg", "Jeff Bezos"], "r": "Demis Hassabis", "ex": "Hassabis est un ancien prodige des échecs et concepteur de jeux vidéo."},
    {"q": "Quel est le principal défaut des réseaux de neurones actuels ?", "options": ["Ils sont trop lents", "L'effet 'boîte noire' (on ne sait pas comment ils décident)", "Ils consomment trop peu d'énergie", "Ils n'aiment pas les maths"], "r": "L'effet 'boîte noire' (on ne sait pas comment ils décident)", "ex": "L'explicabilité est un grand défi de l'IA moderne."},
    {"q": "Quelle architecture a remplacé les RNN pour le texte en 2017 ?", "options": ["Le Transformer", "Le CNN", "Le Perceptron", "La machine à vapeur"], "r": "Le Transformer", "ex": "Introduit par Google dans l'article 'Attention is all you need'."},
    {"q": "Que signifie GPT ?", "options": ["General Processing Tool", "Generative Pre-trained Transformer", "Global Python Technology", "Great Personal Teacher"], "r": "Generative Pre-trained Transformer", "ex": "Il génère du texte, est pré-entraîné et utilise l'architecture Transformer."},
    {"q": "Quelle ville est un immense hub mondial de l'IA grâce à Yoshua Bengio ?", "options": ["Paris", "Montréal", "Tokyo", "Berlin"], "r": "Montréal", "ex": "Le MILA à Montréal est l'un des plus grands centres de recherche."},
    {"q": "Qu'est-ce qu'une 'GAN' (Generative Adversarial Network) ?", "options": ["Deux IA qui s'affrontent pour créer des images réalistes", "Une IA qui joue aux jeux de combat", "Un réseau de neurones très lent", "Une IA pour la sécurité routière"], "r": "Deux IA qui s'affrontent pour créer des images réalistes", "ex": "Un 'générateur' crée et un 'discriminateur' juge."},
    {"q": "En 2015, quelle étape majeure a franchi l'IA en reconnaissance d'image ?", "options": ["Elle a peint la Joconde", "Elle a dépassé l'humain sur ImageNet", "Elle a reconnu un chat pour la première fois", "Elle est devenue obligatoire sur smartphone"], "r": "Elle a dépassé l'humain sur ImageNet", "ex": "Le taux d'erreur de l'IA est descendu sous celui de l'humain (environ 5%)."}
]
questions_difficile = [
    {"q": "En 1943, qui a publié le premier modèle mathématique d'un neurone ?", "options": ["McCulloch & Pitts", "Turing & Von Neumann", "Minsky & Papert", "Shannon & Weaver"], "r": "McCulloch & Pitts", "ex": "Leur article 'A Logical Calculus of Ideas Immanent in Nervous Activity' est fondateur."},
    {"q": "Quel livre de 1969 a tué la recherche sur les réseaux de neurones pendant 10 ans ?", "options": ["Perceptrons", "The Society of Mind", "Cybernetics", "AI : A Modern Approach"], "r": "Perceptrons", "ex": "Minsky et Papert y démontraient l'incapacité du perceptron à résoudre le problème du XOR."},
    {"q": "Comment s'appelait le premier robot mobile 'intelligent' (1966-1972) ?", "options": ["ASIMO", "Shakey", "Roomba", "Unimate"], "r": "Shakey", "ex": "Surnommé ainsi car il tremblait beaucoup en se déplaçant."},
    {"q": "Qui a popularisé l'algorithme de rétropropagation (Backpropagation) en 1986 ?", "options": ["Andrew Ng", "Geoffrey Hinton", "Yann LeCun", "John Hopfield"], "r": "Geoffrey Hinton", "ex": "Avec Rumelhart et Williams, il a permis d'entraîner des réseaux multicouches."},
    {"q": "Quel projet visait à encoder tout le bon sens humain dans une base de données dès 1984 ?", "options": ["Cyc", "Deep Blue", "Mycin", "Project Debater"], "r": "Cyc", "ex": "Lancé par Douglas Lenat, le projet Cyc continue encore aujourd'hui."},
    {"q": "Quelle est la particularité d'AlphaGo Zero par rapport à AlphaGo ?", "options": ["Il est plus lent", "Il a appris sans aucune donnée humaine", "Il joue aux échecs", "Il utilise moins de serveurs"], "r": "Il a appris sans aucune donnée humaine", "ex": "Il a appris en jouant contre lui-même uniquement."},
    {"q": "Qu'est-ce que le 'Gradient Vanishing Problem' ?", "options": ["L'IA oublie tout", "L'erreur devient trop petite pour mettre à jour les neurones profonds", "L'IA devient trop rapide", "Les données disparaissent du serveur"], "r": "L'erreur devient trop petite pour mettre à jour les neurones profonds", "ex": "C'était un obstacle majeur pour les réseaux très profonds avant les années 2010."},
    {"q": "Qui a inventé le concept de 'Perceptron' en 1958 ?", "options": ["Frank Rosenblatt", "Herbert Simon", "Allen Newell", "Marvin Minsky"], "r": "Frank Rosenblatt", "ex": "C'était une machine physique (le Mark I Perceptron) pour la reconnaissance visuelle."},
    {"q": "Quel était le nom du projet de 5ème génération de calculateurs au Japon (1982) ?", "options": ["Prolog Project", "FGCS", "Neo-Tokyo AI", "The Samurai Chip"], "r": "FGCS", "ex": "Fifth Generation Computer Systems, un échec coûteux basé sur la logique Prolog."},
    {"q": "Qu'est-ce que le mécanisme d''Attention' dans un Transformer ?", "options": ["L'IA écoute l'utilisateur", "L'IA se focalise sur les mots les plus importants d'une phrase", "L'IA économise son énergie", "L'IA demande l'attention de l'humain"], "r": "L'IA se focalise sur les mots les plus importants d'une phrase", "ex": "Cela permet de comprendre le contexte lointain dans un texte."},
    {"q": "Qui est considéré comme le père de la 'Cybernetique' ?", "options": ["Norbert Wiener", "Claude Shannon", "John Von Neumann", "Vannevar Bush"], "r": "Norbert Wiener", "ex": "Il a publié 'Cybernetics' en 1948, influençant l'IA."},
    {"q": "Quelle fonction d'activation a remplacé la Sigmoïde pour éviter la disparition du gradient ?", "options": ["ReLU", "Tangente Hyperbolique", "Linéaire", "Binaire"], "r": "ReLU", "ex": "Rectified Linear Unit (ReLU) est devenue le standard pour le Deep Learning."},
    {"q": "En quelle année l'IA AlphaFold a-t-elle 'résolu' le repliement des protéines ?", "options": ["2010", "2015", "2020", "2023"], "r": "2020", "ex": "Une avancée majeure pour la biologie et la médecine par Google DeepMind."},
    {"q": "Quel chercheur a quitté Google en 2023 pour alerter sur les dangers de l'IA ?", "options": ["Geoffrey Hinton", "Jeff Dean", "Fei-Fei Li", "Demis Hassabis"], "r": "Geoffrey Hinton", "ex": "Souvent appelé 'Le parrain de l'IA', il craint les risques existentiels."},
    {"q": "Qu'est-ce que la 'Chambre Chinoise' de John Searle ?", "options": ["Une supercalculateur chinois", "Une expérience de pensée contre le test de Turing", "Un laboratoire secret", "Une architecture de puce"], "r": "Une expérience de pensée contre le test de Turing", "ex": "Elle suggère qu'une machine peut manipuler des symboles sans rien comprendre."},
    {"q": "Quel système expert des années 70 servait au diagnostic des maladies du sang ?", "options": ["MYCIN", "Dendral", "DeepFace", "Siri"], "r": "MYCIN", "ex": "Il était parfois plus performant que certains spécialistes."},
    {"q": "Qui a inventé les réseaux de neurones récurrents de type LSTM ?", "options": ["Sepp Hochreiter & Jürgen Schmidhuber", "LeCun & Bengio", "Gates & Allen", "Page & Brin"], "r": "Sepp Hochreiter & Jürgen Schmidhuber", "ex": "Les LSTM (1997) ont dominé la traduction automatique avant les Transformers."},
    {"q": "Qu'est-ce qu'un 'Autoencodeur' ?", "options": ["Une IA qui répare les voitures", "Une IA qui apprend à compresser et reconstruire ses propres données", "Un programme qui écrit du code tout seul", "Une IA pour le chiffrement"], "r": "Une IA qui apprend à compresser et reconstruire ses propres données", "ex": "C'est une forme d'apprentissage non supervisé."},
    {"q": "Quelle loi stipule que le nombre de transistors double tous les 2 ans ?", "options": ["Loi de Moore", "Loi de Murphy", "Loi de Newton", "Loi de Turing"], "r": "Loi de Moore", "ex": "Gordon Moore, co-fondateur d'Intel, l'a formulée en 1965."},
    {"q": "Comment s'appelle l'approche de l'IA qui s'inspire de l'évolution naturelle ?", "options": ["Logique floue", "Algorithmes génétiques", "IA symbolique", "Systèmes multi-agents"], "r": "Algorithmes génétiques", "ex": "Ils utilisent des concepts de mutation, croisement et sélection naturelle."}
]

questions_data = {
    "Facile": questions_facile,
    "Intermédiaire": questions_intermediaire,
    "Difficile": questions_difficile
}

# --- INTERFACE STREAMLIT ---
st.title("🧠 Quiz : L'Épopée de l'IA")
st.write("Testez vos connaissances sur l'histoire de l'intelligence artificielle.")

# Initialisation des variables de session (pour garder le score en mémoire)
if 'score' not in st.session_state:
    st.session_state.score = 0
if 'xp' not in st.session_state:
    st.session_state.xp = 0
if 'question_index' not in st.session_state:
    st.session_state.question_index = 0
if 'quiz_termine' not in st.session_state:
    st.session_state.quiz_termine = False
if 'questions_melangees' not in st.session_state:
    st.session_state.questions_melangees = {
        niveau_key: random.sample(questions_data[niveau_key], len(questions_data[niveau_key]))
        for niveau_key in questions_data
    }

# Sélection du niveau
niveau = st.sidebar.selectbox("Choisissez votre niveau :", ["Facile", "Intermédiaire", "Difficile"])
xp_par_niveau = {
    "Facile": 10,
    "Intermédiaire": 20,
    "Difficile": 30
}

st.sidebar.metric("XP total", st.session_state.xp)

# Réinitialiser si on change de niveau
if st.sidebar.button("Réinitialiser le Quiz"):
    st.session_state.score = 0
    st.session_state.xp = 0
    st.session_state.question_index = 0
    st.session_state.quiz_termine = False
    st.session_state.questions_melangees = {
        niveau_key: random.sample(questions_data[niveau_key], len(questions_data[niveau_key]))
        for niveau_key in questions_data
    }
    st.rerun()

# Affichage du Quiz
questions = st.session_state.questions_melangees[niveau]

if not st.session_state.quiz_termine:
    q_actuelle = questions[st.session_state.question_index]
    
    st.subheader(f"Question {st.session_state.question_index + 1} sur {len(questions)}")
    st.write(q_actuelle["q"])
    
    # Formulaire de réponse
    with st.form(key=f"form_{st.session_state.question_index}"):
        reponse = st.radio("Choisissez une option :", q_actuelle["options"])
        submit = st.form_submit_button("Valider")
        
        if submit:
            if reponse == q_actuelle["r"]:
                xp_gagne = xp_par_niveau[niveau]
                st.success(f"✅ Bonne réponse ! +{xp_gagne} XP. {q_actuelle['ex']}")
                st.session_state.score += 1
                st.session_state.xp += xp_gagne
            else:
                st.error(f"❌ Mauvaise réponse. La réponse était : {q_actuelle['r']}. {q_actuelle['ex']}")

    # --- LE BOUTON SUIVANT DOIT ÊTRE ICI (HORS DU FORMULAIRE) ---
    if st.session_state.question_index < len(questions) - 1:
        if st.button("Question suivante ➡️"):
            st.session_state.question_index += 1
            st.rerun()
    else:
        if not st.session_state.quiz_termine:
            if st.button("Voir le résultat final 🏆"):
                st.session_state.quiz_termine = True
                st.rerun()

else:
    st.balloons()
    st.header("🏆 Quiz Terminé !")
    st.metric("Votre Score Final", f"{st.session_state.score} / {len(questions)}")
    st.metric("XP total gagné", st.session_state.xp)
    
    if st.button("Rejouer"):
        st.session_state.score = 0
        st.session_state.xp = 0
        st.session_state.question_index = 0
        st.session_state.quiz_termine = False
        st.session_state.questions_melangees = {
            niveau_key: random.sample(questions_data[niveau_key], len(questions_data[niveau_key]))
            for niveau_key in questions_data
        }
        st.rerun()