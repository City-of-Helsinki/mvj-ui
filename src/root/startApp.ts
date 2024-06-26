import configureStore, { history } from "./configureStore";
import renderApp from "./renderApp";
import Root from "./Root";
export const store = configureStore();
export default (() => {
  const rootProps = {
    history,
    store
  };
  renderApp(Root, rootProps);

  if (module.hot) {
    module.hot.accept('./Root', () => {
      const nextRootComponent = require('./Root').default;

      renderApp(nextRootComponent, rootProps);
    });
  } // if (process.env.NODE_ENV === 'production') {
  //   require('./enableOfflineMode');
  // }

});