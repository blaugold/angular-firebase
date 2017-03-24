/**
 * Created by gabrielterwesten on 24/03/2017.
 */
const pkg = require('./package.json');
const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies)
];

export default {
  entry: './release/angular-firebase.js',
  external,
  targets: [
    {
      dest: getLocalDest(pkg.main),
      format: 'umd',
      moduleName: pkg.name,
      sourceMap: true
    },
    {
      dest: getLocalDest(pkg.module),
      format: 'es',
      sourceMap: true
    }
  ]
}

function getLocalDest(releaseDest) {
  return `./release/${releaseDest}`
}