# D3-Times
## HW 16 - Data Journalism and D3

* Note: You'll need to use `python -m http.server` to run the visualization. This will host the page at `localhost:8000` in your web browser.

## Background

Welcome to the newsroom! You've just accepted a data visualization position for a major metro paper. You're tasked with analyzing the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand your findings.

The editor wants to run a series of feature stories about the health risks facing particular demographics. She's counting on you to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set included with the assignment is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml]. The current data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

## The Task

### Level 1: D3 Fixed, 2 Varible Chart

You need to create a scatter plot between two of the data variables such as `Poverty vs. Income`.

Represent each state with circle elements, use file `data.csv` for input data. 
* Include state abbreviations in the circles.
* Create and situate your axes and labels to the left and bottom of the chart.

### Level 2: Interactive Graph

#### 1. More Data Categories, More Dynamics

Place additional labels in your scatter plot and give them click events so that your users can select which data categories to display. Animate the transitions for your circles' locations as well as the range of your axes. 

#### 2. Incorporate d3-tip

Add tooltips to your circles and display each tooltip with the data that the user has selected. Use the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)
