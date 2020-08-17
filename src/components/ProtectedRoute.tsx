import React from "react";
import { Redirect, Route, RouteProps } from "react-router";

export interface ProtectedRouteProps extends RouteProps {
  isAuthenticated: boolean;
  authenticationPath: string;
  setRedirectUrl: (path?: string) => void;
}

function ProtectedRoute(props: ProtectedRouteProps) {
  if (!props.isAuthenticated) {
    props.setRedirectUrl(
      Array.isArray(props.path) ? props.path[0] : props.path
    );

    const renderComponent = () => <Redirect to={props.authenticationPath} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
}

export default ProtectedRoute;
