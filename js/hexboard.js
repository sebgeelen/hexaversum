(function(context, namespace) {

  var _board            = context[namespace],       // context object (defaul on window.Hexboard)
      _hexsList         = [],                       // hex lists
      settings          = {
        "container"         : null,               // the board container html obj (expect jQuery instance) -- MANDATORY
        "startingLayer"     : 1                   // number layer around center hex
      },
      rowHtml           = "#objects-lib .row",
      hexHtml           = "#objects-lib .hex-c",
      _hexMatrix        = {},
      _oignionLayerNbr  = 1,
      boardContainer;

  if (_board) { // singleton
    return;
  }

  // init the board
  function init(options) {
    cl.log('init');
    if(options !== undefined){
      // merge options object into settings object
      jQuery.extend(settings, options);
    }

    _initVars();
    _buildStartingBoard();
    _showAllHexs();
  }

  // used at startup, full filed the vars which need $ ready to have corect values
  function _initVars() {
    cl.log('init vars');

    boardContainer   = settings.container;
    rowHtml          = $(rowHtml)[0].outerHTML;
    hexHtml          = $(hexHtml)[0].outerHTML;
  }

  // build the starting hex board ( 1 hex in the center )
  function _buildStartingBoard() {
    cl.log('building starting board');

    // Todo : add x id in row data
    var newRow    = $(rowHtml),
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

    var newRowA  = $(rowHtml),
        newRowB  = $(rowHtml),
        rowIdA   = ( _oignionLayerNbr - 1 ),
        rowIdB   = rowIdA * -1;
    // Todo : add x id in row data

    boardContainer.find(".row").each(function(){
      var row = $(this);
      row.prepend(_createHex().getJq());
      row.append(_createHex().getJq());
    });

    //row before first line
    addXHexInRow(_oignionLayerNbr, newRow, rowIdB);
    boardContainer.prepend(newRow);

    //row after last line
    addXHexInRow(_oignionLayerNbr, newRow, rowIdA);
    boardContainer.append(newRow);
  }

  // add "nbr" number of hex in this "row"
  function addXHexInRow (nbr, row, rowId){
    for (var i = 0; i < nbr; i++) {
      var Ybase = (nbr-1)/2;

      row.prepend(_createHex({"x":rowId, "y": Ybase - i}).getJq());
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

    newHex = new Hex(defOpt);

    if(defOpt.startingHex){
      _addHexInMatrix(newHex, 0, 0);
    } else if(defOpt.x !== undefined && defOpt.y !== undefined) {
      _addHexInMatrix(newHex, defOpt.x, defOpt.y);
    }

    return newHex;
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

  function getAllHexs() {
    all = [];
    for (var i in _hexMatrix) {
      for(var j in _hexMatrix[i]){
        all.push(_hexMatrix[i][j].hex);
      }
    }
    return all;
  }

  // define the public methods and vars
  var board               = {};
      board.init          = init;
      board.getHexMatrix  = getHexMatrix;

  _board                  = board;
  context[namespace]      = _board;
}(window, 'Hexboard'));
