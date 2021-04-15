function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("./static/js/samples.json").then((data) => {
      var samples = data.samples;
      var filterArray = samples.filter(sampleObj => sampleObj.id == sample);
      //.filter(sampleObj => sampleObj.id == sample)
      var result = filterArray[0];
      var sample_values = result.sample_values;
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      // Deliverable 1: Bar
      var trace = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Greek",
        type: "bar",
        orientation: "h"
      };
      var data = [trace];
      var layout = {
          title: "Top Ten OTUs for Individual " +sample,
          margin: {l: 100, r: 100, t: 100, b: 100}
      };
      Plotly.newPlot("bar", data, layout);

      // Deliverable 2: Bubble
      var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"YlGnBu"
        }
      };
      var data = [trace1];
      var layout = {
        title: 'Bacteria Cultures per Sample',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU ID " +sample},
        margin: {t:30}
    };
    Plotly.newPlot('bubble', data, layout);

    //Deliverable 3: Gauge
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        marker: {size: 28, color:'black'},
        value: 2,
        title: 'Belly Button Washing Frequency<br> Scrubs per Week',
        //titlefont: {family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }]
          }
      }
    ];
    var layout = {
      width: 450,
       height: 400,
       margin: { t: 25, r: 25, l: 25, b: 25 },
       line: {
       color: otu_ids
       },
       //paper_bgcolor: "#a5bdc6",
       //font: { color: "#85541d", family: "Serif" }
     };
    Plotly.newPlot("gauge", data, layout);
    }
    )
};

// Initialize the dashboard
init();