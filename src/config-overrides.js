// Overriding CreateReactApp settings, ref: https://github.com/arackaf/customize-cra

const {
  override,
  addDecoratorsLegacy,
  addLessLoader,
  useEslintRc,
  fixBabelImports,
  addBundleVisualizer,
  addWebpackAlias,
  adjustWorkbox
} = require("customize-cra");

const path = require("path");
const antdTheme = require('./src/theme.js')


module.exports = override(
  // enable legacy decorators babel plugin
  addDecoratorsLegacy(),

  // disable eslint in webpack
  useEslintRc(),
  fixBabelImports('import', {
    libraryName: 'antd', libraryDirectory: 'es', style: true
  }),

  // add webpack bundle visualizer if BUNDLE_VISUALIZE flag is enabled
  process.env.BUNDLE_VISUALIZE === 1 && addBundleVisualizer(),

  // add an alias for "ag-grid-react" imports
  addWebpackAlias({
    ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js")
  }),

  // adjust the underlying workbox
  adjustWorkbox(wb =>
    Object.assign(wb, {
      skipWaiting: true,
      exclude: (wb.exclude || []).concat("index.html")
    })
  ),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: antdTheme
  })
);
