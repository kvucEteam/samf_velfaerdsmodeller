var canvas_height = $("#myCanvas").height();
var canvas_width = $("#myCanvas").width();

var ratio = (canvas_width / 2) / canvas_height;
var top, hojre, venstre, triangle, dragarea, shadow_triangle_clone, statsdifference, civildifference, markedsdifference, crosshair, crosshair_clone, streg, top_pct, venstre_pct, hojre_pct, runde = 0;
var universel_values = [56, 18, 25];

$(".canvas_container").css("height", canvas_height)

$(document).ready(function() {
    //Init canvas genererer en universel model
    poseQuestion(runde);
});

function poseQuestion(runde, opgavetype) {

    drawTriangle(.75, .43);
    draw_draggable();

   
        $(".opgave_header").html("<b>Opgave</b> " + (runde + 1) + "/" + jsonData.spm_tiltag.length);
        $(".opgave_broedtxt").html(jsonData.spm_tiltag[runde].spm + "<br/> <br/>" + jsonData.userInterface.opg_1_instruks);
        //console.log("poseQuestion: " + runde);
}


function drawTriangle(toppos, leftpos) {

    if (triangle) {
        triangle.remove();
    }

    toppos_px = toppos * canvas_height;
    leftpos_px = leftpos * canvas_width;

    // tegn de tre dele af trekanten med de kaldte argumenter:
    top = new Path();
    top.add(new Point(canvas_width * .5, 0));
    top.add(new Point(canvas_width * .5 - toppos_px * ratio, canvas_height * toppos));
    top.add(new Point(canvas_width * .5 + toppos_px * ratio, canvas_height * toppos));
    top.closed = true;

    venstre = new Path();
    // mountain_path.strokeColor = 'white';
    venstre.add(new Point(canvas_width * .5 - toppos_px * ratio, canvas_height * toppos));
    venstre.add(new Point(0, canvas_height));
    venstre.add(new Point(leftpos_px, canvas_height));
    venstre.add(new Point(leftpos_px, toppos_px));
    venstre.closed = true;


    hojre = new Path();
    // mountain_path.strokeColor = 'white';
    hojre.add(new Point(canvas_width, canvas_height));
    hojre.add(new Point(canvas_width * .5 + toppos_px * ratio, canvas_height * toppos));
    hojre.add(new Point(leftpos_px, toppos_px));
    hojre.add(new Point(leftpos_px, canvas_height));
    hojre.closed = true;

    triangle = new Group([top, venstre, hojre]);
    triangle.strokeColor = new Color(1, 1, 1, .7);
    triangle.strokeWidth = 3;


    /*=============================================
    =            den gamle boundary / udskiftet med den cirkel omkring crosshairet (dragarea)            =
    =============================================*/

    //    dragarea = triangle.clone();
    //    dragarea.fillColor = new Color(0, 0, 0, .1);
    //    dragarea.scale(0.7);


    /*=====  End of gammel boundary comment block  ======*/





    /*=============================================
    =            Udregning af delenes størrelser           =
    =============================================*/


    var top_area = Math.abs(top.area);
    var venstre_area = Math.abs(venstre.area);
    var hojre_area = Math.abs(hojre.area);

    //    console.log(top_area + "," + venstre_area + "," + hojre_area);

    var total_area = top_area + venstre_area + hojre_area;

    top_pct = Math.round(top_area / total_area * 100);
    venstre_pct = Math.round(venstre_area / total_area * 100);
    hojre_pct = Math.round(hojre_area / total_area * 100);



//Free roaming funtionalitet
    /*  var modeltype = "Alternativ"

      //check for residual_model
      if (top_pct > 40 && top_pct < 90) {
          modeltype = "Universel";
      } else if (top_pct > 25 && top_pct < 41 && venstre_pct > 25 && venstre_pct < 41 && hojre_pct > 25 && hojre_pct < 41) {
          modeltype = "Selektiv";
      } else if (top_pct < 20 && hojre_pct > 40) {
          modeltype = "Residual";
      }

      if (opgavetype == 0) {
          $(".opgave_header").html(modeltype);
      }

      console.log(top_pct + ", " + venstre_pct + ", " + hojre_pct);
      */

    triangle.fillColor = new Color(top_pct / 100, venstre_pct / 100, hojre_pct / 100, .35);


    /*=====  End of Section comment block  ======*/

    /**
     *
    top.onMouseUp = function(event) {
            console.log("Test click på areas - kan bruges til opgave 2 type...");
      };
     *
     */

};


/*==========================================================================
=            Tegn crosshair og funktion der knytter sig til den            =
==========================================================================*/


function draw_draggable() {

    // fjern crosshair og clone hvis de findes (clear)
    if (crosshair) {
        crosshair.remove();
    }

    if (crosshair_clone) {
        crosshair_clone.remove();
    }

    if (streg) {
        streg.remove();
    }

    //Den nye dragarea 
    dragarea = new Path.Circle({
        center: [leftpos_px, toppos_px],
        radius: 100,
        fillColor: new Color(1, 1, 1, .4),
        strokeWidth: 4
    });


    //corsshair / draggable inititaliseres her:
    crosshair = new Path.Circle({
        center: [leftpos_px, toppos_px],
        radius: 20,
        fillColor: 'white',
        strokeWidth: 4
    });

    crosshair.strokeColor = new Color("#1AA0A7");
    crosshair.fillColor = new Color(1, 1, 1, .4);


    // CLone, som der bliver tegnet en linje ud fra: 
    if (crosshair_clone) {
        crosshair_clone.remove();
    }
    crosshair_clone = crosshair.clone();
    crosshair_clone.scale(.2)
    crosshair_clone.strokeColor = new Color("#aaa");
    crosshair_clone.sendToBack();


    //Drag funktion herunder:
    crosshair.onMouseDrag = function(event) {
        $(".microhint").remove();

        var hitOptions = {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        };

        var hitResult = dragarea.hitTestAll(event.point, hitOptions);

        if (hitResult.length > 0)
        //if (Math.abs(markedsdifference) < 10)

        {
            crosshair.position += event.delta;

            pct_height = crosshair.position.y / canvas_height;
            pct_width = crosshair.position.x / canvas_width;

            crosshair_xpos = crosshair.position.x;
            crosshair_ypos = crosshair.position.y;


            // Streg fra crosshair_clone tegnes her og opdateres ved bevægelse:
            if (streg) {
                streg.remove();
            }


            var from = new Point(crosshair_clone.position.x, crosshair_clone.position.y);
            var to = new Point(crosshair_xpos, crosshair_ypos);
            streg = new Path.Line(from, to);
            streg.dashArray = [5, 5];
            streg.strokeColor = '#bbb';
            streg.strokeWidth = 3;

            //console.log("SS: " + streg.length);

            //console.log("CROSS_Y: " + crosshair.position.y);

            //console.log("pct_height" + pct_height + "pct_width: " + pct_width);


            triangle.remove();

            drawTriangle(pct_height, pct_width);

            crosshair.bringToFront();


        } else {
            // DEN ØNSKEDE FUNKTION ER DER; MEN KASTER ER ERROR..!
            crosshair.onMouseDrag.off();

        }
    }

    // Hvis afstanden er under 40  - er bevægelsen ikke tydelig nok og dermed svær at teste på: 
    crosshair.onMouseUp = function(event) {

        if (streg.length > 40) {
            tjeksvar();
        } else {
            crosshairfeedback("<p>Du skal ændre modellen mere drastisk for at afgive et svar</p>")
        }
    }

}

/*=====  End of Tegn crosshair og funktion der knytter sig til den  ======*/



/*=============================================
=            Sektion der er klik på modelknapperne  // Nothing fancy here:         =
=============================================*/


$(".btn_model").click(function() {
    var indeks = $(this).index();
    //console.log("indeks: " + indeks);
    var broedtxt = "noget text om modellernoget text om modeller noget text om modeller noget text om modeller noget text om modeller<br/> noget text om modellernoget text om modeller noget text om modeller noget text om modeller noget text om modeller<br/>noget text om modellernoget text om modeller noget text om modeller noget text om modeller noget text om modeller<br/>";

    var model;
    if (indeks == 0) {
        model = "Universel";

        //drawTriangle(.6, .43);
        //draw_draggable();

    } else if (indeks == 1) {
        model = "Residual";
        //drawTriangle(.3, .4);
        //draw_draggable();

    } else if (indeks == 2) {
        model = "Selektiv";
        //drawTriangle(.47, .5);
        //draw_draggable();
    }

    UserMsgBox("body", "<div class='col-xs-12 usrMsg_content_container'><h3>" + model + " vælfærdsmodel</h3><p class='broedtxt'>" + broedtxt + "</p><h3>Eks</h3><div class='col-xs-6'>" + broedtxt + "</div><div class='col-xs-6'><img class='img-responsive msbox_pic' src='img/trekant_dummy.png'></div></div>");


});

/*=====  End Sektion der er klik på modelknapperne Section comment block  ======*/



/*=============================================================================
=            Generer et microhint der lægger sig under crosshairet            =
=============================================================================*/

function crosshairfeedback(html) {

    microhint($(".btn_sektor"), html); // + "<div class='btn btn-primary btn-sm btn-ok'>OK</div>");

    console.log($("#myCanvas").offset().left);

    var mh_left = crosshair.position.x + $("#myCanvas").offset().left - $(".microhint").width() / 2 - 10;
    var mh_top = crosshair.position.y + $("#myCanvas").offset().top + 40;

    $(".microhint").css("left", mh_left).css("top", mh_top);

    $(".microhint").click(function() {
        poseQuestion(runde, opgavetype);
    });

}

/*=====  End of Generer et microhint der lægger sig under crosshairet  ======*/




function tjeksvar() {
    //console.log("PCT: " + top_pct);

    var korrekt_svar = jsonData.spm_tiltag[runde].korrekt_svar;
    var svarmargin = 6;
    var statsvar = false;
    var civilsvar = false;
    var markedssvar = false;


    console.log("KS: " + korrekt_svar[0] + "," + top_pct + "SCOPE: " + (korrekt_svar[0] + svarmargin) + " - " + (korrekt_svar[0] - svarmargin));

    if (top_pct > (korrekt_svar[0] - svarmargin) && top_pct < (korrekt_svar[0] + svarmargin)) {
        statsvar = true;
        //console.log("statsvar = true;");

    }
    if (venstre_pct > (korrekt_svar[1] - svarmargin) && venstre_pct < (korrekt_svar[1] + svarmargin)) {
        civilsvar = true;
        //console.log("civilsvar = true;");

    }
    if (hojre_pct > (korrekt_svar[2] - svarmargin) && hojre_pct < (korrekt_svar[2] + svarmargin)) {
        markedssvar = true;
        //console.log("markedssvar = true;");
    }


    console.log("tjeksvar: top_pct , korrekt_svar[0]" + top_pct + "," + (korrekt_svar[0]) + "venstre_pct , korrekt_svar[1]" + venstre_pct + "," + (korrekt_svar[1]) + "hojre_pct , korrekt_svar[2]" + hojre_pct + "," + (korrekt_svar[2]));

    statdifference = top_pct - universel_values[0];
    civildifference = venstre_pct - universel_values[1];
    markedsdifference = hojre_pct - universel_values[2];

    // Generer en passende feedback streng: 
    if (statdifference < -3) {
        var statsstring = "svækkes"
    } else if (statdifference > 3) {
        var statsstring = "styrkes"
    } else {
        var statsstring = "er konstant"
    }

    if (civildifference < -3) {
        var civilstring = "svækkes"
    } else if (civildifference > 3) {
        var civilstring = "styrkes"
    } else {
        var civilstring = "er konstant"
    }

    if (markedsdifference < -3) {
        var markedsstring = "svækkes"
    } else if (markedsdifference > 3) {
        var markedsstring = "styrkes"
    } else {
        var markedsstring = "er konstant"
    }


    //console.log(statsvar + ", " + civilsvar + "," + markedssvar);
    //console.log("statdifference: " + statdifference + "civildifference: " + civildifference + "markedsdifference: " + markedsdifference);

    var systemfeedback = "Du har svaret, at staten " + statsstring + ", civilsamfundet <b>" + civilstring + " </b>og markedet " + markedsstring + ".";
    

    if (statsvar == true && civilsvar == true && markedssvar == true) {

        //console.log("Vi er indenfor skiven");
        crosshairfeedback("<div class='microhint_label_success'>Dit svar er korrekt! </div>" + systemfeedback + "<br/> Modellen bevæger sig i en " + jsonData.spm_tiltag[runde].retning + " retning.");
        runde++;
    } else {
        crosshairfeedback("<div class='microhint_label_danger'>Forkert</div><p>" + systemfeedback + "</p>")
    }
};
