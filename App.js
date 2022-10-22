import  Icon  from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import React, { useState, useEffect, useMemo } from 'react';
import { Button, DataTable, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import {
  WheelPicker,
} from "react-native-wheel-picker-android";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as data from './TimetableGroup25.json'
import * as lectureData from './TimetableLecturer25.json'


const groupData = data.Timetable.Group
const lecturerData = lectureData.Timetable.Lecturer.filter(lec => lec.Days !== undefined)

const AuthContext = React.createContext();

const WeekTable = ({groupDay}) => {
  return(
    <FlatList
        data={groupDay}
        renderItem={({item}) => (
          <DayTable item={item}/> 
        )
      }
    />
  )
}

const LecturerHeader = () => {
  return(
    <DataTable.Header style={styles.header}>
      <DataTable.Title><Text style={{color: 'white', textAlign: 'right'}}>Время</Text></DataTable.Title>
      <DataTable.Title><Text style={{color: 'white', textAlign: 'right'}}>Дисциплина</Text></DataTable.Title>
      <DataTable.Title><Text style={{color: 'white', textAlign: 'right'}}>      Группа</Text></DataTable.Title>
      <DataTable.Title><Text style={{color: 'white', textAlign: 'right'}}>      Аудитория</Text></DataTable.Title>
    </DataTable.Header>
  )
}

const Header = () => {
  return(
    <DataTable.Header style={styles.header}>
      <DataTable.Title><Text style={{color: 'white'}}>Время</Text></DataTable.Title>
      <DataTable.Title><Text style={{color: 'white'}}>Дисциплина</Text></DataTable.Title>
      <DataTable.Title><Text style={{color: 'white'}}>Преподаватель</Text></DataTable.Title>
      <DataTable.Title><Text style={{color: 'white'}}>     Аудитория</Text></DataTable.Title>
    </DataTable.Header>
  )
}

const NameOfDay = ({item}) => {
  return(
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <View style={{
        backgroundColor: '#3e66a6', 
        width: '30%', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
        
        }}>
        <Text style={{color: 'white'}}>{item.Title}</Text>
      </View>
    </View>
  )
}

const LecturerLessons = ({item}) => {
  const renderItem = ({item}) => {
    return (
      <DataTable.Row style={item.WeekCode === '1' ? styles.odd : styles.even}>
                  <View style={{width: 75, justifyContent: 'center'}}>
                    <Text style={{color: 'black'}}>
                      {`${item.Time} `}
                    </Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={{color: 'black'}}>
                      {`${item.Discipline} `}
                    </Text>
                  </View>
                  <View style={{
                    width: 105,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                  }}>
                    {item.Groups.Group.Number !== undefined
                    ? (
                    <Text style={{color: 'black'}}>
                      {`${item.Groups.Group.Number}`}
                    </Text>
                    ) : (
                      <FlatList 
                      data={item.Groups.Group}
                      renderItem={({item}) => (
                      <Text style={{color: 'black'}}>
                        {item.Number}
                      </Text>

                      )}
                      />
                      
                    )
                    }
                  </View>
                  <View style={styles.cell}>
                    <Text style={{color: 'black'}}>
                      {`${item.Classroom}`}
                    </Text>
                  </View>

                </DataTable.Row>
    )
  }

  
  return(
    <SafeAreaView>
      {item.LecturerLessons.Lesson.length !== undefined
      ? (
        <FlatList
          data={item.LecturerLessons.Lesson}
          renderItem={renderItem}
        />  
        
        ) : (
          <FlatList
            data={[item.LecturerLessons.Lesson]}
            renderItem={renderItem}
          />  
          
          )
      }
    </SafeAreaView>
  )
}

const Lessons = ({item}) => {
  const navigation = useNavigation()
  if (item.GroupLessons.Lesson.length === undefined) {
    return (
      <FlatList
        data={[item.GroupLessons.Lesson]}
        renderItem={({item}) => (
          <DataTable.Row style={item.WeekCode === '1' ? styles.odd : styles.even}>
            <View style={{width: 75, justifyContent: 'center'}}>
              <Text style={{color: 'black'}}>
                {`${item.Time} `}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={{color: 'black'}}>
                {`${item.Discipline} `}
              </Text>
            </View>
              {item.Lecturers 
              ? <View style={{
                width: 105,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}> 
              {item.Lecturers.Lecturer.ShortName !== undefined
              ? <Pressable
                style={{
                  borderBottomWidth: 2,
                  borderStyle: 'dotted',
                  borderColor: 'black'
                }}
                onPress={() => navigation.navigate('Lecturer', {
                  id: item.Lecturers.Lecturer.IdLecturer,
                  title: item.Lecturers.Lecturer.ShortName
              })}>
                  <Text style={{color: 'black'}}>{item.Lecturers.Lecturer.ShortName}</Text>
                </Pressable>
              : <>
              <FlatList
              data={item.Lecturers.Lecturer}
              renderItem={({item}) => (
                <Pressable
                    style={{
                      borderStyle: 'dotted',
                      borderColor: 'black',
                      borderBottomWidth: 2,
                    }} 
                    onPress={() => navigation.navigate('Lecturer', {
                      id: item.IdLecturer,
                      title: item.ShortName
                  })}>
                    <Text style={{color: 'black'}}>{item.ShortName}</Text>
                  </Pressable>
              )} />
                </>
              }
              </View>
                : <View style={{
                  width: 105,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}> 
                <Text></Text>
                </View>
              }
            <View style={{
              width: 100,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{color: 'black'}}>
                {`${item.Classroom}`}
              </Text>
            </View>

          </DataTable.Row>
        )}
        />  
    )
  }

  return(
    <FlatList
        data={item.GroupLessons.Lesson}
        renderItem={({item}) => (
          <DataTable.Row style={item.WeekCode === '1' ? styles.odd : styles.even}>
            <View style={{width: 75, justifyContent: 'center'}}>
              <Text style={{color: 'black'}}>
                {`${item.Time} `}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={{color: 'black'}}>
                {`${item.Discipline} `}
              </Text>
            </View>
              {item.Lecturers 
              ? <View style={{
                width: 105,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}> 
              {item.Lecturers.Lecturer.ShortName !== undefined
              ? <Pressable
                style={{
                  borderBottomWidth: 2,
                  borderStyle: 'dotted',
                  borderColor: 'black'
                }}
                onPress={() => navigation.navigate('Lecturer', {
                  id: item.Lecturers.Lecturer.IdLecturer,
                  title: item.Lecturers.Lecturer.ShortName
              })}>
                  <Text style={{color: 'black'}}>{item.Lecturers.Lecturer.ShortName}</Text>
                </Pressable>
              : <>
              <FlatList
              data={item.Lecturers.Lecturer}
              renderItem={({item}) => (
                <Pressable
                    style={{
                      borderStyle: 'dotted',
                      borderColor: 'black',
                      borderBottomWidth: 2,
                    }} 
                    onPress={() => navigation.navigate('Lecturer', {
                      id: item.IdLecturer,
                      title: item.ShortName
                  })}>
                    <Text style={{color: 'black'}}>{item.ShortName}</Text>
                  </Pressable>
              )} />
                </>
              }
              </View>
                : <View style={{
                  width: 105,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}> 
                <Text></Text>
                </View>
              }
            <View style={{
              width: 100,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{color: 'black'}}>
                {`${item.Classroom}`}
              </Text>
            </View>

          </DataTable.Row>
        )}
        />  
  )
}

const DayTable = ({item}) => {
  return(
    <DataTable style={{marginVertical: 10}}>
        <NameOfDay item={item}/>
        <Header/>
        <Lessons item={item} />
      </DataTable> 
  )
}

const LoginPage = () => {
  const [warning, setWarning] = useState(false)
  const [inputGroup, setInputGroup] = useState('')

  const [selectedFaculty, setSelectedFaculty] = useState(0);
  const [facultyGroups, setFacultyGroups] = useState(list_of_A);
  const [selectedWheelGroup, setSelectedWheelGroup] = useState();

  const {grDay, loginn, name} = React.useContext(AuthContext)
  const [groupDay, setGroupDay] = grDay
  const [login, setLogin] = loginn
  const [nameOfGroup, setNameOfGroup] = name
  
  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      console.warn(e)
    }
  }

  const submitGroup = () => {
    try {

      let filteredGroup = groupData.filter(group => group.Number === facultyGroups[selectedWheelGroup])
      setGroupDay(filteredGroup[0].Days.Day)
      storeData('@storage_Key', filteredGroup[0].Days.Day)
      setLogin('true')
      setNameOfGroup(facultyGroups[selectedWheelGroup])
      storeData('Login', true)
      storeData('Group', facultyGroups[selectedWheelGroup])
    } catch(e) {
      setWarning(true)
      setTimeout(() => {
        setWarning(false)
      }, 2000)
    }
    
  }

 
  const submitFaculty = (item) => {
    setSelectedFaculty(item)
    if (selectedFaculty !== 5) {
      setFacultyGroups(groupData.filter(group => group.Number.startsWith(list_of_faculties[selectedFaculty])).map(group => group.Number))
    } else {
      setFacultyGroups(groupData.filter(group => !group.Number.startsWith(list_of_faculties[0]) 
        && !group.Number.startsWith(list_of_faculties[1])
        && !group.Number.startsWith(list_of_faculties[2])
        && !group.Number.startsWith(list_of_faculties[3])
        && !group.Number.startsWith(list_of_faculties[4])
          ).map(group => group.Number))
        }
    setTimeout(() => {
      setSelectedWheelGroup(0)
    }, 200)
  }

  const submitFacultyGroup = (item) => {
    setSelectedWheelGroup(item)
  }

  const list_of_faculties = ["А", "Е", "О", "И", "Р", "Другое"]
  const list_of_A = groupData.filter(group => group.Number.startsWith("А")).map(group => group.Number)
 
  return(
    <SafeAreaView>
      <View style={{backgroundColor: '#3e66a6', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        {/* <Text style={{color: 'white', fontSize: 2, position: 'absolute', top: 70}}>Укажите факультет и группу</Text> */}
      <View style={{
        backgroundColor: 'white', 
        alignItems: 'center',
        width: '100%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center', 
        borderRadius: 10,
        marginBottom: 10}}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            marginBottom: 10
          }}>
            <Text style={{color: '#3e66a6', fontWeight: 'bold'}}>Факультет</Text>
            <Text style={{color: '#3e66a6', fontWeight: 'bold', marginRight: 10}}>Группа</Text>
          </View>
          <View style={{borderBottomWidth: 2, borderBottomColor: '#3e66a6', height: 1, width: '100%'}}></View>
          <View style={{
            flexDirection: 'row',
            marginBottom: 40
          }}>
          <WheelPicker
          selectedItem={selectedFaculty}
          data={list_of_faculties}
          onItemSelected={(item) => submitFaculty(item)}
          backgroundColor={'white'}
          indicatorColor={'#3e66a6'}
          itemTextSize={23}
          selectedItemTextSize={23}
          itemTextColor={"#3e66a6"}
          selectedItemTextColor={"#3e66a6"}
        />
        <WheelPicker
          selectedItem={selectedWheelGroup}
          data={facultyGroups}
          onItemSelected={(item) => submitFacultyGroup(item)}
          backgroundColor={'white'}
          indicatorColor={'#3e66a6'}
          itemTextColor={"#3e66a6"}
          selectedItemTextColor={"#3e66a6"}
          itemTextSize={23}
          selectedItemTextSize={23}
          initPosition={0}
        />
            
          </View>
        <Button
         mode='contained'
         onPress={submitGroup}
         style={styles.button}
        > 
          Показать
        </Button>
        
      </View>
    </View>
    </SafeAreaView>
  )
}

const TimeTablePage = ({navigation}) => {

  const {grDay} = React.useContext(AuthContext)
  const [groupDay, setGroupDay] = grDay
 

  return (
    <SafeAreaView>
      <View style={{backgroundColor: 'white', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <WeekTable groupDay={groupDay}/>
      </View>
    </SafeAreaView>
  )
}

const LoadingScreen = () => {
  return(
    <View style={{backgroundColor: '#3e66a6', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <Icon name="rocket" size={30} color="white" />
    </View>

  )
}

const DummyScreen = ({navigation}) => {

  const [lecturers, setLecturers] = useState(lecturerData)
  const [inputLecturer, setInputLecturer] = useState('')

  const filterLecturers = useMemo(() => {
    return lecturers.filter(lec => lec.LecturerName.toLowerCase().includes(inputLecturer.toLowerCase()))
  }, [lecturers, inputLecturer])

const getItemLayout = (data, index) => (
  {length: 30, offset: 30 * index, index}
);

  const renderItem = ({item}) => (
    <Button 
        color='#3e66a6'
        style={{width: '100%', borderBottomWidth: 2, borderColor: '#3e66a6', padding: 5}}
        onPress={() => navigation.navigate('Lecturer', {
          id: item.IdLecturer,
          title: item.LecturerName,
          lessonss: item.Days.Day,
        })}
        >
          <Text style={{color: 'black'}}>{item.LecturerName}</Text>
        </Button>
  )

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      <TextInput 
          style={{width: '90%', height: 50, backgroundColor: 'white', color: 'black', marginVertical: 20}}
          label={'Введите Ф.И.О.'}
          mode={'outlined'}
          value={inputLecturer}
          onChangeText={text => setInputLecturer(text)}
          activeOutlineColor={'#3e66a6'}
          required
        />
      {inputLecturer.length >= 3 &&

      <FlatList
      getItemLayout={getItemLayout}
      style={{width: '100%'}}
      data={filterLecturers}
      renderItem={renderItem}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      windowSize={10}
      />
      }
    </View>
  )
}

const LecturerTimeTablePage = ({route, navigation}) => {
  const { id, title, lessonss} = route.params;
  const [lessons, setLessons] = useState([])

  useEffect(() => {
    let lecturer = lecturerData.filter(lec => lec.IdLecturer === id)
    setLessons(lecturer[0].Days.Day)
  }, [])


  return (
    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
      {lessons.length !== undefined
      ? (

        <FlatList
          style={{width: '100%'}} 
          data={lessons}
          renderItem={({item}) => (
            <DataTable style={{marginVertical: 10}}>
              <NameOfDay item={item}/>
              <LecturerHeader />
              <LecturerLessons item={item} />
            </DataTable>
          )}/>
          ) : (
            
            <FlatList
              style={{width: '100%'}} 
              data={[lessons]}
              renderItem={({item}) => (
                <DataTable style={{marginVertical: 10}}>
                  <NameOfDay item={item}/>
                  <LecturerHeader />
                  <LecturerLessons item={item} />
                </DataTable>
              )}/>
      )
      }
    </View>
  )
}

const TabNavigation = () => {

  const Tab = createBottomTabNavigator();
  const {name, loginn} = React.useContext(AuthContext)
  const [nameOfGroup, setNameOfGroup] = name
  const [login, setLogin] = loginn




  return (
    <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'user-alt'
        } else if (route.name === 'Dummy') {
          iconName = 'user-graduate';
        }

        return <FontAwesome5 name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#243c7b',
      tabBarStyle: {
        backgroundColor: '#3e66a6',
        paddingVertical: 5
      },
      tabBarLabel: ({focused, color}) => {
        let label;

        if (route.name === 'Home') {
          label = 'Студент'

        } else if (route.name === 'Dummy') {
          label = 'Преподаватель';

        }

        return <Text style={{color: 'white', fontSize: 12}}>{label}</Text>
      },
      // tabBarShowLabel: false
    })}
  >

    <Tab.Screen 
      name="Home" 
      component={TimeTablePage} />
    <Tab.Screen name="Dummy" component={DummyScreen}/>
  </Tab.Navigator>
  )
}

const App = () => {
  const [groupDay, setGroupDay] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [login, setLogin] = useState('false')
  const [nameOfGroup, setNameOfGroup] = useState('')

  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      console.warn(e)
    }
  }

  useEffect (() => {
    restoreDaysFromAsync()
  }, [])

  const restoreDaysFromAsync = async () => {
    setIsLoading(true)
    try {
      let Json = await AsyncStorage.getItem("@storage_Key")
      let login = await AsyncStorage.getItem("Login")
      let group = await AsyncStorage.getItem("Group")
      setGroupDay(JSON.parse(Json))
      setLogin(login)
      setNameOfGroup(group.slice(1, -1))
    } catch(e) {
      console.warn(e)
    }
    setIsLoading(false)
  }

  const Logout = () => {
    setLogin('false')
    storeData('Login', false)
    storeData('Group', '')
  }


  const LoginStack = createNativeStackNavigator();

  const MainStack = createNativeStackNavigator();

  if (isLoading) {
    return <LoadingScreen />
  }
  
 
  return (
    <AuthContext.Provider value={{grDay: [groupDay, setGroupDay], loginn: [login, setLogin], name: [nameOfGroup, setNameOfGroup]}}>
      <NavigationContainer>
        
          {login === 'false'
          ? (
            <LoginStack.Navigator>
              <LoginStack.Screen 
                name="SignIn" 
                component={LoginPage}
                options={{
                  title: '',
                  headerShadowVisible: false,
                  headerStyle: {
                    backgroundColor: '#3e66a6',
                    
                  }
                }} />
            </LoginStack.Navigator>
          ) : (
            <MainStack.Navigator screenOptions={{
              headerStyle: {

                backgroundColor: '#3e66a6',
                
              },
              headerTintColor: 'white'
            }}>
              <MainStack.Screen 
                name='Main' 
                component={TabNavigation} 
                options={{
                  headerTitle: `${nameOfGroup}`,
                  headerRight: () => (
                    <Button
                      color='rgb(250, 193, 193)'
                      onPress={Logout}
                      >
                      <Icon name="close" size={25} color="white" />
                     </Button>)
                  }}/>
              <MainStack.Screen 
                name="Lecturer" 
                component={LecturerTimeTablePage}
                options={({ route }) => ({ 
                  title: route.params.title,
                  })}
                />
            </MainStack.Navigator>
          )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '40%',  
    backgroundColor: '#3e66a6', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 10
  },
  odd: {
    backgroundColor: 'rgb(250, 193, 193)',
    justifyContent: 'space-between'
  },
    
  even: {
    backgroundColor: 'white'
  },
  cell: {
    width: 105,
    justifyContent: 'center',
    alignItems: 'center'
  },

  header: {
    backgroundColor: '#3e66a6',
  }


});

export default App;
