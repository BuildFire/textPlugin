import buildfire from 'buildfire';

const Layouts = {
  1: 'WideScreen',
  2: 'Cinema'
}

const defaultData = {
  content: {
    text: "",
    carouselImages : []
  },
  design: {
    backgroundImage: null,
    selectedLayout: 1
  }
};

const state = {
  height: window.innerHeight,
  width: window.innerWidth,
  carouselInstance: null,
  data: {
    content: {
      carouselImages: [],
      text: ''
    },
    design: {
      backgroundImage: null,
      selectedLayout: 1
    }
  }
};

function init() {
  // Get initial data state
  buildfire.datastore.get((err, result) => {
    if (err) return console.error(err);
    state.data = result.data && result.data.content
      ? result.data
      : defaultData;
    !state.data.design ? state.data.design = defaultData.design : null;
    render();
  });

  // Keep state up to date with control changes
  buildfire.datastore.onUpdate((result) => {
    state.data = result.data;
    !state.data.design ? state.data.design = defaultData.design : null;
    render();
  });
}

function render() {
  const { design, content } = state.data;
  const textContainer = window.document.getElementById('text');

  renderCarousel();

  // Set background image if needed
  if (design && design.backgroundImage) {
    const width = Math.ceil(state.width);
    const height = Math.ceil(state.height);

    const baseUrl = 'https://czi3m2qn.cloudimg.io/cdn/n/n';
    const url = `${baseUrl}/${design.backgroundImage}?h=${height}&w=${width}`;

    window.document.body.setAttribute('style', `
      background-size: cover !important;
      background-image: url(${url}) !important;
    `);
  } else {
    window.document.body.style.backgroundImage = '';
  }

  // Render HTML content
  textContainer.innerHTML = content.text;

  try {
    buildfire.appearance.ready();
  } catch (err) {
    console.log('appearance.ready() failed, is sdk up to date?');
  }
}


function renderCarousel() {
  const { carouselImages } = state.data.content;
  const { selectedLayout } = state.data.design;
  const carouselContainer = window.document.getElementById('carousel');

  // Toggle carousel container visibility
  carouselContainer.style.display = carouselImages.length
    ? 'block' : 'none';

  // Don't do anything if we don't have carousel images
  if (!carouselImages.length) return;

  // Set the proper size to the carousel container
  carouselContainer.style.height = selectedLayout === 1
    ? `${Math.ceil(9 * state.width / 16.7)}px`
    : `${Math.ceil(1 * state.width / 2.5)}px`;

  // Destroy the carousel if we already have one
  if (state.carouselInstance && state.carouselInstance.lorySlider) {
    state.carouselInstance.lorySlider.destroy();
    carouselContainer.innerHTML = '';
    delete state.carouselInstance;
  }

  // Initialize carousel
  state.carouselInstance = new buildfire.components.carousel.view({
    selector: carouselContainer,
    layout: Layouts[state.data.design.selectedLayout],
    items: carouselImages
  });
}

init();
