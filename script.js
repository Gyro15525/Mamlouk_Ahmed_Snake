const canvas = document.getElementById('Canvas'); // canvas 400x400
const ctx = canvas.getContext('2d');
let niveau =1;
let changement_niveau=false;
let score = 0;
let meilleur_score = 0;
if (localStorage.getItem('snakeMeilleurScore')) {
    meilleur_score = localStorage.getItem('snakeMeilleurScore');
    document.getElementById("meilleur").innerText = meilleur_score;
}


let rang = JSON.parse(localStorage.getItem('classement') || '[]'); //converti le text en un objet js





function ligne_classement(entree, indice) {
    return `<div class="rang-ligne">${indice + 1}. ${entree.nom} - ${entree.score} - niveau: ${entree.niveau}</div>`;  //represente la ligne affichee avec les valeurs du niveau et nom et core et rang
}
function charger_classement() {        //met a jour laffichage du classement
    const rangList = document.getElementById('rang-list');
    
    if (rang.length === 0) {
        rangList.innerHTML = '<div class="rang-vide">Aucun score</div>';
        return;
    }
    
    let html = '';
    rang.slice(0, 18).forEach((entree, indice) => {          //forEach donne deux variable une contenant lobjet et lautre le ranf de lobjet et ce rang a la meme signification que le rang du classment car on a fait rang.sort avec le scor
        html += ligne_classement(entree, indice);
    });
    rangList.innerHTML = html;
}
let nom;
function addScore() {
    if (est_enregistre===false){
        nom='Joueur';
    }
    else{
        nom = prompt('Bravo! Entrez votre nom:')|| 'aucun nom entre';
        if(nom==='aucun nom entre'){ //pour pouvoir appuyer sur n encore si on a pas entre de nom la derniere fois
            est_enregistre= false;
            return;
        }
    }
    const existe_joueur = rang.find(entree => entree.nom === nom);//cherche dans le classmement pour le meme joueur
    
    if (existe_joueur) {  //si il existe
        if (score > existe_joueur.score) { //je change seulement si le score atteint est meilleur quavant
            rang = rang.filter(entree => entree.nom !== nom); //supprime lancienne ligne
            rang.push({ nom, score, niveau });//ajoute un nouveau membre dans rang qui represente un noveau score avec le nom et niveau
        }
    } else {
        rang.push({ nom, score, niveau });//ajoute un nouveau membre dans rang qui represente un noveau score avec le nom et niveau
    }
    
    rang.sort((a, b) => b.score - a.score); //je les ordonne en ordre decroissant
    rang = rang.slice(0, 18); //je limite le nombre de enregistrement a 30
    
    localStorage.setItem('classement', JSON.stringify(rang)); //enregistre les information sure le classement comme texte qui va etre reconverti en objet js au prochain refresh de la page avec JSON.parse
    charger_classement();
}

let vitesse = 100;
let vitesse_snake=200; //vitesse initiale du snake
let compte_nourriture=0;

let nourritureX=200; //position initiale de la nourriture
let nourritureY=200; //position initiale de la nourriture

let avance=false;  // jai cree cette variable pour savoir si le jeu est en pause ou non pour savoir si je doit prendre en compte linput du clavier
//donc je doit lassocier a start et pause
let perdu = false;

function start(){             //fonction pour start
    avance = true;
}
function pause(){           //fonction pour pause
    avance = false;
    dessiner_niveau();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0,0,400,400);
}

document.getElementById("start").addEventListener("click",start);  //jai associe le bouton start a la fonction start
document.getElementById("pause").addEventListener("click",pause);  //jai associe le bouton pause a la fonction pause

let snake = [
    {x:0, y:0}, // la position de la tete du snake
    {x:0, y:0},
    {x:0, y:0}
];

let directionX=20; // variable pour la direction du snake
let directionY=0;
//la direction depend de linput du clavier
let est_enregistre=false;
let change_direction = false;
function clavier(x){    //fonction pour gerer linput du clavier
    if ((x.key === 'n' || x.key === 'N') && perdu && (est_enregistre===false)){
        est_enregistre= true; //pour eviter que jenregistre plusieures fois
        addScore();
    }
    if (x.repeat) return;
    if (x.key ==' '){  //espace pour pause
        x.preventDefault();
        if (perdu) {
            recommence();  // Si perdu alors recommencer
        } 
        else {
            avance = !avance;
            if (avance===false){ 
                dessiner_niveau();
                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(0,0,400,400);
            }
        }
        return;
    }
    if (change_direction) return; //empche de changer de direction plusieurs fois dans avant une seule timeout 
    if (x.key =='ArrowRight'&& directionX!=-20){ //pas de marche arriere
        directionX=20;
        directionY=0;
    }
    else if (x.key =='ArrowLeft' && directionX!=20){
        directionX=-20;
        directionY=0;
    }
    else if (x.key =='ArrowUp' && directionY!=20){
        x.preventDefault();
        directionX=0;
        directionY=-20;
    }
    else if (x.key =='ArrowDown' && directionY!=-20){
        x.preventDefault();
        directionX=0;
        directionY=20;
    }
    change_direction = true;
}
document.addEventListener('keydown', clavier); //va passer un objet qui conttient des infos sur la touche appuyee

let bonusX=-20;
let bonusY=-20;
let temps=0;
let etat=false;

let son_nourriture=['bip1.mp3', 'bip2.mp3', 'bip3.mp3', 'bip4.mp3', 'bip5.mp3']; //effet dans le dossier
let num_son = 0;
function son() {
    new Audio(son_nourriture[num_son]).play();    //joue les mp3
    num_son = (num_son + 1) % son_nourriture.length; //parcour le tableau contenant les nom des .mp3
}




let labyrinthe = [
    {x: 11, y: 8}, {x: 8, y: 11}, {x: 11, y: 11}, {x: 8, y: 8},
    
    {x: 4, y: 4}, {x: 5, y: 4}, {x: 4, y: 5},
    {x: 14, y: 4}, {x: 15, y: 4}, {x: 15, y: 5},
    {x: 4, y: 14}, {x: 5, y: 15}, {x: 4, y: 15},
    {x: 14, y: 15}, {x: 15, y: 14}, {x: 15, y: 15},
    
    {x: 4, y: 8}, {x: 4, y: 9}, {x: 4, y: 10}, {x: 4, y: 11},
    {x: 15, y: 8}, {x: 15, y: 9}, {x: 15, y: 10}, {x: 15, y: 11},
    {x: 8, y: 4}, {x: 9, y: 4}, {x: 10, y: 4}, {x: 11, y: 4},
    {x: 8, y: 15}, {x: 9, y: 15}, {x: 10, y: 15}, {x: 11, y: 15}
];
let colonnes = [
    {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 6}, {x: 6, y: 7}, {x: 6, y: 8},
    {x: 8, y: 4}, {x: 8, y: 5}, {x: 8, y: 6}, {x: 8, y: 7}, {x: 8, y: 8},
    {x: 10, y: 4}, {x: 10, y: 5}, {x: 10, y: 6}, {x: 10, y: 7}, {x: 10, y: 8},
    {x: 12, y: 4}, {x: 12, y: 5}, {x: 12, y: 6}, {x: 12, y: 7}, {x: 12, y: 8},
    {x: 14, y: 12}, {x: 14, y: 13}, {x: 14, y: 14}, {x: 14, y: 15}, {x: 14, y: 16},
    {x: 11, y: 12}, {x: 11, y: 13}, {x: 11, y: 14}, {x: 11, y: 15}, {x: 11, y: 16},
    {x: 7, y: 12}, {x: 7, y: 13}, {x: 7, y: 14}, {x: 7, y: 15}, {x: 7, y: 16},
    {x: 4, y: 12}, {x: 4, y: 13}, {x: 4, y: 14}, {x: 4, y: 15}, {x: 4, y: 16}

];
let coins = [
    {x:3, y:4}, {x:4, y:3}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 4, y: 5},
    {x: 17, y: 4}, {x: 16, y: 3}, {x: 15, y: 4}, {x: 16, y: 4}, {x: 16, y: 5},
    {x: 3, y: 15}, {x: 4, y: 14}, {x: 4, y: 15}, {x: 5, y: 15}, {x: 4, y: 16},
    {x: 17, y: 15}, {x: 16, y: 14}, {x: 15, y: 15}, {x: 16, y: 15}, {x: 16, y: 16}
];


let zigzag = [
    {x: 5, y: 8}, {x: 6, y: 8}, {x: 7, y: 8}, {x: 7, y: 9}, {x: 8, y: 9}, {x: 9, y: 9}, {x: 9, y: 10}, {x: 10, y: 10}, {x: 11, y: 10}, {x: 11, y: 11}, {x: 12, y: 11}, {x: 13, y: 11},
    {x: 7, y: 5}, {x: 8, y: 5}, {x: 9, y: 5}, {x: 9, y: 6}, {x: 10, y: 6}, {x: 11, y: 6}, {x: 11, y: 7}, {x: 12, y: 7}, {x: 13, y: 7}, {x: 13, y: 8}, {x: 14, y: 8}, {x: 15, y: 8},
    {x: 3, y: 11}, {x: 4, y: 11}, {x: 5, y: 11}, {x: 5, y: 12}, {x: 6, y: 12}, {x: 7, y: 12}, {x: 7, y: 13}, {x: 8, y: 13}, {x: 9, y: 13}, {x: 9, y: 14}, {x: 10, y: 14}, {x: 11, y: 14}
    
];

let points = [
    {x: 5, y: 5}, {x: 15, y: 5}, {x: 5, y: 15}, {x: 15, y: 15},
    {x: 10, y: 10}, {x: 8, y: 8}, {x: 12, y: 12}, {x: 8, y: 12}, {x: 12, y: 8}
];
let liste_structures = [[], labyrinthe , colonnes, coins, zigzag, points]; //tableau contenant les tableaux predefnies

let obstacles_actuel = []; //on commence le jeux par un canva vide










let couleur_boucle=0; //le numero qui va parcourir couleurs
let couleurs = [
    {snake: "#000000", nourriture: "#444444", fond: "#87CEEB", obstacles: "#015f6bff"},
    {snake: "#efefefff", nourriture: "#c170c8ff",fond: "#876ff0ff", obstacles: "#6c3e79ff"},
    {snake: "gray", nourriture: "#ff0000ff",fond: "#9BBA5A", obstacles: "#005f26ff"},
    {snake: "#8B4513", nourriture: "#D2691E",fond: "#F4A460", obstacles: "#acbf00ff"},
    {snake: "#4B0082", nourriture: "#8A2BE2",fond: "#D8BFD8", obstacles: "#444444ff"},
    {snake: "#FF8C00", nourriture: "#FFA500",fond: "#FFD700", obstacles: "#6c6c68ff"},
    {snake: "#2F4F4F", nourriture: "#708090",fond: "#B0C4DE", obstacles: "#015f6bff"}
]
let taille_bonus=20;
function dessiner_niveau(){   
    ctx.clearRect(0,0,400,400); //reinitalise le canvas pour effacer le snake precedent
    ctx.fillStyle = couleurs[couleur_boucle].snake;
    for(let i=0;i<snake.length;i++){
    ctx.fillRect(snake[i].x,snake[i].y,20,20); //dessine le snake entier
    }
    if (changement_niveau===false){
    ctx.fillStyle = couleurs[couleur_boucle].nourriture;
    ctx.fillRect(nourritureX,nourritureY,20,20); //dessine la nourriture 20 x 20 en nourritureX nourritureY
    }
    if (changement_niveau) {
        ctx.fillStyle = couleurs[couleur_boucle].obstacles;
        ctx.fillRect(395, 0, 5, 400);  //portail pour passage de niveau
        ctx.fillStyle = couleurs[couleur_boucle].obstacles;
        ctx.font = "bold 40px Arial";
        for (let i = 0; i < 5; i++) {
            ctx.fillText("→", 350, 50 + i * 80);  //fleches pour rendre le portail plus visible
        }
    }
    for (let i=0;i<obstacles_actuel.length;i++){                  
        ctx.fillStyle = couleurs[couleur_boucle].obstacles;
        ctx.beginPath();
        ctx.roundRect(obstacles_actuel[i].x*20,obstacles_actuel[i].y*20,20,20,5); //dessine le snake entier
        ctx.fill();
    }
    if(etat===true){
        if (temps % 5 === 0) {  //pulsation en utilisant temp chaque 5*200=1000ms=1s
            taille = 18;  
        } else {
            taille = 22;  
        }
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(bonusX+(20-taille),bonusY+(20-taille),taille,taille);
    }
}





let premier=false; //true si le score est meilleur qui le meilleur score
function recommence() { //fonction pour recommencer le jeu
    if ((est_enregistre===false)&&premier){  //si le score est > meilleur et que pas de nom est enregistre
        addScore();
    }
    est_enregistre=false;
    premier=false
    snake = [{x: 0, y: 0}, {x: 0, y: 0}, {x:0, y:0}];// je reinitialise tout
    directionX = 20;
    directionY = 0;
    score = 0;
    vitesse = 100;
    niveau = 1;
    document.getElementById("score").innerText = score;
    document.getElementById("vitesse").innerText = "+" + (vitesse-100) + "%";
    nourritureX = 200;
    nourritureY = 200;
    bonusX=-20;
    bonusY=-20;
    etat=false;
    temps=0;
    perdu = false;
    avance = true;
    compte_nourriture = 0;
    change_direction = false;
    changement_niveau=false;
    vitesse_snake = 200;
    document.body.style.backgroundColor = "#87CEEB";
    couleur_boucle=0; //num danstableau couleurs
    document.getElementById("start").style.color = couleurs[couleur_boucle].fond; //ils sadaptent a la couleur de fond
    document.getElementById("pause").style.color = couleurs[couleur_boucle].fond;
    document.getElementById("niveau").innerText = niveau;
    obstacles_actuel =[];
    num_son = 0;
    charger_classement();
    dessiner_niveau();
    jeu();
}



function perdre(){
    dessiner_niveau();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0,0,400,400);
    ctx.fillStyle = couleurs[couleur_boucle].fond; //game over adapte a la couleur du niveau
    ctx.font = "bold 40px 'Courier New', monospace";
    ctx.fillText("Game Over", 90, 200);
    if (score > meilleur_score) {
        premier=true;
        meilleur_score = score;
        localStorage.setItem('snakeMeilleurScore', score); // sauvegarder le score dans le stockage local
        document.getElementById("meilleur").innerText = meilleur_score;
        ctx.fillStyle = "#6fa1d7ff"; //corrige un if inutile
        ctx.fillText(" NOUVEAU RECORD ", 10, 240);
    }
    ctx.fillStyle = couleurs[couleur_boucle].snake;  //sadapte a la couleur du snake
    ctx.font = "bold 20px 'Courier New', monospace";
    ctx.fillText("Appuyez sur N pour", 80, 260);
    ctx.fillText("sauvegarder votre score!", 50, 290)
}




let decalage_corps=0;
let x_suivante=0;
let y_suivante=0;
let valide=false;
let v2=false;
function passage_niveau(){
    changement_niveau=false;
    niveau=niveau+1; //passe au niveau suivant
    document.getElementById("niveau").classList.add('augmentation-animation');                                   //animation pour passage de niveau
    setTimeout(() => {document.getElementById("niveau").classList.remove('augmentation-animation');}, 300);
    document.getElementById("niveau").innerText = niveau; //met a jour le niveau dans le html
    decalage_corps=400;            //jai resolu le probleme de transition du snake entre les niveaux en decalant tout le corps du snake
    for (let i = 0; i < snake.length; i++) {
        snake[i].x = snake[i].x - decalage_corps;
    }
    x_suivante=0;
    directionX=20;
    directionY=0;
    valide=false;
    v2=false;
    couleur_boucle=(niveau-1)% couleurs.length;  //on determine le numero de couleur pour le tableau coleurs par rapport au niveau
    document.body.style.backgroundColor = couleurs[couleur_boucle].fond; 
    document.getElementById("start").style.color = couleurs[couleur_boucle].fond; //les boutonssadaptent au fond
    document.getElementById("pause").style.color = couleurs[couleur_boucle].fond;
    obstacles_actuel = liste_structures[(niveau - 1) % liste_structures.length];
    while(v2 ===false){    // jai remplace pour eviter que la nourritre soit cree en i-1 lorsque la boucle est en i
        v2=true;
        nourritureX = Math.floor(Math.random() * 20) * 20;
        nourritureY = Math.floor(Math.random() * 20) * 20;
        for (let i = 0; i < obstacles_actuel.length; i++) {
            if (nourritureX === obstacles_actuel[i].x * 20 && nourritureY === obstacles_actuel[i].y * 20) {
                v2=false;
            }
        }
    }
    if (Math.random() < 0.3) { // une chance 30% lors du passage de niveau
        etat=true;
        v2=false;
        while(v2===false){
            v2=true;
            bonusX = Math.floor(Math.random() * 20) * 20;
            bonusY = Math.floor(Math.random() * 20) * 20;
            for (let i = 0; i < obstacles_actuel.length; i++) {
                if (bonusX === obstacles_actuel[i].x * 20 && bonusY === obstacles_actuel[i].y * 20) {
                    v2=false;
                }
            }
         }

    }
    dessiner_niveau()
}



function nourriture_mangee(){
if (changement_niveau === false){ //jai change cette condition pour empecher de gagner des points avec une nourriture invisible
    score=score+20;
    son();

    document.getElementById("score").classList.add('augmentation-animation');                                   //animation pour gain de score
    setTimeout(() => {document.getElementById("score").classList.remove('augmentation-animation');}, 300);

    document.getElementById("score").innerText = score; //met a jour le score dans le html
    valide=false;
    while(valide===false){  //jai corrige un probleme ou la nourriture pouvait spawn sur le snake
        valide=true;
        nourritureX=Math.floor(Math.random()*20)*20;  //je creer une autre position pour nourriture
        nourritureY=Math.floor(Math.random()*20)*20; 
        for (let i=0;i<snake.length;i++){
            if (nourritureX===snake[i].x && nourritureY ===snake[i].y){ //tant que la nourriture est sur le snake
                valide=false;
            }
        }
        for (let i = 0; i < obstacles_actuel.length; i++) {
            if (nourritureX === obstacles_actuel[i].x * 20 && nourritureY === obstacles_actuel[i].y * 20) {
                        valide=false;
            }
        }
        if(nourritureX===bonusX && nourritureY===bonusY){
            valide=false;
        }
    }
    snake.push({x:snake[snake.length-1].x,y:snake[snake.length-1].y}); //ajoute un segment
    compte_nourriture=compte_nourriture+1;
    if (compte_nourriture % 5 ===0){
        vitesse_snake=vitesse_snake*0.97;
        vitesse = Math.floor((200 / vitesse_snake)*100);
        document.getElementById("vitesse").classList.add('augmentation-animation');                                   //animation pour gain de vitesse
        setTimeout(() => {document.getElementById("vitesse").classList.remove('augmentation-animation');}, 300);
        document.getElementById("vitesse").innerText = "+" + (vitesse-100) + "%"; //met a jour la vitesse dans le html
    }
}
}


function bonus_mangee(){
    score = score + 50;
    new Audio("bonus.mp3").play();
    vitesse_snake = vitesse_snake * 1.03;  // je ralenti le snake
    vitesse = Math.floor((200 / vitesse_snake) * 100);
    document.getElementById("score").classList.add('augmentation-animation');                                   //animation pour gain de score
    setTimeout(() => {document.getElementById("score").classList.remove('augmentation-animation');}, 300);
    document.getElementById("score").innerText = score;
    document.getElementById("vitesse").classList.add('diminution-animation');                                   //animation pour perte de vitesse
    setTimeout(() => {document.getElementById("vitesse").classList.remove('diminution-animation');}, 300);
    document.getElementById("vitesse").innerText = "+" + (vitesse - 100) + "%";
    bonusX = -20;
    bonusY = -20;
}


function jeu(){
    change_direction = false;
    if(avance === true && perdu === false){  //si le jeu nest pas en pause   
        x_suivante=snake[0].x+directionX;
        y_suivante=snake[0].y+directionY;
        if (x_suivante >= 400 || x_suivante < 0 || y_suivante >= 400 || y_suivante < 0) { //collision avec bodure du canva
            if (x_suivante >= 400 && changement_niveau){
                passage_niveau();
            }
            else{
            avance = false;
            perdu = true;
            change_direction = false;
            perdre();
            return;
            }
        }
        for(let i=1;i<snake.length;i++){
            if (x_suivante===snake[i].x && y_suivante===snake[i].y){ //je verifie si la tete touche le corps
                avance = false;
                perdu = true;
                perdre();
                return;
            }
        }
        for (let i = 0; i < obstacles_actuel.length; i++) {
            if (x_suivante === obstacles_actuel[i].x * 20 && y_suivante === obstacles_actuel[i].y * 20) {
                avance = false;
                perdu = true;
                perdre();
                return;
            }
        }
        for(let i=1;i<snake.length;i++){
            snake[snake.length-i].x=snake[snake.length-i-1].x;//le corps prend la position precedente de la tete
            snake[snake.length-i].y=snake[snake.length-i-1].y;
        }
        
        
        snake[0].x=x_suivante;  //je deplace le snake en fonction de direction
        snake[0].y=y_suivante;

        if(snake[0].x===nourritureX && snake[0].y===nourritureY){ //je verifie si le snake a mange la nourriture
            nourriture_mangee();
        }
        if(snake[0].x===bonusX && snake[0].y===bonusY){
            bonus_mangee();
        }
        if ((compte_nourriture+1) % 6 ===0){
            changement_niveau=true;
            compte_nourriture=compte_nourriture+1;
        }
        if(temps===30){ //apres une periode le bonus va disparaitre
            etat=false;
            bonusX=-20;
            bonusY=-20;
            temps=0
        }
        if(etat===true){
            temps=temps+1
        }
        dessiner_niveau();
    }
    setTimeout(jeu, vitesse_snake); //je recommence la fonction
}

charger_classement();
jeu();