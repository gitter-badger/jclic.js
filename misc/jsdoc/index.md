<a href="https://github.com/projectestac/jclic.js"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/365986a132ccd6a44c23a9169022c0b5c890c387/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png"></a>

JClic.js
========


__JClic.js__ is a JavaScript player of __JClic__ activities.<br>

## JClic

## JClic and JClic-repo

[JClic](http://clic.xtec.cat) is a free software project from the [Catalan Educational Telematic Network](http://www.xtec.cat) 
(XTEC) for creating various types of interactive activities such as associations, puzzles, text activities,
crosswords or puzzles, from elements of text, graphics and multimedia.

The program includes an authoring tool to create activities, a player and a reporting system that stores
the results obtained by students. All these components, along with some guides and tutorials on how to
create activities, are available in the [clicZone](http://clic.xtec.cat/en/jclic/download.htm).

JClic is a Java application that runs on Linux, Windows and Mac OS. Full [source code](https://github.com/projectestac/jclic)
and [documentation](http://projectestac.github.io/jclic/) are available on GitHub.

Many teachers from different countries have used JClic to create interactive materials for a wide variety
of levels, subjects, languages and curriculum areas. Some of these materials have been collected in a 
huge [library](http://clic.xtec.cat/repo) created with [jclic-repo](https://github.com/projectestac/jclic-repo),
another open source project that will facilitate the publication of collections of JClic projects in
static web hosting services.

## JClic project files

Groups of single __activities__ are often grouped in __JClic projects__ and organized in one or more
__sequences__ (lists of activities that must be performed in a specific order). The resulting set of
activities, sequences and media elements are packaged into __JClic project files__ (files with
extension ".jclic.zip").

## JClic.js components

JClic.js makes use of two main libraries:
* [jQuery](https://jquery.com/) to parse XML documents and manage DOM objects
* [JSZip](https://stuk.github.io/jszip/) to extract contents from "jclic.zip" files.

The build brocess of JClic.js is based on:
* [npm](https://www.npmjs.com/) (the package manager of [Node.js](https://nodejs.org/)) to install,
update and track package dependencies.
* [Browserify](http://browserify.org/) to allow the use of npm modules in browsers.
* [Grunt](http://gruntjs.com/) to automate debug and building tasks.
* [JSDoc](http://usejsdoc.org/) to generate this documentation.


## How to set-up the development environtment

First of all, you must have Node.js (which includes 'npm' by default)
[installed](https://nodejs.org/download/) in your system.

To update __npm__ to the latest version run:

```
sudo npm install -g npm
```

Then you must globally install __Grunt__ running:

```
sudo npm install -g grunt-cli
```

To install the remaining packages, just go to the project's root directory and run:

```
npm install
```

This will install JQuery and other needed packages into `node_modules`.

To build jclic.js, just run:

```
grunt
```

This will generate the file `jclic.min.js` inside the `dist` folder.

To test the module and see the demo in your browser, just launch the test server running:

```
grunt server
```

You can also build this documentation running `grunt doc`



# Main classes

JClic.js is organized in three main groups of classes: _Player_, _Document_ and _Utilities_. In
addition to this, the main [JClic](JClic.html) class provides methods to read JClic project documents,
build players, launch activities and communicate with external reporting systems.

## Player
[JClicPlayer](JClicPlayer.html) loads JClic project files, manages the user interaction and acts as
a interface between the browser and JClic classes for multiple functions. The player has:
* [Skin](Skin.html): manages the visual appareance. Can have up to three [Counter](Counter.html)
objects.
  * [DefaultSkin](DefaultSkin.html): is the basic implementation of _Skin_.
* [PlayerHistory](PlayerHistory.html): used to track the user's navigation between activities.


## Document classes

[JClicProject](JClicProject.html) encapsulates all data needed to play JClic activities. Its main
components are:
* [ProjectSettings](ProjectSettings.html)
* A collection of [Activity](Activity.html) objects (see below)
* An [ActivitySequence](ActivitySequence.html) formed by
[ActivitySequenceElement](ActivitySequenceElement.html) objects.
* A [MediaBag](MediaBag.html) formed by [MediaBagElement](MediaBagElement.html) objects.

The [Activity](Activity.html) class has the following subclasses:
* [SimpleAssociation](SimpleAssociation.html)
  * [ComplexAssociation](ComplexAssociation.html)
* [WrittenAnswer](WrittenAnswer.html)
* [MemoryGame](MemoryGame.html)
* [Explore](Explore.html)
* [Identify](Identify.html)
* [InformationScreen](InformationScreen.html)
* [DoublePuzzle](DoublePuzzle.html)
* [ExchangePuzzle](ExchangePuzzle.html)
* [HolePuzzle](HolePuzzle.html)
* [TextActivityBase](TextActivityBase.html) (see below)
  * [FillInBlanks](FillInBlanks.html)
  * [Complete](Complete.html)
  * [IdentifyText](IdentifyText.html)
  * [OrderText](OrderText.html)
* [CrossWord](CrossWord.html)
* [WordSearch](WordSearch.html)

All classes derived from [TextActivityBase](TextActivityBase.html) have:
* One [TextActivityDocument](TextActivityDocument.html)
* An [Evaluator](Evaluator.html)

At run time, all classes derived from [Activity](Activity.html) generate
a specific [Activity.Panel](Activity.Panel.html), that is a real DOM object with wich users interact.


## Utility classes

#### AWT
[AWT](AWT.html): contains some classes similar to those defined in the Java
[Abstract Window Toolkit](http://docs.oracle.com/javase/7/docs/api/java/awt/package-summary.html):
* [AWT.Font](AWT.Font.html)
* [AWT.Gradient](AWT.Gradient.html)
* [AWT.Stroke](AWT.Stroke.html)
* [AWT.Point](AWT.Point.html)
* [AWT.Dimension](AWT.Dimension.html)
* [AWT.Shape](AWT.Shape.html)
  * [AWT.Rectangle](AWT.Rectangle.html)
  * [AWT.Ellipse](AWT.Ellipse.html)
  * [AWT.Path](AWT.Path.html): formed by [AWT.PathStroke](AWT.PathStroke.html) elements
* [AWT.Action](AWT.Action.html)
* [AWT.Timer](AWT.Timer.html)
* [AWT.Container](AWT.Container.html)

#### Boxes
[AbstractBox](AbstractBox.html) is a special class derived from [AWT.Rectangle](AWT.Rectangle.html)
that has the following subclasses:
* [ActiveBox](ActiveBox.html): an AbstractBox with active content (see below)
* [BoxBag](BoxBag.html): a collection of AbstractBox objects.
  * [ActiveBoxBag](ActiveBoxBag.html): a collection of [ActiveBox](ActiveBox.html) objects.
    * [ActiveBoxGrid](ActiveBoxGrid.html): a special case of ActiveBoxBag with boxes distributed in
rows and columns.
* [TextGrid](TextGrid.html): a grid of single letters.

#### Box content
* [ActiveBoxContent](ActiveBoxContent.html): encapsulates the content of a single _ActiveBox_.
* [BoxBase](BoxBase.html): contains style specs (color, gradient, border, font, size...) common to
one or more _ActiveBoxContent_ objects. Also used by _TextActivityDocument_ to encapsulate text styles.
* [ActiveBagContent](ActiveBagContent.html): a collection of _ActiveBoxContent_ objects.
* [TextGridContent](TextGridContent.html): encapsulates the content of a _TextGrid_ object.

#### Shapers
* [Shaper](Shaper.html): describes how to cut a panel in multiple cells.
  * [Rectangular](Rectangular.html): divides the panel in rectangular cells.
  * [Holes](Holes.html): a free-form shaper.
  * [JigSaw](JigSaw.html): generates cells with teeth and slots.
    * [ClassicJigSaw](ClassicJigSaw.html)
    * [TriangularJigSaw](TriangularJigSaw.html)

#### Media
* [EventSounds](EventSounds.html): a collection of [EventSoundsElement](EventSoundsElement.html)
* [ActiveMediaBag](ActiveMediaBag.html): a collection of [MediaContent](MediaContent.html)
* [ActiveMediaPlayer](ActiveMediaPlayer.html): performs playing of _MediaContent_

#### Automation
* [AutoContentProvider](AutoContentProvider.html): builds dynamic content for activities
  * [Arith](Arith.html): random generator of menthal arithmetics operations

#### Jump between sequence points
* [JumpInfo](JumpInfo.html): stores information about what to do when an activity finishes or when the user clicks on a link or button.
  * [ActivitySequenceJump](ActivitySequenceJump.html): used by _ActivitySequenceElement_ objects.
  * [ConditionalJumpInfo](ConditionalJumpInfo.html): used to decide where to jump, based on the current timing and scoring

#### Miscellaneous utility classes
* [BoxConnector](BoxConnector.html)
* [Utils](Utils.html)
