import { FeedInfoUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';
import type { TFeedStats } from '../components/ui/feed-info/type';

const meta = {
  title: 'Example/FeedInfo',
  component: FeedInfoUI,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FeedInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const feedStats: TFeedStats = {
  total: 12,
  totalToday: 2
};

export const DefaultFeedInfo: Story = {
  args: {
    feed: feedStats,
    readyOrders: [123, 124, 125],
    pendingOrders: [126, 127]
  }
};

