const manifest = chrome.runtime.getManifest()
const versionLabel = `[SkyDropX Tweaks ${manifest.version}]`

// This script runs when visiting the specified URL
logger(`Extension loaded on: ${window.location.href}`)

detectQuoteForm()

// Example: Add a floating notification
function detectQuoteForm() {
  let observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!node.querySelector) return

        logger({ node }, node.nodeName)

        const createForm = node.querySelector('#drawer-form')
        if (createForm) {
          logger({ found: createForm })
          // [0,1,2,3,4,5].forEach(() => handleFormTweaks(createForm))
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