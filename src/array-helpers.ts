import { DeepReadonly, DeepReadonlyArray } from './store/types/readonly-types';

export function mapButBetter<T, TRet>(
  arr: DeepReadonlyArray<T>,
  callbacks: {
        firstEntryCallback: (payload: { current: DeepReadonly<T>, next: DeepReadonly<T> }) => TRet,
        middleEntryCallback: (payload: { previous: DeepReadonly<T>, current: DeepReadonly<T>, next: DeepReadonly<T> }) => TRet,
        lastEntryCallback: (payload: { previous: DeepReadonly<T>, current: DeepReadonly<T> }) => TRet
    }
): TRet[] {
  const result: TRet[] = [];

  for (let index = 0; index < arr.length; index++) {
    const current = arr[index];

    const firstEntryReached = index === 0;
    if (firstEntryReached) {
      const next = arr[index + 1];
      result.push(callbacks.firstEntryCallback({
        current: current,
        next: next
      }));
      continue;
    }

    const previous = arr[index - 1];

    const lastEntryReached = index === arr.length - 1;
    if (lastEntryReached) {
      result.push(callbacks.lastEntryCallback({
        previous: previous,
        current: current,
      }));
      continue;
    }

    const next = arr[index + 1];

    result.push(callbacks.middleEntryCallback({
      previous: previous,
      current: current,
      next: next
    }));
  }

  return result;
}
