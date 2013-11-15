(function(context, namespace) {

  var _console        = context[namespace],       // context object (defaul on window.Hexboard)
      _debugMode      = true

  if (_console) { // singleton
    return;
  }

  // a private debug function
  function log(toLog, type) {
    if (typeof type === "undefined") {
      type = "MSG";
    }

    if (_debugMode) {
      if (typeof toLog === "string") {
        console.debug(type.toUpperCase() + " : " + toLog);
      } else {
        console.debug(type.toUpperCase() + " :  ▼ -[" + typeof toLog + "]");
        console.debug(toLog);
      }
    }
  }

  // define the public methods and vars
  var myConsole         = {};
      myConsole.log     = log;

  _console              = myConsole;
  context[namespace]    = _console;
}(window, 'cl'));