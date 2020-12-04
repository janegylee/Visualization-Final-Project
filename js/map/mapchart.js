import mapDataProcessor from './mapDataProcessor.js';
import BarChart from './barchart.js';
import PieChart from './piechart-rotten.js';
import StarChart from './starChart.js';

export default function MapChart(container) {
  // initialization
  // Create a SVG with the margin convention
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 1000 - margin.left - margin.right;
  const height = 750 - margin.top - margin.bottom;

  const barChart = BarChart('#bar-chart-container');
  const pieChart = PieChart('#Rotten-tomato-container');
  const starChart = StarChart('#IMDB-chart-container');

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  function update(worldmap, obj) {
    ////// MAP CHART //////
    const topo = topojson.feature(worldmap, worldmap.objects.countries);
    const features = topo.features;
    const projection = d3.geoMercator().fitExtent(
      [
        [0, 0],
        [width, height],
      ],
      topo
    );

    const path = d3.geoPath().projection(projection);

    const objKeys = Object.keys(obj);
    const totalExtent = d3.extent(objKeys, (d) => obj[d].total);
    console.log('totalExtent', totalExtent);

    const totals = objKeys.map((k) => obj[k].total);
    totals.sort((a, b) => a - b);
    console.log('totals', totals);

    const colorScale = d3
      .scaleThreshold()
      .domain([50, 100, 300, 1500])
      .range(d3.schemeBlues[5]);

    const defaultUpdate = function (country) {
      // "United States of America";
      d3.select('#Map-Country').text(country);
      const countryVal = obj[country];
      const mapProcessed = mapDataProcessor.barProcess(countryVal);
      const rottenScore = Math.floor(countryVal['Rotten']);
      const pieData = [rottenScore, 100 - rottenScore, 0];

      const imdb = countryVal['IMDB'];
      const imdbRounded = +imdb.toFixed(2);

      const starProcessed = mapDataProcessor.starProcess(imdbRounded);

      starChart.update(starProcessed);

      barChart.update(mapProcessed);

      pieChart.update(pieData);
    };

    const mouseover = function (e, d) {
      d3.selectAll('.world-map')
        .transition()
        .duration(200)
        .style('opacity', 0.2);
      d3.select(this)
        .transition()
        .duration(200)
        .style('opacity', 1)
        .style('stroke-width', 5)
        .style('stroke', 'black');

      const country = d.properties.name;
      d3.select('#Map-Country').text(country);

      const countryVal = obj[country];
      if (!countryVal) return;

      const mapProcessed = mapDataProcessor.barProcess(countryVal);

      const rottenScore = Math.floor(countryVal['Rotten']);
      const pieData = [rottenScore, 100 - rottenScore, 0];

      const imdb = countryVal['IMDB'];
      const imdbRounded = +imdb.toFixed(2);

      const starProcessed = mapDataProcessor.starProcess(imdbRounded);

      starChart.update(starProcessed);

      barChart.update(mapProcessed);

      pieChart.update(pieData);
    };

    const mouseleave = function (e, d) {
      d3.selectAll('.world-map').transition().duration(200).style('opacity', 1);
      d3.select(this).transition().duration(200).style('stroke', 'transparent');
    };

    group
      .selectAll('path')
      .data(features)
      .join('path')
      .attr('class', 'world-map')
      .attr('fill', (d) => {
        const country = d.properties.name;
        if (obj[country] !== undefined) {
          return colorScale(obj[country].total);
        }
        return 'grey';
      })
      .attr('d', path)
      .style('opacity', 1)
      .on('mouseover', mouseover)
      .on('mouseleave', mouseleave);

    group
      .append('path')
      .datum(topojson.mesh(worldmap, worldmap.objects.countries))
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('class', 'world-map subunit-boundary')
      .style('opacity', 1);

    ////////////
    // LEGEND //
    ////////////

    const rectSize = 15;
    const legendX = margin.left - 5;
    const legendY = height - margin.bottom - 5 * (rectSize + 10);

    // Append Title
    group
      .append('text')
      .attr('class', 'labels')
      .attr('x', legendX)
      .attr('y', legendY - 15)
      .style('fill', 'black')
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
      .attr('font-weight', 'bold')
      .text('Movie Count');

    const legendInfo = [
      { label: '1500+', number: 1600 },
      { label: '300 ~ 1500', number: 400 },
      { label: '100 ~ 300', number: 110 },
      { label: '51 ~ 100', number: 60 },
      { label: '0 ~ 50', number: 10 },
      { label: 'No Data', number: -1 },
    ];

    const legends = group.selectAll('.legend').data(legendInfo, (d) => d);

    legends
      .enter()
      .append('rect')
      .attr('class', 'legend')
      .attr('x', legendX)
      .attr('y', (d, i) => legendY + i * (rectSize + 5))
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', (d) => {
        if (d.number < 0) {
          return 'grey';
        }
        return colorScale(d.number);
      });

    legends.exit().remove();

    const labels = group.selectAll('.labels').data(legendInfo, (d) => d);

    labels
      .enter()
      .append('text')
      .attr('class', 'labels')
      .attr('x', legendX + rectSize * 1.2)
      .attr('y', (d, i) => legendY + i * (rectSize + 5) + rectSize / 2)
      .style('fill', 'black')
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
      .text((d) => d.label);

    /// Default update
    defaultUpdate('United States of America');
  }

  return {
    update,
  };
}
