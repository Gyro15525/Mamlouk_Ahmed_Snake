# Mamlouk_Ahmed_Snake
Jeu Snake avancé (avec niveaux) - Snake avec vitesse croissante, obstacles et bonus. Score et meilleurs scores locaux. Animations CSS. Travail sur Canvas, DOM et logique avancée.

Jeu Snake Évolutif - Une version avancée du jeu classique Snake avec système de niveaux avec portails, obstacles, bonus et classement. Le serpent évolue à travers différents environnements avec des défis croissants.

Technologies utilisées

  HTML5 : Structure de la page avec canvas pour le jeu
  
  CSS3 : Styles responsifs, animations, flexbox et effets visuels
  
  JavaScript : Logique de jeu complète sans frameworks externes
  
  LocalStorage : Sauvegarde des scores et du classement
  
  Canvas API : Rendu graphique du jeu
    

Fonctionnalités principales:

  Jeu qui continu a l'infini en parcourant de differents niveau

  Système de niveaux avec 6 structures d'obstacles différentes
  
  Mécaniques de bonus : nourriture spéciale avec effets sonores, bonus de score et diminution de vitesse
  
  Classement persistant (Top 18) avec noms des joueurs, score et niveau atteint
  
  Animations visuelles pour les gains de score et changements de niveau
  
  Contrôles multiples : clavier (flèches, espace) et boutons
  
  Système de vitesse adaptative qui augmente avec la progression chaque 5 nourriture mangee
  
  Design responsive avec conteneurs flexibles
  
  Effets sonores

Nouveautés explorées:

  Gestion avancée du Canvas : animations fluides, collisions complexes
  
  Algorithmes de génération procédurale pour le placement des objets
  
  Système de sauvegarde local sophistiqué avec gestion des doublons
  
  Transitions CSS avancées entre les niveaux (changement de couleurs)
  
  Gestion d'état complexe : pause, game over, transitions de niveaux
  
  Patterns de obstacles variés : labyrinthes, colonnes, zigzags, etc.

Difficultés rencontrées:

  Rendre le jeu infini
  
  Collisions complexes avec les différents types d'obstacles
  
  Variete d'obstacles
  
  logique du corps du serpent
  
  logieur du passage entre niveaux
  
  Synchronisation entre la vitesse du serpent et le rendu graphique
  
  Gestion des transitions entre niveaux sans perte de fluidité
  
  Placement aléatoire valide de la nourriture (éviter les obstacles)
  
  Placement aléatoire valide du bonus (éviter les obstacles)
  
  Persistance des données avec gestion des joueurs existants
  
  eviter la repetition et lecrasement pour le classement
  
  Créer des patterns d'obstacles variés mais toujours jouables
  

Solutions apportées:

  Des fonctions qui s'adaptes a chaque niveau non specifiques avec des variables qui parcour une liste de niveau predefinies
  
  Algorithmes de validation pour le placement aléatoire avec boucles de vérification
  
  J'ai cree une liste d'obstacles predefinies
  
  logique de parcourir passant de la position la queue vers celle de la tete
  
  decalage de 400px vers la gauche
  
  Système de délais et flags pour éviter les changements de direction multiples
  
  Transition coordonnée du serpent entre les niveaux avec décalage progressif
  
  Des boucles qui generes des positions aleatoires jusqua avoirr une position valide
  
  Des boucles qui generes des positions aleatoires jusqua avoirr une position valide
  
  utilisation du LocalStorage
  
  Des verification avec des fonction predefinies de Localstorage
  
  Je me suis assurer qu'il reste toujours un chemin possible pour atteindre la nourriture
  
