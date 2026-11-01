import { Stack } from 'expo-router';
import { colors } from '@/core/design-system';

export default function AuthenticatedLayout() {
	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: colors.brandBlue },
				headerTintColor: colors.textOnPrimary,
				contentStyle: { backgroundColor: colors.background },
			}}
		>
			<Stack.Screen name="index" options={{ title: 'Operations Field' }} />
			<Stack.Screen name="check-list" options={{ title: 'Field checklist' }} />
			<Stack.Screen name="diario-de-bordo" options={{ title: 'Activity journal' }} />
		</Stack>
	);
}
