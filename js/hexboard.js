(function(context, namespace) {

  var _board            = context[namespace],       // context object (defaul on window.Hexboard)
      _hexsList         = [],                       // hex lists
      settings          = {
        "container"         : null,               // the board container html obj (expect jQuery instance) -- MANDATORY
        "startingLayer"     : 1                   // number layer around center hex
      },
      linksOposite      = {
        "1": "4",
        "2": "5",
        "3": "6",
        "4": "1",
        "5": "2",
        "6": "3"
      },
      rowHtml           = "#objects-lib .row",
      hexHtml           = "#objects-lib .hex-c",
      _hexMatrix        = {},
      _oignionLayerNbr  = 1,
      boardContainer,_menu, _curentlySelectedHex;

  if (_board) { // singleton
    return;
  }

  // init the board
  function init (options) {
    cl.log('init');
    if(options !== undefined){
      // merge options object into settings object
      jQuery.extend(settings, options);
    }

    _initVars();
    _initMenu();
    _buildStartingBoard();
    _showAllHexs();
  }

  // used at startup, full filed the vars which need $ ready to have corect values
  function _initVars () {
    cl.log('init vars');

    boardContainer   = settings.container;
    rowHtml          = $(rowHtml)[0].outerHTML;
    hexHtml          = $(hexHtml)[0].outerHTML;
    _menu            = $("menu#main-menu");
  }

  // fill in menu with starting data
  function _initMenu () {
    startingMenuData = settings.startingMenuData;

    for (var i in startingMenuData) {
      target = _menu.find("." + i);

      if(target.length > 0) {
        target.html(startingMenuData[i]);
      }
    }
  }

  // build the starting hex board ( 1 hex in the center )
  function _buildStartingBoard () {
    cl.log('building starting board');

    // Todo : add x id in row data
    var newRow    = _createRow(0),
        startHex  = _createHex({"startingHex" : true});

    newRow.append(startHex.getJq());
    boardContainer.append(newRow);

    // add x layer of hexs around the starting hex
    // x => settings.startingLayer
    for (var i = settings.startingLayer - 1; i >= 0; i--) {
      addHexsAroundBoard();
    }
  }

  //show all the not visible hex
  function _showAllHexs() {
    all = getAllHexs();
    cl.log(all);

    while (all.length > 0) {
      all.pop().show();
    }
  }

  // add a layout around current hex board
  function addHexsAroundBoard () {
    _oignionLayerNbr ++;

    var allRows       = boardContainer.find(".row"),
        rowIdA        = ( _oignionLayerNbr - 1 ),
        rowIdB        = rowIdA * -1,
        newRowA       = _createRow(rowIdA),
        newRowB       = _createRow(rowIdB);
    // Todo : add x id in row data

    allRows.each(function(){
      var row         = $(this),
          rowId       = row.data("id"),
          firstHexId  = parseFloat(row.find(".hex-c:first-child").data("id")) -1,
          lastHexId   = parseFloat(row.find('.hex-c:last-child').data("id")) +1;

      row.prepend(_createHex({"x":rowId, "y": firstHexId }).getJq());
      row.append(_createHex({"x":rowId, "y": lastHexId}).getJq());
    });

    //row before first line
    addXHexInRow(_oignionLayerNbr, newRowB, rowIdB);
    boardContainer.prepend(newRowB);

    //row after last line
    addXHexInRow(_oignionLayerNbr, newRowA, rowIdA);
    boardContainer.append(newRowA);
  }

  // add "nbr" number of hex in this "row"
  function addXHexInRow (nbr, row, rowId){
    var Ybase = (nbr-1)/2;
    for (var i = nbr - 1; i >=0 ; i--) {
      row.append(_createHex({"x":rowId, "y": Ybase - i}).getJq());
    }
  }

  function _createHex(opt) {
    defOpt = {
      "parentBoard" : _board,
      "hexHtml"     : hexHtml,
      "startingHex" : false
    };

    if(opt !== undefined){
      jQuery.extend(defOpt, opt);
    }
    if(defOpt.startingHex){
      defOpt.x = defOpt.y = 0;
    }


    if(defOpt.x === undefined || defOpt.y === undefined) {
      cl.log("Mandatory [x] or [y] param missing", "error");
      return;
    }
    var rowId        = defOpt.x,
        HexId        = defOpt.y,
        aroundMeHexs = _getHexAround(rowId, HexId);

    defOpt.mandatoryLinks = {};
    for(var i in aroundMeHexs){
      var checkAt = linksOposite[i];
          linkVal = aroundMeHexs[i].getLinkAt(checkAt);

      if(linkVal !== undefined){
        defOpt.mandatoryLinks[i] = linkVal;
      }
    }

    newHex = new Hex(defOpt);
    _addHexInMatrix(newHex, rowId, HexId);
    _registerEventsOn(newHex);

    return newHex;
  }

  function _createRow(id) {
    if(id === undefined){
      cl.log("new row id not provided", "error");
      return;
    }

    newRow = $(rowHtml);
    newRow.data("id", id);
    return newRow;
  }

  function _addHexInMatrix(hex, x, y) {
    cl.log("add in Matrix at ["+x+"]["+y+"]");

    if(_hexMatrix[x] === undefined){
      _hexMatrix[x] = {};
    }
    _hexMatrix[x][y] = {"hex" : hex};

    cl.log(_hexMatrix);
  }

  // return hex list as array
  function getHexMatrix() {
    return _hexMatrix;
  }

  // return hex list as array
  function _getHexAround(rowId, hexId) {
    var res = {};

    res["1"] = getSingleHexAt( rowId - 1, hexId - 0.5);
    res["2"] = getSingleHexAt( rowId, hexId - 1);
    res["3"] = getSingleHexAt( rowId + 1, hexId - 0.5) ;
    res["4"] = getSingleHexAt( rowId + 1, hexId + 0.5);
    res["5"] = getSingleHexAt( rowId, hexId + 1);
    res["6"] = getSingleHexAt( rowId - 1, hexId + 0.5);

    for(var i in res){
      if(res[i] === undefined){
        delete(res[i]);
      }
    }
    return res;
  }
  function getSingleHexAt(rowId, hexId){

    if(_hexMatrix[rowId] === undefined || _hexMatrix[rowId][hexId] === undefined){
      return undefined;
    }

    return _hexMatrix[rowId][hexId].hex;
  }

  function getAllHexs() {
    all = [];
    for (var i in _hexMatrix) {
      for(var j in _hexMatrix[i]){
        all.push(_hexMatrix[i][j].hex);
      }
    }
    return all;
  }

  function _registerEventsOn(hex) {
    hex.getJq().on("hexEvent", eventsInbox);
  }

  function eventsInbox(e) {
    //console.log(e);
    var hex = $(this).data("self");
    //improve Handling of custom event sub-type, data, etc
    switch(e.type){
      case "hexEvent" :
      _selectHex(hex);
      _fillInMenuWithHex(hex); // expect hex obj
      break;
    }
  }

  function _selectHex(hex) {
    if(_curentlySelectedHex !== undefined) {
      _curentlySelectedHex.unselect();
    }
    _curentlySelectedHex = hex.select();
  }

  // clear the menu and refill it with hex data
  function _fillInMenuWithHex(hex) {

    var resourcesObj = _menu.find(".resources>p");

    console.log(resourcesObj);

    resourcesObj.each(function(){
      var obj       = $(this),
          objClass  = $(this).attr("class").replace("res-", "");

      obj.find("span.nbr").text(hex.getResource(objClass));
    });
  }

  /* getters / setters*/
  function getOignionLayerNbr(offset) {

    if(offset === undefined) {
      offset = 0;
    }

    return _oignionLayerNbr + offset;
  }


  // define the public methods and vars
  var board                     = {};
      board.init                = init;
      board.getOignionLayerNbr  = getOignionLayerNbr;

  _board                  = board;
  context[namespace]      = _board;
}(window, 'Hexboard'));
