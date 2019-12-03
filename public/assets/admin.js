/**
 * FUNCTIONS
 **/

const sendFile = (file, editor, welEditable) => {
    let data = new FormData();
    data.append("file", file);

    $.ajax({
        data: data,
        type: "POST",
        url: "/editorimageuploads",
        cache: false,
        contentType: false,
        processData: false,
        success: (result) => {
            const {
                fileName,
                filePath
            } = result;
            $('.summernote-editor').summernote('insertImage', filePath, fileName);
        }
    });
}

const menuPositionUpdate = (itemType) => {
    const menuPosAlertEle = $('.alert.menu-pos-alert');
    if (menuPosAlertEle) {
        menuPosAlertEle.fadeOut();
    }

    $('.page-body')
        .before(
            `<div class="alert alert-success alert-dismissible fade show menu-pos-alert" role="alert">
        <strong>Success: </strong> ${itemType} position update.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        </div>`
        );
}

/**
 * INIT
 **/

//initialize Summernote editors
$(() => {
    $('.summernote-editor').summernote({
        minHeight: 500,
        callbacks: {
            onImageUpload: (files, editor, welEditable) => {
                sendFile(files[0], editor, welEditable);
            }
        }
    });
});

//initialize jQuery date pickers
$(".datepicker").datepicker();

/**
 * HOVER
 **/

//expand submenus in CMS main navigation
$('.cms-menu .nav-item.nav-has-submenu').hover(function () {
    const $this = $(this);

    if ($this.hasClass('current')) {
        return false;
    }

    return $this.addClass('expanded');

}, function () {
    const $this = $(this);

    if ($this.hasClass('current')) {
        return false;
    }

    return $this.removeClass('expanded');
})

/**
 * CLICK
 **/

 // handle media selection in media select modal ::GLOBAL
 $('body').on('mouseup', '.analog-modal.media-select.active button.select', () => {
     $selectedMedia = $('.analog-modal.media-select.active .media-grid-item.selected');

     // if no media is selected, abort
    if (!$selectedMedia.length) {
        return false;
    }
    // capture media details
    const _id = $selectedMedia.data('id');
    const path = $selectedMedia.data('path');

    // update thumbnail
    $('.image-upload-thumb').removeClass('no-image').addClass('image-exists').css('background-image', `url('${path}')`).empty();

    // insert captured id as value into form field
    $('input#_image').val(_id)

    // update thumbnail

    // empty media items on modal
    $('.analog-modal .media-grid').empty();
});

 // handle media select modal dismissal ::GLOBAL
 $('body').on('mouseup', '.analog-modal.media-select.active button.dismiss', () => {
    // empty media items on modal
    $('.analog-modal .media-grid').empty();
});

 // handle media selection in select modal ::GLOBAL
 $('body').on('click', '.analog-modal.media-select.active .media-grid-item', function () {
     const $this = $(this);

    if ($this.hasClass('selected')) {
        $this.removeClass('selected')
        return false;
    }

    // remove any other selected class to avoid dups
    $('.media-grid-item').removeClass('selected')
    $this.addClass('selected')
    return false;
});

 // handle media select modal ::GLOBAL
 $('.image-upload-thumb').click(() => {
    $.ajax({
        type: "GET",
        url: '/api/media/multi',
        success: (media) => {
            media.forEach((item, i) => {
                $('.media-grid')
                .append(
                    `<div id="media-${i}" data-id="${item._id}" data-path="${item.path}" class="col-4 col-md-3 col-lg-2 media-grid-item"
                    style="background-image: url('${item.path}')"></div>`
                );
            });
            // show modal
            $('.analog-modal').addClass('active');
        },
        error: (error) => {
            $('.custom-fields-notifications .alert').remove();
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
    });
})

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
            $('.custom-fields-notifications .alert').remove();
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
            $('.custom-fields-notifications .alert').remove();
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
    });
})

// handle global modal closing
$('.analog-modal .modal-footer button').click(function () {
    const $modal = $('.analog-modal');

    // if the user is saving changes, submit form
    if ($(this).hasClass('update')) {
        $('#updatemedia').submit();
    }

    $modal.removeClass('active')
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
        url: `/api/media/single/${_id}`,
        success: function (media) {
            const {type, fileName, storage, path, meta} = media
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
            $('.custom-fields-notifications .alert').remove();
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
            $('.custom-fields-notifications .alert').remove();
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

// handle content image removals
$('#image-upload-thumb-rm').click(function () {
    const $this = $(this);
    const _id = $this.data('id');
    const url = $this.data('delajaxurl');

    // avoid firing ajax without values
    if (!_id || !url) {
        return false;
    }

    $.ajax({
        type: "POST",
        url: url,
        data: {
            _id
        },
        success: function (result) {
            $this.remove();
            $('input#_image').val('')
            $('.image-upload-thumb.image-exists').css('background-image', 'none').addClass('no-image');
            $('.image-upload-thumb.image-exists i').removeClass('d-none');
            $('.custom-fields-notifications .alert').remove();
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
            $('.custom-fields-notifications .alert').remove();
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
    });

})

// handle next and previous pagination link clicks
$('.page-link.directional').click(function () {
    event.preventDefault();
    const $currentPage = $('.page-item.active');
    const $nextPage = $currentPage.next();
    const $prevPage = $currentPage.prev();

    if ($(this).hasClass('next')) {
        $nextPage.find('a.page-link')[0].click();
        return false;
    }

    $prevPage.find('a.page-link')[0].click();
})

// reveal custom field update options
$('body').on('click', '.editcustomfield', function () {
    const $this = $(this);
    const customField = $this.data('cf');
    const updateCustomFieldBtn = $(customField).find('.updatecustomfield');
    const customFieldInputs = $(customField).find('input');
    const $deleteBtn = $(customField).find('button.btn-danger');

    customFieldInputs.prop("disabled", false); // input fields are now enabled.
    updateCustomFieldBtn.show();
    $this.hide();
    $deleteBtn.hide();
})

// handle custom field deletions
$('body').on('click', '.deletecustomfield', function () {
    $this = $(this);
    const _id = $this.data('id');
    const row_id = $this.data('row');

    $.ajax({
        type: "POST",
        url: "/deletecustomfield",
        data: {
            _id
        },
        success: function (result) {
            $('.custom-fields-notifications .alert').remove();
            $('.custom-fields-notifications')
                .append(
                    `<div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success: </strong> ${result.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`
                );
            $(row_id).remove();
        },
        error: function (error) {
            $('.custom-fields-notifications .alert').remove();
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
    });

})

// handle custom field updates
$('body').on('click', '.updatecustomfield', function () {
    const customField = $(this).data('cf');
    const slug = $(customField).find('input[name=slug]').val().trim();
    const value = $(customField).find('input[name=value]').val().trim();
    const _id = $(customField).find('input[name=_id]').val();

    if (!slug) {
        $('#new-custom-field').addClass('was-validated');
        return false;
    }

    $.ajax({
        type: "POST",
        url: "/updatecustomfield",
        data: {
            _id,
            slug,
            value
        },
        success: function (result) {
            $('.custom-fields-notifications .alert').remove();
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
            $('.custom-fields-notifications .alert').remove();
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
    });

})

// handle custom field additions
$('#addcustomfield').click(function () {
    const $slugInput = $('#new-custom-field-slug');
    const $valueInput = $('#new-custom-field-value');
    const slug = $slugInput.val().trim();
    const value = $valueInput.val().trim();
    const ownerModel = $('#new-custom-field-ownerModel').val();
    const owner = $('#new-custom-field-owner').val();

    if (!slug) {
        $slugInput.addClass('is-invalid');
        return false;
    }

    $.ajax({
        type: "POST",
        url: "/addcustomfield",
        data: {
            slug,
            value,
            ownerModel,
            owner
        },
        success: function (result) {
            $('.custom-fields-notifications .alert').remove();
            $('.custom-fields-notifications')
                .append(
                    `<div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success: </strong> ${result.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`
                );
            // append new custom field row
            $('#custom-fields-list')
                .append(
                    `
                    <div id="cf-${result.id}" class="row custom-field">
                    <div class="col-6 col-md-4">
                        <input id="new-custom-field-slug" name="slug" type="text" class="form-control"
                            placeholder="Enter slug ..." value="${slug}" required disabled></input>
                        <div class="invalid-feedback">Required.</div>
                    </div>
                    <div class="col-6 col-md-4">
                        <input id="new-custom-field-value" name="value" type="text" class="form-control"
                            placeholder="Enter value ..." value="${value}" disabled></input>
                    </div>
                    <div class="col-4">
                        <input id="new-custom-field-id" type="hidden" name="_id" value="${result.id}">
                        <button type="button" class="btn btn-success editcustomfield" data-cf="#cf-${result.id}"><i class="far fa-edit"></i></button>
                        <button type="button" class="btn btn-info updatecustomfield" data-cf="#cf-${result.id}">Update</button>
                        <button type="button" class="btn btn-danger deletecustomfield" data-row="#cf-${result.id}" data-id="${result.id}"><i class="far fa-trash-alt"></i></button>
                    </div>
                </div>`
                )

            //remove 'no custom fields' alert
            $('.no-cf-alert').remove();

            //clear inputs
            $slugInput.val('').removeClass('is-invalid');
            $valueInput.val('');
        },
        error: function (error) {
            $('.custom-fields-notifications .alert').remove();
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
    });

})

//verify SMTP config settings
$('#verifySMTP').click(function () {
    $('.smtp-notifications')
        .append(
            `<div class="loader-dual-ring"></div>`
        )

    $.ajax({
        type: "POST",
        url: "/verifysmtp",
        success: function (result) {
            $('.loader-dual-ring').remove();
            $('.smtp-notifications')
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
            $('.loader-dual-ring').remove();
            $('.smtp-notifications')
                .append(
                    `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Error: </strong> ${error.responseJSON.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`
                );
        }
    });
})

//reveal redirect edit form
$('.redirect-edit-show').click(function () {
    const formToReveal = $(this).data('target');
    const infoToHide = $(this).data('info');
    $(formToReveal).show();
    $(infoToHide).hide();
})

//hide redirect edit form
$('.redirect-edit-hide').click(function () {
    const formToReveal = $(this).data('target');
    const infoToHide = $(this).data('info');
    $(formToReveal).hide();
    $(infoToHide).show();
})

//toggle expand/collapse icons
$('.section-head').click(function () {
    const closestWrap = $(this).find('.section-toggle-controls');

    if (closestWrap.hasClass('expanded')) {
        closestWrap.removeClass('expanded');
    } else {
        closestWrap.addClass('expanded');
    }
})

//toggle add overlays
$('.add-item-overlay, .add-project-overlay').click(function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
    } else {
        $(this).addClass('active');
    }

    return false;
})

//toggle mobile menu
$('.mobile-menu-toggle').click(() => {
    if ($('body').hasClass('mobile-menu-active')) {
        $('body').removeClass('mobile-menu-active');
    } else {
        $('body').addClass('mobile-menu-active');
    }

    return false;
})

//sortable menu items functionality and post submission
const draggableMenuContainer = $('.draggable.menu-item').closest('.draggableContainer');
let _id_menu_oldPosition = 0;
let draggableMenuContainer_arr = [];

draggableMenuContainer.sortable({
    handle: '.card-title',
    cancel: '.add-item',
    placeholder: "ui-state-highlight",
    forcePlaceholderSize: true,

    start: function (e, ui) {
        _id_menu_oldPosition = $(ui.item).index() + 1;
        draggableMenuContainer_arr = draggableMenuContainer.sortable("toArray");
    },

    update: function (e, ui) {
        const _id = $(ui.item).attr('id');
        const _id_newPosition = $(ui.item).index() + 1;
        const draggableMenuContainer_arr_updated = draggableMenuContainer.sortable("toArray");
        let _menuSwapped;

        //find id of menu item that was swapped
        for (let i = 0; i < draggableMenuContainer_arr.length; i++) {
            const _menu = draggableMenuContainer_arr[i];

            if (_menu == _id) {
                _menuSwapped = draggableMenuContainer_arr_updated[i];
                break;
            }

        }

        $.ajax({
            type: "PUT",
            url: "/updatemenuitemposition",
            data: {
                _id,
                _id_newPosition,
                _id_menu_oldPosition,
                _menuSwapped
            },
            success: function () {
                menuPositionUpdate('Menu item');
            }
        });
    }
});

//sortable submenu items functionality and post submission
const draggableSubmenuContainer = $('.draggable.submenu-item').closest('.draggableContainer');
let _id_submenu_oldPosition = 0;
let draggableSubmenuContainer_arr = [];

draggableSubmenuContainer.sortable({
    placeholder: "ui-state-highlight",
    forcePlaceholderSize: true,

    start: function (e, ui) {
        _id_submenu_oldPosition = $(ui.item).index() + 1;
        draggableSubmenuContainer_arr = draggableSubmenuContainer.sortable("toArray");
    },

    update: function (e, ui) {
        const _id = $(ui.item).attr('id');
        const _id_newPosition = $(ui.item).index() + 1;
        const draggableSubmenuContainer_arr_updated = draggableSubmenuContainer.sortable("toArray");
        let _submenuSwapped;

        //find id of menu item that was swapped
        for (let i = 0; i < draggableSubmenuContainer_arr.length; i++) {
            const _menu = draggableSubmenuContainer_arr[i];

            if (_menu == _id) {
                _submenuSwapped = $(`#${draggableSubmenuContainer_arr_updated[i]}`).data('id');
                break;
            }

        }

        $.ajax({
            type: "PUT",
            url: "/updatesubmenuitemposition",
            data: {
                _id,
                _id_newPosition,
                _id_submenu_oldPosition,
                _submenuSwapped
            },
            success: function () {
                menuPositionUpdate('Submenu item');
            }
        });
    }
});

//TABLE CHECKBOXES
//select all list item checkboxes when select all checkbox is selected
$('.listCheckbox.selectAll').click(function () {
    if ($('.listCheckbox.selectAll:checked').length) {
        return $('#list .listCheckbox.selectSingle').prop("checked", true);
    }

    $('#list .listCheckbox.selectSingle:checked').prop("checked", false);
})

//enable/disable multi edit dropdown when list checkbox is selected
$('.listCheckbox').click(function () {
    if ($('#list .listCheckbox.selectSingle:checked').length) {
        return $('#multi-edit-select, #submit_list_multi_edit').prop("disabled", false);
    }

    $('#multi-edit-select, #submit_list_multi_edit').prop("disabled", true);
})

//handle table multi-select
$('#submit_list_multi_edit').click(function () {
    const list_id_arr = [];
    const url = $(this).data('url');
    const update_criteria = $('#multi-edit-select option:selected').val();
    //cover update values for pages, posts, and redirects pages.
    const update_value = $('#select-template option:selected').val() || $('#select-status option:selected').val() || $('#select-target').val();

    $('#list .listCheckbox.selectSingle:checked').each(function (i, obj) {
        list_id_arr.push($(obj).val());
    });

    $.ajax({
        type: "POST",
        url,
        data: {
            list_id_arr,
            update_criteria,
            update_value
        },
        success: function () {
            location.reload();
        }
    });
})

/**
 * CHANGE
 **/

//show options for update values dynamically
//cover update values for pages, posts, and redirects pages.
$('#multi-edit-select').change(function () {
    const selection = $(this).val();

    if (selection == 'status') {
        $('#select-template').hide();
        return $('#select-status').show();
    } else if (selection == 'template') {
        $('#select-status').hide();
        return $('#select-template').show();
    } else if (selection == 'target') {
        return $('.multiple-target-field').show();
    }
    $('#select-template').hide();
    $('#select-status').hide();
    $('.multiple-target-field').hide();
});

//auto populate route value based off title entered
$('.add-form [name="title"]').focusout(function () {
    const routeValue = $(this).val().trim().replace(/\s+/g, '-').toLowerCase();

    $('.add-form [name="route"]').val(routeValue);
})

//auto populate menu item fields when existing url is selected
$('.menu-item-url-select').change(function () {
    const $this = $(this);
    const selectedUrl = $this.find("option:selected").attr('value');
    const selectedText = $this.find("option:selected").data('title');
    const closestTextField = $this.siblings(".addmenuitem").find('.addmenuitem-text');
    const closestUrlField = $this.siblings(".addmenuitem").find('.addmenuitem-url');
    const closestRefField = $this.siblings(".addmenuitem").find('.addmenuitem-ref');

    closestTextField.val(selectedText);
    closestUrlField.val(selectedUrl);
    closestRefField.val('true');
})

//auto populate slug value based off name entered (menus)
$('#addmenu [name="name"]').focusout(function () {
    const nameValue = $(this).val().trim().replace(/\s+/g, '-').toLowerCase();

    $('#addmenu [name="slug"]').val(nameValue);
})

//auto populate slug value based off value entered (custom fields)
$('#custom-fields [name="slug"]').focusout(function () {
    const $this = $(this);
    const slugValue = $this.val().trim().replace(/\s+/g, '-').toLowerCase();

    $this.val(slugValue);
})

//capture page limit and refresh
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

//
// LISTS PAGE
//

//auto populate slug value based off list name entered
$('#addlist [name="name"]').focusout(function () {
    const nameValue = $(this).val().trim().replace(/\s+/g, '-').toLowerCase();

    $('#addlist [name="slug"]').val(nameValue);
})

//show proper form fields according to model selected
if ($('#selectModel').val() == "Pages") {
    $('.pages-input').show();
    $('.posts-input').hide();
} else {
    $('.pages-input').hide();
    $('.posts-input').show();
}

//update form accordingly (posts vs pages)
$('#selectModel').change(function () {
    if ($(this).val() == "Pages") {
        $('.pages-input').show();
        $('.posts-input').hide();
    } else {
        $('.pages-input').hide();
        $('.posts-input').show();
    }
});
//# sourceMappingURL=admin.js.map
