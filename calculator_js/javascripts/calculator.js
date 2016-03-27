function $(id_selector) {
  return document.getElementById(id_selector);
}
window.onload = function() {
  $("calculator").onsubmit = function(e) {
    e.preventDefault();
    var num1 = +$("input1").value,
        num2 = +$("input2").value,
        operator = $("operator").value,
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

    $("result").innerHTML = result;
  };
};
