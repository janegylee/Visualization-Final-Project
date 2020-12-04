export default function BarChart(container) {
  // Initialization
  // Create a SVG with the margin convention
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
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Create scales
  const xScale = d3.scaleBand().rangeRound([0, width]).paddingInner(0.2);
  const yScale = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom().scale(xScale);
  const xAxisGroup = group.append('g').attr('class', 'x-axis axis');

  const yAxis = d3.axisLeft().scale(yScale);
  const yAxisGroup = group.append('g').attr('class', 'y-axis axis');

  function update(data) {
    const platforms = data.map((d) => d.platform);
    const countMax = d3.max(data, (d) => d.count);

    console.log('barchart update data', data);
    console.log('platforms', platforms);

    xScale.domain(platforms);
    yScale.domain([0, countMax + 1]);
    yAxis.ticks(Math.min(countMax + 1, 10));

    group.selectAll('rect').remove();

    const rects = group.selectAll('rect').data(data);

    rects
      .enter()
      .append('rect')
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.count))
      .attr('x', (d) => xScale(d.platform))
      .attr('y', (d) => yScale(d.count))
      .attr('fill', 'steelblue')
      .merge(rects);

    rects.exit().remove();

    xAxisGroup
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .call((g) =>
        g
          .append('text')
          .attr('x', width + 45)
          .attr('y', 0)
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'end')
          .attr('fill', 'black')
          .text('Platform')
      );

    yAxisGroup
      .call(yAxis)
      .call((g) =>
        g
          .append('text')
          .attr('x', 5)
          .attr('y', -3)
          .attr('fill', 'black')
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'start')
          .text('Movie Count')
      );
  }

  return {
    update,
  };
}
