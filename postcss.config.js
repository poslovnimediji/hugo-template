const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    purgecss({
      content: ['./layouts/**/*.html', './assets/scripts/*.js'],
      safelist: [
        // add classes found only in js
      ],
    }),
  ],
}
