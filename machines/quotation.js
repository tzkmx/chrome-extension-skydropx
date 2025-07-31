const { createMachine, assign } = XState

const quotationMachine = createMachine({
  id: 'quotation',
  initial: 'waitingForForm',
  states: {
    waitingForForm: {
      on: {
        'DOM.NODE_ADDED': {
          target: 'fillingDimensions',
          cond: (context, event) => event.payload.node.querySelector('#pendo-quotation-section')
        }
      }
    },
    fillingDimensions: {
      invoke: {
        src: (context, event) => {
          waitForElement('input[type="number"][name="length"]')
            .then(it => it.value = 36)
          waitForElement('input[type="number"][name="height"]')
            .then(it => it.value = 20)
          waitForElement('input[type="number"][name="width"]')
            .then(it => it.value = 5)
          waitForElement('input[type="number"][name="weigth"]')
            .then(it => it.value = 1)
        }
      }
    }
  }
});
