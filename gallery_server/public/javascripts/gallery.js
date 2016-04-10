$(function() {
  var templates = {},
      photos;

  $("script[type='text/x-handlebars']").each(function() {
    var $tmpl = $(this);
    templates[$tmpl.attr("id")] = Handlebars.compile($tmpl.html()); // pre-compile handlebar templates
  });

  $("[data-type=partial]").each(function() { // register all partials
    var $partial = $(this);
    Handlebars.registerPartial($partial.attr("id"), $partial.html());
  });

  $.ajax({
    url: "/photos",
    success: function(json) {
      photos = json;
      renderPhotos();
      renderPhotoInformation(0);
      getCommentsFor(photos[0].id);
    }
  });

  function renderPhotos() {
    $("#slides").html(templates.photos({ photos: photos })); // place figure elements in slides div
  }

  function renderPhotoInformation(idx) {
    $("section > header").html(templates.photo_information(photos[idx])); // Fill in information about photo based on index
  }

  function getCommentsFor(idx) { // get commments for a photo based on its id
    $.ajax({
      url: "/comments",
      data: "photo_id=" + idx
      success: function(comment_json) {
        $("#comments ul").html(templates.comments({ comments: comment_json }));
      }
    });
  }
});
