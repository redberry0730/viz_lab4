let wealth_health;

d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
    wealth_health = data;

    const margin = ({top: 30, right: 30, bottom: 30, left: 30});
    const width = 750 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    const svg = d3.select('.chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height+margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data,d=>d.Income))
        .range([0, width]);
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data,d=>d.LifeExpectancy))
        .range([height,0]);
    const rScale = d3.scaleSqrt()
        .domain(d3.extent(data,d=>d.Population))
        .range([3,20]);
    const color = d3.scaleOrdinal(d3.schemeSet1);     
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5,'s');
    svg.append('g')
        .attr('class','axis x-axis')
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
    svg.append('text')
        .text('Income')
        .attr('class','titles')
        .attr('x', width-70)
        .attr('y', height-15)
        .attr('text-anchor','middle')
        .attr('font-size', 15)
        .attr('font-weight', 'bold')
        .attr('alignment-baseline','middle');
    const yAxis = d3.axisLeft()
        .scale(yScale);
    svg.append('g')
        .attr('class','axis y-axis')
        .call(yAxis);
    svg.append('text')
        .text('Life Expectancy')
        .attr('class','titles')
        .attr('x', 15)
        .attr('y', 50)
        .attr('text-anchor','middle')
        .attr('font-size', 15)
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle')
        .attr('writing-mode', 'vertical-lr');
    let circles = svg.selectAll('circle')
        .data(wealth_health)
        .enter()
        .append('circle')
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr('r', d=>rScale(d.Population))
        .attr("fill", d=>color(d.Region))
        .attr('opacity', 0.6)
        .attr('stroke', 'black')
        .on("mouseenter", (event, d) => {
            const pos = d3.pointer(event, window)
            d3.select(event.target).attr("opacity", "1");
            d3.select('.tooltip')
                .style('display','inline-block')
                .style('top',pos[1]+7+'px')
                .style('left',pos[0]+7+'px')
                .html("Country: " + d.Country + "<br> Region: " + d.Region
                + "<br> Population: " + d3.format(',d')(d.Population) + "<br> Income: "
                + d3.format(',d')(d.Income) + "<br> Life Expectancy: " + d.LifeExpectancy);
        })
        .on("mouseleave", (event, d) => {
            d3.select(event.target).attr("opacity", "0.6");
            d3.select('.tooltip')
                .style('display', 'none');
        });
    let legend = svg.selectAll('rect')
        .data(color.domain())
        .enter()
        .append('rect')
        .attr('class','box')
        .attr('width', 10)
        .attr('height', 10)
        .attr('x',450)
        .attr('y',(d,i)=>300+i*15)
        .attr('fill', d=>color(d));
    let label = svg.selectAll('div')
        .data(color.domain())
        .enter()
        .append('text')
        .attr('class','region')
        .text(d=>d)
        .attr('x', 450+15)
        .attr('y',(d,i)=>309+i*15)
        .attr('text-anchor', 'beginning')
        .attr('font-size',12);
})