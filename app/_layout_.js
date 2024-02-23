import { Stack } from "expo-router";

<Stack.Screen
	name="HearMe"
	options={{
		presentation: 'modal',
		headerLeft: () => <Button title="Close" onPress={() => router.back()} />
	}}
/>