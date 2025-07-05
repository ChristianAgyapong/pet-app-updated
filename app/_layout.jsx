import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import Colors from '../constants/Colors';

function AuthenticationGuard({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log("Auth state:", { isLoaded, isSignedIn, currentSegment: segments[0] });

    if (!isLoaded) return;

    if (!isSignedIn && segments[0] !== "login") {
      router.replace("/login");
    }
    if (isSignedIn && segments[0] === "login") {
      router.replace("/(tabs)/home");
    }
  }, [isSignedIn, isLoaded, segments]);

  return children;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <AuthenticationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthenticationGuard>
    </ClerkProvider>
  );
}














