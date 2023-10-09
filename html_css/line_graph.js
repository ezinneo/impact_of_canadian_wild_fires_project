let data;

fetch('http://127.0.0.1:5000/api/v1.0/airquality_data')
  .then((response) => response.json())
  .then((jsondata) => {
    data = jsondata;

    // Call the function to create the initial line graph with the default selection
    createLineGraph('O3');
  })
  .catch((e) => console.log(e));

const selectEL = document.getElementById('lineGraphSelect');
selectEL.addEventListener('change', (event) => {
  // Call the function to update the line graph based on the dropdown selection
  createLineGraph(event.target.value);
});

// Function to create and update the line graph based on the selected pollutant
function createLineGraph(selectedPollutant) {
  if (!data) {
    console.log('Data not available yet.');
    return;
  }

  const x = data.map((d) => d.date);
  const y = data.map((d) => d[selectedPollutant]);

  const plotdata = [
    {
      x: x,
      y: y,
      type: 'scatter',
    },
  ];

  const layout = {
    title: `Line Graph for ${selectedPollutant}`,
    xaxis: {
      title: 'Date',
    },
    yaxis: {
      title: 'Value',
    },
  };

  // Use Plotly to create or update the line graph
  Plotly.newPlot('lineGraphPlot', plotdata, layout);
}
