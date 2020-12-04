export default function LineChart(container) {
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const svg1 = d3
    .select(container + '1')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group1 = svg1
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  function update(data) {
    let x = d3.scaleLinear().range([0, width]).domain([2012, 2019]);
    // y-axis for Movie Tickets
    let y = d3.scaleLinear().range([height, 0]).domain([1200, 1400]);

    let y1 = d3.scaleLinear().range([height, 0]).domain([50, 250]);

    //connecting the dots
    let line = d3
      .line()
      .curve(d3.curveCatmullRom)
      .x((d) => x(d.Year))
      .y((d) => y(d.MovieTickets));

    let line1 = d3
      .line()
      .curve(d3.curveCatmullRom)
      .x((d) => x(d.Year))
      .y((d) => y1(d.NetflixSubscribers));

    const l = length(line(data));
    const l1 = length(line1(data));

    group
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', `0,${l}`)
      .attr('d', line)
      .transition()
      .duration(2500)
      .ease(d3.easeLinear)
      .attr('stroke-dasharray', `${l},${l}`);

    group1
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'orange')
      .attr('stroke-width', 2.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', `0,${l1}`)
      .attr('d', line1)
      .transition()
      .duration(2500)
      .ease(d3.easeLinear)
      .attr('stroke-dasharray', `${l1},${l1}`);

    let xAxis = (g) =>
      g
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format('d')))
        .call((gr) => gr.select('.domain').remove())
        .call((gr) =>
          gr
            .selectAll('.tick line')
            .clone()
            .attr('y2', -height)
            .attr('stroke-opacity', 0.1)
        )
        .call((gr) =>
          gr
            .append('text')
            .attr('x', width + 10)
            .attr('y', -4)
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'end')
            .attr('fill', 'black')
            .text('Year')
        );

    //yAxis for movie tickets
    let yAxis = (g) =>
      g
        // .attr('transform', `translate(${margin.left + 30}-10)`)
        .call(d3.axisLeft(y).ticks(width / 110))
        .call((gr) => gr.select('.domain').remove())
        .call((gr) =>
          gr
            .selectAll('.tick line')
            .clone()
            .attr('x2', width + 80)
            .attr('stroke-opacity', 0.1)
        )
        .call((gr) =>
          gr
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 6)
            .attr('y', -4.5)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .attr('fill', 'black')
            .text('Number of Movie Tickets Sold, US  (million)')
        );

    //yAxis for netflix
    let yAxis1 = (g) =>
      g
        // .attr('transform', `translate(${margin.left + 30}-10)`)
        .call(d3.axisLeft(y1).ticks(width / 110))
        .call((gr) => gr.select('.domain').remove())
        .call((gr) =>
          gr
            .selectAll('.tick line')
            .clone()
            .attr('x2', width + 80)
            .attr('stroke-opacity', 0.1)
        )
        .call((gr) =>
          gr
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 8)
            .attr('y', -4.5)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .attr('fill', 'orange')
            .text('Netflix Subscriptions, US (million)')
        );

    group.append('g').call(xAxis);
    group.append('g').call(yAxis);
    group1.append('g').call(xAxis);
    group1.append('g').call(yAxis1);

    const datapoints = group.append('g').selectAll('circle').data(data).enter();

    const datapoints1 = group1
      .append('g')
      .selectAll('circle')
      .data(data)
      .enter();

    // chart

    const circleRadius = 5;
    // add circles
    datapoints
      .append('circle')
      .on('mouseenter', (event, d) => {
        const pos = d3.pointer(event, window);

        console.log(pos);

        d3.select('.tooltip-line')
          .style('display', 'inline-block')
          .style('opacity', 1)
          .style('left', pos[0] + 'px')
          .style('top', pos[1] + 'px')
          .html(d.MovieTickets + ' million');
      })
      .on('mouseleave', function (d) {
        d3.select('.tooltip-line')
          .style('display', 'hidden')
          .style('opacity', 0)
          .html('');
      })
      .attr('cx', (d) => x(d.Year))
      .attr('cy', (d) => y(d.MovieTickets))
      .attr('r', circleRadius)
      .style('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    datapoints1
      .append('circle')
      .on('mouseenter', (event, d) => {
        const pos = d3.pointer(event, window);

        console.log(pos);

        d3.select('.tooltip-line1')
          .style('display', 'inline-block')
          .style('opacity', 0.9)
          .style('left', pos[0] + 'px')
          .style('top', pos[1] + 'px')
          .html(d.NetflixSubscribers + ' million');
      })
      .on('mouseleave', function (d) {
        d3.select('.tooltip-line1')
          .style('display', 'hidden')
          .style('opacity', 0)
          .html('');
      })
      .attr('cx', (d) => x(d.Year))
      .attr('cy', (d) => y1(d.NetflixSubscribers))
      .attr('r', circleRadius)
      .style('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    function length(path) {
      return d3.create('svg:path').attr('d', path).node().getTotalLength();
    }
  }

  return {
    update,
  };
}
