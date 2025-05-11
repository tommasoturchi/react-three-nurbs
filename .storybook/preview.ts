import type { Preview } from '@storybook/react'
import './preview.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
  globalTypes: {
    layout: {
      name: 'Layout',
      description: 'Layout for stories',
      defaultValue: 'fullscreen',
      toolbar: {
        icon: 'grid',
        items: [
          { value: 'fullscreen', title: 'Fullscreen' },
          { value: 'centered', title: 'Centered' },
        ],
      },
    },
  },
};

export default preview;