/*! getEmPixels  | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */
// https://github.com/tysonmatanich/getEmPixels/blob/master/getEmPixels.js
// [Cool Demo]: http://matanich.com/examples/get-em-pixels/

/** USAGE:
 *  getEmPixels(htmlElementReference)   // Returns the em pixels at that element
 *  getEmPixels()                       // Returns the em pixels at the body
 * */
export var getEmPixels: (element?: any) => number = (function (document, documentElement) {
    // Enable strict mode
    "use strict";

    // Form the style on the fly to result in smaller minified file
    var important = "!important;";
    var style = "position:absolute" + important + "visibility:hidden" + important + "width:1em" + important + "font-size:1em" + important + "padding:0" + important;

    return function (element?: any): number {

        var extraBody;

        if (!element) {
            // Emulate the documentElement to get rem value (documentElement does not work in IE6-7)
            element = extraBody = document.createElement("body");
            extraBody.style.cssText = "font-size:1em" + important;
            documentElement.insertBefore(extraBody, document.body);
        }

        // Create and style a test element
        var testElement = document.createElement("i");
        testElement.style.cssText = style;
        element.appendChild(testElement);

        // Get the client width of the test element
        var value = testElement.clientWidth;

        if (extraBody) {
            // Remove the extra body element
            documentElement.removeChild(extraBody);
        }
        else {
            // Remove the test element
            element.removeChild(testElement);
        }

        // Return the em value in pixels
        return value;
    };
}(document, document.documentElement));
