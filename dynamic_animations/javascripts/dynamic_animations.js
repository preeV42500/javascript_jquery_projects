$(function() {
  var $canvas = $("#canvas");

  // function to get input names and values and store them as properties and values in an object
  function getFormObject($f) {
    var o = {};

    $f.serializeArray().forEach(function(input) {
      o[input.name] = input.value;
    });

    return o;
  }

  // function to create a div element within the canvas div
  function createElement(data) {
    var $d = $("<div />", {
      "class": data.shape_type,
      data: data,
    });

    resetElement($d);
    return $d;
  }

  // function to animate a single element
  function animateElement() {
    var $e = $(this),
        data = $e.data();
    resetElement($e);
    $e.animate({
      left: +data.end_x,
      top: +data.end_y
    }, +data.duration);
  }

  // function to set the left and top values of element
  function resetElement($e) {
    var data = $e.data();
    $e.css({
      left: +data.start_x,
      top: +data.start_y
    });
  }

  // function to stop all animations on the elements inside canvas
  function stopAnimations() {
    $canvas.find("div").stop();
  }

  $("form").on("submit", function(e) {
    e.preventDefault();

    var $f = $(this),
        data = getFormObject($f);

    $canvas.append(createElement(data));
  });

  $("#animate").on("click", function(e) {
    e.preventDefault();
    $canvas.find("div").each(animateElement);
  });

  $("#stop").on("click", function(e) {
    e.preventDefault();
    stopAnimations();
  });
});
