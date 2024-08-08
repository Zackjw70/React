import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Button,
  Pressable,
  Modal,
} from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer, RouteProp, useNavigation, useRoute,  } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerLayout } from 'react-native-gesture-handler';


export type StackParamList = {
  Home: undefined;
  Details: {link: string;}
}
type HomeScreenNavigationProp = StackNavigationProp<StackParamList, "Home">
type DetailsScreenRouteProp = RouteProp<StackParamList, 'Details'>;

type DetailsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'Details'
>;


const Stack = createStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator();
const HomeNavigator = createStackNavigator();
const WeatherAppNavigator = createStackNavigator();

interface ImageData {
  id: number;
  url: string;
}
const imageData: ImageData[] = [];
for (let i = 1; i < 70; i++) {
  imageData.push({ id: i, url: `https://picsum.photos/id/${i}/200` });
}

const style = StyleSheet.create({
  row: {
      flex: 1,
      justifyContent: "space-around"
  }
});




export default function App() {
  return (
    <NavigationContainer>
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerLeft: false,
        drawerType: "slide",
        swipeEnabled: true,
        
        
      }}
      
    >
      <Drawer.Screen name="Weather App" component={WeatherApp} />
      <Drawer.Screen name="Photo Gallery" component={PhotoGallery} />
    </Drawer.Navigator>
  </NavigationContainer>
  );
}
export function PhotoGalleryNavigator(){
  return(
    <PhotoGalleryNavigator.Navigator>
      <PhotoGalleryNavigator.Screen name="Weather App" component={PhotoGallery}/>
    </PhotoGalleryNavigator.Navigator>
  )
}

export function PhotoGallery(){
  return(
      <Stack.Navigator screenOptions={{headerShown: true}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{title: "Words"}}/>
      </Stack.Navigator>
  );
}

export function WeatherNavigator(){
  return(
    <WeatherAppNavigator.Navigator>
      <WeatherAppNavigator.Screen name="Weather App" component={WeatherApp}/>
    </WeatherAppNavigator.Navigator>
  )
}

export function WeatherApp(){
  return(
    <Text>Words and</Text>
  );
}


export function HomeScreen(){
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [imageView, setImageView] = useState(1);
  const [number, setChangeNumber] = useState('');
  const [filteredImages, setFilteredImages] = useState(imageData);
  useEffect(() => {
    if (number !== ''){
      const filtered = imageData.filter(image => image.id.toString() === number)
      setFilteredImages(filtered);
    }
    else{
      setFilteredImages(imageData);
    }
  }, [number]);

  return(
    <View style={{backgroundColor: "#fff"}}>
    <TextInput
      style={{ borderColor: 'black', borderWidth: 1, height: 40 , margin: 10, marginTop: 40}}
      onChangeText={setChangeNumber}
        value={number}
        placeholder="Enter ID"
        keyboardType="numeric"
    />
    <FlatList style={{margin:5}}
        numColumns={3}                  // set number of columns 
        columnWrapperStyle={style.row}  // space them out evenly
        data={filteredImages}
        
        renderItem={(images) => 
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress= {() => {navigation.navigate('Details', { link: images.item.url})}}>
          <Image source={{uri: `${images.item.url}`}} style={{
          width: 130,
          height:130,
          opacity: imageView,
          borderWidth:2,
          resizeMode:'contain',
          margin:8
        }}></Image>
        </TouchableHighlight> }
    />
    </View>
    
    
  )
}


export function DetailsScreen() {
  const { params } = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  navigation.setOptions({ title: params.link })

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Modal
        transparent={false}
        visible={modalVisible}
        style={{backgroundColor: 'black'}}
        onRequestClose={() => {
          setModalVisible(!modalVisible);

      
        }}>
        <View style={{flex: 1,justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,backgroundColor: "black"}}>
          <View>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}>
              <Image source={{uri: `${params.link}`}} style={{
                width: 300,
                height:300,
                borderWidth:2,
                resizeMode:'contain',
                margin:8
              }}></Image>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text>Details Screen</Text><Pressable
        onPress={() => setModalVisible(true)}>
        <Image source={{uri: `${params.link}`}} style={{
          width: 200,
          height:200,
          borderWidth:2,
          resizeMode:'contain',
          margin:8
        }}></Image>
      </Pressable>
      
      <Text>itemId: {params.link} </Text>
      <Text>This is an epic image</Text>
      <Button title="Go to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
  },
});