export function forEachButBetter<T>(
  arr: T[],
  callbacks: {
        middleEntryCallback: (payload: { current: T, next: T }) => void,
        lastEntryCallback: (payload: { current: T }) => void
    }
): void {
  for (let index = 0; index < arr.length; index++) {
    const current = arr[index];

    const lastEntryReached = index === arr.length - 1;
    if (lastEntryReached) {
      callbacks.lastEntryCallback({
        current: current,
      });

      continue;
    }

    const next = arr[index + 1];
    callbacks.middleEntryCallback({
      current: current,
      next: next
    });
  }
}

export function mapButBetter<T, TRet>(
  arr: T[],
  callbacks: {
        firstEntryCallback: (payload: { current: T, next: T }) => TRet,
        middleEntryCallback: (payload: { previous: T, current: T, next: T }) => TRet,
        lastEntryCallback: (payload: { previous: T, current: T }) => TRet
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
