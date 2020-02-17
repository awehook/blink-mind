/**
 * FontDetect - A simple library to detect if an internal font is present or an external font got loaded.
 * Updated by Ahmad Azimi: Add some functionality to support other languages, for example Farsi (Persian).
 *
 * TO USE:
 *     Include this file. If desired, you can load this file after the BODY.
 *
 *     After you load the fonts you want to test, call either of these methods:
 *
 *         // Checks that the font is loaded now.
 *         isLoaded = FontDetect.isFontLoaded(fontname);
 *
 *         // Polls for the font getting loaded and calls a callback when it does.
 *         FontDetect.onFontLoaded(fontname, callback [, {onFail: xxx, msInterval: yyy, msTimeout: zzz}]);
 *
 *     Note: For externally loaded fonts, you may have to wait for more than a second to get a reliable
 *     answer. Internal browser fonts can be detected immediately.
 *
 *         // Determines which font in the font stack is being used for a given element.
 *         fontname = FontDetect.whichFont(element); // DOM element, or can be a $(expression) if jQuery is loaded
 *
 * @author     Jennifer Simonds
 * @copyright  2014 Jennifer Simonds
 * @license    MIT License http://opensource.org/licenses/MIT
 */
const FontDetect = (function() {
  // The private parts
  var _isInitialized = false;
  var _aFallbackFonts = [
    'serif',
    'sans-serif',
    'monospace',
    'cursive',
    'fantasy'
  ];
  var span = null;
  var eLang = 'en';
  var aChars = {
    en: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    fa: 'ابپتجچحخدذرزسشصضططعغفقکگلمنوهی'
  };

  function _init() {
    if (_isInitialized) {
      return;
    }

    _isInitialized = true;

    var body = document.body;
    var firstChild = document.body.firstChild;

    var div = document.createElement('div');
    div.id = 'fontdetectHelper';
    span = document.createElement('span');
    span.innerText = aChars[eLang];
    div.appendChild(span);

    body.insertBefore(div, firstChild);

    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.top = '-200px';
    div.style.left = '-100000px';
    div.style.width = '100000px';
    div.style.height = '200px';
    div.style.fontSize = '100px';
  }

  function _getCss(p_element, p_cssStyle) {
    // First check if p_element is a DOM element.
    if (p_element instanceof Element) {
      return window.getComputedStyle(p_element).getPropertyValue(p_cssStyle);
    }

    // If jQuery's loaded, use that.
    // else if (window.jQuery) {
    //   return $(p_element).css(p_cssStyle);
    // } // p_element might be a jQuery expression & caller was expecting jQuery to be loaded,
    // or else some other parameter error...
    else {
      return '';
    }
  }

  // The public interface
  return {
    /**
     * Polls 10 times/second until a font gets loaded or until it times out. (Default = 2 secs) It
     * calls a callback on load, & optionally calls another function if it times out without loading.
     *
     * NOTE: You must specify at least one callback - for success or failure.
     *
     * @param string		The font name to check for.
     * @param function		The function to call if it gets loaded within the timeout period.
     * @param options		An optional object with named parameters:
     *     @param eLang        Which font language to use. Default = 'en'.
     *     @param onFail       The function to call if the font doesn't load within the timeout period.
     *     @param msInterval   How many milliseconds for the polling interval. Default = 100.
     *     @param msTimeout    How many milliseconds until we time out & call onFail. Default = 2000.
     */
    onFontLoaded: function(p_cssFontName, p_onLoad, p_onFail, p_options) {
      if (!p_cssFontName) {
        return;
      }

      // Our hashtable of optional params.
      var msInterval =
        p_options && p_options.msInterval ? p_options.msInterval : 100;
      var msTimeout =
        p_options && p_options.msTimeout ? p_options.msTimeout : 2000;
      // Since the language to use is an enum, check if the language they pass in is defined in aChars.
      eLang =
        p_options && p_options.eLang && p_options.eLang in aChars
          ? p_options.eLang
          : 'en';

      if (!p_onLoad && !p_onFail) {
        // Caller must specify at least one callback.
        return;
      }

      if (!_isInitialized) {
        _init();
      }

      if (this.isFontLoaded(p_cssFontName)) {
        // It's already here, so no need to poll.
        if (p_onLoad) {
          p_onLoad(p_cssFontName);
        }
        return;
      }

      // At this point we know the font hasn't loaded yet. Add it to the list of fonts to monitor.

      // Set up an interval using msInterval. The callback calls isFontLoaded(), & if true
      // it closes the interval & calls p_onLoad, else if the current time has timed out
      // it closes the interval & calls onFail if there is one.
      var outerThis = this;
      var utStart = new Date().getTime();
      var idInterval = setInterval(function() {
        if (outerThis.isFontLoaded(p_cssFontName)) {
          // It's now loaded.
          clearInterval(idInterval);
          p_onLoad(p_cssFontName);
          return;
        } else {
          // Still not loaded.
          var utNow = new Date().getTime();
          if (utNow - utStart > msTimeout) {
            clearInterval(idInterval);
            if (p_onFail) {
              p_onFail(p_cssFontName);
            }
          }
        }
      }, msInterval);
    },

    /**
     * Determines if a font has gotten loaded.
     *
     * @param string		The font name to check for.
     *
     * @returns bool		true if it's loaded, else false if the browser had to use a fallback font.
     */
    isFontLoaded: function(p_cssFontName) {
      var wThisFont = 0;
      var wPrevFont = 0;

      if (!_isInitialized) {
        _init();
      }

      for (var ix = 0; ix < _aFallbackFonts.length; ++ix) {
        span.style.fontFamily =
          '"' + p_cssFontName + '",' + _aFallbackFonts[ix];
        wThisFont = span.offsetWidth;
        if (ix > 0 && wThisFont != wPrevFont) {
          // This iteration's font was different than the previous iteration's font, so it must
          //  have fallen back on a generic font. So our font must not exist.
          return false;
        }

        wPrevFont = wThisFont;
      }

      // The widths were all the same, therefore the browser must have rendered the text in the same
      // font every time. So unless all the generic fonts are identical widths (highly unlikely), it
      // couldn't have fallen back to a generic font. It's our font.
      return true;
    },

    /**
     * Determines which font is being used for a given element.
     *
     * @param string/object		The element to examine. If it's a string, it's a jQuery selector. If it's
     *							an object, it's taken as a DOM element.
     *
     * @returns string			The name of the font that's being used - either one of the fonts
     *							listed in the element's font-family css value, or null.
     */
    whichFont: function(p_element) {
      var sStack = _getCss(p_element, 'font-family');
      var aStack = sStack.split(',');

      var sFont = aStack.shift();
      while (sFont) {
        // Trim the fontname of any spaces or quotes.
        sFont = sFont.replace(/^\s*['"]?\s*([^'"]*)\s*['"]?\s*$/, '$1');

        // If it's a default fallback font, trap it here.
        for (var ix = 0; ix < _aFallbackFonts.length; ix++) {
          if (sFont == _aFallbackFonts[ix]) {
            return sFont;
          }
        }

        // It must be a custom font name. Check it.
        if (this.isFontLoaded(sFont)) {
          return sFont;
        }

        sFont = aStack.shift();
      }

      return null;
    }
  };
})();

export { FontDetect };
