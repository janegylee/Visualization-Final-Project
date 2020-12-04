import DensityChart from './Density.js';

export default function BubbleChart(container) {
  const margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 50,
    },
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const rScale = d3.scaleLinear().range([5, 11]).clamp(true);
  const cScale = d3.scaleOrdinal(d3.schemeTableau10);
  const centerScale = d3.scalePoint().padding(1).range([0, width]);
  const forceStrength = 0.05;

  // append the svg object to the body of the page
  let svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  // const drag = (simulation) => {
  //     function started(event) {
  //         if (!event.active) simulation.alpha(1).restart();
  //         event.subject.fx = event.subject.x;
  //         event.subject.fy = event.subject.y;
  //     }

  //     function dragged(event) {
  //         event.subject.fx = event.x;
  //         event.subject.fy = event.y;
  //     }

  //     function ended(event) {
  //         if (!event.active) simulation.alphaTarget(0.0);
  //         event.subject.fx = null;
  //         event.subject.fy = null;

  //     }
  //     return d3.drag()
  //         .on("start", started)
  //         .on("drag", dragged)
  //         .on("end", ended);
  // }

  var currentValue = 0;
  var x = d3
    .scaleLinear()
    .domain([1, 4])
    .range([0, width - margin.left - margin.right])
    .clamp(true);

  let slidersvg = d3
    .select('#slider')
    .append('svg')
    .attr('width', width)
    .attr('height', 50);

  var slider = slidersvg
    .append('g')
    .attr('class', 'slider')
    .attr('transform', 'translate(' + margin.left + ',' + 15 + ')');

  slider
    .append('line')
    .attr('class', 'track')
    .attr('x1', x.range()[0])
    .attr('x2', x.range()[1]);
  // .select(function () {
  //     return this.parentNode.appendChild(this.cloneNode(true));
  // })
  // .attr("class", "track-inset")
  // .select(function () {
  //     return this.parentNode.appendChild(this.cloneNode(true));
  // })
  // .attr("class", "track-overlay")
  // .call(d3.drag()
  //     .on("start.interrupt", function () {
  //         slider.interrupt();
  //     })
  //     .on("start drag", function () {
  //         currentValue = d3.event.x;
  //         update(x.invert(currentValue));
  //     })
  // );

  slider
    .insert('g', '.track-overlay')
    .attr('class', 'ticks')
    .attr('transform', 'translate(0,' + 10 + ')')
    .selectAll('text')
    .data(x.ticks(4))
    .join('text')
    .attr('x', x)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .text(function (d) {
      return d;
    });

  //dragging handle
  var handle = slider
    .insert('circle', '.track-overlay')
    .attr('class', 'handle')
    .attr('r', 9);

  var playButton = d3.select('#play-button');

  var targetValue = width;
  let sliderStage = 1;

  function step() {
    sliderStage = (sliderStage % 4) + 1;
    handleMove(sliderStage);
    currentValue = currentValue + targetValue / 10;
    if (currentValue > targetValue) {
      currentValue = 0;
    }
  }

  function handleMove(h) {
    var h = Math.round(h);
    sliderStage = h;
    handle.transition().duration(200).attr('cx', x(h));
  }

  function showComments() {
    let comments = svg
      .append('text')
      .attr('class', 'comments')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .html(
        'Many movies are streamed on Netflix. Click on the button to find out!'
      );
    comments.exit().remove();
  }

  function hideComments() {
    d3.select('.comments').remove();
  }

  showComments();

  function update(data) {
    let density = DensityChart('.density');

    //for color variations
    data.forEach((d) => {
      let genre = d.Genres;

      if (
        genre == 'Action' ||
        genre == 'Adventure' ||
        genre == 'Sci-Fi' ||
        genre == 'Fantasy'
      ) {
        d.category = 'genre1';
      } else if (
        genre == 'Comedy' ||
        genre == 'Talk-Show' ||
        genre == 'Game-Show'
      ) {
        d.category = 'genre2';
      } else if (genre == 'Biography' || genre == 'Documentary') {
        d.category = 'genre3';
      } else if (
        genre == 'Horror' ||
        genre == 'Mystery' ||
        genre == 'Thriller' ||
        genre == 'Crime' ||
        genre == 'Film-Noir'
      ) {
        d.category = 'genre4';
      } else if (
        genre == 'Drama' ||
        genre == 'Family' ||
        genre == 'Animation'
      ) {
        d.category = 'genre5';
      } else {
        d.category = 'genre6';
      }
      if (d.Netflix == 1) d.platform = 'Netflix';
      else if (d.Hulu == 1) d.platform = 'Hulu';
      else if (d.Prime_Video == 1) d.platform = 'Prime';
      else d.platform = 'Disney';
    });
    rScale.domain(d3.extent(data, (d) => d.IMDb));

    data.forEach(function (d) {
      d.x = width / 2;
      d.y = height / 2;
    });

    const simulation = d3
      .forceSimulation(data)
      // .force('charge', d3.forceManyBody().strength(0))
      .force(
        'y',
        d3
          .forceY()
          .y(height / 2)
          .strength(0.05)
      )
      .force(
        'x',
        d3
          .forceX()
          .x(width / 2)
          .strength(0.05)
      )
      // .force('collision', d3.forceCollide().radius(d3.max(data, d => d.IMDb)).iterations(15))
      .force(
        'collide',
        d3.forceCollide(d3.max(data, (d) => d.IMDb)).iterations(15)
      );
    // .force("charge", d3.forceManyBody().strength(5))

    // simulation
    //     .nodes(data)
    //     .on("tick", ticked);

    function showCircles() {
      var circles = svg
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('r', (d) => rScale(d.IMDb))
        .attr('cx', (d, i) => {
          return 175 + 25 * i + 2 * i ** 2;
        })
        .attr('cy', (d) => 250)
        .style('fill', (d, i) => {
          return cScale(d.category);
        })
        // .style("stroke", "black")
        // .style("stroke-width", 1)
        .style('pointer-events', 'all');
      // .call(drag(simulation));

      circles
        .on('mouseover', function (event, d) {
          let xPosition = parseFloat(d3.select(this).attr('cx'));
          let yPosition = parseFloat(d3.select(this).attr('cy'));

          //Update the tooltip position and value
          d3.select('#tooltip2')
            .style('left', xPosition + 'px')
            .style('top', yPosition + 'px')
            .select('#title')
            .text(d.Title);
          d3.select('#tooltip2')
            .style('left', xPosition + 'px')
            .style('top', yPosition + 'px')
            .select('#genre')
            .text(d.Genres);
          // Show the tooltip
          d3.select('#tooltip2').classed('hidden', false);
        })
        .on('mouseout', function (d) {
          //Hide the tooltip
          d3.select('#tooltip2').classed('hidden', true);
        });

      circles.on('click', (event, d) => {
        density.update(data, d.category, cScale(d.category));
      });

      function ticked() {
        circles
          .attr('cx', function (d) {
            return d.x;
          })
          .attr('cy', function (d) {
            return d.y;
          });
      }
      simulation.on('tick', ticked);
    }

    function hideCircles() {
      svg.selectAll('circle').remove();
    }

    function showTitles(stage, scale) {
      var titles = svg.selectAll('.title').data(scale.domain());

      titles
        .enter()
        .append('text')
        .attr('class', 'title')
        .merge(titles)
        .attr('x', (d) => scale(d))
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text((d) => {
          let genre_title;
          if (d === 'genre1') {
            // genre_title = "Action & Adventure & Sci-Fi & Fantasy"
            return 'Action & Adventure';
          } else if (d === 'genre2') {
            // genre_title = "Comedy & Talk-Show & Game-Show & Reality-TV"
            return 'Comedy & Shows';
          } else if (d === 'genre3') {
            return 'Bio & Documentary';
          } else if (d === 'genre4') {
            return 'Horror & Crime';
          } else if (d === 'genre5') {
            return 'Drama & Family & Animation';
          } else if (d === 'genre6') {
            return 'Others';
          }
          return d;
        });
      titles.exit().remove();
    }

    function hideTitles() {
      svg.selectAll('.title').remove();
    }

    function splitBubbles(stage) {
      if (stage === 1) {
        hideCircles();
        hideTitles();
        showComments();
      }
      if (stage === 2) {
        hideComments();
        showCircles();
        const platform_map = data.map((d) => d.platform);
        platform_map.sort();

        centerScale.domain(platform_map);
        showTitles(stage, centerScale);
        simulation.force(
          'x',
          d3
            .forceX()
            .strength(forceStrength)
            .x((d) => centerScale(d.platform))
        );
      } else if (stage === 3) {
        hideComments();
        showCircles();
        const category_map = data.map((d) => d.category);
        category_map.sort();

        centerScale.domain(category_map);
        showTitles(stage, centerScale);
        simulation.force(
          'x',
          d3
            .forceX()
            .strength(forceStrength)
            .x((d) => centerScale(d.category))
        );
      }

      // @v4 We can reset the alpha value and restart the simulation
      simulation.alpha(2).restart();
    }

    let description = [
      '',
      'These are top 600 movies streamed on Netflix. The radius of a circle represents IMDb ratings, and the colors are genres.',
      'These are top 5 genres streamed on Netflix. Among these categories, Biography & Documentary genre leads with high ratings',
      'Now click on the bubbles to find out runtime of each genre!',
    ];

    function setupButtons() {
      playButton.on('click', function () {
        step();
        if (sliderStage === 1) {
          d3.select('#play-button').text('Next  ▶');
          // d3.select('.density').remove();
        } else if (sliderStage === 4) {
          d3.select('#play-button').text('Restart  ↻');
        }
        let pTag = document.querySelector('#comment-1');
        pTag.innerHTML = description[sliderStage - 1];
        splitBubbles(sliderStage);
      });
    }

    setupButtons();
  }
  return {
    update,
  };
}
