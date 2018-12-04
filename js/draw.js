
$(document).ready(function () {
    loadData();
});

var numOfMovie;
var radius = 280;
var movie_node_size = 45;
var character_node_size = 30;

var test_data = {
    "nodes": [
        {
            "id": "Avengers: Infinity War",
            "group": 0
        },
        {
            "id": "Guardians of the Galaxy",
            "group": 0
        },
        {
            "id": "Iron Man",
            "group": 1
        },
        {
            "id": "Groot",
            "group": 1,
            "relative": 0,
            "squad": 0
        }
    ],
    "links": [
        { "source": "Avengers: Infinity War", "target": "Iron Man", "value": 0 },
        { "source": "Guardians of the Galaxy", "target": "Groot", "value": 0 },
        { "source": "Iron Man", "target": "Groot", "value": 1 }
    ]
}


function loadData() {
    //code for Q1 goes here
    d3.json("data/network_with_photo.json", function (d) {
        data = d;
        nodes = data.nodes;
        movies = data.nodes.filter(function (node) { return node.group == 0 });
        numOfMovie = movies.length;
        links = data.links;

        // nodes = test_data.nodes;
        // links = test_data.links;

        // console.log(nodes)
        //console.log(numOfMovie)

        drawNodes();
    });

}

function drawNodes() {
    const width = window.innerWidth
    const height = window.innerHeight

    var svg = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

    // simulation setup with all forces
    var linkForce = d3
        .forceLink()
        .id(function (d, i) { return d.id })
        .strength(function (link) { return 0.1 })

    const simulation = d3.forceSimulation()
        .force("link", linkForce)
        .force("charge", d3.forceCollide().radius(15).strength(0.5))
        //.force("r", d3.forceRadial(function (d) { return d.group === "0" ? 100 : 200; }))
        // .force('charge', d3.forceManyBody().strength(-10).distanceMax(radius-10).distanceMin(10))
        .force('center', d3.forceCenter(width / 2 - radius, height / 2))


    function getNodeColor(node) {
        if (node.group == 0) {
            return 'white'
        } else {
            return 'black'
        }
    }

    function getNodeBorder(node) {
        if (node.group == 0) {
            return 'blue'
        }
        return;
    }

    function getNodeSize(node) {
        if (node == undefined) {
            // clip-path
            return character_node_size;
        }
        if (node.group == 0) {
            return movie_node_size;
        } else {
            // number after + is border width
            return character_node_size + 1;
        }
    }

    function processId(id) {
        return id.replace(/[:\s\(\)]+/g, '_');
    }


    var linkElements = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", 1)
        .attr("stroke", "rgba(50, 50, 50, 0.2)")
        .attr('id', function (linkObj) {
            var psource = processId(linkObj.source);
            var ptarget = processId(linkObj.target);
            return psource + '_' + ptarget;
        })
        .attr('class', 'link')


    var nodeElements = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .enter().append('g')


    svg.append("defs")
        .attr("id", "clip-def")
        .attr('class', 'node')
        .append('clipPath').attr('id', "clip-circle")
        .append('circle')
        .attr('r', getNodeSize)


    nodeElements
        .attr('class', function (n) {
            return n.group == 0 ? 'movie_node' : 'char_node'
        })
        .append('circle')
        .attr('r', getNodeSize)
        .attr('id', function (d) {
            return processId(d.id);
        })
        .attr('fill', getNodeColor)
        .attr('stroke', getNodeBorder)
        .on("mouseover", handleMovieMouseOver)
        .on("mouseout", handleMovieMouseOut)

    // add text, wrapped
    nodeElements.append('foreignObject')
        .attr("x", -movie_node_size * 0.6)
        .attr("y", -movie_node_size * 0.6)
        .attr('width', movie_node_size * 1.2)
        .attr('height', movie_node_size * 1.2)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('color', 'black')
        .attr('class', 'movie_label')
        .append('xhtml:p')
        .text(function (node) {
            if (node.group == 0) {
                return node.id;
            }
        })
        .attr('style', 'text-align:center')
        .attr('id', function (node) {
            if (node.group == 0) {
                return processId(node.id);
            }
        })
        .on("mouseover", handleMovieMouseOver)
        .on("mouseout", handleMovieMouseOut)



    function handleMovieMouseOver() {
        var selectedId = this.id;

        var connectedLinks = links.filter(function (link) {
            return processId(link.source.id) == selectedId;
        })
        // console.log(connectedLinks)
        var charInMovieList = [];
        var linkList = [];

        connectedLinks.forEach(function (link) {
            charInMovieList.push(link.target.id);

            var psource = processId(link.source.id);
            var ptarget = processId(link.target.id);
            var linkId = psource + '_' + ptarget;
            linkList.push(linkId)
        })

        // console.log(charInMovieList)
        // console.log(linkList)

        d3.selectAll('.movie_node')
            .style('opacity', function (movie) {
                return processId(movie.id) == selectedId ? 1 : 0.3;
            })
            .style('cursor', 'pointer')

        d3.selectAll('.char_node')
            .style('opacity', function (chara) {
                return charInMovieList.includes(chara.id) ? 1 : 0;
            })
            .style('cursor', 'pointer')

        d3.selectAll('.link')
            .style('opacity', function (link) {
                var psource = processId(link.source.id);
                var ptarget = processId(link.target.id);
                var linkId = psource + '_' + ptarget;
                return (linkList.includes(linkId)) ? 1 : 0;
            })
    }

    function handleMovieMouseOut() {
        d3.selectAll('.movie_node')
            .style('opacity', 1)
        d3.selectAll('.char_node')
            .style('opacity', 1)
        d3.selectAll('.link')
            .style('opacity', 1)
    }


    nodeElements
        .append('image')
        .attr('href', function (d) { if (d.group == 1) return d.photo; })
        .attr('class', 'profile_pic')
        .attr('x', function (d) { return character_node_size * -1; })
        .attr('y', function (d) { return character_node_size * -1; })
        .attr("clip-path", function (d, i) { if (d.group == 1) return "url(#clip-circle)"; })


    function setUpMovies(node, counter) {
        var angle = (counter / (numOfMovie / 2)) * Math.PI;
        var x = (radius * Math.cos(angle)) + width / 2 - radius;
        var y = (radius * Math.sin(angle)) + height / 2;
        node.x = x;
        node.y = y;
        return node;
    }

    simulation.nodes(nodes).on('tick', () => {
        var counter = 0;
        nodeElements.attr("transform", function (node) {
            if (node.group == 0) {
                var node = setUpMovies(node, counter);
                counter++;
            }
            return "translate(" + node.x + "," + node.y + ")";
        })

        linkElements
            .attr('x1', function (link) { return link.source.x })
            .attr('y1', function (link) { return link.source.y })
            .attr('x2', function (link) { return link.target.x })
            .attr('y2', function (link) { return link.target.y })
    })

    simulation.force("link").links(links);
    //d3.selectAll('.wrapme').call(wrap);
}
