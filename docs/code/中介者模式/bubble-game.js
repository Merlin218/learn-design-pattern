const playerDirector = (function () {
  const players = {};
  const operations = {
    addPlayer(player) {
      const { teamColor } = player;
      if (!players[teamColor]) {
        players[teamColor] = [];
      }
      players[teamColor].push(player);
    },
    removePlayer(player) {
      const { teamColor } = player;
      const teamPlayers = players[teamColor] || [];
      for (let i = teamPlayers.length; i >= 0; i -= 1) {
        if (teamPlayers[i] === player) {
          teamPlayers.splice(i, 1);
        }
      }
    },
    changeTeam(player, nextTeamColor) {
      operations.removePlayer(player);
      // eslint-disable-next-line no-param-reassign
      player.teamColor = nextTeamColor;
      operations.addPlayer(player);
    },
    playerDead(player) {
      const { teamColor } = player;
      const teamPlayers = players[teamColor] || [];
      let allDied = true;
      for (let i = 0; i < teamPlayers.length; i += 1) {
        // 如果有一个队友没死，则不是全部死亡
        if (teamPlayers[i].state !== 'dead') {
          allDied = false;
          break;
        }
      }
      if (allDied) {
        // 通知本队伍全部死亡
        for (let i = 0; i < teamPlayers.length; i += 1) {
          const partner = teamPlayers[i];
          partner.lose();
        }
        // 通知其他队伍所有玩家win
        Object.keys(players).forEach((color) => {
          if (color !== teamColor) {
            const enemyPlayers = players[color];
            for (let i = 0; i < enemyPlayers.length; i += 1) {
              const enemy = enemyPlayers[i];
              enemy.win();
            }
          }
        });
      }
    },
  };
  const reciveMessage = function (message, ...args) {
    operations[message].apply(this, args);
  };
  return {
    reciveMessage,
  };
}());

class Player {
  constructor(name, teamColor) {
    this.name = name;
    this.partners = [];
    this.enemies = [];
    this.teamColor = teamColor;
    this.state = 'alive';
  }

  win() {
    console.log(`${this.name} win`);
  }

  lose() {
    console.log(`${this.name} lose`);
  }

  die() {
    this.state = 'dead';
    playerDirector.reciveMessage('playerDead', this);
  }

  remove() {
    playerDirector.reciveMessage('removePlayer', this);
  }

  changeTeam(nextTeamColor) {
    playerDirector.reciveMessage('changeTeam', this, nextTeamColor);
  }
}

// 创建玩家工厂
const createPlayer = (name, teamColor) => {
  const player = new Player(name, teamColor);
  playerDirector.reciveMessage('addPlayer', player);
  return player;
};

const player1 = createPlayer('player1', 'red');
const player2 = createPlayer('player2', 'red');
createPlayer('player3', 'blue');
createPlayer('player4', 'blue');

player1.changeTeam('blue');
player2.die();
