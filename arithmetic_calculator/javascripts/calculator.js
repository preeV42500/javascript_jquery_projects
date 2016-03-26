$(function() {
  $("form").on("submit", function(e) {
    e.preventDefault();
    var num1 = +$("#input1").val(),
        num2 = +$("#input2").val(),
        operator = $("#operator").val(),
        result;

    if (operator === "add") {
      result = num1 + num2;
    } else if (operator === "subtract") {
      result = num1 - num2;
    } else if (operator === "multiply") {
      result = num1 * num2;
    } else {
      result = num1/num2;
    }

    $("h1").text(result);
  });
});
