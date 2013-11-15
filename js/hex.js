var Hex = function (options) {

  var settings  = {},
      type = "empty",
      status = "lock",
      planetSize = 16,
      links = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
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

    return _this;
  }

  // create Event Listener
  function _initEventListener(){
    newHex.find(".hex.visible a").on("click", function(){
      console.log("clicked");
      hexHasBeenClicked($(this));
    });
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

  // define the public methods and prop
  var hex         = {};
  hex.getJq       = getJq;
  hex.getType     = getType;
  hex.getStatus   = getStatus;
  hex.show        = show;

  return hex;
};
