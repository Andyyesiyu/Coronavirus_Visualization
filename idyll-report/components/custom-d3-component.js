const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;
// const margin = ({top: 20, right: 20, bottom: 30, left: 40});
// const height = size;
// const width = size;
class CustomD3Component extends D3Component {
  initialize(node, props) {
    const svg = (this.svg = d3.select(node).append('svg'));
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
          d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv", function(data) {

            // group the data: I want to draw one line per group
            var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
              .key(function(d) { return d.name;})
              .entries(data);
          
            // Add X axis --> it is a date format
            var x = d3.scaleLinear()
              .domain(d3.extent(data, function(d) { return d.year; }))
              .range([ 0, width ]);
            svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x).ticks(5));
          
            // Add Y axis
            var y = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) { return +d.n; })])
              .range([ height, 0 ]);
            svg.append("g")
              .call(d3.axisLeft(y));
          
            // color palette
            var res = sumstat.map(function(d){ return d.key }) // list of group names
            var color = d3.scaleOrdinal()
              .domain(res)
              .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
          
            // Draw the line
            svg.selectAll(".line")
                .data(sumstat)
                .enter()
                .append("path")
                  .attr("fill", "none")
                  .attr("stroke", function(d){ return color(d.key) })
                  .attr("stroke-width", 1.5)
                  .attr("d", function(d){
                    return d3.line()
                      .x(function(d) { return x(d.year); })
                      .y(function(d) { return y(+d.n); })
                      (d.values)
                  })
          
          })
    //Read the data
    // var x = d3.scaleLinear()
    // .domain([0, 100]).nice()
    // .range([margin.left, width - margin.right]);

    // var y = d3.scaleLinear()
    // .domain([0, 100]).nice()
    // .range([height - margin.bottom, margin.top]);

    // var line = d3.line()
    // .x(function(d) { return x(d[0]); })
    // .y(function(d) { return y(d[1]); });
    // svg
    //   .attr('viewBox', `0 0 ${size} ${size}`)
    //   .style('width', '100%')
    //   .style('height', 'auto');

    // svg
    //   .append('circle')
    //   .attr('r', 20)
    //   .attr('cx', 0.1 * size)
    //   .attr('cy', 0.9 * size);

    // svg
    //   .append("path")
    //   .datum(d3.range(100).map(function(x) { return [x, Math.exp(x)]; }))
    //   .attr("fill", "none")
    //   .attr("stroke", "steelblue")
    //   .attr("stroke-width", 1.5)
    //   .attr("stroke-linejoin", "round")
    //   .attr("stroke-linecap", "round")
    //   .attr("d", line);
  }

  update(props) {

    const { transition } = props;
    
  }

}

module.exports = CustomD3Component;
