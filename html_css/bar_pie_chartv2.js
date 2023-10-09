let piedata;

    // Fetch data from the API endpoint
    fetch('http://127.0.0.1:5000/api/v1.0/airquality_data')
      .then((response) => response.json())
      .then((jsondata) => {
        piedata = jsondata;

        // Call the function to create the initial pie chart with the selected month's averages
        const selectedMonth = document.getElementById('monthSelect').value;
        createPieChart(selectedMonth);
      })
      .catch((e) => console.log(e));

    // Function to calculate averages for the selected month
    function calculateMonthlyAverage(data, selectedMonth) {
      const selectedYear = selectedMonth.split('-')[0];
      const selectedMonthNum = parseInt(selectedMonth.split('-')[1]);

      const monthlyAverage = {};

      data.forEach((entry) => {
        const dateParts = entry.date.split(' ')[0].split('-');
        const entryYear = dateParts[0];
        const entryMonth = parseInt(dateParts[1]);

        if (entryYear === selectedYear && entryMonth === selectedMonthNum) {
          for (const key in entry) {
            if (key !== 'date' && key !== 'aqi') {
              if (!monthlyAverage[key]) {
                monthlyAverage[key] = 0;
              }
              monthlyAverage[key] += entry[key];
            }
          }
        }
      });

      // Calculate the monthly average
      for (const key in monthlyAverage) {
        if (key !== 'date') {
          monthlyAverage[key] /= data.filter(entry => entry.date.startsWith(selectedMonth)).length;
        }
      }

      return monthlyAverage;
    }

    // Function to create and update the pie chart based on the selected month
    function createPieChart(selectedMonth) {
      if (!piedata) {
        console.log('Data not available yet.');
        return;
      }

      const chartData = calculateMonthlyAverage(piedata, selectedMonth);
      const chartTitle = `Monthly Average Pollutant Breakdown - ${selectedMonth}`;

      const pollutants = Object.keys(chartData);

      const pieData = pollutants.map(pollutant => ({
        labels: Object.keys(chartData).filter(key => key !== 'date'),
        values: pollutants.map(pollutant => chartData[pollutant] || 0),
        type: 'pie',
        name: pollutant,
        hole: 0.4,
      }));

      const layout = {
        title: chartTitle,
      };

      // Use Plotly to update the chart
      Plotly.newPlot('pieChartPlot', pieData, layout);
    }

    // Event listener for dropdown change
    const selectMonth = document.getElementById('monthSelect');
    selectMonth.addEventListener('change', (event) => {
      const selectedMonth = event.target.value;
      createPieChart(selectedMonth);
    });