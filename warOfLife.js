var warOfLife = (function() {
	var battleFieldSize = 20,
		battleField,
		tempBattleField,
		playersMapping,
		checkNeighboursAndSetValueForAlive = function(x, y, color) {
			var allies = 0,
				enemies = 0,
				neighboursIncrement = function(neighbour) {
					if (neighbour != null) {
						if (neighbour === color)
							allies += 1;
						else
							enemies += 1;
					}
				};

			battleFieldCellAction(x, y, neighboursIncrement);

			if ((enemies === 0 && allies < 2)
				|| (enemies === 0 && allies > 3)
				|| (enemies !== 0 && enemies > allies)) {
				//die
			//console.log('killed: ' + x + ' ' + y + ' ' + color);
				tempBattleField[x][y] = null;
			}
		},
		addCountToColorMap = function(map, color) {
			if (color != null) {
				var currentCount = map[color];

				if (currentCount != null)
					map[color] = ++currentCount;
				else
					map[color] = 1;
			}
		},
		getMostCommonFromMap = function(map) {
			var mostCommonColor, mostCommonColorCount = 0;

			for (var key in map) {
		  		if (map.hasOwnProperty(key)) {
		    		var tmp = map[key];
		    		if (tmp > mostCommonColorCount) {
		    			mostCommonColor = key;
		    			mostCommonColorCount = tmp;
		    		}
		  		}
			}

			return mostCommonColor;
		},
		checkNeighboursAndSetValueForDead = function(x, y) {
			var map = new Object(),
				currentNeighbour,
				incrementCountForColor = function(neighbour) {
					addCountToColorMap(map, neighbour);
				};

			battleFieldCellAction(x, y, incrementCountForColor);

			var mostCommonColor = getMostCommonFromMap(map);

			if (mostCommonColor != null && map[mostCommonColor] === 3) {
				//console.log('born: ' + x + ' ' + y + ' ' + mostCommonColor);
				tempBattleField[x][y] = mostCommonColor;
			}
		},
		battleFieldCellAction = function(x, y, action) {
			if (x !== 0 && y !== 0) {
				//get from x-1, y-1
				action(battleField[x-1][y-1]);
			}
			if (x !== 0) {
				//get from x-1, y
				action(battleField[x-1][y]);
				//get from x-1, y+1
				if (y < 19)
					action(battleField[x-1][y+1]);
			}
			//get from x+1, y+1
			if (x < 19) {
				if (y < 19)
					action(battleField[x+1][y+1]);
				//get from x+1, y
				action(battleField[x+1][y]);
			}
			//get from x, y+1
			if (y < 19)
				action(battleField[x][y+1]);
			if (y !== 0) {
				//get from x, y-1
				action(battleField[x][y-1]);
				//get from x+1, y-1
				if (x < 19)
					action(battleField[x+1][y-1]);
			}
		},
		calculateNextGeneration = function() {
			tempBattleField = new Object();
			$.extend( true, tempBattleField, battleField );

			for (i = 0; i < battleField.length; i++)
				for (j = 0; j < battleField[i].length; j++) {
					if (battleField[i][j] != null)
						checkNeighboursAndSetValueForAlive(i, j, battleField[i][j]);
					else
						checkNeighboursAndSetValueForDead(i, j);
				}
			$.extend( true, battleField, tempBattleField );
		},
		calculateOutcome = function() {
			var map = new Object();

			for (i = 0; i < battleField.length; i++)
				for (j = 0; j < battleField[i].length; j++)
					addCountToColorMap(map, battleField[i][j]);

			//console.log('winer is: ' + getMostCommonFromMap(map));
			return playersMapping[getMostCommonFromMap(map)];
		},
		redrawField = function() {
			//console.log('redrawField');
		    var parent = $('<div />', {
		        class: 'grid',
		        width: battleFieldSize  * 20,
		        height: battleFieldSize  * 20
		    }).addClass('grid');

		    for (var i = 0; i < battleFieldSize; i++) {
		        for(var p = 0; p < battleFieldSize; p++) {
		        	var color = '#fff';

		        	if (battleField[i][p] != null)
		        		color = battleField[i][p];

		            $('<div />', {
		                width: 20 - 1,
		                height: 20 - 1,
		                css: {
		                	background: color
		                }
		            }).appendTo(parent);
		        }
		    }

		    $('#battleField').html(parent);
		},
		play = function(generations, genLength, callback) {
			var playInterval = setInterval(function() {
				calculateNextGeneration();
				redrawField();

				if (--generations <= 0) {
					clearInterval(playInterval);
					callback(calculateOutcome());
				}
			}, genLength * 1000);
		};

	return {
		init: function(playersMap) {
			battleField = new Array(battleFieldSize);

			for (i = 0; i < battleFieldSize; i++)
				battleField[i] = new Array(battleFieldSize);

				var colors = ["#000","#f00","#0f0","#00f"];
				var offsets = [{"x":0,"y":0},{"x":10,"y":0},{"x":0,"y":10},{"x":10,"y":10}];
				playersMapping = new Object();

			$('#players').html($('<div />'));
			
			for (var key in playersMap) {
		  		if (playersMap.hasOwnProperty(key)) {
		    		var player = playersMap[key];

						var color = colors.pop();
						var offset = offsets.pop()

						playersMapping[color] = player;
						
						var parent = $('<label />', {
					        class: 'none',
					        css: {
			                	color: color
			                }
					    }).text(player.name).appendTo('#players');
						$('<br>').appendTo('#players');
						
						if (typeof player !== "undefined" && typeof player.cells !== "undefined")
							player.cells.forEach(function(cell) {
								battleField[cell.x+offset.x][cell.y+offset.y] = color;
							});
		  		}
			}

			redrawField();
		},
		play: play
	};
})();

var gameHandler = (function() {
	var players,
		winners = new Array(),
		generationsCount,
		generationLength,
		start = function(generations, genLength, data) {
			generationsCount = generations;
			generationLength = genLength;
            players = randomizePlayersList(data);
    		playRound(prepareRoundPlayersMap());
		},
		randomizePlayersList = function(playersList) {
			var result = new Array();

			while (playersList.length > 0) {
				var index = (Math.random()*12345|0)%playersList.length;
				result.push(playersList[index]);
				playersList.splice(index, 1);
			}

			return result;
		},
		playRound = function(map) {
			warOfLife.init(map);
			warOfLife.play(generationsCount, generationLength, function(result) {
				if (typeof players !== "undefined") {
					winners.push(result);
					console.log('winner is ' + result.name);
	
					if (players.length === 0 && winners.length > 1) {
						players = winners;
						winners = new Array();
						playRound(prepareRoundPlayersMap());
					} else if (players.length > 0)
						playRound(prepareRoundPlayersMap());
					else
						alert('winner: ' + result.name);
				} else
					console.log('noone won');
			});
		},
		prepareRoundPlayersMap = function() {
			var map = new Object();

			for (var i = 0; i < 4; i++) {
				var player = players.pop();
				if (typeof player !== "undefined")
					map[player.id] = player;
			}

			return map;
		};
	return {
		startGame: start
	};
})();
