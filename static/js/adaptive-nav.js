(function () {
  "use strict";

  const DESKTOP_BREAKPOINT = 992;

  function AdaptiveNav(root) {
    this.root = root;
    this.primaryNav = root.querySelector("[data-nav-primary]");
    this.overflowToggle = root.querySelector("[data-nav-overflow-toggle]");
    this.overflowMenu = root.querySelector("[data-nav-overflow-menu]");
    this.searchToggle = root.querySelector("[data-nav-search-toggle]");
    this.searchForm = root.querySelector("[data-nav-search-form]");
    this.searchInput = this.searchForm ? this.searchForm.querySelector("input[name='s']") : null;
    this.originalItems = this.primaryNav ? Array.prototype.slice.call(this.primaryNav.children) : [];
    this.resizeTimer = null;

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleEscape = this.handleEscape.bind(this);
  }

  AdaptiveNav.prototype.init = function () {
    if (!this.primaryNav || !this.overflowToggle || !this.overflowMenu || !this.searchToggle || !this.searchForm) {
      return;
    }

    this.bindEvents();
    this.syncLayout();
  };

  AdaptiveNav.prototype.bindEvents = function () {
    this.overflowToggle.addEventListener("click", (event) => {
      event.preventDefault();
      this.toggleOverflowMenu();
    });

    this.searchToggle.addEventListener("click", (event) => {
      event.preventDefault();
      this.toggleSearchPanel();
    });

    document.addEventListener("click", this.handleDocumentClick);
    document.addEventListener("keydown", this.handleEscape);
    globalThis.addEventListener("resize", this.handleResize);
  };

  AdaptiveNav.prototype.handleResize = function () {
    globalThis.clearTimeout(this.resizeTimer);
    this.resizeTimer = globalThis.setTimeout(() => {
      this.syncLayout();
    }, 90);
  };

  AdaptiveNav.prototype.handleEscape = function (event) {
    if (event.key === "Escape") {
      this.closeOverflowMenu();
      this.closeSearchPanel();
    }
  };

  AdaptiveNav.prototype.handleDocumentClick = function (event) {
    if (!this.root.contains(event.target)) {
      this.closeOverflowMenu();
      this.closeSearchPanel();
    }
  };

  AdaptiveNav.prototype.syncLayout = function () {
    const isDesktop = globalThis.innerWidth >= DESKTOP_BREAKPOINT;

    this.restorePrimaryItems();
    this.closeOverflowMenu();
    this.closeSearchPanel();

    if (!isDesktop) {
      this.root.classList.remove("adaptive-nav-ready");
      this.searchToggle.hidden = true;
      this.overflowToggle.hidden = true;
      this.overflowMenu.hidden = true;
      return;
    }

    this.root.classList.add("adaptive-nav-ready");
    this.searchToggle.hidden = false;
    this.distributeOverflowItems();
  };

  AdaptiveNav.prototype.restorePrimaryItems = function () {
    if (!this.primaryNav) {
      return;
    }

    for (const item of this.originalItems) {
      if (item.parentElement !== this.primaryNav) {
        this.primaryNav.appendChild(item);
      }
    }
  };

  AdaptiveNav.prototype.distributeOverflowItems = function () {
    let guard = this.originalItems.length;

    while (this.isPrimaryOverflowing() && this.primaryNav.children.length > 1 && guard > 0) {
      this.moveLastPrimaryItemToOverflow();
      guard -= 1;
    }

    if (this.overflowMenu.children.length > 0) {
      this.overflowToggle.hidden = false;

      while (this.isPrimaryOverflowing() && this.primaryNav.children.length > 1 && guard > 0) {
        this.moveLastPrimaryItemToOverflow();
        guard -= 1;
      }
    } else {
      this.overflowToggle.hidden = true;
    }

    this.overflowMenu.hidden = true;
  };

  AdaptiveNav.prototype.isPrimaryOverflowing = function () {
    if (!this.primaryNav) {
      return false;
    }

    return this.primaryNav.scrollWidth > this.primaryNav.clientWidth + 1;
  };

  AdaptiveNav.prototype.moveLastPrimaryItemToOverflow = function () {
    const lastItem = this.primaryNav.lastElementChild;
    if (!lastItem) {
      return;
    }

    this.overflowMenu.insertBefore(lastItem, this.overflowMenu.firstElementChild);
  };

  AdaptiveNav.prototype.toggleOverflowMenu = function () {
    if (this.overflowToggle.hidden) {
      return;
    }

    const willOpen = this.overflowMenu.hidden;
    this.closeSearchPanel();
    this.overflowMenu.hidden = !willOpen;
    this.overflowToggle.setAttribute("aria-expanded", String(willOpen));
  };

  AdaptiveNav.prototype.closeOverflowMenu = function () {
    this.overflowMenu.hidden = true;
    this.overflowToggle.setAttribute("aria-expanded", "false");
  };

  AdaptiveNav.prototype.toggleSearchPanel = function () {
    if (!this.root.classList.contains("adaptive-nav-ready")) {
      return;
    }

    const willOpen = !this.root.classList.contains("is-search-open");
    this.closeOverflowMenu();
    this.root.classList.toggle("is-search-open", willOpen);
    this.searchToggle.setAttribute("aria-expanded", String(willOpen));

    if (willOpen && this.searchInput) {
      this.searchInput.focus();
    }
  };

  AdaptiveNav.prototype.closeSearchPanel = function () {
    this.root.classList.remove("is-search-open");
    this.searchToggle.setAttribute("aria-expanded", "false");
  };

  document.addEventListener("DOMContentLoaded", function () {
    const roots = document.querySelectorAll("[data-adaptive-nav]");
    for (const root of roots) {
      const nav = new AdaptiveNav(root);
      nav.init();
    }
  });
})();
