const processElement = (el) => {
  // Since the editor's "text background-color" plugin works only with "<mark>",
  // need to replace tags
  if (el.style?.backgroundColor && el.nodeName !== "MARK") {
    const mark = document.createElement('mark')
    for (const attr of el.attributes) {
      mark.setAttributeNS(null, attr.name, attr.value)
    }
    mark.innerHTML = el.innerHTML
    el.replaceWith(mark)
  }

  let children = Array.from(el.childNodes || [])
    .map(processElement)
    .flat()

  return children
}

export const processHtmlForEditor = (html) => {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  processElement(parsed.body)
  const outer = parsed.body.innerHTML;
  const splittedTextArr = outer.split(/(\{.*?\})/g).filter(Boolean)

  // Replace {properties.propName} with <span data-type="mention">propName</span>
  const result = splittedTextArr.map(content => {
    if (/^\{.*?\}/.test(content)) {
      const displayedText = content.replace(/{|}/g, '').split('.')[1]
      return `<span data-type="mention" class="mention" data-id="${displayedText}">${displayedText}</span>`
    }
    return content
  }).join('')

  return result
}

const replaceProperties = (el) => {
  // Replace <span data-type="mention">propName</span> with {properties.propName}
  if (el.getAttribute && el.getAttribute('data-type') === 'mention') {
    const textNode = document.createTextNode(`{properties.${el.innerHTML}}`)
    el.replaceWith(textNode)
  }
  let children = Array.from(el.childNodes || [])
  .map(replaceProperties)
  .flat()

  return children
}

export const prepareHtmlForSave = (html) => {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  replaceProperties(parsed.body)
  const outer = parsed.body.innerHTML;
  return outer;
}