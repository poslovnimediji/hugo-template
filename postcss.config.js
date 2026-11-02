import purgeCSSPlugin from '@fullhuman/postcss-purgecss'
import autoprefixer from 'autoprefixer'

// Markdown is mostly prose, and PurgeCSS's default extractor treats every word it
// finds as a possible class name. Pointing it at content/ with the default
// extractor would therefore keep almost everything and quietly defeat the purge.
// Instead, pull only the places a class name can legitimately appear in content:
// a class="..." attribute in raw HTML, or an extraClass="..." shortcode argument.
const contentClassAttributes = /(?:class|extraClass)\s*=\s*["']([^"']+)["']/g

const markdownExtractor = (content) => {
  const found = []

  for (const [, classList] of content.matchAll(contentClassAttributes)) {
    found.push(...classList.split(/\s+/).filter(Boolean))
  }

  return found
}

export default {
  plugins: [
    autoprefixer(),
    purgeCSSPlugin({
      content: [
        './layouts/*.html',
        './layouts/**/*.html',
        './assets/scripts/*.js',
        './assets/scripts/**/*.js',
        './content/**/*.md',
        './data/**/*.json',
        './themes/**/layouts/*.html',
        './themes/**/layouts/**/*.html',
        './themes/**/assets/scripts/*.js',
        './themes/**/assets/scripts/**/*.js',
      ],
      extractors: [
        {
          extractor: markdownExtractor,
          extensions: ['md', 'json'],
        },
      ],
      safelist: [
        // Classes that only ever appear in JS string literals, or that a CMS
        // editor might type into a field this extractor cannot see.
      ],
    }),
  ],
}
