import { NavigationContainer, RouteProp, useNavigation, useRoute,  } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

export type StackParamList = {
  Home: undefined;
  Home2: undefined;
  Modal: undefined;
  Details: {itemId: number; otherParam?: string};
}

type DetailsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'Details'
>;

type Home2ScreenNavigationProp = StackNavigationProp<StackParamList, "Home2">
type HomeScreenNavigationProp = StackNavigationProp<StackParamList, "Home">
type DetailsScreenRouteProp = RouteProp<StackParamList, 'Details'>;
type ModalScreenNavigationProp = StackNavigationProp<StackParamList, "Modal">



const Stack = createStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: true}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Home2" component={HomeScreen2} options={{title: 'This is my second home',
          headerStyle: {
            backgroundColor: '#000fff',
          },
          headerTintColor: 'red',
          headerTitleStyle: {
            fontWeight: 'bold',
          },}} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Modal" component={ModalScreen} options={{presentation: "modal"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export function ModalScreen(){
  const navigation = useNavigation<ModalScreenNavigationProp>();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Modal Screen</Text>
      <Button title="Go to back" onPress= {() => {navigation.goBack()}} />
    </View>
  )
}


export function HomeScreen(){
  const navigation = useNavigation<HomeScreenNavigationProp>();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button title="Go to details" onPress= {() => {navigation.navigate('Details', { itemId: 123, otherParam: 'test' })}} />
      <Button title="Go to modal" onPress= {() => {navigation.navigate('Modal')}} />
      <Button title="Go to Home2" onPress={() => navigation.navigate('Home2')} />
    </View>
  )
}
export function HomeScreen2(){
  const navigation = useNavigation<Home2ScreenNavigationProp>();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>This is NOT the home Screen</Text>
      <Button title="Go to details" onPress= {() => {navigation.navigate('Details', { itemId: 123, otherParam: 'test' })}} />
      <Button title="Go to modal" onPress= {() => {navigation.navigate('Modal')}} />
      <Button title="Go to Home" onPress={() => navigation.goBack()} />
    </View>
  )
}


export function DetailsScreen() {
  const { params } = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {params.itemId} </Text>
      <Text>otherParam: {params.otherParam} </Text>
      <Button title="Go to Home" onPress={() => navigation.goBack()} />
      <Button title="Go to Home2" onPress={() => navigation.navigate('Home2')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

