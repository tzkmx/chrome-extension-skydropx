const manifest = chrome.runtime.getManifest()
const versionLabel = `[SkyDropX Tweaks ${manifest.version}]`

// This script runs when visiting the specified URL
logger(`Extension loaded on: ${window.location.href}`)

detectQuoteForm()
// https://app.skydropx.com/quotations
detectInitForm()
// https://app.skydropx.com/order_wizard/addresses
detectStep1Wizard()

// https://app.skydropx.com/order_wizard/4euJeLn5FDtNL1P1WGhoEPNa/edit/choosen_rate
// step2Wizard - packaging

// https://app.skydropx.com/order_wizard/KrCQNekBAgV2FSwf7RTSVTUs/edit/choosen_rate
detectStep3form()

function detectInitForm() {
  // #pendo-quotation-section
  let observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!node.querySelector) return

        const quoteForm = node.querySelector('#pendo-quotation-section')
        if (quoteForm) {
          logger({ found: quoteForm })
          wait(2000).then(() => handleDimensionsEnabler(quoteForm))
        }
      })
    })
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function handleDimensionsEnabler(form) {
  waitForElement('input[type="number"][name="length"]')
    .then(it => it.value = 36)
  waitForElement('input[type="number"][name="height"]')
    .then(it => it.value = 20)
  waitForElement('input[type="number"][name="width"]')
    .then(it => it.value = 5)
  waitForElement('input[type="number"][name="weigth"]')
    .then(it => it.value = 1)
}

function detectStep1Wizard() {
  // #pendo-step1-section
  let observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!node.querySelector) return

        const senderForm = node.querySelector('#pendo-step1-section')
        if (senderForm) {
          logger({ found: senderForm })
          wait(2000).then(() => detectStep1SelectedAddress())
        }
      })
    })
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function detectStep1SelectedAddress() {
  // #pendo-step1-section
  let observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!node.querySelector) return

        if (node.textContent.match(/Actualizar libreta/)) {
          handleStep1helper()
        }
      })
    })
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}


function handleStep1helper() {
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

function detectStep3form() {
  let observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!node.querySelector) return

        const senderForm = node.querySelector('#pendo-step3-international-section')
        if (senderForm) {
          logger({ found: senderForm })
          wait(2000).then(() => handleStep3helper(senderForm))
        }
      })
    })
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function handleStep3helper() {
  let observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!node.querySelector) return
        const amountSpan = node.querySelector('#ow-count-container')
        if (!amountSpan) {
          logger('not found sos proteccion')
          return
        }
        if (!amountSpan.textContent.match(/0\.00/)) {
          document.querySelector('#ow_s3_sos').click()
        }
      })
    })
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

// Example: Add a floating notification
function detectQuoteForm() {
  let observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!node.querySelector) return

        
        if(!['SCRIPT', 'SVG', 'svg'].includes(node.nodeName)) {
          const { attributes, id, type, value, checked, nodeName, textContent } = node
          logger(node.nodeName, { attributes, id, type, value, checked, nodeName, textContent }, node.textContent.trim())
        }
        

        const createForm = node.querySelector('#drawer-form')
        if (createForm) {
          logger({ found: createForm })
          wait(2000).then(() => handleFormTweaks(createForm))
        }
        // debug('Not found drawer form') 
      })
    })
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function handleFormTweaks(form) {
  const xpr = document.evaluate('//*[@id="billing_component"]/div[1]/div[2]/span[1]', form)
  debug({ xpathResult: xpr })

  const maybeLabelCost = xpr.iterateNext()
  debug({ maybeLabelCost })

  if (maybeLabelCost) {
    const toggle = document.querySelector('#package_form_section .switch-wrapper > label')
    waitForElement('#package_form_section .switch-wrapper > label')
      .then(toggle => {
        debug({ toggle })
        toggle.click()
        logger('Verify not incurring extra costs')
      })
      .catch(console.warn)
  }
  logger('SHOULD NOT incurr in extra costs')
}


// library functions

function logger(...what) {
  console.log(versionLabel, ...what)
}

function debug(...msg) {
  console.debug(versionLabel, ...msg)
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function waitForElement(selector, options = {}) {
  const { timeout = 10000, root = document.body } = options
  return new Promise((resolve, reject) => {
    // Check if element already exists
    const existing = root.querySelector(selector)
    if (existing) {
      resolve(existing)
      return
    }

    let observer

    const timeoutId = setTimeout(() => {
      observer?.disconnect()
      reject(new Error(`Element "${selector}" not found within ${timeout}ms`))
    }, timeout)

    observer = new MutationObserver(() => {
      const element = root.querySelector(selector)
      if (element) {
        observer?.disconnect()
        clearTimeout(timeoutId)
        resolve(element)
      }
    })    

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

function waitForElementByXPath(xpath, options = {}) {
  const { timeout = 10000, root = document.body } = options

  return new Promise((resolve, reject) => {
    const existing = document.evaluate(xpath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    if (existing) {
      resolve(existing)
      return
    }

    let observer

    const timeoutId = setTimeout(() => {
      observer?.disconnect()
      reject(new Error(`Element with XPath "${xpath}" not found within ${timeout}ms`))
    }, timeout)

    observer = new MutationObserver(() => {
      const element = document.evaluate(xpath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (element) {
        observer.disconnect();
        clearTimeout(timeoutId);
        resolve(element);
      }
    })

    observer.observe(root, {
      childList: true,
      subtree: true
    })
  })
}