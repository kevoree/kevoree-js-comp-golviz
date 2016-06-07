angular.module('canvas', [])
  .factory('initCanvas', function () {
    return function () {
      console.log("azertyuazertyuazertyuazertyuazertyu");
      function getSquareSize() {
          var w = window,
              d = document,
              e = d.documentElement,
              g = d.getElementsByTagName('body')[0],
              x = w.innerWidth || e.clientWidth || g.clientWidth,
              y = w.innerHeight || e.clientHeight || g.clientHeight;
          return _.min([x,y]);
      }

      function getScale(gridSize, svgSize) {
          var xScale = d3.scale.linear().domain([0,gridSize.x]).range([0,svgSize.width]);
          var yScale = d3.scale.linear().domain([0,gridSize.y]).range([0,svgSize.height]);
          return { x:xScale, y:yScale };
      }

      var squareSize = getSquareSize() * 0.9;

      return function updateGrid(map) {
        var xmap = _.map(map, function(e) { return e.x; });
        var ymap = _.map(map, function(e) { return e.y; });
        var xmin = _.min(xmap);
        var xmax = _.max(xmap);
        var ymin = _.min(ymap);
        var ymax = _.max(ymap);

        var rx = _.range(xmin, xmax+1);
        var ry = _.range(ymin, ymax+1);
        var scales = getScale({x:rx.length, y:ry.length}, {height:squareSize, width:squareSize});

        var myNode = document.getElementById("gol-display");
        myNode.innerHTML = '';

        var svgContainer = d3.select("#gol-display")
            .append("svg")
            .attr("width", squareSize)
            .attr("height", squareSize);

        var gridGroup = svgContainer.append("g");

        var grid = [];
        ry.reverse().forEach(function (coordy, ey) {
            rx.forEach(function (coordx, ex) {
                var alive = _.filter(map, function (e) {
                        return e.x === coordx && e.y === coordy;
                    }).length === 1;
                grid.push({x: ex, y: ey, alive: alive});
            });
        });

        var cells = gridGroup.selectAll("rect")
            .data(grid)
            .enter()
            .append("rect");

        var cellAttributes = cells
            .attr("x", function (d) {
                return scales.x(d.x);
            })
            .attr("y", function (d) {
                return scales.y(d.y);
            })
            .attr("width", function (d) {
                return squareSize / rx.length;
            })
            .attr("height", function (d) {
                return squareSize / ry.length;
            })
            .attr("class", function (d) {
                return d.alive ? "alive" : "dead";
            });
      };
    };
  });
