module.exports = function info() {
  console.log('run the following to set up eslint:')
  console.log(`
  (
    export PKG=eslint-config-airbnb;
    npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add -D "$PKG@latest"
  )
  `)
};
