import buildfire from 'buildfire';

const Layouts = {
  1: 'WideScreen',
  2: 'Cinema'
}

const defaultData = {
  content: {
    text :
      '<p>The WYSIWYG (which stands for What You See Is What You Get) allows you to do some really cool stuff. You can add images like this</p>\
      <p><img src="https://static.pexels.com/photos/12057/pexels-photo-12057-large.jpeg" alt="" width="100%" height="auto" /></p>\
      <p>You can even create links like these:<br /> Link to web content like <a href="http://www.google.com">this</a><br /> Link to a phone number like this <a href="tel: 8005551234">8005551234</a><br /> Link to an email like this <a href="mailto:noreply@google.com">noreply@google.com</a></p>\
      <p>Want to add some super cool videos about this item? You can do that too!</p>\
      <p><iframe src="https://www.youtube.com/embed/wTcNtgA6gHs" width="100%" height="auto" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\
      <p>You can create bulleted and numbered lists like this:</p>\
      <ul>\
      <li>This is an item in a list</li>\
      <li>This is another item in a list</li>\
      <li>This is a last item in a list</li>\
      </ul>\
      <p>Want more info? Check out our tutorial by clicking the help button at the top of this page.</p>',

    carouselImages : [
      {"action":"noAction","iconUrl":"http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/5db61d30-0854-11e6-8963-f5d737bc276b.jpg","title":"image 1"},{"action":"noAction","iconUrl":"http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/31c88a00-0854-11e6-8963-f5d737bc276b.jpeg","title":"image 2"}
    ]
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
