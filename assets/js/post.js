import ClipboardJS from './lib/clipboard';
import FsLightbox from './lib/fslightbox';

document.addEventListener('DOMContentLoaded', function () {
    const clipboardButton = document.querySelector('.macaw-copy-link');

    if (clipboardButton) {
        initializeClipboard(clipboardButton);
    }

    const images = document.querySelectorAll('.kg-image-card img, .kg-gallery-card img');
    images.forEach(setupLightbox);

    refreshFsLightbox();

    function initializeClipboard(button) {
        new ClipboardJS(button);

        button.addEventListener('click', function (event) {
            event.preventDefault();
            button.classList.add('copy-is-active');
            setTimeout(() => {
                button.classList.remove('copy-is-active');
            }, 3000);
        });
    }

    function setupLightbox(image) {
        const wrapper = createLightboxWrapper(image.src);
        image.parentNode.insertBefore(wrapper, image.parentNode.firstChild);
        wrapper.appendChild(image);
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
