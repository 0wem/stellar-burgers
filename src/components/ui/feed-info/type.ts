export type TFeedStats = {
  total: number;
  totalToday: number;
};

export type FeedInfoUIProps = {
  feed: TFeedStats;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
