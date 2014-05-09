$(document).ready(function(){

  $('.game').hide()
  var ROWS, COLUMNS, MINES;

  $('#startform').submit(function(event){
    event.preventDefault();
    if( $('#beginner-mode').is(':checked') ) {
      ROWS = 9;
      COLUMNS = 9;
      MINES = 10;
    }
    else if( $('#intermediate-mode').is(':checked') ) {
      ROWS = 16;
      COLUMNS = 16;
      MINES = 40;
    }
    else if( $('#expert-mode').is(':checked') ) {
      ROWS = 16;
      COLUMNS = 30;
      MINES = 99;
    }
    generateGrid(ROWS, COLUMNS);
    positionMines(MINES);
    populateGrid();
    hideTiles();
    $('#startform').hide();
    $('.game').show()

    $('td').click(function(){
      if ( !$(this).hasClass('flagged') ) {
        $(this).hasClass('mine') ? gameOver() : openSafeTile($(this));
      };
    });

    $('td').bind('contextmenu', function(e){
      e.preventDefault();
      toggleFlagTile($(this));
    });
  });
});


function generateGrid(rows, columns){
  for (var y = 0 ; y < rows ; y++) {
    $('tbody').append($("<tr id='row" + y + "'>"));
    for (var x = 0 ; x < columns ; x++) {
      $('tr:last-child').append($("<td class='" + x + "'></td>"));
    };
  };
};

var positionMines = function(mines){
  var counter = 0;
  while (counter < mines){
    $('td').each(function(){
      if ( (Math.floor((Math.random()*10)+1) == 1) && counter < mines){
        $(this).addClass('mine');
        counter++;
      };
    });
  };
};

function hideTiles() {
  $('td').each(function() {
    $(this).addClass('unopened');
  })
};

var populateGrid = function(){
  $('td').each(function(){
    if (!$(this).hasClass('mine')) {
      var counter = minedNeighboursCount($(this));

      if (counter == 0) {
        $(this).addClass('opened');
      } else if (counter > 8) {
        alert('BUG !');
      } else {
        $(this).addClass('mine-neighbour-' + counter);
      }
    };
  });
};

var minedNeighboursCount = function(tile){
  var counter = 0;

  getSurroundingTiles(tile).forEach(function(nextTile){
    if (nextTile.hasClass('mine')) {
      counter++;
    };
  })
  return counter;
};

var revealTiles = function(){
  $('td').each(function(){
    $(this).removeClass('unopened');
  });
};

var gameOver = function(){
  revealTiles();
};

var openSafeTile = function(tile){
  if (tile.hasClass('unopened')) {
    tile.removeClass('unopened');
    if( tile.hasClass('opened') ) {
      getSurroundingTiles(tile).forEach(function(nextTile){
        openSafeTile(nextTile);
      });
    };
  };
};


var getSurroundingTiles = function(tile){
  // x and y of the tile
  var positionX = tile.attr("class"); // class id
  var currentRow = tile.parent(); // object

  // surrounding tiles on the same row
  var previousX = (parseFloat(positionX) - 1); // id (numerical)
  var followingX = (parseFloat(positionX) + 1);

  // rows on top and on bottom of the tile
  var previousRow = tile.parent().prev(); // tile (object)
  var nextRow = tile.parent().next();

  surroundingTiles = [];
  surroundingTiles.push(tile.prev());
  surroundingTiles.push(tile.next());
  surroundingTiles.push(previousRow.children('.' + previousX));
  surroundingTiles.push(previousRow.children('.' + tile.index()));
  surroundingTiles.push(previousRow.children('.' + followingX));
  surroundingTiles.push(nextRow.children('.' + previousX));
  surroundingTiles.push(nextRow.children('.' + tile.index()));
  surroundingTiles.push(nextRow.children('.' + followingX));

  return surroundingTiles;
};

var toggleFlagTile = function(tile){
  if (tile.hasClass('unopened')) {
    tile.hasClass('flagged') ? tile.removeClass('flagged') : tile.addClass('flagged');
  };
};