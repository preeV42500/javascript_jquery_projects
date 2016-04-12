$(function() {
  $("nav a").on("click", function(e) {
    e.preventDefault();
    var $e = $(this),
        class_name = "active",
        idx = $e.closest("li").index();

    $e.closest("nav").find("." + class_name).removeClass(class_name); // remove active class
    $e.addClass(class_name); // and add it to the anchor that was clicked
    $("#tabs article").hide().eq(idx).show(); // show the article corresponding to the the clicked tab
    localStorage.setItem("active_nav", idx); // set current active tab index in localStorage
  });

  $(":radio").on("change", function() { // change event on radio buttons
    var color = $(this).val();

    $(document.body).css({ background: color }); // change body's background color to value of selected radiobutton
    localStorage.setItem("background", color); // set background color in localStorage object
  });

  $(window).unload(function() {
    localStorage.setItem("note", $("textarea").val());
  });

  setActiveNav(localStorage.getItem("active_nav"));
  setBackground(localStorage.getItem("background"));
  setNote(localStorage.getItem("note")); // set textarea's value to the value retrieved from localStorage
});

function setActiveNav(idx) {
  if (idx === null) { return; }
  $("nav a").eq(idx).click(); // trigger click event on the tab corresponding to stored index
}

function setBackground(color) {
  if (color === null) { return; }
  $("[value=" + color + "]").prop("checked", true).change(); // trigger change event on radio button
}

function setNote(comment) {
  $("textarea").val(comment);
}
