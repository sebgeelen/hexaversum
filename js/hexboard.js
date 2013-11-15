(function(context, namespace) {

  var _board            = context[namespace],       // context object (defaul on window.Hexboard)
      _hexsList         = [],                       // hex lists
      settings          = {
        "container"         : null,               // the board container html obj (expect jQuery instance) -- MANDATORY
        "startingLayer"     : 3                   // number layer around center hex
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
    if(defOpt.startingHex){
      defOpt.x = defOpt.y = 0;
    }


    if(defOpt.x === undefined || defOpt.y === undefined) {
      cl.log("Mandatory [x] or [y] param missing", "ERROR");
      return;
    }

    newHex = new Hex(defOpt);
    _addHexInMatrix(newHex, defOpt.x, defOpt.y);

    return newHex;
  }

  function _createRow(id) {
    if(id === undefined){
      cl.log("new row id not provided", "ERROR");
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
