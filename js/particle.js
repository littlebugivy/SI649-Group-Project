
var canvas;
var context;
var proton;
var renderer;
var emitter;
var stats;

Main();

function Main() {
    initCanvas();
    // addStats();
    createProton();
    tick();
}

function initCanvas() {
    canvas = document.getElementById("particle");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext('2d');
    context.globalCompositeOperation = "lighter";
}

function createProton(image) {
    proton = new Proton;
    emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(40, 20), new Proton.Span(1, 2));

    emitter.addInitialize(new Proton.Body('img/particle_grey.png', 15));
    emitter.addInitialize(new Proton.Mass(10));
    emitter.addInitialize(new Proton.Radius(100));
    emitter.addInitialize(new Proton.Life(1, 10));
    emitter.addInitialize(new Proton.V(new Proton.Span(.1,2), new Proton.Span(0, 360), 'polar'));
    emitter.addBehaviour(new Proton.RandomDrift(10, 10, .05, easing="easeInSine"));
    emitter.addBehaviour(new Proton.Alpha(1, 0.1));

    emitter.addBehaviour(new Proton.Scale(.1, 4));
    emitter.p.x = canvas.width / 2;
    emitter.p.y = canvas.height / 2;
    emitter.emit();
    proton.addEmitter(emitter);

    renderer = new Proton.CanvasRenderer(canvas);
    proton.addRenderer(renderer);
}



function tick() {
    requestAnimationFrame(tick);

    proton.update();

}
