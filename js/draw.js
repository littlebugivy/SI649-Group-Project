
$(document).ready(function () {
    loadData();
});

var numOfMovie;
var radius = 300;
var movie_node_size = 48;
var character_node_size = 25;
var char_node_size_enlarged = 28;

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
        .strength(function (link) { return 0.05 })

    const simulation = d3.forceSimulation()
        .force("link", linkForce)
        .force("charge", d3.forceCollide().radius(25).strength(0.8))
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
        .attr('r', character_node_size)


    // create movie nodes
    nodeElements
        .filter(function (d) { return d.group == 0 })
        .attr('class', 'movie_node')
        .append('circle')
        .attr('r', movie_node_size)
        .attr('id', function (d) {
            return processId(d.id);
        })
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .on("mouseover", handleMovieMouseOver)
        .on("mouseout", reset)

    // create char nodes
    nodeElements
        .filter(function (d) { return d.group == 1 })
        .attr('id', function (d) {
            return processId(d.id) + '_group';
        })
        .attr('class', 'char_node')
        .append('circle')
        .attr('r', character_node_size)
        .attr('id', function (d) {
            return processId(d.id) + '_circle';
        })
        .attr('class', 'char_circle')
        .attr('fill', 'white')
        .on("mouseover", handleCharMouseOver)
        .on("mouseout", reset)


    // add movie label, wrapped
    nodeElements
        .filter(function (d) { return d.group == 0 })
        .append('foreignObject')
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
        .on("mouseout", reset)

    function handleMovieMouseOver() {
        var selectedId = this.id;
        var connectedLinks = links.filter(function (link) {

            return processId(link.source.id) == selectedId;
        })

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

        // d3.select('#' + selectedId)
        //     .attr('height', 100)

        d3.selectAll('.movie_node')
            .style('opacity', function (movie) {
                return processId(movie.id) == selectedId ? 1 : 0.1;
            })
            .style('cursor', 'pointer')

        d3.selectAll('.char_node')
            .style('opacity', function (chara) {
                return charInMovieList.includes(chara.id) ? 1 : 0.1;
            })
            .style('cursor', 'pointer')

        d3.selectAll('.link')
            .style('opacity', function (link) {
                var psource = processId(link.source.id);
                var ptarget = processId(link.target.id);
                var linkId = psource + '_' + ptarget;
                return (linkList.includes(linkId)) ? 1 : 0;
            })
        simulation.force("link", d3
            .forceLink()
            .links(connectedLinks)
            .strength(function (link) { return 0.05 }));
        simulation.force("charge", d3.forceCollide().radius(30))
        simulation.alpha(1).restart();
    }

    function reset() {
        d3.selectAll('.movie_node')
            .style('opacity', 1)
        d3.selectAll('.char_node')
            .style('opacity', 1)
        d3.selectAll('.link')
            .style('opacity', 1)

        d3.selectAll('.char_label')
            .style('opacity', 0)
        d3.selectAll('.char_circle')
            .attr('r', character_node_size)

        simulation.force("link").links(links)
        simulation
            .force("charge", d3.forceCollide().radius(25).strength(0.8))
            .force('center', d3.forceCenter(width / 2 - radius, height / 2));
        simulation.alpha(1).restart();

    }


    nodeElements
        .filter(function (d) { return d.group == 1 })
        .append('image')
        .attr('href', function (d) { return d.photo; })
        .attr('class', 'profile_pic')
        .attr('id', function (d) { return processId(d.id); })
        .attr('x', function (d) { return character_node_size * -1; })
        .attr('y', function (d) { return character_node_size * -1; })
        .attr("clip-path", function (d, i) { return "url(#clip-circle)"; })
        .on("mouseover", handleCharMouseOver)
        .on("mouseout", reset)


    // add character label, wrapped
    nodeElements
        .filter(function (d) { return d.group == 1 })
        .append('foreignObject')
        .attr("x", - character_node_size)
        .attr("y", character_node_size)
        .attr('width', character_node_size * 2)
        .attr('height', character_node_size)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('color', 'red')
        .append('xhtml:p')
        .text(function (node) {
            return node.id;
        })
        .attr('style', 'text-align:center')
        .attr('id', function (d) {
            return processId(d.id) + '_label'
        })
        .attr('class', 'char_label')
        .style('opacity', 0)


    function handleCharMouseOver() {
        //console.log(this)
        var selectedId = this.id;

        var connectedLinks = links.filter(function (link) {
            if (processId(link.source.id) == selectedId || processId(link.target.id) == selectedId)
                return link;
        })

        var nodeList = [];
        var linkList = [];

        connectedLinks.forEach(function (link) {
            var source = processId(link.source.id);
            var target = processId(link.target.id);

            if (source == selectedId) {
                nodeList.push(target)
            }

            if (target == selectedId) {
                nodeList.push(source)
            }

            var linkId = source + '_' + target;
            linkList.push(linkId)
        })

        nodeList.push(selectedId);

        //console.log(nodeList)

        // // console.log(charInMovieList)
        // // console.log(linkList)

        d3.selectAll('.movie_node')
            .style('opacity', function (node) {
                return nodeList.includes(processId(node.id)) ? 1 : 0.1;
            })
            .style('cursor', 'pointer')


        d3.selectAll('.char_node')
            .style('opacity', function (chara) {
                return nodeList.includes(processId(chara.id)) ? 1 : 0.1;
            })
            .style('cursor', 'pointer')


        var selected_label = '#' + selectedId + '_label'
        d3.select(selected_label)
            .style('opacity', 1)

        var selected_node = '#' + selectedId + '_circle'
        console.log(d3.select(selected_node))
        d3.select(selected_node)
            .attr('r', char_node_size_enlarged)
            .attr('fill', 'red')
        // .attr('transform', function () {
        //     //transform = d3.transform(d3.select(this).attr("transform"));
        //     console.log(d3.select(this).attr("transform") + ",scale(1.5, 1.5)")
        //     return "translate(", width / 2 - radius, "," + height / 2, "),scale(1.5)";
        // })

        d3.selectAll('.link')
            .style('opacity', function (link) {
                var psource = processId(link.source.id);
                var ptarget = processId(link.target.id);
                var linkId = psource + '_' + ptarget;
                return (linkList.includes(linkId)) ? 1 : 0;
            })

        simulation.force("link", d3
            .forceLink()
            .links(connectedLinks)
            .strength(function (link) { return 0.05 }));
        simulation.force("charge", d3.forceCollide().radius(30))
        simulation.alpha(1).restart();




    }



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
