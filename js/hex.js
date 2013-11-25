var Hex = function (options) {

  var settings  = {
        "mandatoryLinks" : {},
        "planetSize" : {"min":1, "max":3}
      },
      type = "empty",
      status = "lock",
      planetSize,
      planetOwner,
      possibleOwners = ["free","owned","ue","wild"],
      links = {
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
      },
      resources = {
        "a": null, // attaque
        "d": null, // defence
        "f": null, // food
        "p": null, // politics
        "s": null, // science / tech
        "m": null  // money
      },
      _board,_this,_self;

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
    _board = settings.parentBoard;
    _this.data("id", settings.y);
    _this.data("rowId", settings.x);

    _this.attr("id", "hex:" + settings.y + ":" + settings.x );

    _chooseRamdomLinks(settings.mandatoryLinks);
    _chooseRamdomPlanetSize(settings.planetSize);

    forceType = false;
    if(settings.startingHex) {
      forceType = "owned";
    }
    _chooseRamdomOwner(forceType);
    _chooseRamdomResources();

    _initEventListener();

    return _this;
  }

  // choose a random planet size between min and max provided
  function _chooseRamdomPlanetSize (planetSizeMinMax) {
    var min   = planetSizeMinMax.min,
        max   = planetSizeMinMax.max,
        diff  = max - min,
        rand  = min + Math.floor((Math.random() * ( 1+ diff ) ));

    planetSize = rand;
    _this.find(".planet").addClass("planet-" + rand);

  }

  // choose a random owner between you (very rare), free, wild, and own by united empire
  function _chooseRamdomOwner (type) {

    if (type === undefined || !type) {
      var rand  = Math.floor((Math.random() * 1000));

      if(rand < 3) {
        type = "owned";
      } else if (rand < 200) {
        type = "wild";
      } else if (rand < (200 + ( 50 * _board.getOignionLayerNbr(-1) ) )) {
        type = "ue";
      } else {
        type = "free";
      }
    }

    setOwner(type);

  }

  // choose a random owner between you (very rare), free, wild, and own by united empire
  function _chooseRamdomResources () {

    resources = {
      "a": Math.floor((Math.random() * 10)),
      "d": Math.floor((Math.random() * 10)),
      "f": Math.floor((Math.random() * 10)),
      "p": Math.floor((Math.random() * 10)),
      "s": Math.floor((Math.random() * 10)),
      "m": Math.floor((Math.random() * 10))
    };
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
    _this.find(".hex ").on("click", function(e){
      // todo improve event with data and sub name
      _this.trigger("hexEvent", "hexClick", _self);
    });
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

  function select(){
    _this.addClass('select');
    return _self;
  }

  function unselect(){
    _this.removeClass('select');
    return _self;
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
  function getOwner() {
    return planetOwner;
  }
  function getSize() {
    return planetSize;
  }
  function getResource(type){
    return resources[type];
  }
  //seters

  function setOwner(type) {
    if(type === undefined || type === "") {
      type = "owned";
    }

    planetOwner = type;
    for(var t in possibleOwners) {
      var ot = possibleOwners[t],
          ct = "owner-" + ot;
      if(ot === type) {
        _this.addClass(ct);
      } else {
        _this.removeClass(ct);
      }
    }
    return _self;
  }

  // define the public methods and prop
  var hex         = {};
  hex.getJq       = getJq;
  hex.getType     = getType;
  hex.getStatus   = getStatus;
  hex.show        = show;
  hex.getLinkAt   = getLinkAt;
  hex.getOwner    = getOwner;
  hex.getSize     = getSize;
  hex.getResource = getResource;
  hex.select      = select;
  hex.unselect    = unselect;

  _self = hex;
  _this.data("self", _self);
  return hex;
};
