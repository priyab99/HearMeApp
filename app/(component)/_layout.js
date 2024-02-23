import { Stack } from "expo-router";

<Stack.Screen
	name="Comment"
	options={{
		presentation: 'HearMe',
		headerLeft: () => <Button title="Close" onPress={() => router.back()} />
	}}
/>