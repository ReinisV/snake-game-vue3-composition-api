
import { defineComponent } from 'vue';
import { store } from '@/store';

export default defineComponent({
  name: 'Home',

  setup() {
    return () => {
      const leaderboard = store.leaderboardScores.length > 0
        ? <table style="margin:auto;">
          <thead>
            <tr>
              <th colspan={2}>Leaderboard</th>
            </tr>
          </thead>
          <tbody>
            {store.leaderboardScores.map(entry =>
              (<tr>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
              </tr>
              ))}
          </tbody>
        </table>
        : <div>No scores yet</div>;
      return (
        <div>
          {leaderboard}
        </div>
      );
    };
  }
});
