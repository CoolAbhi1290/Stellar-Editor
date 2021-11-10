import * as RootContextListing from 'components/ContextMenu/types/root';

const toolbarBenchmark: RootContextListing.contextMenuListing = {
  x: 0,
  y: 0,
  listing: [
    {
      type: 'text_button',
      onClick: () => alert('Woo! You clicked me!'),
      text: 'Click me :)',
    },
  ],
};

export default toolbarBenchmark;
