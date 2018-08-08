// document.addEventListener("DOMContentLoaded", function() {
//   Chess.newGame();
// });

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("reg_chess").onclick = function() {
    document.getElementById("chessboard").style.border = "1px solid black";
    Chess.newGame();
  };
  document.getElementById("960_chess").onclick = function() {
    Chess.chess960();
  };
});

