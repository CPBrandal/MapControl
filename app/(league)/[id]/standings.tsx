// app/(league)/[id]/standings.tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function StandingsRedirect() {
  const { id } = useLocalSearchParams();
  
  useEffect(() => {
    // Redirect to the main unified view with 'standings' tab selected
    // Use string concatenation and type assertion to avoid typescript errors
    router.replace({
      pathname: ('/(league)/' + id) as any,
      params: { tab: 'standings' }
    });
  }, [id]);

  // Return null as this is just a redirect component
  return null;
}