import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { database } from '../../config/firebaseConfig';
import { Stack } from 'expo-router';
import { BarChart, PieChart } from 'react-native-gifted-charts';  // Import gifted charts

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
    const intervalId = setInterval(fetchData, 30 * 24 * 60 * 60 * 1000); // Every month
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  // Prepare bar chart data
  const barChartData = postCounts.map(([month, count]) => ({
    value: count,
    label: month,
    frontColor: '#4682B4', // Dodger Blue color
    onPress: () => Alert.alert(`${month}`, `${count} posts`),  // Interactivity for the bar chart
  }));

  // Prepare pie chart data
  const pieChartData = Object.entries(categoryCounts).map(([category, count]) => ({
    value: count,
    label: category,
    color: getRandomColor(),
    text: `${category} (${count})`,
    onPress: () => Alert.alert(`${category}`, `Total posts: ${count}`),  // Interactivity for the pie chart
  }));

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: `Charts` }} />
      <Text style={styles.chartTitle}>Visualizing Daily Activity</Text>
      <Text style={styles.chartSubtitle}>Posts Created Throughout the Year:</Text>

      {/* Horizontal ScrollView */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={true} // Enable scroll indicator for visibility
        contentContainerStyle={styles.scrollContainer}>
        <BarChart
          data={barChartData}
          height={250}
          barWidth={40} // Increased width to make sure content exceeds screen width
          noOfSections={4}
          barBorderRadius={5}
          initialSpacing={10}
          frontColor="rgba(70, 130, 180, 0.8)"
          labelStyle={{ fontSize: 10 }}
          yAxisThickness={1}
          xAxisThickness={1}
          xAxisColor="#4682B4"
          yAxisColor="#4682B4"
        />
      </ScrollView>

      <Text style={styles.chartSubtitle}>Post Categories Breakdown:</Text>
      <View style={styles.pieChartContainer}>
        
        <PieChart
          data={pieChartData}
          innerCircleColor="#ffffff"
          radius={118}
          innerRadius={60}
          textSize={12}
          textColor="black"
          isAnimated
        />

        <View style={styles.categoryContainer}>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <Text key={category} style={styles.categoryText}>
              {category}: {count}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  chartTitle: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: 'white',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'navy',
  },
  chartSubtitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  pieChartContainer: {
    flexDirection: 'row',  // Arrange PieChart and categories in a row
    alignItems: 'flex-start',  // Align items to the start
    marginTop: 10,  // Add margin for spacing
  },
  categoryContainer: {
    flexDirection: 'column',  // Stack category names vertically
    marginLeft: 10,  // Space between the pie chart and the category names
  },
  categoryText: {
    fontSize: 14,
    color: 'black',
    marginVertical: 2,  // Vertical spacing between category texts
  },
});

export default BarChartScreen;
