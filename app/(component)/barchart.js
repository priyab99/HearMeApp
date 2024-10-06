import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Text, StyleSheet } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { collection, query, getDocs } from 'firebase/firestore';
import { database } from '../../config/firebaseConfig';
import { Stack } from 'expo-router';

const BarChartScreen = () => {
  const [loading, setLoading] = useState(true);
  const [postCounts, setPostCounts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});


  const getMonthName = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()];
  };
  const getRandomColor = () => {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsQuery = query(collection(database, 'posts'));
        const postsSnapshot = await getDocs(postsQuery);
        const counts = {};
        const categoryCountsObj = {};

        postsSnapshot.forEach((doc) => {
          const { date, category } = doc.data();
          const monthName = getMonthName(date.toDate());
          counts[monthName] = (counts[monthName] || 0) + 1;

          // Counting categories
          const trimmedCategory = category.split(' - ')[0];
          categoryCountsObj[trimmedCategory] = (categoryCountsObj[trimmedCategory] || 0) + 1;
        });

        const sortedCounts = Object.entries(counts).sort((a, b) => {
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          return months.indexOf(a[0]) - months.indexOf(b[0]);
        });
        setPostCounts(sortedCounts);
        setCategoryCounts(categoryCountsObj);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post counts:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Fetching data every month (adjusting the interval as needed)
    const intervalId = setInterval(fetchData, 30 * 24 * 60 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const barChartData = {
    labels: postCounts.map(([dayName]) => dayName),
    datasets: [
      {
        data: postCounts.map(([_, count]) => count),
      },
    ],
  };

  const pieChartData = Object.entries(categoryCounts).map(([category, count]) => ({
    name: category,
    count,
    color: getRandomColor(), // Function to generate random colors
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  return (

    <View style={styles.container}>

      <Stack.Screen options={{ headerTitle: `Charts` }} />
      <Text style={{ fontSize: 20, marginBottom: 5, fontWeight: 'bold', textAlign: 'center', marginTop: 10, color: 'white', borderWidth: 2, borderRadius: 10, backgroundColor: 'navy' }}>Visualizing Daily Activity</Text>
      <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>Posts Created Throughout the Year:</Text>
      <ScrollView horizontal>
        <BarChart
          data={barChartData}
          width={400}  // Increased width to accommodate more bars
          height={300}
          yAxisLabel=" "
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(70, 130, 180, ${opacity})`,
            labelColor: (opacity = 2) => `rgba(70, 130, 180, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: 0.7,  
            propsForLabels: {
              fontSize: 8,  // Smaller font size for month names
              rotation: 45,  // Rotating labels for better readability
            },
          }}
          style={{
            marginVertical: 10,
            borderRadius: 16,
            marginTop: 10
          }}
          fromZero={true}
          showBarTops={false}
          withInnerLines={false}
        />
      </ScrollView>
      <Text style={{ fontSize: 20, marginBottom: 5, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Post Categories Breakdown:</Text>
      <ScrollView horizontal>
        <PieChart
          data={pieChartData}
          width={460}
          height={300}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(70, 130, 180, ${opacity})`, // Dodger Blue color
            labelColor: (opacity = 1) => `rgba(70, 130, 180, ${opacity})`,
            style: {
              borderRadius: 16,

            },
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="5"
          paddingRight='20'

          absolute
        />
      </ScrollView>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
    //backgroundColor: '#fff',
  },
})



export default BarChartScreen;