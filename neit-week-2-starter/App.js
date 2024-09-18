import { Text, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

export default function App() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: 'center', padding: 10 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <Text style={{ fontSize: 18, color: 'red' }}>
        Change code in the editor and watch it change on your phone! Save to get
        a shareable url. Change code in the editor and watch it change on your
        phone! Save to get a shareable url. Change code in the editor and watch
        it change on your phone! Save to get a shareable url. Change code in the
        editor and watch it change on your phone! Save to get a shareable url.
        Change code in the editor and watch it change on your phone! Save to get
        a shareable url.
      </Text>
      <TextInput
        style={{ borderColor: 'black', borderWidth: 1, height: 40 }}
        onChangeText={(text) => console.log(text)}
        placeholder="Type here"
      />
    </KeyboardAvoidingView>
  );
}
