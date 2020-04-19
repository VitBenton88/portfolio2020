/**
 * CLICK
 **/

// handle storage tabs navigation
$('.storage-tabs .nav-link').click(function () {
    event.preventDefault();
    const $this = $(this);
    const target = $this.data('target');

    if ($this.hasClass('active')) {
        return false;
    }

    $('.storage-body').addClass('hidden');
    $('.storage-tabs .nav-link.active').removeClass('active');
    $this.addClass('active');
    $(target).removeClass('hidden');
})
//# sourceMappingURL=settings.js.map
