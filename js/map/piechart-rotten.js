export default function PieChart(container) {
  const margin = { top: 20, right: 50, bottom: 20, left: 50 };
  const width = 400 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group = svg
    .append('g')
    .attr('transform', 'translate(' + width / 3 + ',' + height / 2 + ')');

  const colorScale = d3
    .scaleOrdinal(['steelblue', 'red', 'grey'])
    .domain([0, 1, 2]);

  const arc = d3.arc().innerRadius(0).outerRadius(50);

  function update(data) {
    const arcs = d3.pie()(data);

    console.log('piechart', data);
    console.log('arcs', arcs);

    const pieGraph = group.selectAll('slices');

    pieGraph
      .data(arcs)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorScale(i))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    pieGraph.exit().remove();

    group
      .selectAll('slices')
      .data(arcs)
      .enter()
      .append('text')
      .text((d, i) => {
        if (d.value !== 0) {
          return d.value + '%';
        }
        return;
      })
      .attr('transform', function (d) {
        return 'translate(' + arc.centroid(d) + ')';
      })
      .style('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .style('font-size', 10);

    ////////////
    // LEGEND //
    ////////////

    const rectSize = 15;
    const legendX = 65;
    const legendY = 50;

    const rects = svg.selectAll('.legend').data(data);

    rects
      .join('rect')
      .attr('class', 'legend')
      .attr('x', width / 3 + legendX)
      .attr('y', (d, i) => legendY + i * (rectSize + 5))
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', (d, i) => colorScale(i));

    rects.exit().remove();

    const labels = svg.selectAll('.labels').data(data);

    labels
      .join('text')
      .attr('class', 'labels')
      .attr('x', width / 3 + legendX + 20)
      .attr('y', (d, i) => legendY + i * (rectSize + 5) + rectSize / 2)
      .text((d, i) => {
        if (i === 0) {
          return 'Positive Review';
        } else if (i === 1) {
          return 'Negative Review';
        } else if (i === 2) {
          return 'No Data';
        } else {
          return;
        }
      })
      .style('fill', (d, i) => colorScale(i))
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle');
  }

  return {
    update,
  };
}
