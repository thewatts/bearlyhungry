;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  $(document).ready(function() {
    $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
    $.fn.foundationButtons          ? $doc.foundationButtons() : null;
    $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
    $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
    $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
    $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
    $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
    $.fn.foundationTabs             ? $doc.foundationTabs({callback : $.foundation.customForms.appendCustomMarkup}) : null;
    $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
    $.fn.foundationMagellan         ? $doc.foundationMagellan() : null;
    $.fn.foundationClearing         ? $doc.foundationClearing() : null;

    $.fn.placeholder                ? $('input, textarea').placeholder() : null;

    // toggle order
    var showOrder = false;
    var headerBottom = $('.main-header').outerHeight();
    var header = $('.main-header');

    $('#nav-order').on('click', function() {
      $('.wrapper').toggleClass('slide');
      $('.header-bg').toggleClass('bg-slide');
      $('.order.row').toggleClass('visible');
      $('.main-header').toggleClass('left-indent');
      $('.main-header').toggleClass('default');
    });

    $(window).scroll(function() {
      evaluateHeader();
    });

    var evaluateHeader = function(){
      var windowPosition = $(window).scrollTop();
      if (windowPosition >= headerBottom) {
        if ( (header.hasClass('left-indent')) && ( !header.hasClass('sticky-header-left'))) {
          header.addClass('sticky-header-left');
        }
        if (! header.hasClass('sticky-header') && (!header.hasClass('sticky-header-left')) && (!header.hasClass('left-indent'))) {
          $('.main-header').addClass('hidden-header').delay(500).addClass('sticky-header');
          $('.content').addClass('sticky-header');
        }
      } else {
        if ( header.hasClass('sticky-header') || (header.hasClass('sticky-header-left'))) {
          $('.main-header').removeClass('sticky-header').removeClass('sticky-header-left').removeClass('hidden-header');
          $('.content').removeClass('sticky-header');
        }
      }
    };

    $('.quantity-order .quantity').on('change', function() {
      var val = $(this).val();
      var digitCheck = /^\d+$/;
      if ((val <= 0) || (! digitCheck.test(val)))  {
        console.log('testing');
        $(this).val(1);
        console.log(this);
      } else {
        $(this).val(val);
      }
    });

    $('.add-item').closest('form').on('ajax:success', function(event, data) {
      $('.nav-order-item-count').text(data.order.total_items + " items");
      $('.nav-order-total').text(data.order.subtotal);
    });

    var footer = $('.footer');
    var footerTop = footer.position().top;
    var footerHeight = footer.outerHeight();
    var documentHeight = footerTop + footerHeight + 5
    console.log(documentHeight);
    $('.order.row').css({'height':documentHeight});


  });

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }
})(jQuery, this);
