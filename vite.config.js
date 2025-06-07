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

export default {
  plugins: [minifyCSSStrings()],
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
