//    File    : Order.js  
//    Created : 20/06/2015  
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
  "./TextActivityBase"
], function ($, Activity, TextActivityBase) {

  //
  // TODO: Implement order text activities
  var Order = function (project) {
    TextActivityBase.call(this, project);
  };

  Order.prototype = {
    constructor: Order
  };

  // 
  // Order extends TextActivityBase
  Order.prototype = $.extend(Object.create(TextActivityBase.prototype), Order.prototype);

  //
  // Constructor of this Activity.Panel object
  Order.Panel = function (act, ps, $div) {
    TextActivityBase.Panel.call(this, act, ps, $div);
  };


  // 
  // Properties and methods specific to Order.Panel
  var ActPanelAncestor = TextActivityBase.Panel.prototype;
  Order.Panel.prototype = {
    constructor: Order.Panel
  };

  // Order.Panel extends TextActivityBase.Panel
  Order.Panel.prototype = $.extend(Object.create(ActPanelAncestor), Order.Panel.prototype);

  // 
  // Register class in Activity.prototype
  Activity.CLASSES['@text.Order'] = Order;

  return Order;
});
