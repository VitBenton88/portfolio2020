/**
 * CLICK
 **/

// Provide strong password
$('#get_strong_pass').click(function () {
    const $password_inputs = $('.password_target, .verify_password_target, .password_helper input');
    $password_inputs.val('');
    
    $.ajax({
        type: "GET",
        url: "/api/password",
        success: function (strong_password) {
            $password_inputs.val(strong_password);
            $('.password_helper').show();
        },
        error: function(error) { 
            console.error(error);
            alert("An error occurred while retrieving a strong password. Please try again later.");
        }  
    });
})

/**
 * CHANGE
 **/

// capture page limit and refresh
$('#paginationlimit').change(function () {
    const limit = $(this).val();
    let currentUrl = window.location.href;
    const limitExists = currentUrl.indexOf('limit=') >= 0;

    if (limitExists) {
        currentUrl = currentUrl.substring(0, currentUrl.indexOf('limit=') + 'limit='.length);
        location.href = `${currentUrl}${limit}`;
        return false;
    }

    const queryToAdd = currentUrl.indexOf('&') !== -1 ? '&limit=' : '?limit=';
    location.href = `${currentUrl}${queryToAdd}${limit}`;
});

// Remove strong password helper text when password is manually changed
$('.password_target, .verify_password_target').on('input', function () {
    $('.password_helper').hide();
})
//# sourceMappingURL=scripts.js.map
