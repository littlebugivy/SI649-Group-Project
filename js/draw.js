
$(document).ready(function () {
    loadData();
});
const COLOR_RED = '#EA2327'
const COLOR_BK = '#151515'
const COLOR_WHITE = "rgba(255, 241, 191, 0.2)"
const COLOR_ALLY = "rgba(255, 0, 0, 0.5"
const COLOR_ENER = "rgba(21, 190, 233, 0.5)"
var numOfMovie;
var radius = 300;
var movie_node_size = 48;
var char_node_size = 25;
var char_node_size_enlarged = 28;
var movie_node_width = 110;
var movie_node_height = 50;
var active_char;
var hover_char;
var query_content = "";

var poly = [{ "x": 0, "y": 10 },
{ "x": 0, "y": 50 },
{ "x": 90, "y": 50 },
{ "x": 110, "y": 40 },
{ "x": 110, "y": 0 },
{ "x": 20, "y": 0 }];

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
        setUpSearch();
    });

}

function processId(id) {
    return id.replace(/[:\s\(\)]+/g, '_');
}

function drawNodes() {
    const width = window.innerWidth + 50
    const height = window.innerHeight - 20;

    var svg = d3.select('.graph-container')
        .append('svg')
        .attr('width', width / 3 * 2)
        .attr('height', height)

    // simulation setup with all forces
    var linkForce = d3
        .forceLink()
        .id(function (d, i) { return d.id })
        .strength(function (link) { return 0.05 })

    const simulation = d3.forceSimulation()
        .force("link", linkForce)
        .force("charge", d3.forceCollide().radius(25).strength(0.3))
        //.force("r", d3.forceRadial(function (d) { return d.group === "0" ? 100 : 200; }))
        //.force('charge', d3.forceManyBody().strength(-25).distanceMax(radius - 10).distanceMin(25))
        .force('center', d3.forceCenter(width / 2 - radius, height / 2))


    function getNodeColor(node) {
        if (node.group == 0) {
            return 'white'
        } else {
            return COLOR_BK
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
            return char_node_size;
        }
        if (node.group == 0) {
            return movie_node_size;
        } else {
            // number after + is border width
            return char_node_size + 1;
        }
    }



    var linkElements = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", 1)
        .attr("stroke", "rgba(255, 241, 191, 0.2)")
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
        .attr('r', char_node_size)


    // create movie nodes
    nodeElements
        .filter(function (d) { return d.group == 0 })
        .attr('class', 'movie_node')
        .selectAll('polygon')
        .data([poly])
        .enter().append("polygon")
        .attr("points", function (d) {
            return d.map(function (d) {
                return [d.x - movie_node_width / 2, d.y - movie_node_height / 2].join(",");
            }).join(" ");
        })
        .attr('fill', COLOR_BK)
        .attr("stroke", 'white')
        .attr("stroke-width", 0.4);

    // create char nodes
    nodeElements
        .filter(function (d) { return d.group == 1 })
        .attr('id', function (d) {
            return processId(d.id) + '_group';
        })
        .attr('class', 'char_node')
        .append('circle')
        .attr('r', char_node_size)
        .attr('id', function (d) {
            return processId(d.id) + '_circle';
        })
        .attr("opacity", 1)
        .attr('class', 'char_circle')
        .on("mouseover", handleCharMouseOver)
        .on("click", handleCharMouseClick)
        .on("mouseout", handleCharMouseOut)


    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            reset();
        }
    };


    // add movie label, wrapped
    nodeElements
        .filter(function (d) { return d.group == 0 })
        .append('foreignObject')
        .attr("x", -movie_node_width * 0.45)
        .attr("y", -movie_node_height * 0.4)
        .attr('width', movie_node_width * 0.95)
        .attr('height', movie_node_height)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('color', 'white')
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
        if (active_char) {
            resetChar(active_char);
        }
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
        simulation.force("charge", d3.forceCollide().radius(function (d) { return d.group == 0 ? 70 : 30 }))
        simulation.alpha(1).restart();
    }

    function reset() {
        d3.select('#searchBar').attr("value", "")

        d3.selectAll('.movie_node')
            .style('opacity', 1)
        d3.selectAll('.char_node')
            .style('opacity', 1)
        d3.selectAll('.link')
            .style('opacity', 1)
            .attr('stroke', COLOR_WHITE)

        d3.selectAll('.char_label')
            .style('opacity', 0)
        d3.selectAll('.char_circle')
            .attr('r', char_node_size)

        simulation.force("link").links(links)
        simulation
            .force("charge", d3.forceCollide().radius(25).strength(0.3))
        //.force('center', d3.forceCenter(width / 2 - radius, height / 2));
        simulation.alpha(1).restart();

    }


    nodeElements
        .filter(function (d) { return d.group == 1 })
        .append('image')
        .attr('href', function (d) { return d.photo; })
        .attr('class', 'profile_pic')
        .attr('id', function (d) { return processId(d.id); })
        .attr('x', function (d) { return char_node_size * -1; })
        .attr('y', function (d) { return char_node_size * -1; })
        .attr("clip-path", function (d, i) { return "url(#clip-circle)"; })
        .on("mouseover", handleCharMouseOver)
        .on("mouseout", handleCharMouseOut)
        .on("click", handleCharMouseClick)

    // add character label, wrapped
    nodeElements
        .filter(function (d) { return d.group == 1 })
        .append('foreignObject')
        .attr("x", - char_node_size)
        .attr("y", char_node_size)
        .attr('width', char_node_size * 2)
        .attr('height', char_node_size)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('color', COLOR_RED)
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

    function resetChar(charId) {
        d3.select('#searchBar').attr("value", "")
        var selected_label = '#' + charId + '_label'
        d3.select(selected_label)
            .style('opacity', 0)

        var selected_node = '#' + charId + '_circle'
        //console.log(d3.select(selected_node))
        d3.select(selected_node)
            .attr('r', char_node_size)

        nodes.forEach(function (node) {
            node.mark = undefined
        })
        selectedNode = nodes.filter(function (d) { return processId(d.id) == charId; })[0]
        if (selectedNode == undefined) {
            return
        }
        selectedNode.fx = null;
        selectedNode.fy = null;
        simulation.force("link").links(links);
    }

    function handleCharMouseOver() {
        if (hover_char && hover_char != active_char)
            resetChar(hover_char);

        var selectedId = this.id;
        hover_char = selectedId;

        var selected_node = '#' + selectedId + '_circle'
        console.log(d3.select(selected_node))
        d3.select(selected_node)
            .attr('r', char_node_size_enlarged)
            .attr('fill', COLOR_RED)

        var selected_label = '#' + selectedId + '_label'
        d3.select(selected_label)
            .style('opacity', 1)

        selectedNode = nodes.filter(function (d) { return processId(d.id) == selectedId; })[0]
        if (selectedNode == undefined) {
            return
        }
        selectedNode.fx = selectedNode.x;
        selectedNode.fy = selectedNode.y;
    }

    function handleCharMouseOut() {
        if (!hover_char)
            return
        var selectedId = hover_char;

        selectedNode = nodes.filter(function (d) { return processId(d.id) == selectedId; })[0]
        if (selectedNode == undefined) {
            return
        }

        if (hover_char == active_char) {
            console.log("here")
            return
        }
        selectedNode.fx = null;
        selectedNode.fy = null;

        var last_label = '#' + hover_char + '_label'
        d3.select(last_label)
            .style('opacity', 0)

        var last_node = '#' + hover_char + '_circle'
        //console.log(d3.select(last_node))
        d3.select(last_node)
            .attr('r', char_node_size)

        hover_char = null;
    }


    function handleCharMouseClick() {
        d3.select('#searchBar').attr("value", this.id)
        var selectedId = this.id;

        if (active_char)
            resetChar(active_char);

        active_char = selectedId;

        var connectedLinks = links.filter(function (link) {
            if (processId(link.source.id) == selectedId || processId(link.target.id) == selectedId)
                return link;
        })

        var nodeList = [];
        var linkList = [];

        connectedLinks.forEach(function (link) {

            if (processId(link.target.id) != selectedId) {
                if (link.value == 1) {
                    link.target.mark = 1
                } else if (link.value == 2) {
                    link.target.mark = -1
                }
            }

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


        // add the activated node itself
        nodeList.push(selectedId);

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

        var selected_node = '#' + selectedId + '_circle'
        console.log(d3.select(selected_node))
        d3.select(selected_node)
            .attr('r', char_node_size_enlarged)
            .attr('fill', COLOR_RED)

        var selected_label = '#' + selectedId + '_label'
        d3.select(selected_label)
            .style('opacity', 1)

        d3.selectAll('.link')
            .style('opacity', function (link) {
                var psource = processId(link.source.id);
                var ptarget = processId(link.target.id);
                var linkId = psource + '_' + ptarget;
                return (linkList.includes(linkId)) ? 1 : 0;
            })
            .attr('stroke', function (link) {
                if (link.value == 1) {
                    return COLOR_ALLY //for ally
                }
                else if (link.value == 2) {
                    return COLOR_ENER //for enermy
                } else {
                    return COLOR_WHITE;
                }
            })


        simulation.force("link", d3
            .forceLink()
            .links(connectedLinks)
            .strength(function (link) { return processId(link.target.id) == selectedId ? 0 : 0.05 }));
        simulation.force("charge", d3.forceCollide().radius(30))
        simulation.alpha(1).restart();
        selectedNode = nodes.filter(function (d) { return processId(d.id) == selectedId; })[0]
        if (!selectedNode)
            return

        selectedNode.fx = width / 2 - radius;
        selectedNode.fy = height / 2;
    }

    function setUpMovies(node, counter) {
        var angle = (counter / (numOfMovie / 2) - 0.375) * Math.PI;
        var x = - (radius * Math.cos(angle)) + width / 2 - radius;
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
            if (active_char && node.mark != undefined) {
                // character is selected
                node.x = (radius * Math.tan(2 * node.mark)) + 150;
                node.y = -(radius * Math.cos(2 * node.mark)) + 200;
                node.mark = undefined
                return "translate(" + node.x + "," + node.y + ")";
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

function setUpSearch() {
    let searchDropdown = document.querySelector(".searchCandidates");
    nodes.sort(function (a, b) { if (a.id < b.id) { return -1; } else { return 1; } });
    for (var i = 0; i < nodes.length; i++) {

        if (nodes[i].group == 1) {
            var newNode = document.createElement('a');
            newNode.className = "dropDownItems";
            newNode.innerHTML = nodes[i].id;
            searchDropdown.appendChild(newNode);
        }
    }
    let xPosition = $(".searchBar").position().left;
    let height = $(".searchBar").outerHeight();
    let width = $(".searchBar").outerWidth(true);
    $(".searchCandidates").css({ width: width, top: height, left: xPosition });
    $(".dropDownItems").hide();
    $(".dropDownItems").bind("click", function () {
        confirmSearch($(this));
    })
}

function search(searchBar) {
    console.log(searchBar.value);
    query_content = searchBar.value.replace(" ", "").toUpperCase();
    let dropDownItems = $(".dropDownItems");

    if (query_content != "") {
        for (var i = 0; i < dropDownItems.length; i++) {
            if ($(dropDownItems[i]).text().replace(" ", "").toUpperCase().includes(query_content)) {
                $(dropDownItems[i]).show("fast");
            } else {
                $(dropDownItems[i]).hide("fast");
            }
        }
        // d3.selectAll(".char_node")
        // .style('opacity', function (chara) {
        //     return chara.id.replace(" ", "").toUpperCase().includes(query_content) ? 1 : 0.1;
        // })
        // d3.selectAll(".link")
        // .style('opacity', function (link) {
        //     return link.target.id.replace(" ", "").toUpperCase().includes(query_content) ? 1 : 0;
        // }).attr('stroke', COLOR_WHITE)
    } else {
        $(".dropDownItems").show();
    }
}

function dismiss() {
    window.setTimeout(function () { $('.dropDownItems').hide(); }, 200)
    //active_char = undefined;
}

function confirmSearch(element) {
    let text = $(element).text();
    $(".searchBar").val(text);
    $(".dropDownItems").hide();
    let evt = new MouseEvent("click");
    try {
        d3.select("#" + $(".searchBar").val().replace(" ", "_")).node().dispatchEvent(evt);
    } catch (err) {

    }
}



