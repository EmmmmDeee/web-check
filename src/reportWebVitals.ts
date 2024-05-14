import { ReportHandler } from 'web-vitals';

type WebVitalsFunctions = {
  getCLS: (handler: ReportHandler) => void;
  getFID: (handler: ReportHandler) => void;
  getFCP: (handler: ReportHandler) => void;
  getLCP: (handler: ReportHandler) => void;
  getTTFB: (handler: ReportHandler) => void;
};

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (!onPerfEntry || typeof onPerfEntry !== 'function') {
    console.warn('onPerfEntry is not a function');
    return;
  }

  let webVitalsModule: { default: WebVitalsFunctions } | null = null;

  const loadWebVitals = async () => {
    webVitalsModule = await import('web-vitals');
  };

  loadWebVitals().catch((error) => {
    console.error('Failed to load web-vitals module:', error);
  });

  if (webVitalsModule) {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitalsModule.default;
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
