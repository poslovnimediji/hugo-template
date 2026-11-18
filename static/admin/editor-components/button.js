/* global CMS */

// {{< button href="..." target="..." extraClass="..." >}}Text{{< /button >}}
// `target` and `extraClass` are optional and omitted from the output when empty.

CMS.registerEditorComponent({
  id: 'button',
  label: 'Button',
  fields: [
    { name: 'inner', label: 'Text', widget: 'string' },
    { name: 'href', label: 'Link', widget: 'string' },
    { name: 'target', label: 'Target', widget: 'string', required: false },
    { name: 'extraClass', label: 'Class', widget: 'string', required: false },
  ],
  pattern: /^{{< button href="([^"]*)"(?: target="([^"]*)")?(?: extraClass="([^"]*)")? >}}(.*?){{< \/button >}}$/,
  fromBlock (match) {
    return {
      href: match[1],
      target: match[2] || '',
      extraClass: match[3] || '',
      inner: match[4],
    }
  },
  toBlock (obj) {
    const target = obj.target ? ` target="${obj.target}"` : ''
    const extraClass = obj.extraClass ? ` extraClass="${obj.extraClass}"` : ''
    return `{{< button href="${obj.href}"${target}${extraClass} >}}${obj.inner}{{< /button >}}`
  },
  toPreview (obj) {
    return `<a href="${obj.href}" class="button ${obj.extraClass || ''}">${obj.inner}</a>`
  },
})
