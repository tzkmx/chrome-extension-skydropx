const { createMachine, assign } = XState

const wizardStep1Machine = createMachine({
  id: 'wizardStep1',
  initial: 'waitingForForm',
  states: {
    waitingForForm: {
      on: {
        'DOM.NODE_ADDED': {
          target: 'waitingForAddress',
          cond: (context, event) => event.payload.node.querySelector('#pendo-step1-section')
        }
      }
    },
    waitingForAddress: {
      on: {
        'DOM.NODE_ADDED': {
          target: 'fillingEmail',
          cond: (context, event) => event.payload.node.textContent.match(/Actualizar libreta/)
        }
      }
    },
    fillingEmail: {
      invoke: {
        src: (context, event) => {
          wait(1200)
            .then(() => {
              waitForElement('input[type="text"][name="remitent.email"]')
                .then(origin => {
                  return origin.value
                })
                .then(senderEmail => {
                  logger(`Sender Email: ${senderEmail}`)
                  waitForElement('input[type="text"][name="destinatary.email"]')
                    .then(() => {
                      typeInField('input[type="text"][name="destinatary.email"]', senderEmail, {
                        delay: 30,
                        clear: false,
                        focus: true
                      })
                    })
                })
            })
        }
      }
    }
  }
});
