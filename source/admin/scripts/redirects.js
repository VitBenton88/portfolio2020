/**
 * CLICK
 **/

// reveal redirect edit form
$('.redirect-edit-show').click(function () {
    const $this = $(this);
    const formToReveal = $this.data('target');
    const infoToHide = $this.data('info');
    $(formToReveal).show();
    $(infoToHide).hide();
})

// hide redirect edit form
$('.redirect-edit-hide').click(function () {
    const $this = $(this);
    const formToReveal = $this.data('target');
    const infoToHide = $this.data('info');
    $(formToReveal).hide();
    $(infoToHide).show();
})