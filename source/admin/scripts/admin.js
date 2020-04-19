/**
* INIT
**/

//initialize Summernote editors
$(function() { 
    $('.summernote-editor').summernote();
});

/**
* CLICK
**/

//toggle expand/collapse icons
$('.section-head').click(function() {
    const closestWrap = $(this).find('.section-toggle-controls');

    if (closestWrap.hasClass('expanded')) {
        closestWrap.removeClass('expanded');
    } else {
        closestWrap.addClass('expanded');
    }
})

//toggle add overlays
$('.add-item-overlay, .add-project-overlay').click(function() {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
    } else {
        $(this).addClass('active');
    }

    return false;
})

//add new product detail input
$('.add-project-detail').click(function() {
    const productDetailInput = '<input name="details" class="form-control project-detail-additional" type="text" aria-describedby="details-help" placeholder="Project Detail">';
    if ($(this).hasClass('edit')) {
        $(this).before(productDetailInput);
    } else {
        $('.add-project .project-detail').after(productDetailInput);
    }

    return false;
})

//handle project bullet deletions via AJAX
$('.delete-project-bullet').click(function() {
    const bulletid = $(this).data('bulletid');
    const projectid = $(this).data('projectid');
    const _id = $(this).data('_id');
    const thisDetailItem = $(this).closest('.project-bullet');
    $.post("/deleteprojectbullet", {bulletid, _id, projectid}, () => thisDetailItem.remove());
})

//toggle mobile menu
$('.mobile-menu-toggle').click(function() {
    if ($('body').hasClass('mobile-menu-active')) {
        $('body').removeClass('mobile-menu-active');
    } else {
        $('body').addClass('mobile-menu-active');
    }

    return false;
})