export default function DensityChart(container) {
  const margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 50,
    },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  let group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var x = d3.scaleLinear().range([0, width - 25]);

  var y = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom().scale(x);

  const yAxis = d3.axisLeft().scale(y);

  let xDisplay = group.append('g').attr('class', 'axis x-axis');

  let yDisplay = group.append('g').attr('class', 'axis y-axis');

  const xLabel = group
    .append('text')
    .attr('x', width - 20)
    .attr('y', height)
    .attr('font-size', 14);

  const yLabel = group
    .append('text')
    .attr('x', -5)
    .attr('y', -5)
    .attr('font-size', 14);

  function update(data, category, scale) {
    let obj = [];
    data.forEach((d) => {
      if (d.Runtime != null) {
        let runtime = d.Runtime;
        if (d.category === category) {
          obj.push({
            Runtime: runtime,
          });
        }
      }
    });

    x.domain([0, d3.max(obj, (d) => d.Runtime)]);

    xDisplay.attr('transform', `translate(0, ${height})`).call(xAxis);
    xLabel.text('runtime');
    yLabel.text('counts');

    var histogram = d3
      .histogram()
      .value((d) => d.Runtime)
      .domain(x.domain())
      .thresholds(x.ticks(80));

    var bins = histogram(obj);

    y.domain([0, d3.max(bins, (d) => d.length)]);

    yDisplay.call(yAxis);

    group.selectAll('rect').remove();

    let bars = group
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', 1)
      .attr('transform', function (d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
      })
      .attr('width', function (d) {
        return x(d.x1) - x(d.x0);
      })
      .attr('height', function (d) {
        return height - y(d.length);
      })
      .style('fill', scale);
    bars
      .on('mouseover', function (event, d) {
        let xPosition = parseFloat(d3.select(this).attr('width'));
        let yPosition = parseFloat(d3.select(this).attr('height'));

        //Update the tooltip position and value
        d3.select('#tooltip')
          .style('left', xPosition + 'px')
          .style('top', yPosition + 'px')
          .select('#runtime')
          .text(d[0].Runtime);
        d3.select('#tooltip')
          .style('left', xPosition + 10 + 'px')
          .style('top', yPosition + 10 + 'px')
          .select('#count')
          .text(d.length);
        // Show the tooltip
        d3.select('#tooltip').classed('hidden', false);
      })
      .on('mouseout', function (d) {
        //Hide the tooltip
        d3.select('#tooltip').classed('hidden', true);
      });
  }

  return {
    update,
  };
}
