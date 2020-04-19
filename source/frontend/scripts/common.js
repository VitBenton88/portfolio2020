//VARIABLES
const browserWarningModal = $('#browser-warning');
const browserWarningCloseIcon = $('#browser-warning .fa-times');
const copyrightSpan = $('#copyrightYear');
const currentYear = (new Date()).getFullYear();
const contactSendBtn = $("#sendButton");

//set current year for copyright year in footer
copyrightSpan.html(`&copy; ${currentYear}`);

//click
//browser warning close
browserWarningCloseIcon.click(() => {
    browserWarningModal.hide();
});

//close notification
$('button.close').click( function() {
    $(this).closest('.alert').remove();
});