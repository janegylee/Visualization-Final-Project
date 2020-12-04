export default function PieChart(container) {
  // initialization
  var margin = { top: 0, right: 10, bottom: 100, left: 60 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  const group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  function update(data, type, platform) {
    var dataSelect = [];

    for (var i = 0; i < data.length; i++) {
      if (platform === 'All' && data[i].Age == type) {
        dataSelect.push({
          Age: data[i].Age,
          Genres: data[i].Genres,
        });
      } else if (platform === 'Netflix' && data[i].Age == type) {
        if (data[i].Netflix == 1) {
          dataSelect.push({
            Age: data[i].Age,
            Genres: data[i].Genres,
          });
        }
      } else if (platform === 'Hulu' && data[i].Age == type) {
        if (data[i].Hulu == 1) {
          dataSelect.push({
            Age: data[i].Age,
            Genres: data[i].Genres,
          });
        }
      } else if (platform === 'Prime Video' && data[i].Age == type) {
        if (data[i]['Prime Video'] == 1) {
          dataSelect.push({
            Age: data[i].Age,
            Genres: data[i].Genres,
          });
        }
      } else if (platform === 'Disney+' && data[i].Age == type) {
        if (data[i]['Disney+'] == 1) {
          dataSelect.push({
            Age: data[i].Age,
            Genres: data[i].Genres,
          });
        }
      }
    }

    var genres = [];
    var doNothing = 0;

    for (var i = 0; i < dataSelect.length; i++) {
      if (dataSelect[i].Genres == null) {
        doNothing++;
      } else {
        var temp = dataSelect[i].Genres.split(',');
        for (var j = 0; j < temp.length; j++) {
          genres.push(temp[j]);
        }
      }
    }

    var total = dataSelect.length;

    var sortGenre = [];
    genres.forEach((d) => {
      let genre = d;
      if (
        genre == 'Action' ||
        genre == 'Adventure' ||
        genre == 'Sci-Fi' ||
        genre == 'Fantasy'
      ) {
        sortGenre.push('Action & Adventure');
      } else if (genre == 'Romance' || genre == 'Drama') {
        sortGenre.push('Romance & Drama');
      } else if (
        genre == 'Biography' ||
        genre == 'War' ||
        genre == 'History' ||
        genre == 'News' ||
        genre == 'Sport' ||
        genre == 'Short' ||
        genre == 'Western' ||
        genre == 'Documentary'
      ) {
        sortGenre.push('Biography & News');
      } else if (
        genre == 'Horror' ||
        genre == 'Mystery' ||
        genre == 'Thriller' ||
        genre == 'Crime' ||
        genre == 'Film-Noir'
      ) {
        sortGenre.push('Horror & Thriller');
      } else if (
        genre == 'Music' ||
        genre == 'Family' ||
        genre == 'Musical' ||
        genre == 'Animation'
      ) {
        sortGenre.push('Family & Musical');
      } else {
        sortGenre.push('Other');
      }
    });

    const select = {};
    sortGenre.forEach((el) => {
      if (select[el]) {
        select[el]++;
      } else {
        select[el] = 1;
      }
    });

    var data1 = [];

    for (var key in select) {
      data1.push({
        genre: key,
        value: select[key],
        percent: parseInt((select[key] / total) * 100),
      });
    }

    const arc = d3.arc().innerRadius(0).outerRadius(150);

    var pie = d3.pie().value(function (d) {
      return d.value;
    });

    const color = d3
      .scaleOrdinal()
      .domain(data1)
      .range(["#fff5eb","#feddbd","#fdc28d","#fda25b","#f47420","#e05609"]);

    let piechart = group.datum(data1).selectAll('path').data(pie);
    piechart
      .enter()
      .append('path')
      .merge(piechart)
      .on('mouseenter', (event, d) => {
        const pos = d3.pointer(event, window);
        d3.select('.tooltip-pie')
          .style('display', 'inline-block')
          .style('top', pos[1] + 'px')
          .style('left', pos[0] + 'px')
          .html(
            'Platform: ' +
              platform +
              '<br>' +
              'Age: ' +
              type +
              '<br>' +
              'Genre: ' +
              d.data.genre +
              '<br>' +
              'Number of movies: ' +
              d.data.value +
              '<br>' +
              'Percent: ' +
              d.data.percent +
              '%'
          );
      })
      .on('mouseleave', (event, d) => {
        d3.select('.tooltip').style('display', 'none');
      })
      .transition()
      .style('fill', function (d, i) {
        return color(i);
      })
      .attr('d', arc);

    piechart.exit().remove();
  }
  return {
    update,
  };
}
