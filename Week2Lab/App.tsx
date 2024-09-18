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
import { NavigationContainer, RouteProp, useNavigation, useRoute, } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerLayout } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from 'axios';
import Animated, { RotateInDownRight, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';


export type StackParamList = {
  Home: undefined;
  Details: { link: string; }
}

export type BarCodeParams = {
  BarCode: undefined;
  Favorites: {favorite: string} | undefined;
  BarDisplay: { option: string; }
}

type BarCodeDisplayRouteProp = RouteProp<BarCodeParams, 'BarDisplay'>;

type BarCodeDisplayNavigationProp = StackNavigationProp<BarCodeParams, 'BarDisplay'>
type BarCodeFavoritesRouteProp = RouteProp<BarCodeParams, 'Favorites'>;

type BarCodeScannerNavigationProp = StackNavigationProp<BarCodeParams, "BarCode">
type BarCodeFavoritesNavigationProp = StackNavigationProp<BarCodeParams, "Favorites">


type HomeScreenNavigationProp = StackNavigationProp<StackParamList, "Home">
type DetailsScreenRouteProp = RouteProp<StackParamList, 'Details'>;

type DetailsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'Details'
>;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator();
const HomeNavigator = createStackNavigator();
const BarCodeDisplay = createStackNavigator<BarCodeParams>();
const WeatherAppNavigator = createStackNavigator();
const BarCodeAppNavigator = createStackNavigator();
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



//USE WHEN ADDING NEW PROJECTS
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
        <Drawer.Screen name="Photo Gallery" component={PhotoGallery} />
        <Drawer.Screen name="Weather App" component={WeatherApp} />
        <Drawer.Screen name="Bar Code Scanner" component={BarCodeNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
export function PhotoGalleryNavigator() {
  return (
    <PhotoGalleryNavigator.Navigator>
      <PhotoGalleryNavigator.Screen name="Weather App" component={PhotoGallery} />
    </PhotoGalleryNavigator.Navigator>
  )
}

export function PhotoGallery() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Words" }} />
    </Stack.Navigator>
  );
}
export function BarCodeNavigator() {
  return (
    <BarCodeAppNavigator.Navigator>
      <BarCodeAppNavigator.Screen name="Bar Code App" component={BarCode} />
      <BarCodeAppNavigator.Screen name="BarDisplay" component={BarCodeDisplayPage} />
    </BarCodeAppNavigator.Navigator>
  )
}
export function BarCodeScannerPage() {
  const navigation = useNavigation<BarCodeScannerNavigationProp>();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [barLink, setBarLink] = useState('');
  const [barDetails, setBarDetails] = useState('');
  useEffect(() => {
    async function getDetails() {
      try {
        let response = await fetch(barLink);
        let responseJson = await response.json();
        setBarDetails(responseJson);
      } catch (error) {
        console.error(error);
      }


    }
    getDetails();
    console.log(barDetails);
  }, [barLink])

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');

    }
    getBarCodeScannerPermissions();
  }, [])
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarLink(data);

    navigation.navigate('BarDisplay', { option: data });


  };
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }
  return (
    <View style={styles.containerCamera}>
      <BarCodeScanner
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={`Tap to Scan Again`} onPress={() => setScanned(false)} />}
    </View>
  )
}
export function BarCodeDisplayPage() {
  interface BarData {
    id: number;
    title: string;
    category: string;
    description: string;
    icon: string;
  }
  const route = useRoute<BarCodeDisplayRouteProp>();
  const { option } = route.params;
  const navigation = useNavigation<BarCodeDisplayNavigationProp>();
  const { params } = useNavigation<BarCodeDisplayRouteProp>();
  const [bardata, setBarData] = useState('');

  console.log(option)

  const storeData = async (l: string) => {
    console.log(l);
    try {
      const temp = await AsyncStorage.getItem('links');
      console.log(temp);
      let tempA = [];
      let check = false;


      if (temp != null) {
        tempA = JSON.parse(temp);
        for (let i = 0; i < tempA.length; i++) {
          if (tempA[i] == l) {
            check = true;
            break;
          }

        }
        if (check == false) {
          tempA.push(l);
          await AsyncStorage.setItem('links', JSON.stringify(tempA));
        }


      }
      else {
        tempA.push(l);
        await AsyncStorage.setItem('links', JSON.stringify(tempA));
        navigation.navigate('Favorites', { favorite: JSON.stringify(tempA) });
        
      }

    } catch (e) {
      // saving error
      console.log(e);
    }
    finally {
      const value = await AsyncStorage.getItem('links');
      console.log(value);
    }
  };
  useEffect(() => {
    async function getItem() {
      try {
        let response = await fetch(`${option}`);
        let responseJson = await response.json();
        setBarData(responseJson);

      } catch (error) {

      }

    }

    getItem();


  }, []);

  return (
    <View>
      <Text
        style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 20 }}
      >Details Screen:</Text>
      {bardata && <Text>{bardata.title}</Text>}
      {bardata &&
        <Text>Category: {bardata.category}</Text>}
      {bardata && <Text>Description: {bardata.description}</Text>}
      {bardata && <Image
        source={{ uri: `${bardata.images[0]}` }} style={{
          width: 130,
          height: 130,
          resizeMode: 'contain',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >

      </Image>}
      <Pressable
        onPress={() => storeData(bardata.id)}
      >
        <Text
          style={{ color: 'blue', fontSize: 18, margin: 'auto' }}
        >Add to Favorites</Text>
      </Pressable>
    </View>
  )

}
export function BarCodeFavs() {
  const navigation = useNavigation<BarCodeFavoritesNavigationProp>();
  const route = useRoute<BarCodeFavoritesRouteProp>();
  const [newFav, setNewFav] = useState('');
  interface BarData {
    id: number;
    title: string;
    category: string;
    description: string;
    icon: string;
    link: string;
  }
  const bardata: BarData[] = [];
  const [data, setData] = useState<BarData[]>([]);
  const [fav, setFav] = useState([]);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('links');
      let tempA = []
      if (value !== null) {
        tempA = JSON.parse(value);
        if (newFav != undefined){
          tempA.push(newFav.toString());
        }
        setFav(tempA);
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getData();
    async function getDetails() {
      for (let i = 0; i < fav.length; i++) {
        try {
          let response = await fetch(`https://dummyjson.com/products/${fav[i]}`);
          console.log(i);
          let responseJson = await response.json();
          bardata.push({ id: i + 1, title: responseJson.title, category: responseJson.category, description: responseJson.description, icon: responseJson.images[0], link: `https://dummyjson.com/products/${fav[i]}`})

        } catch (error) {

        }


      }
      setData(bardata);
      console.log(data);
    }

    getDetails();

  }, [newFav]);
  if (route.params != undefined){
    const { favorite} = route.params ;
    setNewFav(favorite);
    console.log("FAVORITE" + newFav);
  }
  return (
    <View>
      <Text>Favorites</Text>
      {data && <FlatList
        data={data}
        renderItem={(casting) =>
          <View

          >
            <Pressable onPress={() => navigation.navigate('BarDisplay', { option: casting.item.link })} style={{ flexDirection: 'row', height: 50 }}>
              <Text
                style={{ marginTop: 15 }}
              >{casting.item.title}</Text>
              <Image source={{ uri: casting.item.icon }} style={{ width: 40, height: 40, marginBottom: 20 }} />
            </Pressable>
          </View>
        }


      />}

      <Pressable
        onPress={() => {
          AsyncStorage.clear();
          
         
          setFav([]);
          setNewFav('');
        }}

      >
        <Text
          style={{ fontSize: 30 }}
        >Clear Favorites</Text>
      </Pressable>
    </View>
  );
}
export function BarCode() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Details') {
            iconName = focused ? 'reader' : 'reader-outline';
          }

          // You can return any component that you like here
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Scanner" component={BarCodeScannerPage} />
      <Tab.Screen name="Favorites" component={BarCodeFavs} />
    </Tab.Navigator>
  )
}
//WEEK 4 LAB START
export function WeatherNavigator() {
  return (
    <WeatherAppNavigator.Navigator>
      <WeatherAppNavigator.Screen name="Weather App" component={WeatherApp} />
    </WeatherAppNavigator.Navigator>
  )
}
export function WeatherApp() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Current Weather" component={CurrentWeather} />
      <Drawer.Screen name="Forecast" component={WeatherForecast} />
    </Drawer.Navigator>
  );
}
export function CurrentWeather() {
  const [current, setCurrent] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    axios.get('http://api.weatherapi.com/v1/' +
      'current.json' +
      '?q=02893' +
      `&key=dc78d09957ae44929f5220122241408`).then((response) => {
        setCurrent(response.data.current);
        setLocation(response.data.location);



      });

  }, [])
  return (

    <View>

      <Text
        style={{ margin: 'auto', fontSize: 20 }}

      >{location.name} {location.region}</Text>
      {current.condition &&
        <Image source={{ uri: `https:${current.condition.icon}` }} style={{
          width: 130,
          height: 130,
          borderWidth: 2,
          resizeMode: 'contain',
          margin: 'auto',

        }}></Image>}
      {current.condition && <Text
        style={{ margin: 'auto', fontSize: 20 }}
      >
        {current.condition.text}</Text>}
      <Text
        style={{ margin: 'auto', fontSize: 20 }}
      >
        {current.heatindex_f}&deg;F</Text>
      <Text
        style={{ margin: 'auto', fontSize: 20 }}
      >Feels like: {current.feelslike_f}&deg;F</Text>
    </View>

  )
}
export function WeatherForecast() {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Details') {
            iconName = focused ? 'reader' : 'reader-outline';
          }

          // You can return any component that you like here
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Five Days" component={FiveDays} />
      <Tab.Screen name="Seven Days" component={SevenDays} />
    </Tab.Navigator>
  )
}
export function FiveDays() {
  interface ForecastData {
    id: number;
    day: string;
    min: string;
    max: string;
    con: string;
    icon: string;
  }
  const forecastData: ForecastData[] = [];

  const [location, setLocation] = useState('');
  const [data, setData] = useState<ForecastData[]>([]);
  useEffect(() => {
    axios.get('http://api.weatherapi.com/v1/' +
      'forecast.json' +
      '?q=02893' +
      `&days=5` +
      `&key=dc78d09957ae44929f5220122241408`).then((response) => {
        setLocation(response.data.location);
        for (let i = 0; i < 5; i++) {
          if (i >= response.data.forecast.forecastday.length) {
            forecastData.push({ id: i, day: response.data.forecast.forecastday[0].date, min: response.data.forecast.forecastday[0].day.mintemp_f, max: response.data.forecast.forecastday[0].day.maxtemp_f, con: response.data.forecast.forecastday[0].day.condition.text, icon: response.data.forecast.forecastday[0].day.condition.icon });
          }
          else {
            forecastData.push({ id: i, day: response.data.forecast.forecastday[i].date, min: response.data.forecast.forecastday[i].day.mintemp_f, max: response.data.forecast.forecastday[i].day.maxtemp_f, con: response.data.forecast.forecastday[i].day.condition.text, icon: response.data.forecast.forecastday[i].day.condition.icon });
          }

        }
        console.log(forecastData);
        setData(forecastData);

      });

  }, [])

  if (data.length != 5) {
    return (

      <View>
        <Text>Loading</Text>
      </View>
    )
  }
  return (
    <View>
      <Text
        style={{ margin: 'auto', fontSize: 20 }}

      >{location.name}, {location.region}</Text>
      <FlatList
        data={data}
        renderItem={(casting) =>
          <View style={{ flexDirection: 'row', height: 50 }}>
            <Text
              style={{ marginTop: 15, marginLeft: 15 }}
            >
              {casting.item.day}
            </Text>
            <Text
              style={{ marginTop: 15, marginLeft: 15 }}
            >
              {casting.item.min}&deg;F | {casting.item.max}&deg;F
            </Text>
            <Text
              style={{ marginTop: 15, marginLeft: 15 }}
            >
              {casting.item.con}
            </Text>
            <Image source={{ uri: `https:${casting.item.icon}` }} style={{
              width: 50,
              height: 50,
              resizeMode: 'contain',
              margin: '0 auto',
            }}></Image>
          </View>
        }


      />



    </View>
  )
}
export function SevenDays() {
  interface ForecastData {
    id: number;
    day: string;
    min: string;
    max: string;
    con: string;
    icon: string;
  }
  const forecastData: ForecastData[] = [];

  const [location, setLocation] = useState('');
  const [data, setData] = useState<ForecastData[]>([]);
  useEffect(() => {
    axios.get('http://api.weatherapi.com/v1/' +
      'forecast.json' +
      '?q=02893' +
      `&days=3` +
      `&key=dc78d09957ae44929f5220122241408`).then((response) => {
        setLocation(response.data.location);
        for (let i = 0; i < 7; i++) {
          if (i >= response.data.forecast.forecastday.length) {
            forecastData.push({ id: i, day: response.data.forecast.forecastday[0].date, min: response.data.forecast.forecastday[0].day.mintemp_f, max: response.data.forecast.forecastday[0].day.maxtemp_f, con: response.data.forecast.forecastday[0].day.condition.text, icon: response.data.forecast.forecastday[0].day.condition.icon });
          }
          else {
            forecastData.push({ id: i, day: response.data.forecast.forecastday[i].date, min: response.data.forecast.forecastday[i].day.mintemp_f, max: response.data.forecast.forecastday[i].day.maxtemp_f, con: response.data.forecast.forecastday[i].day.condition.text, icon: response.data.forecast.forecastday[i].day.condition.icon });
          }

        }
        console.log(forecastData);
        setData(forecastData);

      });

  }, [])

  if (data.length != 7) {
    return (

      <View>
        <Text>Loading</Text>
      </View>
    )
  }
  return (
    <View>
      <Text
        style={{ margin: 'auto', fontSize: 20 }}

      >{location.name}, {location.region}</Text>
      <FlatList
        data={data}
        renderItem={(casting) =>
          <View style={{ flexDirection: 'row', height: 50 }}>
            <Text
              style={{ marginTop: 15, marginLeft: 15 }}
            >
              {casting.item.day}
            </Text>
            <Text
              style={{ marginTop: 15, marginLeft: 15 }}
            >
              {casting.item.min}&deg;F | {casting.item.max}&deg;F
            </Text>
            <Text
              style={{ marginTop: 15, marginLeft: 15 }}
            >
              {casting.item.con}
            </Text>
            <Image source={{ uri: `https:${casting.item.icon}` }} style={{
              width: 50,
              height: 50,
              resizeMode: 'contain',
              margin: '0 auto',
            }}></Image>
          </View>
        }


      />



    </View>
  )

}
//WEEK 4 LAB END
export function HomeScreen() {
  const marginVertical = useSharedValue(2);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // set our updated margin by adding our base margin of 2 to the scroll offset divided by 30
      // 30 is an arbitrary number that I chose to make the animation feel right
      const newMargin = 0 + event.contentOffset.y / 30;
      if (newMargin < 0) {
        marginVertical.value = 0;
      } else if (newMargin > 360) {
        marginVertical.value = 360;
      } else {
        marginVertical.value = newMargin;
      }
    }
  });
  const animatedStyle = useAnimatedStyle(() => {
    return { rotation: marginVertical.value, };
  });
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [imageView, setImageView] = useState(1);
  const [number, setChangeNumber] = useState('');
  const [filteredImages, setFilteredImages] = useState(imageData);
  useEffect(() => {
    if (number !== '') {
      const filtered = imageData.filter(image => image.id.toString() === number)
      setFilteredImages(filtered);
    }
    else {
      setFilteredImages(imageData);
    }
  }, [number]);

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <TextInput
        style={{ borderColor: 'black', borderWidth: 1, height: 40, margin: 10, marginTop: 40 }}
        onChangeText={setChangeNumber}
        value={number}
        placeholder="Enter ID"
        keyboardType="numeric"
      />
      <Animated.FlatList style={{ margin: 5 }}
        numColumns={3}                  // set number of columns 
        columnWrapperStyle={style.row}  // space them out evenly
        data={filteredImages}
        onScroll={scrollHandler}

        renderItem={(images) =>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={() => { navigation.navigate('Details', { link: images.item.url }) }}>
            <Animated.Image source={{ uri: `${images.item.url}` }} sharedTransitionTag={`tag-${images.item.url}`} style={[{
              width: 130,
              height: 130,
              opacity: imageView,
              borderWidth: 2,
              resizeMode: 'contain',
              margin: 8
            }, animatedStyle]}></Animated.Image>
          </TouchableHighlight>}

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
        style={{ backgroundColor: 'black' }}
        onRequestClose={() => {
          setModalVisible(!modalVisible);


        }}>
        <View style={{
          flex: 1, justifyContent: 'center',
          alignItems: 'center',
          marginTop: 22, backgroundColor: "black"
        }}>
          <View>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}>
              <Image source={{ uri: `${params.link}` }} style={{
                width: 300,
                height: 300,
                borderWidth: 2,
                resizeMode: 'contain',
                margin: 8
              }}></Image>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text>Details Screen</Text><Pressable
        onPress={() => setModalVisible(true)}>
        <Image source={{ uri: `${params.link}` }} style={{
          width: 200,
          height: 200,
          borderWidth: 2,
          resizeMode: 'contain',
          margin: 8
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
  containerCamera: {
    flex: 1,
    maxHeight: 800,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
  },
});

function getDayOfWeek(date: any) {
  throw new Error('Function not implemented.');
}
