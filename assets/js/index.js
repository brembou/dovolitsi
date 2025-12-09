import aosJS from "./lib/aos";
import { pagination } from "./lib/pagination";

(() => {

    // Odstranění no-js třídy pro zobrazení JS funkcionalit
    document.documentElement.classList.remove('no-js');

    // =========================== Start of AOS =========================== //
    aosJS.init({
        once: true,
        offset: 50,
        disable: "tablet",
    });

    // Load more pagination for blog posts - infinite scroll is basically disabled - you can set this to true if you want to enable infinite scroll

    pagination(false);


    // =========================== Start of Header =========================== //

    // Constants
    const SCROLL_THRESHOLD = 50;
    const INDICATOR_ANIMATION_DELAY = 280;

    // Header indicator position state
    const headerRef = document.querySelector(".header");
    if (!headerRef) return; // Early exit if header doesn't exist

    const navRef = headerRef.querySelector(".navbar");
    if (!navRef) return;

    const linkRef = navRef.querySelectorAll("a");
    const navCurrent = navRef.querySelector(".nav-current");
    const firstNavItem = navRef.querySelector("li:first-child");
    const activeLinkRef = navCurrent || firstNavItem;
    const navIndicatorRef = headerRef.querySelector(".indicator");
    const hideOnScrollRef = headerRef.querySelectorAll(".hideOnScroll");
    let indicatorPosition = null;
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const navTogglerRef = headerRef.querySelector(".navToggler");
    if (!navTogglerRef) return;

    // Function to set indicator position
    const setIndicatorPosition = (left, width) => {
      indicatorPosition = { left, width };
      navIndicatorRef.style.left = `${indicatorPosition.left}px`;
      navIndicatorRef.style.width = `${indicatorPosition.width}px`;
    };

    // Update indicator position when active link changes
    window.addEventListener("load", () => {
      if (activeLinkRef && navIndicatorRef) {
        setIndicatorPosition(activeLinkRef.offsetLeft, activeLinkRef.offsetWidth);
      }
      if (navIndicatorRef) {
        setTimeout(() => {
          navIndicatorRef.style.opacity = 1;
          navIndicatorRef.style.transform = "scaleX(1)";
        }, INDICATOR_ANIMATION_DELAY);
      }
    });

    // Handle mouse leave event
    const handleLinkMouseLeave = () => {
      if (activeLinkRef && navIndicatorRef) {
        setIndicatorPosition(activeLinkRef.offsetLeft, activeLinkRef.offsetWidth);
      }
      if (navbar) {
        navbar.classList.remove("nav-hover");
      }
    };
    if (navRef) {
      navRef.addEventListener("mouseleave", handleLinkMouseLeave);
    }

    // Handle mouse enter event
    const handleLinkMouseEnter = (event) => {
      const link = event.currentTarget;
      if (navIndicatorRef) {
        setIndicatorPosition(link.offsetLeft, link.offsetWidth);
      }
      if (navbar) {
        navbar.classList.add("nav-hover");
      }
    };

    // Handle link click event
    let currentActiveLinkRef = activeLinkRef;
    const handleLinkClick = (event) => {
      const link = event.currentTarget;
      currentActiveLinkRef = link;
      if (navIndicatorRef) {
        setIndicatorPosition(link.offsetLeft, link.offsetWidth);
      }
      // Close mobile menu when clicking on a link (mobile only)
      if (mobileNavOpen && window.innerWidth < 1024) {
        toggleMobileNav();
      }
    };

    linkRef.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkMouseEnter);
      link.addEventListener("click", handleLinkClick);
    });

    // Update Header element position on Scroll
    hideOnScrollRef.forEach((element) => {
      const handleScroll = () => {
        if (window.scrollY > SCROLL_THRESHOLD) {
          element.classList.add("scrolled");
        } else {
          element.classList.remove("scrolled");
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
    });

    // Open-Close Mobile Nav state
    let mobileNavOpen = false;
    const navOverlayRef = document.querySelector(".navOverlay");
    const toggleMobileNav = () => {
      if (!headerRef) return;
      mobileNavOpen = !mobileNavOpen;
      if (mobileNavOpen) {
        headerRef.classList.add("navOpen");
        document.documentElement.classList.add("navOpen");
        document.body.classList.add("navOpen");
        if (navOverlayRef) {
          navOverlayRef.classList.add("navOverlayVisible");
        }
        // Prevent body scroll when menu is open
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
      } else {
        headerRef.classList.remove("navOpen");
        document.documentElement.classList.remove("navOpen");
        document.body.classList.remove("navOpen");
        if (navOverlayRef) {
          navOverlayRef.classList.remove("navOverlayVisible");
        }
        // Restore body scroll
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
      }
    };
    if (navTogglerRef) {
      navTogglerRef.addEventListener("click", toggleMobileNav);
    }
    // Close menu when clicking on overlay
    if (navOverlayRef) {
      navOverlayRef.addEventListener("click", () => {
        if (mobileNavOpen) {
          toggleMobileNav();
        }
      });
    }


    // Get all the list items
    const listItems = document.querySelectorAll('.navbar .nav li');

    // Add event listeners to each list item
    listItems.forEach(function(item) {
        item.addEventListener('mouseover', function() {
        // Add the 'nav-active' class on hover
        item.classList.add('nav-active');
        });

        item.addEventListener('mouseout', function() {
        // Remove the 'nav-active' class on mouseout
        item.classList.remove('nav-active');
        });
    });
// Event listener for window resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (currentActiveLinkRef && navIndicatorRef) {
      setIndicatorPosition(currentActiveLinkRef.offsetLeft, currentActiveLinkRef.offsetWidth);
    }
  }, INDICATOR_ANIMATION_DELAY);
}, { passive: true });


})();
