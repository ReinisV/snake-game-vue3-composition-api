
import { computed, defineComponent } from 'vue';
import { store } from '@/store';

export default defineComponent({
  name: 'Main menu',

  setup() {
    const orderedLeaderboard = computed(() => {
      const ordered = [...store.leaderboardScores].sort((a, b) => {
        if (a.score < b.score) {
          return 1;
        }
        if (a.score > b.score) {
          return -1;
        }

        return 0;
      });

      let currentPos = 0;
      const withPositions = ordered.map(entry => {
        currentPos += 1;
        return {
          ...entry,
          position: currentPos,
        };
      });

      return withPositions;
    });

    return {
      orderedLeaderboard
    };
  },

  render() {
    if (store.leaderboardScores.length === 0) {
      return <div>
        <div>No scores yet</div>
      </div>;
    }

    return <div>
      <table style="margin:auto;">
        <thead>
          <tr>
            <th colspan={4}>Leaderboard</th>
          </tr>
        </thead>
        <tbody>
          {this.orderedLeaderboard.map(entry =>
            (<tr>
              <td>{entry.position}</td>
              <td>{entry.name}</td>
              <td>{entry.score}</td>
              <td>{entry.time.toLocaleTimeString()}</td>
            </tr>
            ))}
        </tbody>
      </table>
    </div>;
  }
});
