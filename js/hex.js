var Hex = function (options) {

  var settings  = {
        "mandatoryLinks" : {},
        "planetSize" : {"min":0, "max":2}
      },
      type = "empty",
      status = "lock",
      planetSize = 0,
      planetOwner,
      strongResource = false,
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
    var oln   = _board.getOignonLayerNbr(),
        min   = planetSizeMinMax.min + oln,
        max   = planetSizeMinMax.max + Math.floor(Math.pow( 1.5, oln)),
        diff  = max - min,
        rand  = min + Math.floor((Math.random() * ( 1+ diff ) ));
    console.log(oln, max);
    setSize(rand);
  }

  // choose a random owner between you (very rare), free, wild, and own by united empire
  function _chooseRamdomOwner (type) {

    if (type === undefined || !type) {
      var rand  = Math.floor((Math.random() * 1000));

      if(rand < 3) {
        type = "owned";
      } else if (rand < 200) {
        type = "wild";
      } else if (rand < (200 + ( 50 * _board.getOignonLayerNbr(-1) ) )) {
        type = "ue";
      } else {
        type = "free";
      }
    }

    setOwner(type);

  }

  // choose a random owner between you (very rare), free, wild, and own by united empire
  function _chooseRamdomResources () {
    var oln     = _board.getOignonLayerNbr(),
        resMin  = 3 + (oln*3),
        randMax = 2 + Math.pow(2, oln);

    for(var i in resources) {
      var rb = (Math.random() * randMax) + resMin,
          rf = rb * (getSize() * 0.75);

          switch (getOwner()) {
            case "ue" :  // united empire strongess
              if(i === "f") {
                rf *= 1.1;
              } else if (i === "a") {
                rf *= 1.2;
              } else if(i === "d") {
                rf *= 2.2;
              } else if(i === "p") {
                rf *= 1.2;
              } else if(i === "m") {
                rf *= 4;
              }
            break;

            case "wild": // wild owner strongness
              if(i === "f") {
                rf *= 1.5;
              } else if (i === "a") {
                rf *= 2;
              } else if(i === "s") {
                rf *= 0.4;
              } else if(i === "p") {
                rf *= 0.6;
              } else if(i === "m") {
                rf *= (Math.random() + 0.5);
              }
            break;
          }


      resources[i] = rf;
    }
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

  // calcul next turn resource growth and etc
  function nextTurn() {

    for(var i in resources) {
      resources[i] += ( Math.random() + 0.1 ) + getSize() / ( (Math.random() * 2 ) + 1.2 ) ;
      if(i === strongResource) {
        resources[i] += (Math.random() + 0.3) * getSize();
      }
    }
    shouldPlanetGrow();
  }

  function shouldPlanetGrow() {
    //planetSize * 10 < (food * science / 3) + (money / 3) + ( politics / 4 )
    var sizometer = 0;

    sizometer += resources["f"] * (resources["s"] / 3);
    sizometer += resources["m"] / 3;
    sizometer += resources["p"] / 5;

    if (Math.pow("11", getSize()) < sizometer) {
      console.log("level ["+getSize()+"] Grow - ", _this);
      setSize(getSize()+1);
      resources["f"] *= 0.2;
      resources["m"] *= 0.4;
      resources["d"] *= 0.9;
      resources["p"] *= 0.8;
      resources["a"] *= 1.07;
    }
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
    return Math.floor(resources[type]);
  }
  function getStrongResource(){
    return strongResource;
  }
  function getTechVal() {
    return resources["s"] + (resources["p"] / 4);
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

  function setSize(newSize) {
    var p = _this.find(".planet").removeClass("planet-" + planetSize);
    planetSize = newSize;
    p.addClass("planet-" + planetSize);
  }

  function setStrongResource(type){
    if(type === undefined || type === "") {
      type = "a";
    }

    strongResource = type;
    for(var r in resources) {
      var ct = "strong-" + r;
      if(r === type) {
        resources[r] *= 2;
        _this.addClass(ct);
      } else {
        _this.removeClass(ct);
      }
    }

    return _self;
  }

  function getCounterInvadeForce() {
    var cForce = 0;

    if(resources["f"] > resources["d"]) {
      cForce += resources["d"] * 1.6;
    } else {
      cForce += resources["d"];
    }

    cForce += resources["s"];

    if(getStrongResource() === "d") {
      cForce *= 2;
    }

    cForce += ( resources["m"] + resources["p"] ) / 10;

    return cForce;
  }

  function getInvadeForce() {
    var iForce = 0;

    if(resources["f"] > resources["a"]) {
      iForce += resources["d"] * 1.7;
    } else {
      iForce += resources["d"] * 0.9;
    }

    iForce += resources["s"];

    if(getStrongResource() === "a") {
      iForce *= 1.9;
    }

    iForce += ( resources["m"] + resources["p"] ) / 9;

    return iForce;
  }

  // define the public methods and prop
  var hex                   = {};
  hex.getJq                 = getJq;
  hex.getType               = getType;
  hex.getStatus             = getStatus;
  hex.show                  = show;
  hex.getLinkAt             = getLinkAt;
  hex.getOwner              = getOwner;
  hex.setOwner              = setOwner;
  hex.getSize               = getSize;
  hex.getResource           = getResource;
  hex.getTechVal            = getTechVal;
  hex.getStrongResource     = getStrongResource;
  hex.setStrongResource     = setStrongResource;
  hex.getCounterInvadeForce = getCounterInvadeForce;
  hex.getInvadeForce        = getInvadeForce;
  hex.select                = select;
  hex.unselect              = unselect;
  hex.nextTurn              = nextTurn;

  _self = hex;
  _this.data("self", _self);
  return hex;
};
