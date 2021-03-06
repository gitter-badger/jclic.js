//    File    : MemoryGame.js  
//    Created : 04/06/2015  
//    By      : fbusquet  
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
  "../../Activity",
  "../../boxes/ActiveBoxGrid",
  "../../boxes/BoxBag",
  "../../boxes/BoxConnector",
  "../../AWT",
  "../../shapers/Rectangular"
], function ($, Activity, ActiveBoxGrid, BoxBag, BoxConnector, AWT, Rectangular) {

  /**
   * This class of {@link Activity} shows a panel with duplicate {@link ActiveBox} objects initially
   * hidden and scrambled. To complete the activity, all object pairs must be found. Only two objects
   * are revealed in every move, so the user must remember the content of each cell.<br>
   * The cell pairs can have identical content, defined in the `primary` {@link ActiveBagContent} of
   * the activity, or two different contents. In this case, the `secondary` bag elements will have
   * content related to each `primary` element.
   * @exports MemoryGame
   * @class
   * @extends Activity
   * @param {JClicProject} project - The {@link JClicProject} to which this activity belongs
   */
  var MemoryGame = function (project) {
    Activity.call(this, project);
  };

  MemoryGame.prototype = {
    constructor: MemoryGame,
    /**
     * 
     * Retrieves the minimum number of actions needed to solve this activity.
     * @returns {number}
     */
    getMinNumActions: function () {
      return this.abc.primary.getNumCells();
    },
    /**
     * 
     * Whether or not the activity uses random to scramble internal components
     * @returns {boolean}
     */
    hasRandom: function () {
      return true;
    },
    /**
     * 
     * When `true`, the activity mut always be scrambled
     * @returns {boolean}
     */
    shuffleAlways: function () {
      return true;
    }
  };

  // InformationScreen extends Activity
  MemoryGame.prototype = $.extend(Object.create(Activity.prototype), MemoryGame.prototype);

  /**
   * The {@link Activity.Panel} where memory games are played.
   * @class
   * @extends Activity.Panel
   * @param {Activity} act - The {@link Activity} to wich this Panel belongs
   * @param {JClicPlayer} ps - Any object implementing the methods defined in the 
   * [PlayStation](http://projectestac.github.io/jclic/apidoc/edu/xtec/jclic/PlayStation.html)
   * Java interface.
   * @param {external:jQuery=} $div - The jQuery DOM element where this Panel will deploy
   */
  MemoryGame.Panel = function (act, ps, $div) {
    Activity.Panel.call(this, act, ps, $div);
  };

  var ActPanelAncestor = Activity.Panel.prototype;

  MemoryGame.Panel.prototype = {
    constructor: MemoryGame.Panel,
    /**
     * The {@link ActiveBoxBag} containing the information to be displayed.
     * @type {ActiveBoxBag} */
    bg: null,
    /**
     * The {@link BoxConnector} used to reveal pairs of cells
     * @type {BoxConnector} */
    bc: null,
    /**
     * List of mouse, touch and keyboard events intercepted by this panel
     * @type {string[]} */
    events: ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove', 'touchcancel'],
    /**
     * 
     * Miscellaneous cleaning operations
     */
    clear: function () {
      if (this.bg) {
        this.bg.end();
        this.bg = null;
      }
    },
    /**
     * 
     * Prepares the visual components of the activity
     */
    buildVisualComponents: function () {
      if (this.firstRun)
        ActPanelAncestor.buildVisualComponents.call(this);

      this.clear();

      var abcA = this.act.abc['primary'];
      var abcB = this.act.abc['secondary'];

      if (abcA) {

        if (abcA.imgName)
          abcA.setImgContent(this.act.project.mediaBag, null, false);
        if (abcB && abcB.imgName)
          abcB.setImgContent(this.act.project.mediaBag, null, false);


        if (this.act.acp !== null) {
          var contentKit = [abcA];
          if (abcB)
            contentKit.push(abcB);
          this.act.acp.generateContent(abcA.nch, abcA.ncw, contentKit, false);
        }

        var ncw = abcA.ncw;
        var nch = abcA.nch;
        if (this.act.boxGridPos === 'AB' || this.act.boxGridPos === 'BA')
          ncw *= 2;
        else
          nch *= 2;

        this.bg = new ActiveBoxGrid(null, this, abcA.bb,
            this.act.margin, this.act.margin,
            abcA.w * ncw, abcA.h * nch, new Rectangular(ncw, nch));

        var nc = abcA.getNumCells();
        this.bg.setBorder(abcA.border);
        this.bg.setContent(abcA, null, 0, 0, nc);
        this.bg.setContent((abcB ? abcB : abcA), null, 0, nc, nc);
        for (var i = 0; i < 2; i++) {
          for (var j = 0; j < nc; j++) {
            var bx = this.bg.getActiveBox(i * nc + j);
            bx.idAss = j;
            bx.setInactive(true);
          }
        }
        this.bg.setVisible(true);
      }
    },
    /**
     * 
     * Basic initialization procedure
     */
    initActivity: function () {
      ActPanelAncestor.initActivity.call(this);

      if (!this.firstRun)
        this.buildVisualComponents();
      else
        this.firstRun = false;

      if (this.bg) {
        this.shuffle([this.bg], true, true);
        this.invalidate().update();
        this.setAndPlayMsg('initial', 'start');
        this.playing = true;
      }
    },
    /**
     * 
     * Updates the graphic content of this panel.<br>
     * This method will be called from {@link AWT.Container#update} when needed.
     * @param {AWT.Rectangle} dirtyRegion - Specifies the area to be updated. When `null`,
     * it's the whole panel.
     */
    updateContent: function (dirtyRegion) {
      ActPanelAncestor.updateContent.call(this, dirtyRegion);
      if (this.bg && this.$canvas) {
        var canvas = this.$canvas.get(0);
        var ctx = canvas.getContext('2d');
        if (!dirtyRegion)
          dirtyRegion = new AWT.Rectangle(0, 0, canvas.width, canvas.height);
        ctx.clearRect(dirtyRegion.pos.x, dirtyRegion.pos.y, dirtyRegion.dim.width, dirtyRegion.dim.height);
        this.bg.update(ctx, dirtyRegion, this);
      }
      return this;
    },
    /**
     * 
     * Sets the real dimension of this panel.
     * @param {AWT.Dimension} preferredMaxSize - The maximum surface available for the activity panel
     * @returns {AWT.Dimension}
     */
    setDimension: function (preferredMaxSize) {
      if (!this.bg || this.getBounds().equals(preferredMaxSize))
        return preferredMaxSize;
      return BoxBag.layoutSingle(preferredMaxSize, this.bg, this.act.margin);
    },
    /**
     * 
     * Sets the size and position of this activity panel
     * @param {AWT.Rectangle} rect
     */
    setBounds: function (rect) {
      if (this.$canvas)
        this.$canvas.remove();

      ActPanelAncestor.setBounds.call(this, rect);
      if (this.bg) {
        // Create the main canvas
        this.$canvas = $('<canvas width="' + rect.dim.width + '" height="' + rect.dim.height + '"/>').css({
          position: 'absolute',
          top: 0,
          left: 0
        });
        this.$div.append(this.$canvas);

        // Create a [BoxConnector](BoxConnector.html) and attach it to the canvas context        
        this.bc = new BoxConnector(this, this.$canvas.get(0).getContext('2d'));

        // Repaint all
        this.invalidate().update();
      }
    },
    /**
     * 
     * Main handler used to process mouse, touch, keyboard and edit events
     * @param {HTMLEvent} event - The HTML event to be processed
     * @returns {boolean=} - When this event handler returns `false`, jQuery will stop its
     * propagation through the DOM tree. See: {@link http://api.jquery.com/on}
     */
    processEvent: function (event) {
      if (this.bc && this.playing) {
        // 
        // The [AWT.Point](AWT.html#Point) where the mouse or touch event has been originated
        var p = null;
        // 
        // Two [ActiveBox](ActiveBox.html) pointers used for the [BoxConnector](BoxConnector.html)
        // `origin` and `dest` points.
        var bx1, bx2;
        // 
        // _touchend_ event don't provide pageX nor pageY information
        if (event.type === 'touchend') {
          p = this.bc.active ? this.bc.dest.clone() : new AWT.Point();
        } else {
          // Touch events can have more than one touch, so `pageX` must be obtained from `touches[0]`
          var x = event.originalEvent.touches ? event.originalEvent.touches[0].pageX : event.pageX;
          var y = event.originalEvent.touches ? event.originalEvent.touches[0].pageY : event.pageY;
          p = new AWT.Point(x - this.$div.offset().left, y - this.$div.offset().top);
        }

        // Flag for tracking `mouseup` events
        var up = false;

        switch (event.type) {
          case 'touchcancel':
            // Canvel movement
            if (this.bc.active)
              this.bc.end();
            break;

          case 'mouseup':
          case 'touchend':
            // Don't consider drag moves below 3 pixels. Can be a "trembling click"
            if (this.bc.active && p.distanceTo(this.bc.origin) <= 3) {
              break;
            }
            up = true;
            /* falls through */
          case 'touchstart':
          case 'mousedown':
            this.ps.stopMedia(1);
            if (!this.bc.active) {
              // New pairing starts
              //
              // Pairings can never start with a `mouseup` event
              if (up)
                break;
              //
              // Find the ActiveBox behind the clicked point              
              bx1 = this.bg.findActiveBox(p);
              if (bx1 && bx1.idAss !== -1) {
                // Play cell media or event sound
                if (!bx1.playMedia(this.ps))
                  this.playEvent('click');
                bx1.setInactive(false);
                // Start the [BoxConnector](BoxConnector.html)
                this.update();
                if (this.act.dragCells)
                  this.bc.begin(p, bx1);
                else
                  this.bc.begin(p);
              }
            } else {
              // Pairing completed
              //
              // Find the active boxes behind `bc.origin` and `p`              
              if (this.act.dragCells)
                bx1 = this.bc.bx;
              else
                bx1 = this.bg.findActiveBox(this.bc.origin);
              this.bc.end();
              bx2 = this.bg.findActiveBox(p);
              //
              // Check if the pairing was OK
              if (bx1 && bx1.idAss !== -1 && bx2 && bx2.idAss !== -1) {
                if (bx1 !== bx2) {
                  var ok = false;
                  if (bx1.idAss === bx2.idAss ||
                      bx1.getContent().isEquivalent(bx2.getContent(), true)) {
                    ok = true;
                    bx1.idAss = -1;
                    bx1.setInactive(false);
                    bx2.idAss = -1;
                    bx2.setInactive(false);
                  } else {
                    bx1.setInactive(true);
                    if (this.act.dragCells)
                      bx2.setInactive(true);
                    else {
                      bx2.setInactive(false);
                      // Start the [BoxConnector](BoxConnector.html)
                      this.update();
                      if (this.act.dragCells)
                        this.bc.begin(p, bx1);
                      else
                        this.bc.begin(p);
                    }
                  }
                  var m = bx2.playMedia(this.ps);
                  var cellsAtPlace = this.bg.countCellsWithIdAss(-1);
                  this.ps.reportNewAction(this.act, 'MATCH', bx1.getDescription(), bx2.getDescription(), ok, cellsAtPlace / 2);
                  if (ok && cellsAtPlace === this.bg.getNumCells())
                    this.finishActivity(true);
                  else if (!m)
                    this.playEvent(ok ? 'actionOk' : 'actionError');
                } else {
                  this.playEvent('CLICK');
                  bx1.setInactive(true);
                }
              } else if (bx1 !== null) {
                bx1.setInactive(true);
              }
              this.invalidate().update();
            }
            break;

          case 'mousemove':
          case 'touchmove':
            this.bc.moveTo(p);
            break;
        }
        event.preventDefault();
      }
    }
  };

  // MemoryGame.Panel extends Activity.Panel
  MemoryGame.Panel.prototype = $.extend(Object.create(ActPanelAncestor), MemoryGame.Panel.prototype);

  // Register class in Activity.prototype
  Activity.CLASSES['@memory.MemoryGame'] = MemoryGame;

  return MemoryGame;

});
