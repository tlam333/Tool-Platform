type WindowWithDataLayer = Window & {
  dataLayer: Record<string, any>[];
};

declare const window: WindowWithDataLayer;

export const pageview = (url: string) => {
  if (typeof window.dataLayer !== "undefined") {
    window.dataLayer.push({
      event: "pageview",
      page: url,
    });
  }
};

type GTagEvent = {
  event: string;
  params: any;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const gaEvent = ({ event, params }: GTagEvent): void => {
  if (typeof window.dataLayer !== "undefined") {
    window.dataLayer.push({
      event: event,
      params,
    });
  }
};
