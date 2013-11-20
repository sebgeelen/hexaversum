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

  $(window).on("resize", function(e) {
    var html    = $("html"),
        hWidth  = html.width() - 9,
        hHeight = html.height() - 72,
        scrollC = $("#board-scroll");

    scrollC.css({
      "width" : hWidth + "px",
      "height": hHeight + "px"
    });

    scrollC.scrollTop( ( 1200 - hHeight ) / 2);
    scrollC.scrollLeft( ( 1200 - hWidth )  / 2);

  }).trigger("resize");
});
