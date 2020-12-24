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

  onInterval: (callback: () => void, interval: number): Unsubscribe => {
    const id = window.setInterval(callback, interval);
    return () => { window.clearInterval(id); };
  },

  onKeyDown: (callback: (evt: KeyboardEvent) => void): Unsubscribe => {
    document.addEventListener('keydown', callback);
    return () => { document.removeEventListener('keydown', callback); };
  },

  onKeyHeldDown: (payload: {
    heldDownStart: (evt: KeyboardEvent) => void;
    heldDownEnd: (evt: KeyboardEvent) => void;
    keyHeldDownInterval: number;
  }): Unsubscribe => {
    const { heldDownStart, heldDownEnd, keyHeldDownInterval } = payload;

    let heldDownMetIntervalId: number;
    let keydownEventListener: (ev: KeyboardEvent) => void;
    let cancelHeldDownCheckCallback: (ev: KeyboardEvent) => void;

    // eslint-disable-next-line prefer-const
    keydownEventListener = (keydownEvt: KeyboardEvent) => {
      console.log('held down start');
      heldDownStart(keydownEvt);
      heldDownMetIntervalId = window.setInterval(() => {
        console.log('held down continues');
      }, keyHeldDownInterval);

      cancelHeldDownCheckCallback = (keyupEvt: KeyboardEvent) => {
        if (keyupEvt.key === keydownEvt.key) {
          console.log('held down end');
          heldDownEnd(keydownEvt);
        }
      };
      document.addEventListener('keyup', cancelHeldDownCheckCallback);
    };
    document.addEventListener('keydown', keydownEventListener);

    return () => {
      document.removeEventListener('keydown', keydownEventListener);
      if (heldDownMetIntervalId) {
        window.clearInterval(heldDownMetIntervalId);
      }
      if (cancelHeldDownCheckCallback) {
        document.removeEventListener('keyup', cancelHeldDownCheckCallback);
      }
    };
  }
};

export type Unsubscribe = () => void;
