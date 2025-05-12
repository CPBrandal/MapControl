// app/(league)/[id]/schedule.tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function ScheduleRedirect() {
  const { id } = useLocalSearchParams();
  
  useEffect(() => {
    // Redirect to the main unified view with 'schedule' tab selected
    // Use string concatenation and type assertion to avoid typescript errors
    router.replace({
      pathname: ('/(league)/' + id) as any,
      params: { tab: 'schedule' }
    });
  }, [id]);

  // Return null as this is just a redirect component
  return null;
}