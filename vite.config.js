// Custom plugin to minify CSS strings in JavaScript
function minifyCSSStrings() {
  return {
    name: 'minify-css-strings',
    generateBundle(options, bundle) {
      // Process each file in the bundle
      Object.keys(bundle).forEach(fileName => {
        const file = bundle[fileName];
        if (file.type === 'chunk' && fileName.endsWith('.js')) {
          // Find and minify CSS strings within template literals and string assignments
          file.code = file.code.replace(
            /(textContent\s*=\s*["`'])([\s\S]*?)(["`'])/g,
            (match, prefix, cssContent, suffix) => {
              // Check if this looks like CSS content
              if (cssContent.includes('{') && cssContent.includes('}')) {
                // Minify the CSS
                const minifiedCSS = cssContent
                  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                  .replace(/\s*\n\s*/g, '') // Remove newlines and indentation
                  .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
                  .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
                  .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
                  .replace(/\s*:\s*/g, ':') // Remove spaces around colons
                  .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                  .trim(); // Remove leading/trailing whitespace
                
                return prefix + minifiedCSS + suffix;
              }
              return match;
            }
          );
        }
      });
    }
  };
}

// Custom plugin to process HTML file and fix script references
function processHtml() {
  return {
    name: 'process-html',
    async generateBundle(options, bundle) {
      // Read the original index.html
      const fs = require('fs');
      const path = require('path');
      const { minify } = require('html-minifier-terser');
      
      let htmlContent = fs.readFileSync('index.html', 'utf-8');
      
      // Replace the development script with production script
      htmlContent = htmlContent.replace(
        /<!-- development -->\s*<script type="module" src="\.\/src\/creditera-bar\.js"><\/script>/,
        ''
      );
      
      htmlContent = htmlContent.replace(
        /<!-- production -->\s*<!-- <script src="\.\/dist\/creditera-bar\.js"><\/script> -->/,
        '<!-- production -->\n    <script src="./creditera-bar.js"></script>'
      );
      
      // Replace the development CSS with production CSS
      htmlContent = htmlContent.replace(
        /<!-- development -->\s*<link rel="stylesheet" href="\.\/styles\.css">/,
        ''
      );
      
      htmlContent = htmlContent.replace(
        /<!-- production -->\s*<!-- <link rel="stylesheet" href="\.\/styles\.css"> -->/,
        '<!-- production -->\n    <link rel="stylesheet" href="./styles.css">'
      );
      
      // Minify HTML
      const minifiedHtml = await minify(htmlContent, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: false, // Disabled to preserve CSS nesting syntax
        minifyJS: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeOptionalTags: false, // Keep optional tags for better compatibility
        caseSensitive: false,
        keepClosingSlash: false,
        quoteCharacter: '"',
        sortAttributes: true,
        sortClassName: true
      });
      
      // Add the minified HTML file to the bundle
      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        source: minifiedHtml
      });
    }
  };
}

// Custom plugin to process CSS file
function processCss() {
  return {
    name: 'process-css',
    async generateBundle(options, bundle) {
      const fs = require('fs');
      const { transform } = require('lightningcss');
      
      // Read the CSS file
      const cssContent = fs.readFileSync('styles.css', 'utf-8');
      
      // Transform and minify CSS with Lightning CSS
      const result = transform({
        filename: 'styles.css',
        code: Buffer.from(cssContent),
        minify: true,
        targets: {
          // Support modern browsers that support CSS nesting
          chrome: 112 << 16,
          firefox: 117 << 16,
          safari: 16 << 16 | 5 << 8,
        }
      });
      
      // Add the minified CSS file to the bundle
      this.emitFile({
        type: 'asset',
        fileName: 'styles.css',
        source: result.code.toString()
      });
    }
  };
}

export default {
  plugins: [minifyCSSStrings(), processHtml(), processCss()],
  build: {
    lib: {
      entry: 'src/creditera-bar.js',
      name: 'EraCalc',
      formats: ['iife'],
      fileName: () => 'creditera-bar.js',
    },
    assetsInlineLimit: 100000,
    minify: 'terser',
    terserOptions: {
      compress: {
        // Enable string literal minification
        unsafe_comps: true,
        // Remove unnecessary whitespace from strings
        inline: 2,
        // Compress template literals and CSS strings
        reduce_vars: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        drop_console: false,
        // Specifically target CSS-like strings
        collapse_vars: true,
        // Enable unsafe optimizations for better compression
        unsafe: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
      },
      mangle: {
        // Keep function names for web components
        keep_fnames: false,
      },
      format: {
        // Remove comments and unnecessary whitespace
        comments: false,
        // Compress CSS-like strings
        inline_script: true,
      }
    }
  }
};
