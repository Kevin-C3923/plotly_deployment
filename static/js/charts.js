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
  d3.json("samples.json").then((data) => {
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
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var arr = data.samples; 
    console.log(arr);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var fil_samp = arr.filter(sampleObj => sampleObj.id == sample);
    console.log(fil_samp);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = fil_samp;
    console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otu_id_tag ;
    var otu_labels_tag ;
    var sample_values_tag ;
    
    // console.log(otu_id_tag);
    // console.log(otu_labels_tag);
    // console.log(sample_values_tag);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    otu_id_tag = firstSample.map(row => row.otu_ids);
    otu_labels_tag = firstSample.map(row => row.otu_labels);
    sample_values_tag = firstSample.map(row => row.sample_values);

    // console.log(otu_id_tag[0]);
    // console.log(otu_labels_tag[0]);
    // console.log(sample_values_tag[0]);

    var otu_id_tag_ten = otu_id_tag[0].slice(0, 10).reverse();
    var otu_labels_tag_ten = otu_labels_tag[0].slice(0, 10).reverse();
    var sample_values_tag_ten = sample_values_tag[0].slice(0, 10).reverse();

    // console.log(otu_id_tag);
    // console.log(otu_labels_tag);
    // console.log(sample_values_tag);

    var yticks = {
      // y: `"OTU" ${otu_id_tag_ten}`, 
      y: `${otu_id_tag_ten}`, 
      x: sample_values_tag_ten ,
      text:otu_labels_tag_ten,
      type: "bar",
      orientation: "h"

    };

    // 8. Create the trace for the bar chart. 
    var barData = [ 
      yticks
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found ",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    function sizeOfBubble(n) {
      var sizeArray = [];
      for (var i = 0; i < n.length; i++) {
        var sizeNumber = n[i] * .75;
        sizeArray.push(sizeNumber);
      }
      console.log(sizeArray);
      return sizeArray;
      
    }
    
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_id_tag[0], 
      y: sample_values_tag[0] ,
      // text: otu_labels_tag[0],
      text: otu_labels_tag[0],
      mode: 'markers',
      marker: {
        // color: ['rgb(93, 164, 214)', 
        //  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],

        size: sizeOfBubble(sample_values_tag[0]),

      },
      // hovertemplate : `(${otu_id_tag[0]}, ${sample_values_tag[0]})
      //   <br>${otu_labels_tag[0]} `
    
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID" },
      showlegend: false,
      //yaxis: {title: "Population Growth, 2016-2017"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout ); 

  });
}
