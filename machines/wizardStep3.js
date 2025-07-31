const { createMachine, assign } = XState

const wizardStep3Machine = createMachine({
  id: 'wizardStep3',
  initial: 'waitingForForm',
  states: {
    waitingForForm: {
      on: {
        'DOM.NODE_ADDED': {
          target: 'handlingInsurance',
          cond: (context, event) => event.payload.node.querySelector('#pendo-step3-international-section')
        }
      }
    },
    handlingInsurance: {
      on: {
        'DOM.NODE_ADDED': {
          target: 'done',
          cond: (context, event) => {
            const amountSpan = event.payload.node.querySelector('#ow-count-container')
            if (!amountSpan) {
              return false
            }
            if (!amountSpan.textContent.match(/0\.00/)) {
              document.querySelector('#ow_s3_sos').click()
            }
            return true
          }
        }
      }
    },
    done: {
      type: 'final'
    }
  }
});
