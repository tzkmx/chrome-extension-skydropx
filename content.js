const { interpret } = XState
const manifest = chrome.runtime.getManifest()
const versionLabel = `[SkyDropX Tweaks ${manifest.version}]`

// This script runs when visiting the specified URL
logger(`Extension loaded on: ${window.location.href}`)

const domObserverService = interpret(domObserverMachine).start()

const router = {
  '/quotations': quotationMachine,
  '/order_wizard/addresses': wizardStep1Machine,
  '/order_wizard/new': wizardStep1Machine, // Assuming new wizard also uses step 1 logic
  '/edit/choosen_rate': wizardStep3Machine, // A bit generic, might need refinement
}

let activeMachineService = null

// Function to determine and start the correct machine
function route() {
  const path = window.location.pathname

  for (const route in router) {
    if (path.includes(route)) {
      const machine = router[route]
      if (activeMachineService && activeMachineService.machine !== machine) {
        activeMachineService.stop()
      }
      activeMachineService = interpret(machine).start()
      
      // Forward events from the DOM observer to the active machine
      domObserverService.onEvent((event) => {
        activeMachineService.send(event)
      })

      logger(`Starting machine for route: ${route}`)
      return
    }
  }

  logger('No machine found for the current route.')
}

// Initial routing
route()

// Re-route on URL changes (for single-page applications)
let lastUrl = location.href
new MutationObserver(() => {
  const url = location.href
  if (url !== lastUrl) {
    lastUrl = url
    route()
  }
}).observe(document, { subtree: true, childList: true })


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
      const element = document.evaluate(xpath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
      if (element) {
        observer.disconnect()
        clearTimeout(timeoutId)
        resolve(element)
      }
    })

    observer.observe(root, {
      childList: true,
      subtree: true
    })
  })
}
