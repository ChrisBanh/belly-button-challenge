// Add the url as a constant


const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



d3.json(url).then(function({names}) {
    names.forEach(id => {
      d3.select('select').append('option').text(id);
    });

    // Add the call initialise function

    optionChanged();
  });

//Initialise dashboard at startup though optionChanged supplied within the index
  
function optionChanged() {

  let option = d3.select('select').node().value;

  //Grab information out of the json for metadata and samples

  d3.json(url).then(({metadata,samples}) => {
      
    let meta = metadata.filter(obj => obj.id == option)[0];
    let sample = samples.filter(obj => obj.id == option)[0]; 

    //Prepare the bar chart using the selected Subject ID in order of the highest value OTUs

    let {sample_values, otu_ids, otu_labels} = sample;

    //Format the bar chat so that x value is the sample values and the y value is the the ids for the OTUs. Arrange it in reverse order from highest quantitative with a max of 10 entries. 

    var data = [
      {
        x: sample_values.slice(0,10).reverse(), 
        y: otu_ids.slice(0,10).reverse().map(x =>`OTU ${x}` ),
        text: otu_labels.slice(0,10).reverse(),
        type: 'bar',
        orientation:"h"
      }
    ];

    //Add title
      
    var layout = {
      title: "Top OTUs"
  };
    
    //Plot bar chart with the given Subject ID

    Plotly.newPlot('bar', data, layout);

    //Format the Bubble chart and input related information into the template. Color code the samples according to their ids and let size be determined by the quantity.

    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels, 
      mode: 'markers',
      marker: {
        size: sample_values,
        color:otu_ids,
        colorscale:"Earth"
      }
    };
    
    var data = [trace1];
    
    //Add title

    var layout = {
      title: 'Marker Size',
      showlegend: false,
      xaxis: {title: "OTU ID"}
    };
    
    //Plot bubble chart with the given Subject ID

    Plotly.newPlot('bubble', data, layout);

//Clear metadata for everytime a new SubjectID loads ups.

d3.select("#sample-metadata").html("");

//Input information within the metadata when a new one is selected from the dropdown.

Object.entries(meta).forEach(([key,val]) => {
  d3.select(".panel-body").append("h5").text(`${key}: ${val}`)
}) 



  });
};

