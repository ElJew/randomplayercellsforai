//is to be changed as needed
const domain = 'http://localhost:3000';

//if default is left, server will provide with a name each time
let name = 'default';

let roomSettings = {};

//Communication part
const io = require("socket.io-client");
const socket = io.connect(domain);

//reception des position
//marque le début d'un nouveau coup
socket.on("state",function(data){
    console.log('positions reçues');
    console.log(data);
    socket.emit('move',{player:name,move:makeMove(data)})
    });

//reception de notre alias, correspondant au nom que nous avons donné
//ou au nom attribué par le server si nous avons laissé 'default'
socket.on("handshake",function(nom){
      console.log('Nous sommes connectés et près a jouer en tant que ' 
        + nom);
    name = nom;
    });
//reception des settings
socket.on("roomSettings",function(newRoomSettings){
      console.log('Room de taille ' 
        + newRoomSettings.size);
    roomSettings = newRoomSettings;
    });

//s'identifie comme player
console.log('Player Starting')
socket.emit('playerID', name);

//actual move logic
function makeMove(data){
  let myCellsArray = data.filter(function(cell){return(cell.player == name)});
    let myMoves = myCellsArray.map(function(cell){
        //liste les directions materiellement possibles
      let possibleDirections = ['o'];
      if (cell.x > 0){possibleDirections.push('l')}
      if (cell.y > 0){possibleDirections.push('u')}
      if (cell.x < roomSettings.size-1){possibleDirections.push('r')}
      if (cell.y < roomSettings.size-1){possibleDirections.push('d')}
        console.log(possibleDirections);
    
      //liste le nombre de divisions qui ne diminueront pas notre poids
      let possibleSeparations = [1];
      for (let i=2;i<6;i++){if (cell.weight%i==0){possibleSeparations.push(i)}}
      console.log(possibleSeparations);
      //cumule les deux
      let separationsOK = possibleSeparations.filter(function(nb){return(nb <= possibleDirections.length)})
      console.log(separationsOK);
      
      //choisi un nombre de séparations au hasard
      let indexDeSeparations = Math.floor(Math.random()*separationsOK.length);
      let nombreDeSeparations = separationsOK[indexDeSeparations];
      console.log(nombreDeSeparations);
      
      //prend ce nombre d'éléments dans possibleDirections
      let moves = possibleDirections.sort(() => .5 - Math.random()).slice(0,nombreDeSeparations)
        console.log(moves);
    
      //retourne le resultat pour la cell données
      return {id:cell.id,
          move:moves}
    })
    //retourne l'array de moves
    console.log(' MOVES :');
    console.log(myMoves);
    return myMoves; 
}

