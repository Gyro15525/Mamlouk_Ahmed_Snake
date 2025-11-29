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

let change_direction = false;
function clavier(x){    //fonction pour gerer linput du clavier
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
let liste_structures = [[], labyrinthe , colonnes, coins, zigzag, points];

let obstacles_actuel = [];










let couleur_boucle=0;
let couleurs = [
    {snake: "#000000", nourriture: "#444444", fond: "#87CEEB"},
    {snake: "gray", nourriture: "#ff0000ff",fond: "#9BBA5A"},
    {snake: "#efefefff", nourriture: "#c170c8ff",fond: "#876ff0ff"},
    {snake: "#8B4513", nourriture: "#D2691E",fond: "#F4A460"},
    {snake: "#4B0082", nourriture: "#8A2BE2",fond: "#D8BFD8"},
    {snake: "#FF8C00", nourriture: "#FFA500",fond: "#FFD700"},
    {snake: "#2F4F4F", nourriture: "#708090",fond: "#B0C4DE"}
]

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
        ctx.fillStyle = "rgba(234, 2, 255, 0.3)";
        ctx.fillRect(395, 0, 5, 400);
    }
    for (let i=0;i<obstacles_actuel.length;i++){                  
        ctx.fillStyle = "#37817fff";
        ctx.beginPath();
        ctx.roundRect(obstacles_actuel[i].x*20,obstacles_actuel[i].y*20,20,20,5); //dessine le snake entier
        ctx.fill();
    }
}






function recommence() { //fonction pour recommencer le jeu
    snake = [{x: 0, y: 0}, {x: 0, y: 0}, {x:0, y:0}];
    directionX = 20;
    directionY = 0;
    score = 0;
    vitesse = 100;
    niveau = 1;
    document.getElementById("score").innerText = score;
    document.getElementById("vitesse").innerText = "+" + (vitesse-100) + "%";
    nourritureX = 200;
    nourritureY = 200;
    perdu = false;
    avance = true;
    compte_nourriture = 0;
    change_direction = false;
    changement_niveau=false;
    vitesse_snake = 200;
    document.body.style.backgroundColor = "#87CEEB";
    couleur_boucle=0;
    document.getElementById("start").style.color = couleurs[couleur_boucle].fond;
    document.getElementById("pause").style.color = couleurs[couleur_boucle].fond;
    document.getElementById("niveau").innerText = niveau;
    obstacles_actuel =[];
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
        meilleur_score = score;
        localStorage.setItem('snakeMeilleurScore', score); // sauvegarder le score dans le stockage local
        document.getElementById("meilleur").innerText = meilleur_score;
    }
    if (score === meilleur_score) {
        ctx.fillStyle = "#6fa1d7ff";
        ctx.fillText(" NOUVEAU RECORD ", 10, 240);
    }
}
let decalage_corps=0;
let x_suivante=0;
let y_suivante=0;
let valide=false;
function jeu(){
    change_direction = false;
    if(avance === true && perdu === false){  //si le jeu nest pas en pause   
        x_suivante=snake[0].x+directionX;
        y_suivante=snake[0].y+directionY;
        if (x_suivante >= 400 || x_suivante < 0 || y_suivante >= 400 || y_suivante < 0) {
            if (x_suivante >= 400 && changement_niveau){
                changement_niveau=false;
                niveau=niveau+1; //passe au niveau suivant
                document.getElementById("niveau").innerText = niveau; //met a jour le niveau dans le html
                decalage_corps=400;            //jai resolu le probleme de transition du snake entre les niveaux en decalant tout le corps du snake
                for (let i = 0; i < snake.length; i++) {
                    snake[i].x = snake[i].x - decalage_corps;
                }
                x_suivante=0;
                directionX=20;
                directionY=0;
                valide=false;
                couleur_boucle=(niveau-1)% couleurs.length;
                document.body.style.backgroundColor = couleurs[couleur_boucle].fond;
                document.getElementById("start").style.color = couleurs[couleur_boucle].fond;
                document.getElementById("pause").style.color = couleurs[couleur_boucle].fond;
                obstacles_actuel = liste_structures[(niveau - 1) % liste_structures.length];
                for (let i = 0; i < obstacles_actuel.length; i++) {
                    while (nourritureX === obstacles_actuel[i].x * 20 && nourritureY === obstacles_actuel[i].y * 20) {
                        nourritureX = Math.floor(Math.random() * 20) * 20;
                        nourritureY = Math.floor(Math.random() * 20) * 20;
                    }
                }
                dessiner_niveau()
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
            if (changement_niveau === false){ //jai change cette condition pour empecher de gagner des points avec une nourriture invisible
            score=score+20;
            document.getElementById("score").innerText = score; //met a jour le score dans le html
            nourritureX=Math.floor(Math.random()*20)*20; 
            nourritureY=Math.floor(Math.random()*20)*20;//je genere une nouvelle position aleatoire pour la nourriture
            valide=false;
            while(valide===false){  //jai corrige un probleme ou la nourriture pouvait spawn sur le snake
                valide=true;
                for (let i=0;i<snake.length;i++){
                    while (nourritureX===snake[i].x && nourritureY ===snake[i].y){ //tant que la nourriture est sur le snake
                        nourritureX=Math.floor(Math.random()*20)*20;  //je creer une autre position pour nourriture
                        nourritureY=Math.floor(Math.random()*20)*20; 
                }
                }
                for (let i = 0; i < obstacles_actuel.length; i++) {
                        while (nourritureX === obstacles_actuel[i].x * 20 && nourritureY === obstacles_actuel[i].y * 20) {
                            nourritureX = Math.floor(Math.random() * 20) * 20;
                            nourritureY = Math.floor(Math.random() * 20) * 20;
                        }
                    }
                for (let i=0;i<snake.length;i++){
                if (nourritureX===snake[i].x && nourritureY ===snake[i].y){
                    valide=false;
                }
                }
            }
            snake.push({x:snake[snake.length-1].x,y:snake[snake.length-1].y}); //ajoute un segment
            compte_nourriture=compte_nourriture+1;
            if (compte_nourriture % 5 ===0){
            vitesse_snake=vitesse_snake*0.97;
            vitesse = Math.floor((200 / vitesse_snake)*100);
            document.getElementById("vitesse").innerText = "+" + (vitesse-100) + "%"; //met a jour la vitesse dans le html
            }
            }
        }
        if ((score >= (niveau*100))){
            changement_niveau=true;
        }
        dessiner_niveau();
    }
    setTimeout(jeu, vitesse_snake); //je recommence la fonction
}

jeu();