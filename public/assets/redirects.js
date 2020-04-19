/**
 * CLICK
 **/

// reveal redirect edit form
$('.redirect-edit-toggle').click(function () {
    const $this = $(this);
    const $redirectRowToShow = $( $this.data('target') );
    // hide any other engaged edits
    $('.redirect_edit_engaged').removeClass('redirect_edit_engaged');

    if ( $this.hasClass('show') ) {
        $redirectRowToShow.find(".listCheckbox").attr("disabled", true);
        $redirectRowToShow.addClass('redirect_edit_engaged');
    } else {
        $redirectRowToShow.find(".listCheckbox").attr("disabled", false);
    }
})
//# sourceMappingURL=redirects.js.map
