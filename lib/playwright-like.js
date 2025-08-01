async function typeInField(selector, text, options = {}) {
  const {
    delay = 50,           // Delay between keystrokes in ms
    timeout = 30000,      // Timeout for finding element
    clear = true,         // Clear field before typing
    focus = true          // Focus element before typing
  } = options

  // Find the element
  const element = document.querySelector(selector)
  if (!element) {
    throw new Error(`Element not found: ${selector}`)
  }

  // Focus the element if requested
  if (focus) {
    element.focus()
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  // Clear existing content if requested
  if (clear) {
    element.value = ''
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }

  // Type each character with proper events
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    
    // Dispatch keydown event
    const keydownEvent = new KeyboardEvent('keydown', {
      key: char,
      code: `Key${char.toUpperCase()}`,
      charCode: char.charCodeAt(0),
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
      cancelable: true
    })
    element.dispatchEvent(keydownEvent)

    // Update the value
    element.value += char

    // Dispatch input event (important for React/Vue apps)
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true
    })
    Object.defineProperty(inputEvent, 'target', {
      value: element,
      enumerable: true
    })
    element.dispatchEvent(inputEvent)

    // Dispatch keyup event
    const keyupEvent = new KeyboardEvent('keyup', {
      key: char,
      code: `Key${char.toUpperCase()}`,
      charCode: char.charCodeAt(0),
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
      cancelable: true
    })
    element.dispatchEvent(keyupEvent)

    // Wait for the specified delay
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // Dispatch final change event
  const changeEvent = new Event('change', {
    bubbles: true,
    cancelable: true
  })
  element.dispatchEvent(changeEvent)

  // Trigger blur event to ensure validation
  const blurEvent = new Event('blur', {
    bubbles: true,
    cancelable: true
  })
  element.dispatchEvent(blurEvent)

  return element
}

// Enhanced version with better React/Vue support
async function typeInFieldAdvanced(selector, text, options = {}) {
  const {
    delay = 50,
    timeout = 30000,
    clear = true,
    focus = true,
    triggerReactEvents = true
  } = options

  const element = document.querySelector(selector)
  if (!element) {
    throw new Error(`Element not found: ${selector}`)
  }

  if (focus) {
    element.focus()
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  if (clear) {
    // For React inputs, we need to trigger the setter
    if (triggerReactEvents) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set
      nativeInputValueSetter.call(element, '')
    } else {
      element.value = ''
    }
    
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }

  // Get current value to append to it
  let currentValue = element.value

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    currentValue += char

    // Dispatch keydown
    element.dispatchEvent(new KeyboardEvent('keydown', {
      key: char,
      code: getKeyCode(char),
      charCode: char.charCodeAt(0),
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
      cancelable: true
    }))

    // Set value using React-compatible method
    if (triggerReactEvents) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set
      nativeInputValueSetter.call(element, currentValue)
    } else {
      element.value = currentValue
    }

    // Dispatch input event with proper target
    const inputEvent = new Event('input', { bubbles: true })
    Object.defineProperty(inputEvent, 'target', {
      value: element,
      enumerable: true
    })
    element.dispatchEvent(inputEvent)

    // Dispatch keyup
    element.dispatchEvent(new KeyboardEvent('keyup', {
      key: char,
      code: getKeyCode(char),
      charCode: char.charCodeAt(0),
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
      cancelable: true
    }))

    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // Final events
  element.dispatchEvent(new Event('change', { bubbles: true }))
  
  return element
}

// Helper function to get proper key codes
function getKeyCode(char) {
  const keyMap = {
    ' ': 'Space',
    'Enter': 'Enter',
    'Tab': 'Tab',
    'Backspace': 'Backspace',
    'Delete': 'Delete',
    'Escape': 'Escape'
  }
  
  if (keyMap[char]) {
    return keyMap[char]
  }
  
  if (char.match(/[a-zA-Z]/)) {
    return `Key${char.toUpperCase()}`
  }
  
  if (char.match(/[0-9]/)) {
    return `Digit${char}`
  }
  
  return `Key${char.toUpperCase()}`
}

// Simple paste-based alternative function
async function pasteInField(selector, text, options = {}) {
  const {
    timeout = 30000,
    clear = true,
    focus = true,
    triggerReactEvents = true
  } = options

  const element = document.querySelector(selector)
  if (!element) {
    throw new Error(`Element not found: ${selector}`)
  }

  if (focus) {
    element.focus()
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  if (clear) {
    // Clear existing content
    if (triggerReactEvents) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set
      nativeInputValueSetter.call(element, '')
    } else {
      element.value = ''
    }
  }

  // Create clipboard data
  const clipboardData = new DataTransfer()
  clipboardData.setData('text/plain', text)

  // Dispatch paste events
  const pasteEvent = new ClipboardEvent('paste', {
    clipboardData: clipboardData,
    bubbles: true,
    cancelable: true
  })

  // Dispatch the paste event
  element.dispatchEvent(pasteEvent)

  // Set the value directly (in case paste event doesn't update it)
  const currentValue = clear ? '' : element.value
  const newValue = currentValue + text

  if (triggerReactEvents) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set
    nativeInputValueSetter.call(element, newValue)
  } else {
    element.value = newValue
  }

  // Dispatch input and change events
  const inputEvent = new Event('input', { bubbles: true })
  Object.defineProperty(inputEvent, 'target', {
    value: element,
    enumerable: true
  })
  element.dispatchEvent(inputEvent)

  const changeEvent = new Event('change', { bubbles: true })
  element.dispatchEvent(changeEvent)

  return element
}