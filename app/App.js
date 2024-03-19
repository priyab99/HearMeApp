import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRoutes } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';


//creating the AuthenticatedUserContext
export const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>{children}
    </AuthenticatedUserContext.Provider>
  );
};

const App = () => {
  // Using the AuthenticatedUserContext
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    return unsubscribeAuth; // Unsubscribing auth listener on unmount
  }, [user]);



  // Conditional rendering based on authentication state
  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  const routes = useRoutes(() => [
    // Authenticated routes
    { path: '/posts', component: PostsScreen, isPublic: user },
    { path: '/profile', component: ProfileScreen, isPublic: user },
    { path: '/addpost', component: AddPostScreen, isPublic: user },
    { path: '/rating', component: RatingComponent, isPublic: user },
    { path: '/comment', component: CommentScreen, isPublic: user },
    { path: '/weather', component: WeatherScreen, isPublic: user },
    { path: '/video', component: VideoScreen, isPublic: user },
    { path: '/barchart', component: BarChartScreen, isPublic: user },
    { path: '/appRating', component: AppRatingComponent, isPublic: user },

   


    // Non-authenticated routes
    { path: '/', component: LoginScreen },
    { path: '/register', component: SignupScreen }
  ]);


  return routes;
};

export default App;