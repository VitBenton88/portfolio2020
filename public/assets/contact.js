//verify SMTP config settings
$('#verifySMTP').click(function () {
    $('.smtp-notifications')
        .append(
            `<div class="loader-dual-ring"></div>`
        )
    // disable button
    $('#verifySMTP').prop("disabled", true);
    // set message var for ajax callback
    var message;
    var success;

    $.ajax({
        type: "POST",
        url: "/verifysmtp",
        success: function (result) {
            message = result.message
            success = true
        },
        error: function (error) {
            message = error.responseJSON.message
            success = false
        },
    }).always(function () {
        // un-disable button
        $('#verifySMTP').prop("disabled", false);
        $('.loader-dual-ring').remove();
        $('.smtp-notifications')
        .append(
            `<div class="alert alert-${success ? 'success' : 'warning'} alert-dismissible fade show" role="alert">
            <strong>${success ? 'Success:' : 'Error:'} </strong> ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`
        );
    });
})
//# sourceMappingURL=contact.js.map
