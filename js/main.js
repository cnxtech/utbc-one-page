function scroll_to_section(id) {
  $('html, body').animate({
    scrollTop: $('section#' + id).offset().top
  }, 500);
}

$(function() {
  $('#membership_link').click(function() {
    scroll_to_section('membership');
  });

  $('#who_are_we_link').click(function() {
    scroll_to_section('who_are_we');
  });

  $('#sponsors_link').click(function() {
    scroll_to_section('sponsors');
  });
});
