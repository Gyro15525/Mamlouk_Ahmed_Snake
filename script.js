const canvas = document.getElementById('Canvas'); // canvas 400x400
const ctx = canvas.getContext('2d');

let score = 0;
let level = 1;

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

let directionX=0; // variable pour la direction du snake
let directionY=0;
//la direction depend de linput du clavier

function clavier(x){    //fonction pour gerer linput du clavier
    if (x.key =='ArrowRight'){ 
        directionX=20;
        directionY=0;
    }
    else if (x.key =='ArrowLeft'){
        directionX=-20;
        directionY=0;
    }
    else if (x.key =='ArrowUp'){
        directionX=0;
        directionY=-20;
    }
    else if (x.key =='ArrowDown'){
        directionX=0;
        directionY=20;
    }
    else if (x.key ==' '){  //espace pour pause
        if (perdu) {
            recommence();  // Si perdu alors recommencer
        } 
        else {
            avance = !avance;
        }
    }
}
document.addEventListener('keydown', clavier); //va passer un objet qui conttient des infos sur la touche appuyee







function dessiner(){
    ctx.clearRect(0,0,400,400); //reinitalise le canvas pour effacer le snake precedent
    ctx.fillStyle = "green";
    for(let i=0;i<snake.length;i++){
    ctx.fillRect(snake[i].x,snake[i].y,20,20); //dessine le snake entier
    }

    ctx.fillStyle = "red";
    ctx.fillRect(nourritureX,nourritureY,20,20); //dessine la nourriture 20 x 20 en nourritureX nourritureY
}
function recommence() { //fonction pour recommencer le jeu
    snake = [{x: 0, y: 0}, {x: 0, y: 0}];
    directionX = 0;
    directionY = 0;
    score = 0;
    document.getElementById("score").innerText = score;
    nourritureX = 200;
    nourritureY = 200;
    perdu = false;
    avance = false;
    dessiner();
    jeu();
}
let x_suivante=0;
let y_suivante=0;
function jeu(){
    if(avance === true && perdu === false){  //si le jeu nest pas en pause   
        x_suivante=snake[0].x+directionX;
        y_suivante=snake[0].y+directionY;
        if (x_suivante >= 400 || x_suivante < 0 || y_suivante >= 400 || y_suivante < 0) {
            avance = false;
            perdu = true;
            return;
        }
        for(let i=1;i<snake.length;i++){
            snake[snake.length-i].x=snake[snake.length-i-1].x;//le corps prend la position precedente de la tete
            snake[snake.length-i].y=snake[snake.length-i-1].y;
        }     
        snake[0].x=x_suivante;  //je deplace le snake en fonction de direction
        snake[0].y=y_suivante;

        if(snake[0].x===nourritureX && snake[0].y===nourritureY){ //je verifie si le snake a mange la nourriture
            score=score+1;
            document.getElementById("score").innerText = score; //met a jour le score dans le html
            nourritureX=Math.floor(Math.random()*20)*20; 
            nourritureY=Math.floor(Math.random()*20)*20;//je genere une nouvelle position aleatoire pour la nourriture
            snake.push({x:snake[snake.length-1].x,y:snake[snake.length-1].y}); //ajoute un segment
        }
        dessiner();
    }
    setTimeout(jeu, 200); //je recommence la fonction
}

jeu();