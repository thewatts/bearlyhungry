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
    var showOrder    = false;
    var headerBottom = $('.main-header').outerHeight();
    var header       = $('.main-header');

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
        $(this).val(1);
      } else {
        $(this).val(val);
      }
    });

    var generate_line_item = function(data) {
      var output = "";
      output += '<li class="order-item order-item-' + data.order_item.id + '">';
      output += '  <div class="order-item-info">';
      output += '    <div class="order-item-title-total">';
      output += '      <span class="order-item-title block">';
      output += '        ' + data.item.title;
      output += '      </span>';
      output += '      <span class="order-item-total block">';
      output += '        ' + data.order_item.subtotal;
      output += '      </span>';
      output += '    </div><!-- //order-item-title-total -->';
      output += '    <div class="item-quantity-modify">';
      output += '      <div class="quantity-price">';
      output += '        <span class="label">';
      output += '          Quantity';
      output += '        </span>';
      output += '        <span class="value">';
      output += '          ' + data.order_item.quantity + ' x ' + data.item.price;
      output += '        </span>';
      output += '      </div><!-- //quantity-price -->';
      output += '      <div class="modify">';
      output += '        <a class="remove-order-item" data-method="delete" data-confirm="Are you sure?" href="/order_items/' + data.order_item.id + '" rel="nofollow">Remove</a>';
      output += '      </div><!-- //modify -->';
      output += '    </div><!-- item-quantity-price -->';
      output += '  </div><!-- order-item-info -->';
      output += '</li>';

      return output;
    };

    $('.add-item').closest('form').on('ajax:success', function(event, data) {
      window.data = data
      $('.nav-order-item-count').text(data.order.total_items + " items");
      $('.nav-order-total').text(data.order.subtotal);
      if ( $('.no-order').length > 0 ) {
        $('.no-order').remove();
        $('.my-order').append('<ul class="my-order-items"></ul>');
        $('.my-order').append('<div class="order-total"><span class="label">Total</span><span class="value"></span></div>');
        $('.my-order').append('<div class="checkout"><a class="order-checkout" href="/review-my-order">Checkout</a></div>');
      }
      console.log('.order-item-' + data.order_item.id);
      if ($('.order-item-' + data.order_item.id).length > 0) {
        $('.order-item-' + data.order_item.id + ' .order-item-total').text(data.order_item.subtotal);
        $('.order-item-' + data.order_item.id + ' .order-item-quantity').text(data.order_item.quantity);
      } else {
        var new_line_item = generate_line_item(data);
        $('.my-order-items').append(new_line_item);
      }
      $('.order-total .value').text(data.order.subtotal);
    });

    if ( $('.remove-order-item').length > 0 ) {
      $('.remove-order-item').on('ajax:success', function(event, data) {
        window.order_data = data;
        $(this).closest('.order-item').fadeOut();
        $('.order-total .value').text(data.order.subtotal);
        $('.nav-order-item-count').text(data.order.total_items + " items");
        $('.nav-order-total').text(data.order.subtotal);
        if (data.order.total_items === 0) {
          $('.my-order').prepend('<p class="no-order">Sorry, it looks like you have not added any items yet!</p>');
          $('.my-order-items').remove();
          $('.checkout').remove();
          $('.order-total').remove();
          $('.order-checkout').remove();
        }
      });
    }

    var footer = $('.footer');
    var footerTop = footer.position().top;
    var footerHeight = footer.outerHeight();
    var documentHeight = footerTop + footerHeight + 5
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
