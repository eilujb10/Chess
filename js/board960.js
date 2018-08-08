var kingCol;

Chess.Board960 = function(grid) {
  if (typeof grid !== "undefined") {
    this.grid = grid;
  } else {
    this.init();
  }
  this.moves = [];
};

Chess.Board960.prototype.init = function() {
  this.grid = [];
  this.set960Chess();
};

Chess.Board960.prototype.getKingColumn = function() {
  return kingCol;
};

Chess.Board960.prototype.move = function(startPos, endPos) {
  var
  piece1 = this.grid[startPos[0]][startPos[1]],
  piece2 = this.grid[endPos[0]][endPos[1]];

  if (piece1.validMove(startPos, endPos)) {
    this.movePiece(piece1, piece2, startPos, endPos);
    this.didKingCastle(piece1, startPos);
    return true;
  }
  return false;
};

Chess.Board960.prototype.movePiece = function(piece1, piece2, startPos, endPos) {
  this.grid[startPos[0]][startPos[1]] = null;
  this.grid[endPos[0]][endPos[1]] = piece1;
  piece1.currentPosition = endPos;
  piece1.moved++;
  this.moves.push([startPos, endPos, piece1, piece2]);
};

Chess.Board960.prototype.didKingCastle = function(piece, lastPos) {
  if (piece instanceof Chess.King && piece.didCastle(lastPos)) {
    this.findRook(piece, lastPos);
  }
};

Chess.Board960.prototype.findRook = function(king) {
  if (king.color === "white") {
    if (Chess.Util._arrayEquals(king.currentPosition, [7,6])) {
      this.moveRook([7,7], [7,5]);
    } else if (Chess.Util._arrayEquals(king.currentPosition, [7,2])) {
      this.moveRook([7,0], [7,3]);
    }
  } else if (king.color === "black") {
    if (Chess.Util._arrayEquals(king.currentPosition, [0,6])) {
      this.moveRook([0,7], [0,5]);
    } else if (Chess.Util._arrayEquals(king.currentPosition, [0,2])) {
      this.moveRook([0,0], [0,3]);
    }
  }
};

Chess.Board960.prototype.moveRook = function(startPos, endPos) {
  var rook = this.getPiece(startPos);

  this.movePiece(rook, null, startPos, endPos);
};

Chess.Board960.prototype.reverseLastMove = function() {
  var
  lastMove = this.moves[this.moves.length-1],
  startPos = lastMove[0],
  endPos = lastMove[1],
  piece1 = lastMove[2],
  piece2 = lastMove[3];
  piece1.moved--;

  this.grid[startPos[0]][startPos[1]] = piece1;
  piece1.currentPosition = startPos;

  this.grid[endPos[0]][endPos[1]] = piece2;
  if (piece2 !== null) piece2.currentPosition = endPos;

  this.moves.pop();
};

Chess.Board960.prototype.getPiece = function(array) {
  return this.grid[array[0]][array[1]];
};

//This is awful, but I didn't have a lot of time to make this
//Randomizes the placement of the black pieces (non pawns) and returns the array in that correct order
Chess.Board960.prototype.randomizePlacement = function() {
  var array = ["", "", "", "", "", "", "", ""];

  var bishop1 = Math.floor(Math.random() * 8);
  var bishop2 = Math.floor(Math.random() * 8);
  while((bishop1%2) == (bishop2%2)) {
    bishop2 = Math.floor(Math.random() * 8);
  }
  array[bishop1] = "bishop";
  array[bishop2] = "bishop";

  var queen = Math.floor(Math.random() * 8);
  while(array[queen] != "") {
    queen = Math.floor(Math.random() * 8);
  }
  array[queen] = "queen";

  var knight1 = Math.floor(Math.random() * 8);
  while(array[knight1] != "") {
    knight1 = Math.floor(Math.random() * 8);
  }
  array[knight1] = "knight";

  var knight2 = Math.floor(Math.random() * 8);
  while(array[knight2] != "") {
    knight2 = Math.floor(Math.random() * 8);
  }
  array[knight2] = "knight";
  
  var counter = 1;
  for (var i in array) {
    if (array[i] == "") {
      if (counter == 1) {
        array[i] = "rook";
        
      } else if (counter == 2) {
        array[i] = "king";
        kingCol = i;
        console.log("king column: " + kingCol);
      } else {
        array[i] = "rook";
      }
      counter++;
    }
  }
  return array;
};

Chess.Board960.prototype.set960Chess = function() {
  var piecePlacement = this.randomizePlacement();
  console.log(piecePlacement);
  for (var i = 0; i < 8; i++) {
    this.grid.push([]);
  }
  for (var i = 0; i < 8; i++) {
    this.grid[2][i] = null;
    this.grid[3][i] = null;
    this.grid[4][i] = null;
    this.grid[5][i] = null;

    this.grid[1][i] = new Chess.Pawn("black", this, [1, i]);
    this.grid[6][i] = new Chess.Pawn("white", this, [6, i]);
    switch(piecePlacement[i]) {
      case "bishop":
        this.grid[0][i] = new Chess.Bishop("black", this, [0, i]);
        this.grid[7][i] = new Chess.Bishop("white", this, [7, i]);
        break;
      case "queen":
        this.grid[0][i] = new Chess.Queen("black", this, [0, i]);
        this.grid[7][i] = new Chess.Queen("white", this, [7, i]);
        break;
      case "knight":
        this.grid[0][i] = new Chess.Knight("black", this, [0, i]);
        this.grid[7][i] = new Chess.Knight("white", this, [7, i]);
        break;
      case "rook":
        this.grid[0][i] = new Chess.Rook("black", this, [0, i]);
        this.grid[7][i] = new Chess.Rook("white", this, [7, i]);
        break;
      case "king":
        this.grid[0][i] = new Chess.King("black", this, [0, i]);
        this.grid[7][i] = new Chess.King("white", this, [7, i]);
        break;
    }
  }
};
