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
CreateGraph("Albuquerque")
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
    const width = 1300 - margin.left - margin.right;
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
