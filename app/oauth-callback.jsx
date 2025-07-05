import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Optionally show a loading spinner here
    // Redirect to home or let your auth logic handle it
    router.replace("/(tabs)/home");
  }, [router]);

  return null;
}