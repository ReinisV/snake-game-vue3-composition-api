import { Game } from '@/game-logic';
import { State } from 'vuex-simple';
import { convertStateToBeImmutable } from './types/readonly-modifiers';

class SnakeGameStateClass {
    @State()
    public game!: Game;

    @State()
    public leaderboardScores: {name: string, score: number}[] = [];
}

// expose the state class, but make it look like its readonly (so nobody modifies it outright)
export const SnakeGameState = convertStateToBeImmutable(SnakeGameStateClass);

// but also expose a mutable type, so that mutations can use it (because only they are allowed to modify it)
export type MutableSnakeGameState = SnakeGameStateClass;
