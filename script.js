const canvas = document.getElementById('Canvas'); // canvas 400x400
const ctx = canvas.getContext('2d');

let score = 0;
let level = 1;


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

let x=0;
let y=0;     // variables globales pour la position du snake
let direction=0; // variable pour la direction du snake
//la direction depend de linput du clavier

function clavier(x){    //fonction pour gerer linput du clavier
    if (x.key =='ArrowRight'){ 
        direction=20;
    }
    else if (x.key =='ArrowLeft'){
        direction=-20;
    }
}
document.addEventListener('keydown', clavier); //va passer un objet qui conttient des infos sur la touche appuyee







function dessiner(){
    ctx.clearRect(0,0,400,400); //reinitalise le canvas pour effacer le snake precedent
    ctx.fillStyle = "green";
    ctx.fillRect(x,0,20,20); //dessine le snake 20x20 en x,y
}


function jeu(){
    if(avance===true){  //si le jeu nest pas en pause        
        dessiner();
        x=x+direction;  //je deplace le snake en fonction de direction
    }
    setTimeout(jeu, 200); //je recommence la fonction
}
jeu();