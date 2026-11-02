#!/bin/sh
#
# Runs its arguments with Dart Sass on PATH, then execs them.
#
# Hugo's `dartsass` transpiler shells out to a Dart Sass binary — Hugo's extended
# edition bundles LibSass only, so without this the build dies with
# "TOCSS-DART: ... You need to install Dart Sass" and exit code 2.
#
# The binary comes from the `sass-embedded` devDependency, which ships one native
# build per platform. npm does not link it into node_modules/.bin: the `sass` there
# is the pure-JS build, and `sass --embedded` is unavailable in pure JS mode, so
# Hugo cannot use it. Hence resolving the platform directory by glob.
#
# Prepending rather than appending is deliberate: builds then use the pinned
# version from the lockfile even on machines with their own Dart Sass installed.

for dir in ./node_modules/sass-embedded-*/dart-sass; do
  [ -x "$dir/sass" ] || continue
  PATH="$(cd "$dir" && pwd):$PATH"
  export PATH
  break
done

exec "$@"
