$(function() {
  var $ul = $("ul");

  function addItem(item, quantity) {
    $ul.append("<li>" + quantity + " " + item + "</li>");
  }

  $("form").on("submit", function(e) {
    e.preventDefault();
    var item = $("#item").val(),
        quantity = $("#quantity").val() || 1,
        $form = $(this);

    addItem(item, quantity);

    $form[0].reset();

  });
});
