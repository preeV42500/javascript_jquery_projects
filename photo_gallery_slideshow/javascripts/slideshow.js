$(function() {

  var $slides = $("#slides");

  $slides.slideshow({
    $nav: $slides.next("ul"),
    speed: 1000
  }); // call plugin
});
