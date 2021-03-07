import { DeepNonReadonly, DeepReadonly } from './readonly-types';

export type Newable<T> = { new (...args: unknown[]): T };

export function convertMutationsToContainImmutableState<TMutations, TState extends new(...args: unknown[]) => InstanceType<TState>>(
  mutations: Newable<TMutations>
): new () => Omit<TMutations, keyof TState> & InstanceType<TState> {
  return mutations as unknown as Newable<
    Omit<TMutations, keyof TState>
      & InstanceType<TState>>;
}

export function convertStateToBeImmutable<TStateClass>(stateClass: Newable<TStateClass>): Newable<DeepReadonly<TStateClass>> {
  return stateClass as unknown as Newable<DeepReadonly<TStateClass>>;
}

// note: I use Omit<> to pick out the mutable fields from getters close, otherwise those fields override the immutable
// states from mutable state and they are allowed to be written to
export function convertGettersToContainMutableState<TGetters, TState extends new(...args: unknown[]) => InstanceType<TState>>(gettersClass: Newable<TGetters>): Newable<
Omit<TGetters, keyof InstanceType<TState>>
  & DeepNonReadonly<InstanceType<TState>>
> {
  return gettersClass as
    unknown as
    Newable<
      Omit<TGetters, keyof InstanceType<TState>>
        & DeepNonReadonly<InstanceType<TState>>
    >;
}
