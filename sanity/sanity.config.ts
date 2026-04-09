import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import schemas from './schemas/index';

export default defineConfig({
  name: 'default',
  title: 'Portfolio Personal',

  projectId: 'zoh6ht03',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemas,
  },
});
