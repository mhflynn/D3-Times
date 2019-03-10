//------------------------------------------------------------------------
// D3 Times App
// - See README.md for description of the application. 

// Initialize global constants
// Initialize size for chart svg element
const svgWidthMax  = 980;
const svgHeightMax = 660;

// Initialize chart related sizes and chart group element
const margin       = {top:20, bottom:80, left:80, right:20};
const chartPadding = .03;

// Data keys and associated plot and label information. Information is 
// accessed by the same data key value used to access the input data. 
// Values for 'extent' are caluculated when input data read
let dataKeys = {
    'poverty'    : {format:(d)=>`${d}%`,     label:(d)=>`Poverty: ${d}%`,
                    selectText : 'Poverty Level', extent : [],
                    axisLabel  : 'Population Percentage Below Poverty Level'},
    'age'        : {format:(d)=>`${d}yrs`,   label:(d)=>`Age: ${d}yrs`,
                    selectText : 'Age',      extent : [],
                    axisLabel : 'Population Average Age'},
    'income'     : {format:(d)=>`$${d}`,     label:(d)=>`Income: $${d}`,
                    selectText : 'Income',   extent : [],
                    axisLabel  : 'Population Avearge Income'},
    'healthcare' : {format:(d)=>`${d}%`,     label:(d)=>`Health Care: ${d}%`,
                    selectText : 'Health Care',   extent : [],
                    axisLabel  : 'Population Percentage Without Health Care'},
    'obesity'    : {format:(d)=>`${d}%`,     label:(d)=>`Obesity: ${d}%`,
                    selectText : 'Obesity',  extent : [],
                    axisLabel  : 'Population Percentage With Obisity'},
    'smokes'     : {format:(d)=>`${d}%`,     label:(d)=>`Smoking: ${d}%`,
                    selectText : 'Smokers',  extent : [],
                    axisLabel  : 'Population Percentage who Smoke'}
};

// Initialize global variables for app
let xKey = 'income';
let yKey = 'poverty';
let xScale = d3.scaleLinear();
let yScale = d3.scaleLinear();

let lastContainerWidth = d3.select('#scatter').property('clientWidth');
d3.select('#g-grp').attr('transform', `translate(${margin.left}, ${margin.top})`);

// Initialize the category "select" drop down menu to control the plot
let xSel = d3.select('#x-select');
let ySel = d3.select('#y-select');

// Add text for each category to both x-axis and y-axis selection list
Object.keys(dataKeys).forEach(key => {
    xSel.append('option').property('value',key)
                         .text(dataKeys[key].selectText);
    ySel.append('option').property('value',key)
                         .text(dataKeys[key].selectText);
});

// Establish event handlers for both selection menus
xSel.property('value', xKey).on('change', function() {
    xKey = this.value; 
    drawChart(xKey, yKey, 2000)
    });

ySel.property('value', yKey).on('change', function() {
    yKey = this.value; 
    drawChart(xKey, yKey, 2000)
    });

// Initialize tool tip elements, using d3 tool-tip
let toolTip = d3.tip().attr("class", "d3-tip")
                .html((d)=>`${d.state}<br>`+
                           `${dataKeys[xKey].label(d[xKey])}<br>`+
                           `${dataKeys[yKey].label(d[yKey])}`)
                .offset([60, -60]);
        
d3.select('#scatter').select('svg').call(toolTip);

//------------------------------------------------------------------------
// Function : svgUpdate()
// - Update chart elements dependent on svg container size, primarily
// - width of the container. Scaling of height for small and extra-small
// - sizes is TODO.
//
function svgUpdate (newWidth, newHeight=svgHeightMax) {
    // Update global chart variables for container and chart height and width
    svgWidth    = Math.min(lastContainerWidth, svgWidthMax);
    svgHeight   = newHeight;
    chartWidth  = svgWidth - margin.left - margin.right;
    chartHeight = svgHeight - margin.top - margin.bottom;

    // Update axis scales for modified chart height and width
    xScale = d3.scaleLinear().range([0, chartWidth]);
    yScale = d3.scaleLinear().range([chartHeight, 0]);

    // Apply updated height and width to html
    d3.select('#scatter').select('svg').attr('width', svgWidth).attr('height', svgHeight);
    d3.select('#x-axis' ).attr('transform',`translate(0,${chartHeight})`);
    d3.select('#x-label').attr('transform', `translate(${chartWidth/2},${chartHeight+margin.top+20})`);
    d3.select('#y-label').attr('transform', `translate(-50, ${chartHeight/2}) rotate(-90)`);

    // Update chart ...
    drawChart(xKey, yKey)
}

//------------------------------------------------------------------------
// Function : drawChart()
// - Update chart elements and redraw based on catagory selections.
// - Also called for redraw based on container size changes.
//
function drawChart(xKey, yKey, transtime=0) {

    // Scale axis for the current input selection
    xScale.domain(dataKeys[xKey].extent);
    yScale.domain(dataKeys[yKey].extent);
    xAxis = d3.axisBottom(xScale).tickFormat(d=>dataKeys[xKey].format(d));
    yAxis = d3.axisLeft(yScale).tickFormat(d=>dataKeys[yKey].format(d));
    //xAxis = d3.axisBottom(xScale.domain(dataKeys[xKey].extent)).tickFormat(d=>dataKeys[xKey].format(d));
    //yAxis = d3.axisLeft(yScale.domain(dataKeys[yKey].extent)).tickFormat(d=>dataKeys[yKey].format(d));

    // Draw the Y axis
    d3.select('#x-axis').transition().duration(transtime)
                        .call(xAxis);

    // Draw the X axis
    d3.select('#y-axis').transition().duration(transtime)
                        .call(yAxis);

    // Draw the scatter plot for the current input selection
    d3.select('#chart').selectAll('circle')
                       .transition().duration(transtime)
                       .attr('cx',d=>xScale(+d[xKey]))
                       .attr('cy',d=>yScale(+d[yKey]));

    // Draw the scatter plot for the current input selection
    d3.select('#chart').selectAll('text')
                       .transition().duration(transtime)
                       .attr('x',d=>xScale(+d[xKey]))
                       .attr('y',d=>yScale(+d[yKey]));

    d3.select('#x-label').text(dataKeys[xKey].axisLabel);
                  
    d3.select('#y-label').text(dataKeys[yKey].axisLabel);
}
//------------------------------------------------------------------------
// Read file for chart data
//  - As chart data is read once at startup, with no anticipated update
//    to the values or the number of records, data related calculations
//    and allocations can be made at this time.
//
d3.csv('assets/data/data.csv').then(chartData => {

    // Compute extent for each input category for use with scale and axis
    for (k in dataKeys) {
        let data    = chartData.map(d=>+d[k]);
        let extent  = d3.extent(data);
        let padding = (extent[1] - extent[0]) * chartPadding;
        extent[0]  -= padding;
        dataKeys[k].extent = extent;
    }

    // Bind chart data to the chart elements, 1 row/record per element
    d3.select('#chart').selectAll('circle')
                       .data(chartData).enter()
                       .append('circle')
                       .classed('stateCircle',true)
                       .attr('r',15);

    d3.select('#chart').selectAll('text')
                       .data(chartData).enter()
                       .append('text')
                       .classed('stateText',true)
                       .text(d=>d.abbr)
                       .attr('dy',6);

    // Instantiate callbacks for chart elements mouse "over" and "out"
    d3.select('#chart').selectAll('.stateText')
                       .on("mouseover", function(d) {toolTip.show(d,this)})
                       .on("mouseout",  function(d) {toolTip.hide(d)});
         
    // For responsive design, instantiate callback for window size changes
    d3.select(window).on('resize', function() {

        curWidth = d3.select('#scatter').property('clientWidth');

        if (curWidth != lastContainerWidth) {
            lastContainerWidth = curWidth;
            svgUpdate(curWidth);
        }
    });

    // Render the chart for first time
    svgUpdate (lastContainerWidth);
    drawChart(xKey, yKey);
});
