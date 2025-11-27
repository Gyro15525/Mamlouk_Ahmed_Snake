const canvas = document.getElementById('Canvas'); // canvas 400x400
const ctx = canvas.getContext('2d');

let score = 0;
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
}

document.getElementById("start").addEventListener("click",start);  //jai associe le bouton start a la fonction start
document.getElementById("pause").addEventListener("click",pause);  //jai associe le bouton pause a la fonction pause

let snake = [
    {x:0, y:0}, // la position de la tete du snake
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







function dessiner(){
    ctx.clearRect(0,0,400,400); //reinitalise le canvas pour effacer le snake precedent
    ctx.fillStyle = "#000000";
    for(let i=0;i<snake.length;i++){
    ctx.fillRect(snake[i].x,snake[i].y,20,20); //dessine le snake entier
    }

    ctx.fillStyle = "#444444";
    ctx.fillRect(nourritureX,nourritureY,20,20); //dessine la nourriture 20 x 20 en nourritureX nourritureY
}
function recommence() { //fonction pour recommencer le jeu
    snake = [{x: 0, y: 0}, {x: 0, y: 0}];
    directionX = 20;
    directionY = 0;
    score = 0;
    vitesse = 100;
    document.getElementById("score").innerText = score;
    document.getElementById("vitesse").innerText = vitesse;
    nourritureX = 200;
    nourritureY = 200;
    perdu = false;
    avance = true;
    compte_nourriture = 0;
    change_direction = false;
    vitesse_snake = 200;
    dessiner();
    jeu();
}

function perdre(){
    dessiner();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0,0,400,400);
    ctx.fillStyle = "#87CEEB";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 90, 200);
}

let x_suivante=0;
let y_suivante=0;
function jeu(){
    change_direction = false;
    if(avance === true && perdu === false){  //si le jeu nest pas en pause   
        x_suivante=snake[0].x+directionX;
        y_suivante=snake[0].y+directionY;
        if (x_suivante >= 400 || x_suivante < 0 || y_suivante >= 400 || y_suivante < 0) {
            avance = false;
            perdu = true;
            change_direction = false;
            perdre();
            return;
        }
        for(let i=1;i<snake.length;i++){
            if (x_suivante===snake[i].x && y_suivante===snake[i].y){ //je verifie si la tete touche le corps
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
            score=score+20;
            document.getElementById("score").innerText = score; //met a jour le score dans le html
            nourritureX=Math.floor(Math.random()*20)*20; 
            nourritureY=Math.floor(Math.random()*20)*20;//je genere une nouvelle position aleatoire pour la nourriture
            for (let i=0;i<snake.length;i++){
                while (nourritureX===snake[i].x && nourritureY ===snake[i].y){ //tant que la nourriture est sur le snake
                    nourritureX=Math.floor(Math.random()*20)*20;  //je creer une autre position pour nourriture
                    nourritureY=Math.floor(Math.random()*20)*20; 
                }
            }
            snake.push({x:snake[snake.length-1].x,y:snake[snake.length-1].y}); //ajoute un segment
            compte_nourriture=compte_nourriture+1;
            if (compte_nourriture % 5 ===0){
            vitesse_snake=vitesse_snake*0.97;
            vitesse = Math.floor((200 / vitesse_snake)*100);
            document.getElementById("vitesse").innerText = vitesse + "%"; //met a jour la vitesse dans le html
            }
        }
        dessiner();
    }
    setTimeout(jeu, vitesse_snake); //je recommence la fonction
}

jeu();