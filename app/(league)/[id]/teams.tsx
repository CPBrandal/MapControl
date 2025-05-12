// app/(league)/[id]/teams.tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function TeamsRedirect() {
  const { id } = useLocalSearchParams();
  
  useEffect(() => {
    // Redirect to the main unified view with 'teams' tab selected
    // Use string concatenation and type assertion to avoid typescript errors
    router.replace({
      pathname: ('/(league)/' + id) as any,
      params: { tab: 'teams' }
    });
  }, [id]);

  // Return null as this is just a redirect component
  return null;
}