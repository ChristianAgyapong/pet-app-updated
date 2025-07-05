import "expo-router/entry";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        // Add more fonts as needed
      });
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return <RootLayout />; // or your main layout component
}
