// Set constant URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

console.log("Loading data from URL: " + url);

let names;
let samples;
let metadata;

// Read JSON from URL
const loadData = () => {
    return new Promise((resolve, reject) => {
        console.log(d3.version)
        d3.json(url).then(function(data){
            console.log("Success")
            names = data.names;
            samples = data.samples;
            metadata = data.metadata;
            resolve(data);
        });
    });
};

loadData()
    .then((data) => {
    console.log("Callback function called");
    console.log("Data loaded:", data);
    updatePlots("940");
    
    // Get dropdown menu and fill with options
    let dropdownMenu = d3.select("#selDataset");
    names.forEach(function(id) {
        dropdownMenu.append("option").text(id).property("value", id);
    });
    
    })

function optionChanged(value) {
    console.log(`Selected option: ${value}`);
    updatePlots(value);
}

function updatePlots(value) {
    let subjectInfo = samples.find(obj => obj.id === value);
    let subjectMetaData = metadata.find(obj => obj.id == value);

    let sampleValues = subjectInfo.sample_values.slice(0, 10).reverse();

    let otuIDs = subjectInfo.otu_ids.slice(0, 10).reverse();

    let otuLabels = subjectInfo.otu_labels;

    let washFreq = subjectMetaData.wfreq;
    
    barPlot(sampleValues, otuIDs, otuLabels);
    bubblePlot(otuIDs, sampleValues, otuLabels);
    metaDataFrame(subjectMetaData);
    gaugePlot(washFreq);
};

function barPlot(xdata, ydata, hoverData) {
    
    let trace = {
        x: xdata,
        y: ydata.map(ydata => `OTU ${ydata}`),
        text: hoverData,
        type: "bar",
        orientation: "h"
    };

    let data = [trace];

    Plotly.newPlot("bar", data);
};

function bubblePlot(xdata, ydata, textData){
    let trace2 = {
        x: xdata,
        y: ydata,
        mode: 'markers',
        type: 'scatter',
        text: textData,
        marker: {
            color: xdata,
            colorscale: 'Electric',
            size: ydata
        }
    };

    let data2 = [trace2];
    console.log(data2);

    Plotly.newPlot('bubble', data2);

};

function gaugePlot(wf) {
   
    let base_chart = {
        // Chart data
        values: [5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 49.6],
        labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", " "],
        // Chart color set
        marker: {
            colors: 
                ["rgba(248, 243, 236, 100)",
                "rgba(244, 241, 229, 100)",
                "rgba(233, 230, 202, 100)",
                "rgba(229, 231, 179, 100)",
                "rgba(213, 228, 157, 100)",
                "rgba(183, 204, 146, 100)",
                "rgba(140, 191, 136, 100)",
                "rgba(138, 187, 143, 100)",
                "rgba(133, 180, 138, 100)",
                "rgba(255, 255, 255, 0)"
                ],
        },
        // Chart sizing
        rotation: -90.72,
        direction: "clockwise",
        name: "gauge",
        hole: 0.45,
        type: "pie",
        // Data Sort
        sort: false,
        showlegend: false,
        hoverinfo: "none",
        textinfo: "label",
        textposition: "inside"
        }

    let data4 = [base_chart];

    let wfAngle = calculateNeedlePosition(wf/9);
    console.log(wfAngle);
        
    let title = {
        margin: { t: 60 },
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 18 } },
        shapes: [
            {
                type: 'circle',
                xref: 'paper',
                yref: 'paper',
                fillcolor: 'red',
                x0: 0.485,
                y0: 0.485,
                x1: 0.515,
                y1: 0.515,
                line: {
                    color: 'red'
                }
            },
            {
            type: 'line',
            x0: 0.5,
            x1: wfAngle.x,
            y0: 0.5,
            y1: wfAngle.y,
            line: {
                color: 'red',
                width: 3
            },
            xref: 'paper',
            yref: 'paper'
            }
        ]
    };

    function calculateNeedlePosition(theta) {
        const r = 0.3 // radius
        return {
            x: Math.cos((theta) * Math.PI) * r * -1 + 0.5, // -1 inverts the direction of the rotation
            y: Math.sin((theta) * Math.PI) * r + 0.5
        }
    };

Plotly.newPlot('gauge', data4, title);

};

function metaDataFrame(SD) {
    // Extract metadata properties
    console.log(SD);
    let id = SD.id;
    let ethnicity = SD.ethnicity;
    let gender = SD.gender;
    let age = SD.age;
    let location = SD.location;
    let bbtype = SD.bbtype;
    let wfreq = SD.wfreq;
  
    // Create an HTML string with metadata properties
    let htmlString = `
        <div class="panel-body">
            <p>ID: ${id}</p>
            <p>Ethnicity: ${ethnicity}</p>
            <p>Gender: ${gender}</p>
            <p>Age: ${age}</p>
            <p>Location: ${location}</p>
            <p>BB Type: ${bbtype}</p>
            <p>WFreq: ${wfreq}</p>
        </div>
    `;
  
    // Set the innerHTML of an element with id "sample-metadata" to the metadata HTML string
    document.getElementById("sample-metadata").innerHTML = htmlString;
}
  