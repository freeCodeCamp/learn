export default () => `
  function unregisterServiceWorkers(registrations) {
    let count = 0;
    for (let registration of registrations) {
      console.info('unregistering service worker');
      registration.unregister();
      count++;
  }
  console.info('unregistered %d service workers', count);
  }

  if (
    typeof window !== 'undefined' &&
    'navigator' in window &&
    'serviceWorker' in navigator
  ) {
    console.info('finding service workers');
    navigator.serviceWorker.getRegistrations().then(unregisterServiceWorkers);
  }
`;
