const margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 80
  },
  width = 920,
  height = 630

const x = d3.scaleLinear()
 .range([0, width])
const timeFormat = d3.timeFormat('%M:%S')

const svg = d3.select('#svgContainer')
              .append('svg')
              .style('background-color', '#EEE')
              .attr('width', width)
              .attr('height', height)
              .attr('class', 'mainSVG')

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(function(data) {
  
  const minYear = d3.min(data, (d) => d.Year)
  const maxYear = d3.max(data, (d) => d.Year)
  const minTime = d3.min(data, (d) => new Date(Date.UTC(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1])))
  const maxTime = d3.max(data, (d) => new Date(Date.UTC(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1])))

  const xScale = d3.scaleLinear()
                   .domain([minYear - 1, maxYear + 1])
                   .range([margin.left, width - margin.right])

  const yScale = d3.scaleTime()
                   .domain([minTime, maxTime])
                   .range([margin.top, height - margin.bottom])

  const xAxis = svg.append('g')
                   .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom) + ')')
                   .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
                   .attr('id', 'x-axis')

  const yAxis = svg.append('g')
                   .call(d3.axisLeft(yScale)
                   .tickFormat(timeFormat))
                   .attr('transform', 'translate(' + margin.left + ', 0)')
                   .attr('id', 'y-axis')

  const toolTip = d3.select('#svgContainer').append('div')
                     .attr('class', 'tooltip')
                     .attr('id', 'tooltip')
                     .style('opacity', 0)

  const tooltipFormat = (d) => {

        if (d.Doping == "") {
          return `${d.Name}: ${d.Nationality} <br/> 
          Year: ${d.Year}, Time: ${d.Time}`
        } else {
        return `${d.Name}: ${d.Nationality} <br/> 
          Year: ${d.Year}, Time: ${d.Time} <br/>
          <br/>
          ${d.Doping}`
        }
  }

  svg.append('text')
     .attr('class', 'svgTitle')
     .attr('id', 'title')
     .text('Doping in Professional Bicycle Racing')
     .attr('x', width/2)
     .attr('transform', 'translate(-230)')
     .attr('y', 50)
  svg.append('text')
     .attr('class', 'svgTitle svgTitleTwo')
     .text("35 Fastest times up Alpe d'Huez")
     .attr('x', width/2)
     .attr('transform', 'translate(-135)')
     .attr('y', 80)

  const yLabel = svg.append('text')
                    .attr('class', 'yLabel')
                    .attr('transform', 'rotate(-90)')
                    .attr('x', 0 - height/2 + 30)
                    .attr("y", 35)
                    .text('Time in Minutes')

  svg.selectAll('circle')
     .data(data)
     .enter()
     .append('circle')
     .attr('cx', (d) => xScale(d.Year))
     .attr('cy', (d) => yScale(new Date(Date.UTC(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]))))
     .attr('r', 7)
     .attr('class', (d) => d.Doping === "" ? 'noDope dot':'yesDope dot')
     .attr('data-xvalue', (d) => d.Year)
     .attr('data-yvalue', (d) => new Date(Date.UTC(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1])))
     .style('opacity', '.9')
     .on('mouseover', function(d) {
      toolTip.attr('data-year', d.Year)
      toolTip.transition()
             .duration(200)
             .style('opacity', .9)
      toolTip.html(tooltipFormat(d))
             .style('left', (d3.event.pageX + 5) + 'px')
             .style('top', (d3.event.pageY - 60) + 'px')
     })
     .on('mouseout', function() {
      toolTip.transition()
             .duration(500)
             .style('opacity', 0)
     })

  const legend = svg.append('g')
                  .attr('class', 'legend')
                  .attr('id', 'legend')
                  .attr('x', width/2)
                  .attr('y', height/2)
                  .attr('width', 50)
                  .attr('height', 50)
  
  legend.append('rect')
        .attr('x', width - 50)
        .attr('y', 300)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', 'rgb(69, 119, 136)')

  legend.append('rect')
        .attr('x', width - 50)
        .attr('y', 300 + 25)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', 'rgb(206, 134, 2)')
  
  legend.append('text')
        .text('No doping allegations')
        .attr('x', width - 190)
        .attr('y', 315)
        .attr('font-size', '13px')

  legend.append('text')
        .text('Riders with doping allegations')
        .attr('x', width - 240)
        .attr('y', 340)
        .attr('font-size', '13px')

})