const { createMachine } = XState

/**
 * A state machine that wraps a MutationObserver to watch for DOM changes.
 * When spawned as an actor, it sends `DOM.NODE_ADDED` events to the parent machine
 * whenever a new element is added to the document body.
 *
 * This allows other machines to react to DOM changes without implementing their own observers.
 */
const domObserverMachine = createMachine({
  id: 'domObserver',
  initial: 'observing',
  states: {
    observing: {
      invoke: {
        id: 'mutationObserver',
        // `src` is a function that returns the actor logic.
        // This is an invoked callback actor.
        src: (context, event) => (callback, onReceive) => {
          const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
              for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  // Send the event to the parent machine that spawned this actor
                  callback({ type: 'DOM.NODE_ADDED', payload: { node } })
                }
              }
            }
          });

          // Start observing the DOM
          observer.observe(document.body, {
            childList: true,
            subtree: true
          })

          // Return a cleanup function that XState will call when this actor is stopped
          return () => {
            observer.disconnect()
          };
        }
      }
    }
  }
})
