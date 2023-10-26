// Load the JSON data for the selected city (e.g., 'LosAngeles')
const selectedCity = 'LosAngeles';
d3.json("tree_data.json").then(function(data) {
    const cityData = data[selectedCity];

    // Sort the data by count (change this to sort by a different property if needed)
    cityData.sort((a, b) => b.count - a.count);

    const margin = { top: 40, right: 40, bottom: 60, left: 150 };
    const width = 1300 - margin.left - margin.right;
    const height = 5000 - margin.top - margin.bottom;

    
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
        .padding(0.1);

    svg.selectAll(".bar")
        .data(cityData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.scientific_name))
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("class", "x-axis")
        .call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${height})`);

    svg.append("g")
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