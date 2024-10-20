
/*
    Require JQuery 3.7.1+ 
    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="yastrekit-0.2.3.js"></script>

    Hello World. YastreKit JS, 0.2.3.
    By DimaYastrebov, https://www.dimayastrebov.website.

    2022-2024.
*/

$(document).ready(function () {
    /* Menu Module */

    $('header .mobile .mobile-item').click(function () {
        const mobileMenu = $(this).closest('.mobile');
        mobileMenu.toggleClass('opened');
    });

    $('.toggle-switch').click(function () {
        if ($(this).attr('enabled') === 'true') {
            $(this).attr('enabled', 'false');
        } else {
            $(this).attr('enabled', 'true');
        }
    });  

    /* ToolTip Module */

    const $icons = $('.tipBox');
    const $tooltips = $('.tooltip');

    $icons.each(function () {
        const $icon = $(this);
        const $tooltip = $icon.find('.tooltip');
        let timeout;

        if ($tooltip.length) {
            $icon.on('mouseover', function () {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    if ($icon.is(':hover')) {
                        $tooltip.css('opacity', '1');
                    }
                }, 500);
            });

            $icon.on('mousemove', function (event) {
                const x = event.clientX;
                const y = event.clientY;
                const offsetX = 21;
                const offsetY = 21;

                $tooltip.css({
                    left: `${x + offsetX}px`,
                    top: `${y + offsetY}px`
                });
            });

            $icon.on('mouseout', function () {
                $icon.find('.tooltip').css('opacity', '0');
            });
        }
    });

    $tooltips.each(function () {
        const $tooltip = $(this);

        $tooltip.on('mouseover', function () {
            $tooltip.css('opacity', '0');
            clearTimeout(timeout);
        });

        $tooltip.on('mouseout', function () {
            $tooltip.css('opacity', '0');
        });
    });

    /* Tabs Module */

    $(".tabs-container").each(function () {
        var $container = $(this);
        var $tabs = $container.find(".tabs");
        var $tablinks = $tabs.find(".tablinks");
        var $tabcontents = $container.find(".tabcontent");

        $tablinks.on("click", function () {
            var tabId = $(this).attr("itab");
            var $tabcontent = $container.find('.tabcontent[itab="' + tabId + '"]');
            var $activeTab = $container.find('.tabcontent.active');

            if ($activeTab.length) {
                $activeTab.removeClass("active");
            }

            $tabcontent.addClass("active");

            var $activeTabLink = $tabs.find('.tablinks.active');

            if ($activeTabLink.length) {
                $activeTabLink.removeClass("active");
            }

            $(this).addClass("active");
        });

        var $defaultTabLink = $tabs.find('.tablinks[itab="1"]');
        if ($defaultTabLink.length) {
            $defaultTabLink.trigger("click");
        }
    });

    /* Code Block Module */

    $("code").each(function () {
        var codeContent = $(this).html();
        if ($(this).hasClass("noCode")) {
            $(this).text(codeContent);
        } else {
            $(this).html(codeContent);
        }
    });

    /* Accordions Module */

    $("accordions").each(function () {
        var $accords = $(this).find("accord");

        $accords.each(function () {
            var $accordHeader = $(this).find("accordHeader");
            $accordHeader.on("click", function () {
                $accords.not($(this).parent()).removeClass("opened");
                $(this).parent().toggleClass("opened");
            });
        });
    });

    $('accordcontent').each(function () {
        var nestedContent = $(this);

        if (nestedContent[0].scrollHeight > 800) {
            nestedContent.css('overflow-y', 'auto');
        } else {
            nestedContent.css('overflow-y', 'hidden');
        }
    });
})

document.addEventListener("DOMContentLoaded", function () {
    /* Window Module */

    var windowIds = [];

    function windowListUpdate() {
        const Windows = document.querySelectorAll("window");

        Windows.forEach(win => {
            const id = win.id;
            const isModal = win.getAttribute("modal") ? true : false;

            windowIds.push({ id, isModal });
        });
    }

    function isWindowOpen(windowId) {
        const win = document.getElementById(windowId);
        return win.classList.contains("opened");
    }

    function isWindowModal(windowId) {
        const win = windowIds.find(win => win.id === windowId);
        return win ? win.isModal : false;
    }

    function windowAddEventListeners(windowId) {
        const win = document.getElementById(windowId);

        const winOpen = document.querySelectorAll(`.openWindow${windowId}`);
        const winClose = win.querySelector(".close");

        winOpen.forEach(button => {
            button.addEventListener("click", function () {
                toggleWindowOpen(windowId);
            });
        });

        winClose.addEventListener("click", function () {
            windowClose(windowId);
        });
    }

    function setWindowWrapper(state, isModal) {
        const wrapper = document.querySelector("window-wrapper");

        switch (state) {
            case "open":
                wrapper.classList.add("opened");
                if (isModal) {
                    wrapper.setAttribute("modal", true);
                }
                break;
            case "close":
                if (isModal) {
                    wrapper.removeAttribute("modal");
                }
                wrapper.classList.remove("opened");
        }
    }

    function setWindowHash(state, windowId) {
        if (state === "open") {
            history.pushState(null, "", `#${windowId}`);
        } else if (state === "close") {
            if (location.hash === `#${windowId}`) {
                history.pushState(null, "", " ");
            }
        }
    }

    function windowOpen(windowId) {
        const win = document.getElementById(windowId);
        var opened = isWindowOpen(windowId);

        if (!opened) {
            setWindowHash("open", windowId);
            setTimeout(() => {
                win.classList.add("opened");
            }, 100);
        }
    }

    function windowClose(windowId) {
        const win = document.getElementById(windowId);
        var opened = isWindowOpen(windowId);

        if (opened) {
            const isModal = isWindowModal(windowId);

            setTimeout(() => {
                win.classList.add('closed');

                setTimeout(() => {
                    win.classList.remove('opened', 'closed');
                    setWindowHash("close", windowId);
                    setTimeout(() => {
                        setWindowWrapper("close", isModal);
                    }, 350);
                }, 300);
            }, 250);
        }
    }

    function windowCloseAll() {
        const openWindows = document.querySelectorAll("window.opened");

        openWindows.forEach(win => {
            const id = win.id;

            win.classList.add('closed');

            win.addEventListener('transitionend', function handleTransitionEnd() {
                win.classList.remove('opened', 'closed');
                win.removeEventListener('transitionend', handleTransitionEnd);
                setWindowHash("close", id);
            });
        });
    }

    function toggleWindowOpen(windowId) {
        const openWindows = document.querySelectorAll('window.opened');
        openWindows.forEach(win => {
            win.classList.add('closed');

            win.addEventListener('transitionend', function handleTransitionEnd() {
                win.classList.remove('opened', 'closed');
                win.removeEventListener('transitionend', handleTransitionEnd);
                setWindowHash("close", win.id);
            });
        });

        const win = document.getElementById(windowId);
        const isModal = isWindowModal(windowId);
        if (win) {
            if (isWindowOpen(windowId)) {
                setWindowWrapper("close", isModal);

                setTimeout(() => {
                    windowClose(windowId);
                }, 350);
            } else {
                setWindowWrapper("open", isModal);

                setTimeout(() => {
                    windowOpen(windowId);
                }, 550);
            }
        }
    }

    function checkHashAndOpenWindow() {
        const hash = location.hash.slice(1);
        if (hash) {
            const win = document.getElementById(hash);
            if (win) {
                setWindowWrapper("open", isWindowModal(hash));
                windowOpen(hash);
            }
        }
    }

    windowListUpdate();

    windowIds.forEach(({ id }) => {
        windowAddEventListeners(id);
        isWindowModal(id);
    });

    checkHashAndOpenWindow();
});