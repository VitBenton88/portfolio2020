//VARIABLES
const browserWarningModal = $('#browser-warning');
const browserWarningCloseIcon = $('#browser-warning .fa-times');
const contactSendBtn = $("#sendButton");

//click
//browser warning close
browserWarningCloseIcon.click(() => {
    browserWarningModal.hide();
});

//close notification
$('button.close').click( function() {
    $(this).closest('.alert').remove();
});