//VARIABLES

const $mobileMenu = $('.mobile-nav-menu');
const $desktopMenuLinks = $('.desktop-nav-wrap a, .learn-more-wrap, .totop-wrap');
const $mobileMenuLinks = $('.mobile-nav-menu a');
let mobileMenuOpen = false;
const $navIcon = $('#nav-icon');
const $root = $('html, body');

//FUNCTIONS

const displayMobileMenu = (action) => {
    if (action == 'show') {
        $mobileMenu.css('visibility', 'visible');
        $mobileMenuLinks.css('visibility', 'visible');
        $root.addClass('nav-menu-open');
    } else if (action == 'hide') {
        $root.removeClass('nav-menu-open');
        $mobileMenu.css('visibility', 'hidden');
        $mobileMenuLinks.css('visibility', 'hidden');
    }
};

const fadeMobileMenu = (action) => {
    if (action == 'in') {
        displayMobileMenu('show');
        $mobileMenu.animate({
            opacity: 1
        }, 'fast');
        $mobileMenuLinks.animate({
            opacity: 1,
            marginRight: 0
        }, 'fast');
    } else if (action == 'out') {
        $mobileMenuLinks.animate({
            opacity: 0,
            marginRight: 200
        }, 'fast');
        $mobileMenu.animate({
            opacity: 0
        }, 'fast');
        setTimeout(()=> {
            displayMobileMenu('hide');
        }, 300);
    }
};

// CLICK EVENTS

$navIcon.click(function() {
    $(this).toggleClass('open');
    if (!mobileMenuOpen) {
        fadeMobileMenu('in');
        mobileMenuOpen = !mobileMenuOpen;
    } else {
        fadeMobileMenu('out');
        mobileMenuOpen = !mobileMenuOpen;
    }
});

$desktopMenuLinks.click(function() {
    let scrollTarget = $(this).attr('href');
    // smoothScroll
    $root.animate({
      scrollTop: $(scrollTarget).offset().top - 25
    }, 500);
    return false;
});

$mobileMenuLinks.click(function() {
    let scrollTarget = $(this).attr('href');
    fadeMobileMenu('out');
    $navIcon.removeClass('open');
    mobileMenuOpen = !mobileMenuOpen;
    // smoothScroll
    $root.animate({
      scrollTop: $(scrollTarget).offset().top - 25
    }, 500);
    return false;
});
