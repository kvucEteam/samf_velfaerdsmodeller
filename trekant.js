var canvas_height = $("#myCanvas").height();
var canvas_width = $("#myCanvas").width();
$(".canvas_container").css("height", canvas_height)

var ratio = (canvas_width / 2) / canvas_height;

var top, hojre, venstre, triangle, triangle_clone, crosshair;



$(document).ready(function() {


    //Init canvas genererer en universel model
    drawTriangle(.6, .4);

    draw_draggable();

});


function drawTriangle(toppos, leftpos) {


    toppos_px = toppos * canvas_height;
    leftpos_px = leftpos * canvas_width;

    // draw basic triangle:
    top = new Path();

    top.add(new Point(canvas_width * .5, 0));
    top.add(new Point(canvas_width * .5 - toppos_px * ratio, canvas_height * toppos));
    top.add(new Point(canvas_width * .5 + toppos_px * ratio, canvas_height * toppos));


    venstre = new Path();
    // mountain_path.strokeColor = 'white';
    venstre.add(new Point(canvas_width * .5 - toppos_px * ratio, canvas_height * toppos));
    venstre.add(new Point(0, canvas_height));
    venstre.add(new Point(leftpos_px, canvas_height));
    venstre.add(new Point(leftpos_px, toppos_px));



    hojre = new Path();
    // mountain_path.strokeColor = 'white';
    hojre.add(new Point(canvas_width, canvas_height));
    hojre.add(new Point(canvas_width * .5 + toppos_px * ratio, canvas_height * toppos));
    hojre.add(new Point(leftpos_px, toppos_px));
    hojre.add(new Point(leftpos_px, canvas_height));
    hojre.closed = true;

    triangle = new Group([top, venstre, hojre]);
    triangle_clone = triangle.clone();


    triangle_clone.fillColor = new Color(0, 0, 0, .0000001);

    triangle_clone.scale(0.8);


    //triangle_clone.sendToBack();

    triangle.fillColor = new Color(0.33, 0.33, 0.33, 0.35);
    triangle.strokeColor = new Color(1, 1, 1, .7);
    triangle.strokeWidth = 3;



    // Tegn crosshair = dragbar cirkel 
    crosshair = new Path.Circle({
        center: [leftpos_px, toppos_px],
        radius: 25,
        fillColor: 'white',
        strokeWidth: 4
    });

    crosshair.strokeColor = new Color("#1AA0A7");
    crosshair.fillColor = new Color(1, 1, 1, .4);



    crosshair.onMouseDrag = function(event) {


        //console.log("Hittet: " + crosshair.hitTestAll(top)); //[, options])


        var hitOptions = {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        };


        //var hittest_result = triangle.hitTestAll(event.delta[option.fill]);

        var hitResult = triangle_clone.hitTestAll(event.point, hitOptions);


        if (hitResult.length > 0)

        {


            //console.log(hittest_result);
            //console.log(crosshair.position.x);


            crosshair.position += event.delta;

            pct_height = crosshair.position.y / canvas_height;
            pct_width = crosshair.position.y / canvas_width;

            console.log("CROSS_Y: " + crosshair.position.y);

            console.log("pct_height" + pct_height + "pct_width: " + pct_width);



            crosshair.bringToFront();

            while (top.segments.length > 1) {
                top.removeSegment(1)
                    //console.log("hej");
            }
            top.add(new Point(canvas_width * .5 - crosshair.position.y * ratio, canvas_height * pct_height));
            top.add(new Point(canvas_width * .5 + crosshair.position.y * ratio, canvas_height * pct_height));

            top.closed = true;


            while (venstre.segments.length > 0) {
                venstre.removeSegment(0)
                    //console.log("hej");
            }
            venstre.add(new Point(canvas_width * .5 - crosshair.position.y * ratio, canvas_height * pct_height));
            venstre.add(new Point(0, canvas_height));
            venstre.add(new Point(crosshair.position.x, canvas_height));
            venstre.add(new Point(crosshair.position.x, crosshair.position.y));
            venstre.closed = true;



            while (hojre.segments.length > 0) {
                hojre.removeSegment(0)
                    //console.log("hej");
            }
            hojre.add(new Point(canvas_width, canvas_height));
            hojre.add(new Point(canvas_width * .5 + crosshair.position.y * ratio, canvas_height * pct_height));
            hojre.add(new Point(crosshair.position.x, crosshair.position.y));
            hojre.add(new Point(crosshair.position.x, canvas_height));
            hojre.closed = true;


            var top_area = Math.abs(top.area);
            var venstre_area = Math.abs(venstre.area);
            var hojre_area = Math.abs(hojre.area);

            var total_area = top_area + venstre_area + hojre_area;

            var top_pct = Math.round(top_area / total_area * 100);
            var venstre_pct = Math.round(venstre_area / total_area * 100);
            var hojre_pct = Math.round(hojre_area / total_area * 100);

            var modeltype = "Alternativ"

            //check for residual_model
            if (top_pct > 40 && top_pct < 90) {
                modeltype = "Universel";
            } else if (top_pct > 25 && top_pct < 41 && venstre_pct > 25 && venstre_pct < 41 && hojre_pct > 25 && hojre_pct < 41) {
                modeltype = "Selektiv";
            } else if (top_pct < 20 && hojre_pct > 40) {
                modeltype = "Residual";
            }


            console.log(top_pct + ", " + venstre_pct + ", " + hojre_pct);

            triangle.fillColor = new Color(top_pct / 100, venstre_pct / 100, hojre_pct / 100, .35);

            //top_text.fontSize = 8 + (top_pct/ 2);



            $(".output").html("<h3>Velfærdsmodel: " + modeltype + "</h3>Stat: " + Math.round(top_area / total_area * 100) + "%, Civil: " + Math.round(venstre_area / total_area * 100) + "%, Marked: " + Math.round(hojre_area / total_area * 100) + "%");

        } else {
            crosshair.onMouseDrag.off()

        }
    }





};

function draw_draggable() {

}


$(".btn_model").click(function() {
    var indeks = $(this).index();
    console.log("indeks: " + indeks);

    triangle.remove();
    triangle_clone.remove();
    crosshair.remove();

    if (indeks == 0) {

        drawTriangle(.6, .43);

    } else if (indeks == 1) {


        drawTriangle(.3, .4);

    } else if (indeks == 2) {

        drawTriangle(.47, .5);

    }
});
