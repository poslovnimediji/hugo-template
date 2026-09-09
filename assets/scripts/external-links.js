// Marks links that point off-site so `a.external` styling in _typography.scss
// applies, and sets rel="noopener" on them.

function markExternalLinks () {
  Array.from(document.links).forEach((link) => {
    if (!link.hostname || link.hostname === window.location.hostname) {
      return
    }

    link.classList.add('external')

    const rel = link.rel ? link.rel.split(/\s+/) : []
    if (!rel.includes('noopener')) {
      rel.push('noopener')
      link.rel = rel.join(' ')
    }
  })
}

markExternalLinks()
