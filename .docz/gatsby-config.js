const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Rcm Calendar',
    description: 'react calendar',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: true,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root: '/Users/zhengyima/Desktop/dev/rcm-calendar/.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Rcm Calendar',
        description: 'react calendar',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/zhengyima/Desktop/dev/rcm-calendar',
          templates:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/node_modules/docz-core/dist/templates',
          docz: '/Users/zhengyima/Desktop/dev/rcm-calendar/.docz',
          cache: '/Users/zhengyima/Desktop/dev/rcm-calendar/.docz/.cache',
          app: '/Users/zhengyima/Desktop/dev/rcm-calendar/.docz/app',
          appPackageJson:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/package.json',
          appTsConfig:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/tsconfig.json',
          gatsbyConfig:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/gatsby-config.js',
          gatsbyBrowser:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/gatsby-browser.js',
          gatsbyNode:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/gatsby-node.js',
          gatsbySSR: '/Users/zhengyima/Desktop/dev/rcm-calendar/gatsby-ssr.js',
          importsJs:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/.docz/app/imports.js',
          rootJs:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/.docz/app/root.jsx',
          indexJs:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/.docz/app/index.jsx',
          indexHtml:
            '/Users/zhengyima/Desktop/dev/rcm-calendar/.docz/app/index.html',
          db: '/Users/zhengyima/Desktop/dev/rcm-calendar/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
