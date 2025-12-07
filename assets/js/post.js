import ClipboardJS from './lib/clipboard.js';
import FsLightbox from './lib/fslightbox.js';

document.addEventListener('DOMContentLoaded', function () {
    const clipboardButton = document.querySelector('.macaw-copy-link');

    if (clipboardButton) {
        initializeClipboard(clipboardButton);
    }

    const images = document.querySelectorAll('.kg-image-card img, .kg-gallery-card img');
    if (images.length > 0) {
        images.forEach(setupLightbox);
        // Initialize FsLightbox after images are set up
        if (typeof FsLightbox !== 'undefined') {
            FsLightbox.props.sources = Array.from(images).map(img => img.src);
        }
    }

    function initializeClipboard(button) {
        try {
            new ClipboardJS(button);

            button.addEventListener('click', function (event) {
                event.preventDefault();
                button.classList.add('copy-is-active');
                setTimeout(() => {
                    button.classList.remove('copy-is-active');
                }, 3000);
            });
        } catch (error) {
            console.warn('Clipboard initialization failed:', error);
        }
    }

    function setupLightbox(image) {
        if (!image || !image.parentNode) return;
        
        try {
            const wrapper = createLightboxWrapper(image.src);
            image.parentNode.insertBefore(wrapper, image.parentNode.firstChild);
            wrapper.appendChild(image);
        } catch (error) {
            console.warn('Lightbox setup failed:', error);
        }
    }

    function createLightboxWrapper(src) {
        const wrapper = document.createElement('a');
        wrapper.setAttribute('data-no-swup', '');
        wrapper.setAttribute('data-fslightbox', '');
        wrapper.setAttribute('href', src);
        wrapper.setAttribute('aria-label', 'Click for Lightbox');
        return wrapper;
    }
});
