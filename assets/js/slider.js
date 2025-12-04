import Splide from './lib/splide.js'; // Import Splider Slider


new Splide( '.splide',{
    type   : "loop",
    perPage: 2,
    perMove: 1,
    clones: 2,
    pagination: false,
    gap: '3.33rem',
    padding: {
        left: '3.33rem',
        right: '3.33rem'
    },
    reducedMotion:{
        speed      : 400,
        rewindSpeed: 400,
    },
    breakpoints: {
		768: {
			perPage: 1,
            gap: '1.5rem',
            padding: {
                left: '1.5rem',
                right: '1.5rem'
            }
	    },
		1024: {
			perPage: 2,
            gap: '1.5rem',
            padding: {
                left: '1.5rem',
                right: '1.5rem'
            }
	    }
  }
} ).mount();
