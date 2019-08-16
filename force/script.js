


var body = d3.select("#main").append("svg")
    .attr("width", width)
    .attr("height", height);

var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        node,
        link;

svg.append('defs').append('marker')
    .attr({'id':'arrowhead',
        'viewBox':'-0 -5 10 10',
        'refX':13,
        'refY':0,
        'orient':'auto',
        'markerWidth':13,
        'markerHeight':13,
        'xoverflow':'visible'})
    .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .attr('stroke','#ccc');



var force = d3.layout.force()
    .gravity(.05)
    .distance(150)
    .charge(-100)
    .size([width, height]);

var drag = force.drag()
    .on("dragstart", dragstart);

d3.json("graph.json", function(json) {

  var edges = [];
    json.links.forEach(function(e) { 
    var sourceNode = json.nodes.filter(function(n) { return n.id === e.source; })[0],
    targetNode = json.nodes.filter(function(n) { return n.id === e.target; })[0];
      
    edges.push({source: sourceNode, target: targetNode, cause: e.cause, value: e.value});//, value: e.Value});
    });

    
  force
      .nodes(json.nodes)
      .links(edges)
      .start();

  var link = body.selectAll(".link")
      .data(edges)
      .enter().append("line")
      .attr("class", "link")
      // .attr("id",function(d,i) {return 'edge'+i})
      // .style("stroke","#ccc")
      // .style("pointer-events", "none")
      .attr('marker-end','url(#arrowhead)');


  edgepaths = svg.selectAll(".edgepath")
            .data(edges)
            .enter()
            .append('path')
            .attr({
              // 'd': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
                'class': 'edgepath',
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'id': function (d, i) {return 'edgepath' + i}
            })
            .style("pointer-events", "none");

  edgelabels = svg.selectAll(".edgelabel")
            .data(edges)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr({
                'class': 'edgelabel',
                'id': function (d, i) {return 'edgelabel' + i},
                'font-size': 10,
                'fill': '#aaa'
            });

  edgelabels.append('textPath')
      .attr('xlink:href', function (d, i) {return '#edgepath' + i})
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .attr("startOffset", "50%")
      .text(function (d) {return d.cause});

  var node = body.selectAll(".node")
      .data(json.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag)
      .on("dblclick", dblclick)
      .call(drag);

  node.on("click", node_click);

  node.append("circle")
      .attr("class", "node")
      .attr("r", 7)
      .on('contextmenu', function(){ 
        d3.event.preventDefault();
        menu(d3.mouse(this)[0], d3.mouse(this)[1]);
      });
      

  node.append("svg:a")
      .append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.label});

    // node.append("title")
    // .text(function (d) {return d.id;});




  force.on("tick", function() {
      // link.attr({"x1": function(d){return d.source.x;},
      //               "y1": function(d){return d.source.y;},
      //               "x2": function(d){return d.target.x;},
      //               "y2": function(d){return d.target.y;}
      //   });
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

//  nodelabels.attr("x", function(d) { return d.x; }) 
//                   .attr("y", function(d) { return d.y; });

    edgepaths.attr('d', function(d) { 
      return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;});       

    edgelabels.attr('transform',function(d){
        if (d.target.x < d.source.x){
            bbox = this.getBBox();
            rx = bbox.x+bbox.width/2;
            ry = bbox.y+bbox.height/2;
            return 'rotate(180 '+rx+' '+ry+')';
            }
        else {
            return 'rotate(0)';
            }
    });

    
  });

  
});
  var jsonViewer = new JSONViewer();
  document.querySelector("#json").appendChild(jsonViewer.getContainer());

  function node_click(d) {
    jsonViewer.showJSON(d.value);
  }

  function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);

  }

  function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
  }