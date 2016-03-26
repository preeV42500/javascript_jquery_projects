$(function() {

  var answer = Math.floor(Math.random() * 100) + 1;
  var num_guesses = 0;

  $("form").on("submit", function(e) {
    e.preventDefault();
    var guess = +$("#guess").val(),
        message;
    num_guesses++;
    if (guess > answer) {
      message = "My number is lower than " + guess;
    }
    else if (guess < answer) {
      message = "My number is higher than " + guess;
    }
    else {
      message = "You guessed my number! It took you " + num_guesses + " guesses";
    }
    $("p").text(message);
  });

  $("a").on("click", function(e) {
    e.preventDefault();
    num_guesses = 0;
    answer = Math.floor(Math.random() * 100) + 1;
    $("p").text("Guess a number from 1 to 100");
    $("#guess").val("");
  });


});
