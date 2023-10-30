$("select").select2();
  fetch("city_dropdown.json")
        .then(response => response.json())
        .then(data => {
          const citySelect = document.getElementById('citySelect');
            data["cities"].forEach(city => {
              const option = document.createElement('option');
              option.value = city; // Set the option value
              option.textContent = city; // Set the option text
              citySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
$("select").select2();
CreateGraph("Albuquerque");
CreateHeatMap();
$("#citySelect").on('change', function(){
   cityName = $(this).val();
   $("select").select2();
   CreateGraph(cityName)
});
function CreateGraph(cityName) {
  const selectedCity = cityName;
  
  d3.select("#visualization1").select("svg").remove();
  d3.json("tree_data.json").then(function(data) {
    const cityData = data[selectedCity];
    // Sort the data by count 
    cityData.sort((a, b) => b.count - a.count);
    
    const margin = { top: 40, right: 40, bottom: 60, left: 150 };
    const width = 1250 - margin.left - margin.right;
    const height = 2500 - margin.top - margin.bottom;
    const svg = d3.select("#visualization1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(cityData, d => d.count)])
        .range([0, width]);
    
    const yScale = d3.scaleBand()
        .domain(cityData.map(d => d.scientific_name))
        .range([0, height])
        .padding(0.2);

    const tooltip = d3.select('body').select("#visualization1").append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'black')
        .style('color','white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('width', '350px')
        .style('height', '80px')
        .style('font-size', '90%')
        .style('display','flex')
        .style('align-items','center')
        .style('overflow-x','auto');
    const bars = svg.selectAll(".bar")
        .data(cityData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.scientific_name))
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")
        .on('mouseover',function (d,i)  {
            d3.select(this)
            .attr("fill", "orange") // Change the bar color on mouseover
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`&nbspAbundance: ${i.count}<br/>&nbspCommon Name(s): ${i.common_name}`)
            .style("left", (d.pageX + 10) + "px")
            .style("top", (d.pageY - 40) + "px");
        })
        .on('mousemove',function (d,i)  {
            
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`&nbspAbundance: ${i.count}<br/>&nbspCommon Name(s): ${i.common_name}`)
            .style("left", (d.pageX + 10) + "px")
            .style("top", (d.pageY - 40) + "px");
        })
        .on('mouseout', function (){
          d3.select(this)
             .attr("fill", "steelblue");
          tooltip.transition().duration(500).style('opacity', 0);
        }); 

    svg.append("g")
        
        .style("font-family","Fira Sans")
        .attr("class", "x-axis")
        .call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${height})`);
    
    svg.append("g")
        .style("font-family","Fira Sans")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));
    
    svg.append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Count");
    
    svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .style("text-anchor", "middle")
        .text(`Tree Data for ${selectedCity}`);
});
}
function CreateHeatMap(){
    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 50, bottom: 30, left: 200},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("heatmap.csv").then(function(data) {

    // Labels of row and columns -> unique identifier of the column called 'city' and 'scientific_name'
    const myGroups = Array.from(new Set(data.map(d => d.city)))
    const myVars = Array.from(new Set(data.map(d => d.scientific_name)))

    // Build X scales and axis:
    const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);
    svg.append("g")
    .style("font-size", 15)
    .style("font-family","Fira Sans")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

    // Build Y scales and axis:
    const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
    svg.append("g")
    .style("font-size", 15)
    .style("font-family","Fira Sans")
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

    // Build color scale
    const myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,3000])

    // create a tooltip
    const tooltip =d3.select('body').select("#heatmap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .attr("data-svg", "heatmap-tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

    // Three function that change the tooltip when user hover / move / leave a cell

    const mouseover = function(event,d) {
    
    tooltip
    .html("The exact value of<br>this cell is: " + d.count)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY + 10) + "px")
    .style("opacity", 1)
    d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
    }

    const mousemove = function(event,d) {
    tooltip
    .html("The exact value of<br>this cell is: " + d.count)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY + 10) + "px")
    }
    const mouseleave = function(event,d) {
        tooltip
        .style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

    // add the squares
    svg.selectAll()
    .data(data, function(d) {return d.city+':'+d.scientific_name;})
    .join("rect")
    .attr("x", function(d) { return x(d.city) })
    .attr("y", function(d) { return y(d.scientific_name) })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", function(d) { return myColor(d.count)} )
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
    })

    // Add title to graph
    svg.append("text")
    .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .style("text-anchor", "middle")
        .style("font-size", "22px")
        .text("A Heat map for common trees in the cities and their count");
};
