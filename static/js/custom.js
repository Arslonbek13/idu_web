function hidePreloader() {
    $("#status, #preloader").stop(true, true).hide();
    $("body").css({
        overflow: "visible"
    });
}

function initHeadlineTicker() {
    var tickers = document.querySelectorAll("[data-news-ticker]");

    tickers.forEach(function (root) {
        var items = Array.prototype.slice.call(root.querySelectorAll(".news_sticker_item"));
        var prevButton = root.querySelector("[data-ticker-prev]");
        var nextButton = root.querySelector("[data-ticker-next]");
        var activeIndex = 0;
        var autoplayId = null;
        var autoplayDelay = 5000;

        if (!items.length) {
            return;
        }

        function showItem(index) {
            activeIndex = (index + items.length) % items.length;

            items.forEach(function (item, itemIndex) {
                var isActive = itemIndex === activeIndex;
                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-hidden", String(!isActive));
            });
        }

        function stopAutoplay() {
            if (autoplayId) {
                window.clearInterval(autoplayId);
                autoplayId = null;
            }
        }

        function startAutoplay() {
            if (items.length < 2) {
                return;
            }

            stopAutoplay();
            autoplayId = window.setInterval(function () {
                showItem(activeIndex + 1);
            }, autoplayDelay);
        }

        var initialIndex = items.findIndex(function (item) {
            return item.classList.contains("is-active");
        });

        root.classList.add("ticker-ready");
        showItem(initialIndex >= 0 ? initialIndex : 0);

        if (items.length < 2) {
            if (prevButton) {
                prevButton.hidden = true;
            }
            if (nextButton) {
                nextButton.hidden = true;
            }
            return;
        }

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                showItem(activeIndex - 1);
                startAutoplay();
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                showItem(activeIndex + 1);
                startAutoplay();
            });
        }

        root.addEventListener("mouseenter", stopAutoplay);
        root.addEventListener("mouseleave", startAutoplay);
        root.addEventListener("focusin", stopAutoplay);
        root.addEventListener("focusout", function (event) {
            if (!root.contains(event.relatedTarget)) {
                startAutoplay();
            }
        });

        startAutoplay();
    });
}

function initHeroSlider() {
    if (!$.fn.slick || !$(".slick_slider").length) {
        return;
    }

    $(".slick_slider").slick({
        dots: true,
        arrows: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        adaptiveHeight: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        cssEase: "ease"
    });
}

function initLatestPostTicker() {
    if (!$.fn.newsTicker || !$(".latest_postnav").length) {
        return;
    }

    $(".latest_postnav").each(function () {
        var $list = $(this);
        var $container = $list.closest(".latest_post_container");
        var itemCount = $list.children("li").length;
        var rowHeight = 110;

        if (itemCount < 2) {
            $container.find(".latest_post_control").hide();
            return;
        }

        if ($list.children("li").first().outerHeight(true)) {
            rowHeight = Math.max($list.children("li").first().outerHeight(true), rowHeight);
        }

        $list.newsTicker({
            row_height: rowHeight,
            max_rows: 4,
            speed: 600,
            duration: 4000,
            prevButton: $container.find("#prev-button"),
            nextButton: $container.find("#next-button")
        });
    });
}

function initMediaGallery() {
    if (!$.fn.fancybox || !$(".fancybox-buttons").length) {
        return;
    }

    $(".fancybox-buttons").fancybox({
        prevEffect: "none",
        nextEffect: "none",
        closeBtn: true,
        helpers: {
            title: {
                type: "inside"
            },
            buttons: {}
        }
    });
}

function initScrollToTop() {
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 300) {
            $(".scrollToTop").fadeIn();
        } else {
            $(".scrollToTop").fadeOut();
        }
    });

    $(".scrollToTop").on("click", function () {
        $("html, body").animate({
            scrollTop: 0
        }, 700);
        return false;
    });
}

jQuery(document).ready(function () {
    initHeroSlider();
    initLatestPostTicker();
    initMediaGallery();
    initScrollToTop();
    initHeadlineTicker();
});

jQuery(window).on("load pageshow", function () {
    hidePreloader();
});

setTimeout(hidePreloader, 1200);
