import d3Star from './star.js';

export default function StarChart(container) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 300 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;
  const size = 20;
  const next = size + 5;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + (1.05 * width) / 2 + ',' + height / 2 + ')'
    );

  const star1 = d3Star();
  const star2 = d3Star();
  const star3 = d3Star();
  const star4 = d3Star();
  const star5 = d3Star();

  function update(data) {
    /// Text append
    svg.selectAll('.imdb-label').remove();

    svg
      .append('text')
      .attr('class', 'imdb-label')
      .attr('x', 0)
      .attr('y', height / 2 + 5)
      .text(() => {
        const sum = data.reduce((acc, cv) => acc + cv).toFixed(2);
        console.log('reduce sum', sum);
        return 'IMDB Rating: ' + sum;
      })
      .attr('text-anchor', 'left')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .style('alignment-baseline', 'middle');

    /// Updating stars
    star1
      .x(0)
      .y(0)
      .size(size)
      .value(data[0])
      .borderColor('#CAAA6F')
      .borderWidth(1);
    star2
      .x(0 + next)
      .y(0)
      .size(size)
      .value(data[1])
      .borderColor('#CAAA6F')
      .borderWidth(1);
    star3
      .x(0 + next * 2)
      .y(0)
      .size(size)
      .value(data[2])
      .borderColor('#CAAA6F')
      .borderWidth(1);
    star4
      .x(0 + next * 3)
      .y(0)
      .size(size)
      .value(data[3])
      .borderColor('#CAAA6F')
      .borderWidth(1);
    star5
      .x(0 + next * 4)
      .y(0)
      .size(size)
      .value(data[4])
      .borderColor('#CAAA6F')
      .borderWidth(1);

    star1(group);
    star2(group);
    star3(group);
    star4(group);
    star5(group);
  }

  return {
    update,
  };
}
