"use strict";var browserWarningModal=$("#browser-warning"),browserWarningCloseIcon=$("#browser-warning .fa-times"),contactSendBtn=$("#sendButton");browserWarningCloseIcon.click(function(){browserWarningModal.hide()}),$("button.close").click(function(){$(this).closest(".alert").remove()}),$(document).ready(function(){if($("body").hasClass("home")){var e=$('[data-type="Frontend"]'),i=$('[data-type="Backend"]'),o=$.map(e,function(e){return $(e).data("score")}),n=$.map(i,function(e){return $(e).data("score")}),t=$.map(e,function(e){return $(e).data("label")}),a=$.map(i,function(e){return $(e).data("label")}),s="bar",l=$("#canvas-frontend"),r=$("#canvas-backend"),c={tooltips:{enabled:!1},hover:{mode:null},legend:{display:!1},scales:{yAxes:[{display:!1,ticks:{beginAtZero:!0,fontSize:14}}],xAxes:[{display:!0,ticks:{beginAtZero:!0,fontSize:14}}]}};window.matchMedia("(max-width: 1199px)").matches&&(s="horizontalBar",c.scales.yAxes[0].display=!0,c.scales.xAxes[0].display=!1);var d=function(e,i){for(var o=[],n=0;n<i;n++)o.push(e);return o},p=function(){new Chart(l,{type:s,data:{labels:t,datasets:[{data:o,backgroundColor:d("rgba(220, 229, 241, 0.4)",o.length),borderColor:d("rgba(36, 27, 78, 1)",o.length),borderWidth:2}]},options:c})},u=function(){new Chart(r,{type:s,data:{labels:a,datasets:[{data:n,backgroundColor:d("rgba(220, 229, 241, 0.4)",n.length),borderColor:d("rgba(0,0,0,1)",n.length),borderWidth:2}]},options:c})};u(),p(),$(window).on("resize",function(){$(this).width()<=1199?(s="horizontalBar",c.scales.yAxes[0].display=!0,c.scales.xAxes[0].display=!1):(s="bar",c.scales.yAxes[0].display=!1,c.scales.xAxes[0].display=!0),u(),p()})}});var socialLinks=$(".social-icon-wrap a i");socialLinks.click(function(){console.log("social click");var e="";e=$(this).hasClass("fa-stack-overflow")?"Stack Overflow":$(this).hasClass("fa-linkedin")?"Linkedin":"GitHub",dataLayer.push({event:"social-click",social:e})}),$(".portfolio-slider").on("beforeChange",function(e,i,o,n){dataLayer.push({event:"portfolio-slide-change"})});var $mobileMenu=$(".mobile-nav-menu"),$desktopMenuLinks=$(".desktop-nav-wrap a, .learn-more-wrap, .totop-wrap"),$mobileMenuLinks=$(".mobile-nav-menu a"),mobileMenuOpen=!1,$navIcon=$("#nav-icon"),$root=$("html, body"),displayMobileMenu=function(e){"show"==e?($mobileMenu.css("visibility","visible"),$mobileMenuLinks.css("visibility","visible"),$root.addClass("nav-menu-open")):"hide"==e&&($root.removeClass("nav-menu-open"),$mobileMenu.css("visibility","hidden"),$mobileMenuLinks.css("visibility","hidden"))},fadeMobileMenu=function(e){"in"==e?(displayMobileMenu("show"),$mobileMenu.animate({opacity:1},"fast"),$mobileMenuLinks.animate({opacity:1,marginRight:0},"fast")):"out"==e&&($mobileMenuLinks.animate({opacity:0,marginRight:200},"fast"),$mobileMenu.animate({opacity:0},"fast"),setTimeout(function(){displayMobileMenu("hide")},300))};$navIcon.click(function(){$(this).toggleClass("open"),mobileMenuOpen=(fadeMobileMenu(mobileMenuOpen?"out":"in"),!mobileMenuOpen)}),$desktopMenuLinks.click(function(){var e=$(this).attr("href");return $root.animate({scrollTop:$(e).offset().top-25},500),!1}),$mobileMenuLinks.click(function(){var e=$(this).attr("href");return fadeMobileMenu("out"),$navIcon.removeClass("open"),mobileMenuOpen=!mobileMenuOpen,$root.animate({scrollTop:$(e).offset().top-25},500),!1}),$(document).ready(function(){$("body").hasClass("home")&&particlesJS("particles-js",{particles:{number:{value:80,density:{enable:!0,value_area:800}},color:{value:"#241b4e"},shape:{type:"circle",stroke:{width:0,color:"#000000"},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:.5,random:!1,anim:{enable:!1,speed:1,opacity_min:.1,sync:!1}},size:{value:3,random:!0,anim:{enable:!1,speed:40,size_min:.1,sync:!1}},line_linked:{enable:!1,distance:150,color:"#241b4e",opacity:.4,width:1},move:{enable:!0,speed:5,direction:"none",random:!1,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"repulse"},onclick:{enable:!0,mode:"push"},resize:!0},modes:{grab:{distance:400,line_linked:{opacity:1}},bubble:{distance:400,size:40,duration:2,opacity:8,speed:3},repulse:{distance:200,duration:.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:!0})});var sliderSettings={arrows:!1,cssEase:"linear",dots:!0,fade:!0,infinite:!0,speed:500,swipeToSlide:!0,responsive:[{breakpoint:991,settings:{fade:!1}}]},leftArrowApps=$(".slider-article.app-projects-slider .fa-chevron-circle-left"),rightArrowApps=$(".slider-article.app-projects-slider .fa-chevron-circle-right"),leftArrowBml=$(".slider-article.bml-projects-slider .fa-chevron-circle-left"),rightArrowBml=$(".slider-article.bml-projects-slider .fa-chevron-circle-right"),portfolioSliderApps=$(".portfolio-slider.app-projects"),portfolioSliderBml=$(".portfolio-slider.bml-projects");$(document).ready(function(){portfolioSliderApps.slick(sliderSettings),portfolioSliderBml.slick(sliderSettings),rightArrowApps.click(function(){portfolioSliderApps.slick("slickNext")}),leftArrowApps.click(function(){portfolioSliderApps.slick("slickPrev")}),rightArrowBml.click(function(){portfolioSliderBml.slick("slickNext")}),leftArrowBml.click(function(){portfolioSliderBml.slick("slickPrev")})});