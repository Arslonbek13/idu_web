function hidePreloader() {
    $("#status, #preloader").stop(true, true).hide();
    $("body").css({
        overflow: "visible"
    });
}

function initHeadlineTicker() {
    const tickers = document.querySelectorAll("[data-news-ticker]");

    tickers.forEach(function (root) {
        const items = Array.prototype.slice.call(root.querySelectorAll(".news_sticker_item"));
        const prevButton = root.querySelector("[data-ticker-prev]");
        const nextButton = root.querySelector("[data-ticker-next]");
        let activeIndex = 0;
        let autoplayId = null;
        const autoplayDelay = 5000;

        if (!items.length) {
            return;
        }

        function showItem(index) {
            activeIndex = (index + items.length) % items.length;

            items.forEach(function (item, itemIndex) {
                const isActive = itemIndex === activeIndex;
                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-hidden", String(!isActive));
            });
        }

        function stopAutoplay() {
            if (autoplayId) {
                globalThis.clearInterval(autoplayId);
                autoplayId = null;
            }
        }

        function startAutoplay() {
            if (items.length < 2) {
                return;
            }

            stopAutoplay();
            autoplayId = globalThis.setInterval(function () {
                showItem(activeIndex + 1);
            }, autoplayDelay);
        }

        const initialIndex = items.findIndex(function (item) {
            return item.classList.contains("is-active");
        });

        root.classList.add("ticker-ready");
        showItem(Math.max(initialIndex, 0));

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
        const $list = $(this);
        const $container = $list.closest(".latest_post_container");
        const itemCount = $list.children("li").length;
        let rowHeight = 110;

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
    $(globalThis).on("scroll", function () {
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

jQuery(globalThis).on("load pageshow", function () {
    hidePreloader();
});

setTimeout(hidePreloader, 1200);
