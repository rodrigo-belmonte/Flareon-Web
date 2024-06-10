import React from "react";
import Router from "next/router";
import { parseCookies } from "nookies";

const login = "/login"; // Define your login route address.

const withAuth = Component => {
  const Auth = (props) => {
    // Login data added to props via redux-store (or use react context for example)
    const cookies = parseCookies();
    // If user is not logged in, return login component
    const isClient = typeof document !== 'undefined';

    if (isClient && !cookies.token) {
      Router.replace(login);
    }

    // If user is logged in, return original component
    return (
      <Component {...props} />
    );
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;


// // eslint-disable-next-line import/no-anonymous-default-export
// export default WrappedComponent => {
//   const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

//   hocComponent.getStaticPropswhich = async (context) => {
//     const userAuth = await checkUserAuthentication();

//     // Are you an authorized user or not?
//     if (!userAuth?.auth) {
//       // Handle server-side and client-side rendering.
//       if (context.res) {
//         context.res?.writeHead(302, {
//           Location: login,
//         });
//         context.res?.end();
//       } else {
//         Router.replace(login);
//       }
//     } else if (WrappedComponent.getStaticPropswhich) {
//       const wrappedProps = await WrappedComponent.getStaticPropswhich({...context, auth: userAuth});
//       return { ...wrappedProps, userAuth };
//     }

//     return { userAuth };
//   };

//   return hocComponent;
// };
