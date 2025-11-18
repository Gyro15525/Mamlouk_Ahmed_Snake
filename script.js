const canvas = document.getElementById('Canvas');
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
document.getElementById("start").addeventListener("click",start);  //jai associe le bouton start a la fonction start
document.getElementById("pause").addeventListener("click",pause);  //jai associe le bouton pause a la fonction pause

function jeu(){
    if(avance===true){  //si le jeu nest pas en pause        
        
    }
    setTimeout(jeu, 200); //je recommence la fonction
}
