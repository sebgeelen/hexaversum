$(function() {

  // init board
  Hexboard.init({
    "container"         : $("#main-container .inner"),
    "startingLayer"     : 2,
    "startingMenuData"  : {"year" : 7638}
  });

  /*  *
  $("body *").on('click', function(e){
    console.log($(this));
  });
  /*  */
});
