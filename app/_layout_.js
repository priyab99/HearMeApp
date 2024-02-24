import { Stack } from "expo-router";

<Stack.Screen
	name="modal"
	options={{
		presentation: 'modal',
		headerLeft: () => <Button title="Close" onPress={() => router.back()} />
	}}
/>