import aosJS from "./lib/aos";
import { pagination } from "./lib/pagination";

(() => {

    // =========================== Start of AOS =========================== //
    aosJS.init({
        once: true,
        offset: 50,
        disable: "tablet",
    });

    // Load more pagination for blog posts - infinite scroll is basically disabled - you can set this to true if you want to enable infinite scroll

    pagination(false);


    // =========================== Start of Header =========================== //

    // Header indicator position state
    const headerRef = document.querySelector(".header");
    const navRef = headerRef.querySelector(".navbar");
    const linkRef = navRef.querySelectorAll("a");
    const activeLinkRef = navRef.querySelector(".nav-current") === null ? navRef.querySelectorAll("li:first-child")[0]: navRef.querySelector(".nav-current");
    const navIndicatorRef = headerRef.querySelector(".indicator");
    const hideOnScrollRef = headerRef.querySelectorAll(".hideOnScroll");
    let indicatorPosition = null;
    const navbar = document.querySelector(".navbar");

    const navTogglerRef = headerRef.querySelector(".navToggler");

    // Function to set indicator position
    const setIndicatorPosition = (left, width) => {
      indicatorPosition = { left, width };
      navIndicatorRef.style.left = `${indicatorPosition.left}px`;
      navIndicatorRef.style.width = `${indicatorPosition.width}px`;
    };

    // Update indicator position when active link changes
    window.addEventListener("load", () => {
      if (activeLinkRef) {
        setIndicatorPosition(activeLinkRef.offsetLeft, activeLinkRef.offsetWidth);
      }
      setTimeout(() => {
        navIndicatorRef.style.opacity = 1;
        navIndicatorRef.style.transform = "scaleX(1)";
      }, 280);
    });

    // Handle mouse leave event
    const handleLinkMouseLeave = () => {
      if (activeLinkRef) {
        setIndicatorPosition(activeLinkRef.offsetLeft, activeLinkRef.offsetWidth);
      }
      navbar.classList.remove("nav-hover");
    };
    navRef.addEventListener("mouseleave", handleLinkMouseLeave);

    // Handle mouse enter event
    const handleLinkMouseEnter = (event) => {
      const link = event.currentTarget;
      setIndicatorPosition(link.offsetLeft, link.offsetWidth);
      navbar.classList.add("nav-hover");
    };

    // Handle link click event
    const handleLinkClick = (event) => {
      const link = event.currentTarget;
      activeLinkRef = link;
      setIndicatorPosition(link.offsetLeft, link.offsetWidth);
    };

    linkRef.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkMouseEnter);
      link.addEventListener("click", handleLinkClick);
    });

    // Update Header element position on Scroll
    hideOnScrollRef.forEach((element) => {
      const handleScroll = () => {
        window.scrollY > 50
          ? element.classList.add("scrolled")
          : element.classList.remove("scrolled");
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    });

    // Open-Close Mobile Nav state
    let mobileNavOpen = false;
    const html = document.documentElement;
    const toggleMobileNav = () => {
      mobileNavOpen = !mobileNavOpen;
      if (mobileNavOpen) {
        headerRef.classList.add("navOpen");
      } else {
        headerRef.classList.remove("navOpen");
      }
    };
    navTogglerRef.addEventListener("click", toggleMobileNav);


    // Get all the list items
    var listItems = document.querySelectorAll('.navbar .nav li');

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
window.addEventListener("resize", () => {
    // Additional code...
  setTimeout(() => {
    if (activeLinkRef) {
      setIndicatorPosition(activeLinkRef.offsetLeft, activeLinkRef.offsetWidth);
    }
}, 280);
});

 // Change Header background color on scroll
 window.addEventListener("load", () => {
    const banner = document.querySelector(".trigger");
    const bannerScrollHeight = banner ? banner.scrollHeight + 150 : 0;

    let lastScrollTop = 0;
    let headerVisible = true;

    const handleScroll = () => {
      const currentScrollTop = document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        headerVisible = currentScrollTop <= bannerScrollHeight;
      } else {
        // Scrolling up
        headerVisible = true;
      }

      // Update lastScrollTop
      lastScrollTop = currentScrollTop;

      // Update header visibility
      if (headerVisible) {
        headerRef.classList.remove("invisible");
      } else {
        headerRef.classList.add("invisible");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;

        // Update header visibility based on intersection
        headerRef.classList.toggle("active", !isIntersecting);

        // Handle scroll events only if the banner is not intersecting
        if (!isIntersecting) {
          handleScroll();
        }
      },
      { threshold: [0] }
    );

    if (banner !== null) {
      observer.observe(banner);
    }

    // Add a scroll event listener to handle changes not captured by IntersectionObserver
    window.addEventListener("scroll", handleScroll);
  });

})();
