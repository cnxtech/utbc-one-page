function scroll_to_section(section) {
  $('html, body').animate({
    scrollTop: $('.main-content section.' + section).offset().top
  }, 500);
}

$(function() {

  $('.main-header nav .sponsors').click(function() {
    scroll_to_section('sponsors');
  });

  $('.main-header nav .membership').click(function() {
    scroll_to_section('membership');
  });

  $('.main-header nav .meet-the-team').click(function() {
    scroll_to_section('meet-the-team');
  });
});
