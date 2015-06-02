//    File    : SimpleAssociation.js  
//    Created : 02/06/2015  
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
  "../../AWT"
], function ($, Activity, ActiveBoxGrid, BoxBag, BoxConnector, AWT) {

  //
  // This class of [Activity](Activity.html) just shows a panel with [ActiveBox](ActiveBox.html)
  // objects.
  var SimpleAssociation = function (project) {
    Activity.call(this, project);
  };

  SimpleAssociation.prototype = {
    constructor: SimpleAssociation,
    //
    // Uses cell's `idAss` field to check if a pairing match
    useIdAss: false,
    //
    // Retrieves the minimum number of actions needed to solve this activity
    getMinNumActions: function () {
      return this.abc.primary.getNumCells();
    },
    //
    // The activity uses random to scramble internal components
    hasRandom: function () {
      return true;
    },
    //
    // The activity mut always be scrambled
    shuffleAlways: function () {
      return true;
    },
    //
    // The activity permits the user to display the solution
    helpSolutionAllowed: function () {
      return true;
    },
    //
    // Activity.Panel constructor
    Panel: function (act, ps, $div) {
      Activity.prototype.Panel.call(this, act, ps, $div);
    }
  };

  // 
  // InformationScreen extends Activity
  SimpleAssociation.prototype = $.extend(Object.create(Activity.prototype), SimpleAssociation.prototype);

  // 
  // Properties and methods specific to InformationScreen.Panel
  var ActPanelAncestor = Activity.prototype.Panel.prototype;
  SimpleAssociation.prototype.Panel.prototype = {
    constructor: SimpleAssociation.prototype.Panel,
    //
    // The [ActiveBoxBag](ActiveBoxBag.html) objects containing the information to be displayed.
    bgA: null,
    bgB: null,
    //
    // The [BoxConnector](BoxConnector.html) obect
    bc: null,
    // Possible events are: 'keydown', 'keyup', 'keypress', 'mousedown', 'mouseup', 'click',
    // 'dblclick', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout'
    events: ['mousedown', 'mouseup', 'mousemove'],
    //
    // Clears the realized objects
    clear: function () {
      if (this.bgA) {
        this.bgA.end();
        this.bgA = null;
      }
      if (this.bgB) {
        this.bgB.end();
        this.bgB = null;
      }
    },
    // 
    // Prepares the activity panel
    buildVisualComponents: function () {

      if (this.firstRun)
        ActPanelAncestor.buildVisualComponents.call(this);

      this.clear();

      var abcA = this.act.abc['primary'];
      var abcB = this.act.abc['secondary'];
      var solved = this.act.abc['solvedPrimary'];

      if (abcA && abcB) {

        if (abcA.imgName)
          abcA.setImgContent(this.act.project.mediaBag, null, false);

        if (abcB.imgName)
          abcB.setImgContent(this.act.project.mediaBag, null, false);

        if (this.act.acp !== null) {
          var contentKit = [abcA, abcB];
          if (solved)
            contentKit.push(solved);
          this.act.acp.generateContent(
              new this.act.acp.ActiveBagContentKit(abcA.nch, abcA.ncw, contentKit, false), this.ps);
        }

        this.bgA = ActiveBoxGrid.prototype._createEmptyGrid(null, this, this.act.margin, this.act.margin, abcA);
        this.bgB = ActiveBoxGrid.prototype._createEmptyGrid(null, this, this.act.margin, this.act.margin, abcB);

        this.bgA.setContent(abcA, solved ? solved : null);
        this.bgB.setContent(abcB);

        this.bgA.setVisible(true);
        this.bgB.setVisible(true);

      }
    },
    // 
    // Basic initialization procedure
    initActivity: function () {
      ActPanelAncestor.initActivity.call(this);

      if (!this.firstRun)
        this.buildVisualComponents();
      else
        this.firstRun = false;

      //this.setAndPlayMsg('main', 'start');
      if (this.bgA && this.bgB) {
        // Scramble cells
        var scrambleArray = [];
        if (this.act.scramble.primary)
          scrambleArray.push(this.bgA);
        if (this.act.scramble.secondary)
          scrambleArray.push(this.bgB);
        if (scrambleArray.length > 0) {
          this.shuffle(scrambleArray, true, true);
        }

        if (this.useOrder)
          this.currentItem = this.bgA.getNextItem(-1);

        this.playing = true;
        this.invalidate().update();
      }
    },
    //
    // Overrides `Activity.Panel.updateContent`
    // Updates the graphic contents of its panel.
    // The method should be called from `Activity.Panel.update`
    // dirtyRect (AWT.Rectangle) - Specifies the area to be updated. When `null`, it's the whole panel.
    updateContent: function (dirtyRegion) {
      ActPanelAncestor.updateContent.call(this, dirtyRegion);
      if (this.bgA && this.bgB && this.$canvas) {
        var canvas = this.$canvas.get(0);
        var ctx = canvas.getContext('2d');
        if (!dirtyRegion)
          dirtyRegion = new AWT.Rectangle(0, 0, canvas.width, canvas.height);
        ctx.clearRect(dirtyRegion.pos.x, dirtyRegion.pos.y, dirtyRegion.dim.width, dirtyRegion.dim.height);
        this.bgA.update(ctx, dirtyRegion, this);
        this.bgB.update(ctx, dirtyRegion, this);
      }
      return this;
    },
    //
    // Calculates the optimal dimension of this panel
    setDimension: function (preferredMaxSize) {
      if (!this.bgA || !this.bgB || this.getBounds().equals(preferredMaxSize))
        return preferredMaxSize;
      return BoxBag.prototype._layoutDouble(preferredMaxSize, this.bgA, this.bgB, this.act.boxGridPos, this.act.margin);
    },
    //
    // Sets the size and position of this activity panel
    setBounds: function (rect) {
      this.$div.empty();
      ActPanelAncestor.setBounds.call(this, rect);
      if (this.bgA || this.bgB) {
        // Create the main canvas
        this.$canvas = $('<canvas width="' + rect.dim.width + '" height="' + rect.dim.height + '"/>').css({
          position: 'absolute',
          top: 0,
          left: 0
        });
        this.$div.append(this.$canvas);
        // 
        // Add a canvas layer for the BoxConnector
        //this.$bcCanvas = $('<canvas width="' + rect.dim.width + '" height="' + rect.dim.height + '"/>').css({
        //  position: 'absolute',
        //  top: 0,
        //  left: 0
        //});
        //this.$div.append(this.$bcCanvas);
        //this.bc = new BoxConnector(this, this.$bcCanvas.get(0).getContext('2d'));
        this.bc = new BoxConnector(this, this.$canvas.get(0).getContext('2d'));

        this.invalidate().update();
      }
    },
    // 
    // Main handler to receive mouse and key events
    // Overrides same function in Activity.Panel
    processEvent: function (event) {
      if (this.bc && this.playing) {

        var bx1, bx2;
        var p = new AWT.Point(
            event.pageX - this.$div.offset().left,
            event.pageY - this.$div.offset().top);
        var m = false;
        var clickOnBg0 = false;

        switch (event.type) {
          case 'mousedown':
            this.ps.stopMedia(1);
            if (this.bc.active) {
              bx1 = this.bgA.findActiveBox(this.bc.origin);
              if (bx1) {
                bx2 = this.bgB.findActiveBox(p);
              }
              else {
                bx2 = this.bgB.findActiveBox(this.bc.origin);
                if (bx2) {
                  bx1 = this.bgA.findActiveBox(p);
                  clickOnBg0 = true;
                }
              }
              this.bc.end();
              if (bx1 && bx2 && bx1.idAss !== -1 && bx2.idAss !== -1) {
                var ok = false;
                var src = bx1.getDescription();
                var dest = bx2.getDescription();
                if (bx1.idOrder === bx2.idOrder
                    || (bx2.getContent().isEquivalent(this.act.abc['primary'].getActiveBoxContent(bx1.idOrder), true))) {
                  ok = true;
                  bx1.idAss = -1;
                  bx2.idAss = -1;
                  if (this.act.abc['solvedPrimary']) {
                    bx1.switchToAlt(this.ps);
                    m |= bx1.playMedia(this.ps);
                  }
                  else {
                    if (clickOnBg0)
                      m |= bx1.playMedia(this.ps);
                    else
                      m |= bx2.playMedia(this.ps);
                    bx1.clear();
                  }
                  bx2.clear();

                  if (this.act.useOrder)
                    this.currentItem = this.bgA.getNextItem(this.currentItem);
                }

                var cellsPlaced = this.bgB.countCellsWithIdAss(-1);
                this.ps.reportNewAction(this.act, 'MATCH', src, dest, ok, cellsPlaced);
                if (ok && cellsPlaced === this.bgB.getNumCells())
                  this.finishActivity(true);
                else if (!m)
                  this.playEvent(ok ? 'actionOk' : 'actionError');
              }
              this.update();
            }
            else {
              bx1 = this.bgA.findActiveBox(p);
              bx2 = this.bgB.findActiveBox(p);
              if ((bx1 && (!this.act.useOrder || bx1.idOrder === this.currentItem))
                  || (!this.act.useOrder && bx2) && bx2.idAss !== -1) {
                if (this.act.dragCells)
                  this.bc.begin(p, bx1 ? bx1 : bx2);
                else
                  this.bc.begin(p);
                m = bx1.playMedia(this.ps);
                if (!m)
                  this.playEvent('click');
              }
            }
            break;

          case 'mousemove':
            this.bc.moveTo(p);
            break;
        }
      }
    }
  };

  // DoublePuzzle.Panel extends Activity.Panel
  SimpleAssociation.prototype.Panel.prototype = $.extend(
      Object.create(ActPanelAncestor),
      SimpleAssociation.prototype.Panel.prototype);

  // 
  // Register class in Activity.prototype
  Activity.prototype._CLASSES['@associations.SimpleAssociation'] = SimpleAssociation;

  return SimpleAssociation;

});


