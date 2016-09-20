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

  var slideshow = { // create parent object for slideshow, attach all pertinent methods to it
    $el: $("#slideshow"),
    duration: 500,
    prevSlide: function(e) {
      e.preventDefault();
      var $current = this.$el.find("figure:visible"),
          $prev = $current.prev("figure"); // find previous figure
      if (!$prev.length) { // loop back to last figure if current figure is first one
        $prev = this.$el.find("figure").last();
      }
      $current.fadeOut(this.duration);
      $prev.fadeIn(this.duration);
      this.renderPhotoContent($prev.attr("data-id"));
    },
    nextSlide: function(e) {
      e.preventDefault();
      var $current = this.$el.find("figure:visible"),
          $next = $current.next("figure"); // find next figure

      if (!$next.length) {
        $next = this.$el.find("figure").first(); // loop back to first figure if current figure is last one
      }
      $current.fadeOut(this.duration);
      $next.fadeIn(this.duration);
      this.renderPhotoContent($next.attr("data-id"));
    },
    renderPhotoContent: function(idx) {
      $("[name=photo_id]").val(idx);
      renderPhotoInformation(+idx); // Render the photo's information
      getCommentsFor(idx); // and corresponding comments
    },
    bind: function() {
      this.$el.find("a.prev").on("click", $.proxy(this.prevSlide, this));
      this.$el.find("a.next").on("click", $.proxy(this.nextSlide, this));
    },
    init: function() { // will be called to kick off event binding for slideshow buttons
      this.bind();
    }
  };

  $.ajax({
    url: "/photos",
    success: function(json) {
      photos = json;
      renderPhotos();
      renderPhotoInformation(photos[0].id);
      slideshow.init();
      getCommentsFor(photos[0].id);
    }
  });

  $("section > header").on("click", ".actions a", function(e) { // delegate click event to header
    e.preventDefault();
    var $e = $(e.target);

    $.ajax({
      url: $e.attr("href"),
      type: "post",
      data: "photo_id=" + $e.attr("data-id"),
      success: function(json) {
        $e.text(function(i, txt) { // replace number on current button with new value from total property of json object
          return txt.replace(/\d+/, json.total);
        });
      }
    });
  });

  $("form").on("submit", function(e) {
    e.preventDefault();
    var $f = $(this);

    $.ajax({
      url: $f.attr("action"),
      type: $f.attr("method"),
      data: $f.serialize(),
      success: function(json) {
        $("#comments ul").append(templates.comment(json));
      }
    });
  });

  function renderPhotos() {
    $("#slides").html(templates.photos({ photos: photos })); // place figure elements in slides div
  }

  function renderPhotoInformation(idx) {
    var photo = photos.filter(function(item) {
      return item.id === idx;
    })[0];
    $("section > header").html(templates.photo_information(photo)); // Fill in information about photo based on index
  }

  function getCommentsFor(idx) { // get commments for a photo based on its id
    $.ajax({
      url: "/comments",
      data: "photo_id=" + idx,
      success: function(comment_json) {
        $("#comments ul").html(templates.comments({ comments: comment_json }));
      }
    });
  }
});
