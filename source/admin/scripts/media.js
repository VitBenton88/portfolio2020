/**
 * CLICK
 **/

 // handle multiple media deletions
 $('#media-delete-multi').click(() => {
    const _id_arr = [];

    $('.media-grid.select-mode .media-grid-item.selected').each(function (i, item) {
        $(item).addClass('to-be-deleted')
        _id_arr.push($(item).data('id'));
    });

    // if array is empty stop here
    if (_id_arr.length === 0) {
        return false;
    }

    $.ajax({
        type: "POST",
        url: '/deletemediamulti',
        data: {
            _id_arr,
        },
        success: (result) => {
            $('.custom-fields-notifications')
                .append(
                    `<div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success: </strong> ${result.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`
                );
            // remove the deleted items from the DOM
            $('.media-grid-item.to-be-deleted').remove();
        },
        error: (error) => {
            $('.custom-fields-notifications')
                .append(
                    `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Error: </strong> ${error.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`
                );
        }
    }).always(function () {
        $('.custom-fields-notifications .alert').remove();
    });
})

// handle edit media modal
$('.media-grid-item-edit').click(function () {
    const $this = $(this);
    const $mediaGrid = $this.closest('.media-grid')
    // if select mode is not, do nothing
    if ($mediaGrid.hasClass('select-mode')) {
        return false;
    }

    const _id = $this.data('id');

    $.ajax({
        type: "GET",
        url: `/api/media/${_id}`,
        success: function (media) {
            const {type, fileName, storage, path, meta} = media[0]
            const {alt, description, caption} = meta

            // populate modal content
            $('.analog-modal .modal-body img').attr('src', path);
            $('.analog-modal .modal-body .media-name mark').text(fileName);
            $('.analog-modal .modal-body .media-type mark').text(type);
            $('.analog-modal .modal-body .media-storage mark').text(storage);
            $('.analog-modal .modal-body .media-path mark').text(path);
            // populate modal form values
            $('.analog-modal .modal-body #alt').val(alt);
            $('.analog-modal .modal-body #description').val(description);
            $('.analog-modal .modal-body #caption').val(caption);
            $('.analog-modal .modal-body #_id').val(_id);

            // show modal
            $('.analog-modal').addClass('active');
        },
        error: function (error) {
            alert(error.responseJSON.message)
        }
    });
})

// dynamically delete media
$('.media-grid-item-del').click(function () {
    const $this = $(this);
    const $mediaGrid = $this.closest('.media-grid');
    // if select mode is on, do nothing
    if ($mediaGrid.hasClass('select-mode')) {
        return false;
    }

    const mediaEleId = $this.data('media');
    const $mediaEle = $(mediaEleId);
    const _id = $mediaEle.data('id');

    $.ajax({
        type: "POST",
        url: "/deletemedia",
        data: {
            _id
        },
        success: function (result) {
            $mediaEle.remove();
            $('.custom-fields-notifications')
                .append(
                    `<div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success: </strong> ${result.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`
                );
        },
        error: function (error) {
            $('.custom-fields-notifications')
                .append(
                    `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Error: </strong> ${error.responseJSON.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`
                );
        }
    }).always(function () {
        $('.custom-fields-notifications .alert').remove();
    });
})

// toggle select mode on media page
$('#media-select-on').click(function () {
    const $mediaGrid = $('.media-grid');
    const $this = $(this);

    if ($this.hasClass('select-mode')) {
         // disable bulk delete button
         $('#media-delete-multi').prop('disabled', true);

        $this.removeClass('select-mode');
        $mediaGrid.removeClass('select-mode');
        $('.media-grid .media-grid-item.selected').removeClass('selected');
        return false;
    }
     // enable bulk delete button
    $('#media-delete-multi').prop('disabled', false);

    $mediaGrid.addClass('select-mode');
    $this.addClass('select-mode');
    return false;
})

// handle selecting media items
$('.media-grid .media-grid-item').click(function () {
    const $this = $(this);

    // if select mode is not on, do nothing
    if (!$('.media-grid').hasClass('select-mode')) {
        return false;
    }

    if ($this.hasClass('selected')) {
        $this.removeClass('selected')
        return false;
    }

    $this.addClass('selected')
    return false;
})