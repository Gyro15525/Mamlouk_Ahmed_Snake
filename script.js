const canvas = document.getElementById('Canvas'); // canvas 400x400
const ctx = canvas.getContext('2d');

let score = 0;
let level = 1;

let nourritureX=200; //position initiale de la nourriture
let nourritureY=200; //position initiale de la nourriture

let avance=false  // jai cree cette variable pour savoir si le jeu est en pause ou non pour savoir si je doit prendre en compte linput du clavier
//donc je doit lassocier a start et pause
function start(){             //fonction pour start
    avance = true;
}
function pause(){           //fonction pour pause
    avance = false;
}

document.getElementById("start").addEventListener("click",start);  //jai associe le bouton start a la fonction start
document.getElementById("pause").addEventListener("click",pause);  //jai associe le bouton pause a la fonction pause

let snake = [
    {x:0, y:0} // la position du snake
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
        avance = !avance;
    }
}
document.addEventListener('keydown', clavier); //va passer un objet qui conttient des infos sur la touche appuyee







function dessiner(){
    ctx.clearRect(0,0,400,400); //reinitalise le canvas pour effacer le snake precedent
    ctx.fillStyle = "green";
    ctx.fillRect(snake[0].x,snake[0].y,20,20); //dessine le snake 20x20 en x,y


    ctx.fillStyle = "red";
    ctx.fillRect(nourritureX,nourritureY,20,20); //dessine la nourriture 20 x 20 en nourritureX nourritureY
}


function jeu(){
    if(avance===true){  //si le jeu nest pas en pause        
        if(snake[0].x+directionX<400 && snake[0].x+directionX>=0){  //je verifie que le snake ne sort pas du canvas en x
        snake[0].x=snake[0].x+directionX;  //je deplace le snake en fonction de direction
        }
        if(snake[0].y+directionY<400 && snake[0].y+directionY>=0){  //je verifie que le snake ne sort pas du canvas en y
        snake[0].y=snake[0].y+directionY;
        }
        if(snake[0].x===nourritureX && snake[0].y===nourritureY){ //je verifie si le snake a mange la nourriture
            score=score+1;
            document.getElementById("score").innerText = score; //met a jour le score dans le html
            nourritureX=Math.floor(Math.random()*20)*20; 
            nourritureY=Math.floor(Math.random()*20)*20;//je genere une nouvelle position aleatoire pour la nourriture
        }
        dessiner();
    }
    setTimeout(jeu, 200); //je recommence la fonction
}
jeu();