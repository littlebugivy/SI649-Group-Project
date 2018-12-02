
$(document).ready(function () {
    loadData();
});

var numOfMovie;
var radius = 250;
var node_size = 40;

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
    d3.json("data/network.json", function (d) {
        data = d;
        nodes = data.nodes;
        movies = data.nodes.filter(function (node) { return node.group == 0 });
        numOfMovie = movies.length;
        links = data.links;

        // nodes = test_data.nodes;
        // links = test_data.links;

        // console.log(nodes)
        //console.log(numOfMovie)

        // data.forEach(function (item) {
        //     item.n = parseInt(item.n);
        // });

        drawNodes();

        //visualizeColorProperty();
        //visualizeColorWheel();
        //visualizeColorHarmony();
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
        .force('center', d3.forceCenter(width / 2 - radius, height / 2 - radius / 4))


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
        if (node.group == 0) {
            return node_size;
        } else {
            return 10;
        }
    }

    var linkElements = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", 1)
        .attr("stroke", "rgba(50, 50, 50, 0.2)")


    var nodeElements = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .enter().append('g')

    nodeElements
        .attr('class', 'node')
        .append('circle')
        .attr('r', getNodeSize)
        .attr('id', function (d) { return d.id })
        .attr('fill', getNodeColor)
        .attr('stroke', getNodeBorder)

    nodeElements
        .append('text')
        .text(function (node) {
            if (node.group == 0) {
                return node.id;
            }
        })
        .attr('class', 'wrapme')
        .attr("text-anchor", "center")
        .attr("dx", function (d) { return -node_size / 2 })


    function wrap(text) {
        console.log(text)
        text.each(function () {
            var text = d3.select(this);
            var words = text.text().split(/\s+/).reverse();
            var lineHeight = 20;
            var width = parseFloat(text.attr('width'));
            var y = parseFloat(text.attr('y'));
            var x = text.attr('x');
            var anchor = text.attr('text-anchor');

            var tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('text-anchor', anchor);
            var lineNumber = 0;
            var line = [];
            var word = words.pop();

            while (word) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width) {
                    lineNumber += 1;
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text.append('tspan').attr('x', x).attr('y', y + lineNumber * lineHeight).attr('anchor', anchor).text(word);
                }
                word = words.pop();
            }
        });
    }

    function setUpMovies(node, counter) {
        //nodes.forEach(function (node) {
        //if (node.group == 0) { // this node is a movie
        var angle = (counter / (numOfMovie / 2)) * Math.PI;
        var x = (radius * Math.cos(angle)) + width / 2 - radius;
        var y = (radius * Math.sin(angle)) + height / 2 - radius / 4;
        node.x = x;
        node.y = y;
        //console.log(node.id, node.x, node.y)
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
    d3.selectAll('.wrapme').call(wrap);
}
