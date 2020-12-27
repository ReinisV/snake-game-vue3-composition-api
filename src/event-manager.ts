import { Ref, watch } from 'vue';

const listeningInProgress: string[] = [];

/**
 * provides access to event subscription methods on the window and document
 * global objects.
 *
 * All methods on this always return an unsubscribe method that should be
 * executed when the calling component is being destroyed to avoid memory
 * leaks via global objects.
 */
export const eventManager = {
  onWindowResize: (callback: () => void): Unsubscribe => {
    window.addEventListener('resize', callback);
    return () => { window.removeEventListener('resize', callback); };
  },

  onInterval: (callback: () => void, interval: Ref<number>): Unsubscribe => {
    let id = startInterval(interval.value);
    let shouldBeReset = false;

    function resetMethod() {
      window.clearInterval(id);
      id = startInterval(interval.value);
    };

    function startInterval(intervalValue: number): number {
      return window.setInterval(() => {
        callback();
        if (shouldBeReset) {
          shouldBeReset = false;
          resetMethod();
        }
      }, intervalValue);
    };

    watch(interval, () => {
      shouldBeReset = true;
    });

    return () => { window.clearInterval(id); };
  },

  onKeyDown: (callback: (evt: KeyboardEvent) => void): Unsubscribe => {
    document.addEventListener('keydown', callback);
    return () => { document.removeEventListener('keydown', callback); };
  },

  /**
   * TODO I dont think this is leaky, but honestly, I should write some checks
   * to make sure :D
   * @param payload
   */
  onKeyHeldDown: (payload: {
    heldDownStart: (evt: KeyboardEvent) => void,
    heldDownEnd: (evt: KeyboardEvent) => void
  }): Unsubscribe => {
    const { heldDownStart, heldDownEnd } = payload;

    let keydownEventListener: (ev: KeyboardEvent) => void;
    let cancelHeldDownCheckCallback: (ev: KeyboardEvent) => void;

    // eslint-disable-next-line prefer-const
    keydownEventListener = (keydownEvt: KeyboardEvent) => {
      if (!keydownEvt.repeat) {
        return;
      }

      if (listeningInProgress.includes(keydownEvt.key)) {
        return;
      }

      listeningInProgress.push(keydownEvt.key);

      heldDownStart(keydownEvt);

      cancelHeldDownCheckCallback = (keyupEvt: KeyboardEvent) => {
        if (keyupEvt.key === keydownEvt.key) {
          heldDownEnd(keydownEvt);

          // do all cleanup
          listeningInProgress.splice(listeningInProgress.indexOf(keydownEvt.key), 1);
          document.removeEventListener('keyup', cancelHeldDownCheckCallback);
        }
      };
      document.addEventListener('keyup', cancelHeldDownCheckCallback);
    };
    document.addEventListener('keydown', keydownEventListener);

    return () => {
      document.removeEventListener('keydown', keydownEventListener);
      if (cancelHeldDownCheckCallback) {
        document.removeEventListener('keyup', cancelHeldDownCheckCallback);
      }
    };
  }
};

export type Unsubscribe = () => void;
