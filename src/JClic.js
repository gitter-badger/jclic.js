//    File    : JClic.js  
//    Created : 01/04/2015  
//    By      : Francesc Busquets  
//
//    JClic.js  
//    HTML5 player of [JClic](http://clic.xtec.cat) activities  
//    https://github.com/projectestac/jclic.js  
//    (c) 2000-2015 Catalan Educational Telematic Network (XTEC)  
//    This program is free software: you can redistribute it and/or modify it under the terms of
//    the GNU General Public License as published by the Free Software Foundation, version. This
//    program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
//    even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
//    General Public License for more details. You should have received a copy of the GNU General
//    Public License along with this program. If not, see [http://www.gnu.org/licenses/].  

define([
  "jquery",
  "./JClicPlayer",
  "./Deps"
], function ($, JClicPlayer, deps) {
  
  // Declaration of JSDoc external objects:

  /**
   * A jQuery object
   * @external jQuery
   * @see {@link http://api.jquery.com/jQuery/}
   */

  /**
   * The class used for manipulating the layout and presentation of HTML image elements.
   * @external HTMLImageElement
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement
   */
  
  /**
   * A JSZip object
   * @external JSZip
   * @see {@link https://stuk.github.io/jszip}
   */
  
  /**
   * @typedef {object} HTMLElement 
   */
  
  /** 
   * This is the main JClic method
   * 
   * Executes on `document.ready()`.
   * 
   * The method iterates over all `div` objects with `JClic` class and creates a {@link JClicPlayer}
   * within them. Each player loads the JClic project file specified in the `data-project` attribute of
   * the `div` tag.
   * 
   * The `div` elements must preferabily be empty. Inner content may become overlapped by objects
   * created by the JClic player.
   * 
   * @module JClic
   * @example
   * // Creates a JClic div and loads "my-project.jclic" on it
   * <div class ="JClic" data-project="my-project.jclic"></div>
   */
  // Execute on document ready
  $(function () {

    // If defined, load the global variable `JClicDataOptions`
    var options = (typeof JClicDataOptions === 'undefined' ? {} : JClicDataOptions);

    if (!options.noInit) {
      // If defined, load the global variable `JClicDataProject`
      var projectName = (typeof JClicDataProject === 'undefined' ? null : JClicDataProject);

      // Search DOM elements with class "JClic"
      var $JClicDivs = $('div.JClic');

      // Iterate over all JClic DOM elements, initializing players
      $JClicDivs.each(function () {
        var $div = $(this);

        var prj = $div.data('project');
        if (prj)
          projectName = prj;

        var opt = $div.data('options');
        if (opt)
          options = $.extend(Object.create(options), opt);

        var player = new JClicPlayer($div, options);
        if (projectName)
          player.load(projectName);

        $(window).resize(function () {
          if (player.skin)
            player.skin.doLayout();
        });
      });
    }
  });
  return 'JClic ready!';
});

// Testing function for npm
// TODO: Remove npm testing function
if (typeof exports !== "undefined") {
  exports.printMsg = function () {
    console.log("This is a message from JClic");
  };
}

/* global exports, JClicDataProject, JClicDataOptions */
