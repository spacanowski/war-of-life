# war-of-life
Multiplayer implementation of Conway's Game of Life in tournament setting

## Rules
Game will shuffle all provided players and group them in groups of four. Then it's normal tournament where winner will be player with most cells after given generations count. Winners will play with each other in secound round and so on and so on untill there is but one last player.
One round have classic Conway's Game of Life rules plus two additional:
1. When living cell is surrounded with more enemies (cells of different player) than allies it dies, because ... you know ... war. If there are more allies than enemies it lives.
2. Dead cell is brought to life for player with most cells surrounding it, because ... you know ... friends.

## How to play
Call ``` startGame ``` function on ``` gameHandler ``` object with arguments: number of generations, lenght of generation in seconds and array with game data and then press play.
Game data should contain json array with objects with id, name and cells array containing objects with x and y fields, e.g.
```json
[{"id":"1", "name":"player1","cells":
                        [{"x":5,"y":1},{"x":5,"y":2},{"x":5,"y":3},{"x":5,"y":4},{"x":5,"y":6},{"x":5,"y":7},{"x":5,"y":8},{"x":7,"y":3},{"x":8,"y":3},{"x":9,"y":3},{"x":1,"y":1},{"x":2,"y":1}]},
                    {"id":"2", "name":"player2","cells":
                        [{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3},{"x":2,"y":1},{"x":2,"y":2},{"x":2,"y":3},{"x":3,"y":2},{"x":3,"y":3},{"x":3,"y":4},{"x":3,"y":5}]},
                    {"id":"3", "name":"player3","cells":
                        [{"x":3,"y":3},{"x":3,"y":4},{"x":3,"y":5},{"x":4,"y":3},{"x":5,"y":3},{"x":6,"y":3},{"x":6,"y":4},{"x":6,"y":5},{"x":4,"y":5},{"x":5,"y":5}]},
                    {"id":"4", "name":"player4","cells":
                        [{"x":3,"y":2},{"x":2,"y":3},{"x":4,"y":3},{"x":3,"y":4},{"x":5,"y":4},{"x":6,"y":4},{"x":7,"y":4},{"x":8,"y":4}]}]
```
