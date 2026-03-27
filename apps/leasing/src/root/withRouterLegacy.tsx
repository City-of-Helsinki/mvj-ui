import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Location, Params, NavigateFunction } from "react-router-dom";

export type WithRouterProps = {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
};
/** Created to ease migrating react-router v5->v6 as it removed withRouter,
 * and many class based components still exist that can't use hooks.
 * Usage should be incrementally replaced with hooks as more class based
 * components are converted to functional components.
 */
export function withRouterLegacy<P extends object>(
  Component: React.ComponentType<P & WithRouterProps>,
) {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <Component
        {...props}
        location={location}
        navigate={navigate}
        params={params}
      />
    );
  }
  return ComponentWithRouterProp;
}
