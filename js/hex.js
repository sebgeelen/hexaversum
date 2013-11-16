var Hex = function (options) {

  var settings  = {
        "mandatoryLinks" : {},
        "planetSize" : {"min":1, "max":3}
      },
      type = "empty",
      status = "lock",
      planetSize = 16,
      links = {
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
      },
      _board,_this;

  if (_this === undefined) {
    cl.log('new hex instance');

    if (options !== undefined) {
      jQuery.extend(settings, options);
    }

    _init(settings);
  }

  // create a hex entity
  function _init(settings) {
    cl.log('init new hex');

    _this = $(settings.hexHtml);
    _this.data("id", settings.y);

    _chooseRamdomLinks(settings.mandatoryLinks);
    _chooseRamdomPlanetSize(settings.planetSize);

    _initEventListener();

    return _this;
  }

  // choose a random planet size between min and max provided
  function _chooseRamdomPlanetSize (planetSizeMinMax) {
    var min   = planetSizeMinMax.min,
        max   = planetSizeMinMax.max,
        diff  = max - min,
        rand  = min + Math.floor((Math.random() * ( 1+ diff ) ));

    _this.find(".planet").addClass("planet-" + rand);

  }

  //randomlyenable some links
  function _chooseRamdomLinks (mandatoryLinks) {

    var nbrDisabled = 0,
        nbrEnabled  = 0,
        unassigned  = [1,2,3,4,5,6];

    for( var i in mandatoryLinks){
      _cml = !!mandatoryLinks[i]; // force boolean curent madatory link

      if(_cml){
        nbrEnabled++;
      } else {
        nbrDisabled++;
      }
      delete( unassigned[i-1]);

      links[i] = _cml;
    }
    unassigned = cleanArray(unassigned);

    if(unassigned.length > 0){
      // randomise the latest links
      var rand = Math.floor((Math.random() * 101)); // 0 - 100 inclusive
      // 0 link  if rand < 0   (/)
      // 1 link  if rand < 11  (11)
      // 2 links if rand < 32  (21)
      // 3 links if rand < 76  (44)
      // 4 links if rand < 92  (16)
      // 5 links if rand < 98  (6)
      // 6 links if rand < 101 (3)
      var thresholds    = [0,11,32,76,92,98],
          allowedLinks  = 0;
      for (i = 0; i < thresholds.length; i++) {
        if(thresholds[i] <= rand ) {
          allowedLinks++;
        }
      }
      allowedLinks -= nbrEnabled;

      // realy randomize the remining links only if we have more unassigned thant to assigned
      if(allowedLinks < unassigned.length) {
        unassigned = shuffleArray(unassigned);
      }

      for (i = 0; i < unassigned.length; i++) {
        var id = unassigned[i];
        links[id] = i < allowedLinks;
      }

    }

    _showActiveLinks();
  }

  // create Event Listener
  function _initEventListener() {
    _this.find(".hex a.hl").on("click", _hlClick);
  }


function _hlClick (e) {
  console.log($(this));
  /*var color       = target.css("background-color"),
      colorKey    = target.attr("class"),
      hex         = target.parents(".hex"),
      bgColorBox  = hex.find(".in2");

  // apply color, remove choise
  bgColorBox.css("background-color", color).find(">p").remove();

  // add icon
  hex.prepend($("#colors>p."+colorKey+">span:first-child").html());

  //colors count
  if (numberColored[colorKey] === undefined) {
    numberColored[colorKey] = 0;
  };
  numberColored[colorKey] ++;
  updateColorsNumber();*/
}

  // show active link
  function _showActiveLinks() {
    var linksContainer = _this.find(".links");
    for (var i in links) {
      if(links[i]) {
        linksContainer.find('.link-' + i).show();
      }
    }
  }


  // show the hex if its hidden (random duration and speed)
  function show(maxClass, maxWaitingTime, minWaitingTime) {

    if(_this.hasClass("visible")) {
      return;
    }

    if(maxClass === undefined){
      maxClass = 3;
    }
    if(maxWaitingTime === undefined){
      maxWaitingTime = 600;
    }
    if(minWaitingTime === undefined){
      minWaitingTime = 200;
    }

    var randClass  = Math.floor((Math.random() * maxClass)+1),
        randWait   = Math.floor((Math.random() * (maxWaitingTime - minWaitingTime) ) + minWaitingTime);

    setTimeout(function() {
      _this.addClass('visible visible-' + randClass);
    }, randWait);
  }


  // return ths jQuery object
  function getJq() {
    cl.log("return the JQ object of this hex instance");
    return _this;
  }

  // geters
  function getStatus() {
    return status;
  }
  function getType() {
    return type;
  }
  function getLinkAt(id) {
    return links[id];
  }

  // define the public methods and prop
  var hex         = {};
  hex.getJq       = getJq;
  hex.getType     = getType;
  hex.getStatus   = getStatus;
  hex.show        = show;
  hex.getLinkAt   = getLinkAt;

  return hex;
};
