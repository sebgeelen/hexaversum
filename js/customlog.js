(function(context, namespace) {

  var _console        = context[namespace],       // context object (defaul on window.Hexboard)
      _debugMode      = false;                     // set to false to avoid message

  if (_console) { // singleton
    return;
  }

  // a private debug function
  function log(toLog, type) {
    if (typeof type === "undefined") {
      type = "MSG";
    } else {
      type = type.toUpperCase();
    }

    if (_debugMode || type == "ERROR") {
      if (typeof toLog === "string") {
        console.debug(type + " : " + toLog);
      } else {
        console.debug(type + " :  ▼ -[" + typeof toLog + "]");
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
