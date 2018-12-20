// Velfærdsmodellerne:
// ===================


    

// ajustCanvas();  // <----- Fungere ikke i denne placering!

// var canvas_height = $("#myCanvas").height();
// var canvas_width = $("#myCanvas").width();
// var ratio = (canvas_width / 2) / canvas_height;
var canvas_height;
var canvas_width;
var ratio;

var top, hojre, venstre, triangle, dragarea, shadow_triangle_clone, statsdifference, civildifference, markedsdifference, crosshair, crosshair_clone, streg, top_pct, venstre_pct, hojre_pct, runde = 0;
// var universel_values = [56, 18, 25];
var universel_values = [56, 18, 26];

var cordStart = []; 
var cordEnd = []; 
var areasPct = {start: {civil: null, marked: null, stat: null}, end: {civil: null, marked: null, stat: null}};   // Tilføjet d. 26/4-2018. Dette objekt rummer de procentvise størrelser på arealerne af sektorene. 
var studerendeHarSvaretKorrekt = false;
var runde_old = 0;
var attempt = 0;

$(window).resize(function() {
   
    // Hvis vinduet resizes, så efterlader cirklen "dragarea" et aftryk på den position den har været, pga at der ikke tegnes henover området og opacity på de øvrige elementer. 
    // Dette problem løses ved at fjerne alle elementer:
    project.activeLayer.removeChildren();

    ajustCanvas();   // <----------  VIGTIGT: Denne funktion er defineret i trekant.html og køres første gang INDEN paper.js indlæses med alle funktioner i trekant.js!
    drawTriangle(.75, .43);
    areasPct.start = {civil: venstre_pct, marked: hojre_pct, stat: top_pct};
    draw_draggable();

});


// $(".canvas_container").css("height", canvas_height)

$(document).ready(function() {

    $('.instr_container').html(instruction(jsonData.userInterface.instruktion));
    $('#explanationWrapper').html(explanation(jsonData.userInterface.explanation));

    jsonData.spm_tiltag = shuffle_Array(jsonData.spm_tiltag);  // Randomize spørgsmål.

    $('.numOfQuestions').text(jsonData.spm_tiltag.length);  // Opdater counter ift antallet af spørgsmål

    // ajustCanvas();  // <----- Fungere ikke i denne placering!

    // UserMsgBox('html', '<h1>Velfærdsmodeller</h1>'+jsonData.userInterface.instruktion);  // Alternativ instruks istedet for den alm instruction

    //Init canvas genererer en universel model
    poseQuestion(runde);

    crosshairfeedback('Ryk den grønne cirkel væk fra den sektor, der bliver styrket og hen imod den sektor, der svækkes, så felterne bliver enten større eller mindre.');

    // Der er to containere i DOM'en med klassen "textHolder" (og child "opgave_broedtxt"): den ene vises på desktop, den anden i mobil.
    $('.opgave_broedtxt:visible').addClass('microhint_target');  // Find den "opgave_broedtxt" der er synlig og tilføj klassen "microhint_target"
    $('.opgave_broedtxt:hidden').removeClass('microhint_target');  // Find den "opgave_broedtxt" der er gemt og fjern klassen "microhint_target"
    microhint($('.microhint_target'), 'Her finder du opgaverne', true, '#000'); // Tilføj et microhint på "microhint_target"

    microhint($('.btn_model'), 'Start med at læse om de tre modeller', true, '#000');

});



function poseQuestion(runde, opgavetype) {

    drawTriangle(.75, .43);
    areasPct.start = {civil: venstre_pct, marked: hojre_pct, stat: top_pct};
    cordStart = [.75, .43];  // toppos, leftpos
    draw_draggable();

    if (runde < jsonData.spm_tiltag.length) {

        console.log('poseQuestion - runde: ' + runde);

        // drawTriangle(.75, .43);
        // cordStart = [.75, .43];  // toppos, leftpos
        // draw_draggable();

       
        // $(".opgave_header").html("<b>Hvilken sektor bliver større og hvilken bliver mindre?</b> " + (runde + 1) + "/" + jsonData.spm_tiltag.length);
        // $(".opgave_header").html("<b>Hvilken sektor bliver større og hvilken bliver mindre?</b> ");  
        $(".opgave_header").html("<b>Hvilken sektor i velfærdstrekanten bliver større og hvilken bliver mindre?</b> ");
        $(".opgave_broedtxt").html('<span class="opgTekst">"'+jsonData.spm_tiltag[runde].spm+'"</span>' + '<br> <br>Flyt den grønne cirkel på modellen.');
        
        if (runde != runde_old) { // Kun fade ind ved nyt spørgsmål.
            $(".opgTekst").hide().fadeIn(600);  // Vi henleder kursistens opmærksomhed på en ny opgaveinstruks ved at fade opgaveinstruksen ind.
        }
        //console.log("poseQuestion: " + runde);

        runde_old = (studerendeHarSvaretKorrekt)? runde : runde_old;

    } 
    // else {                                                   // <----------  UdKommenteret d. 11/1-2018
    //     UserMsgBox('body', jsonData.userInterface.slutfeedback);
    // }
}


function drawTriangle(toppos, leftpos) {


    canvas_height = $("#myCanvas").height();    // TILFØJET D. 10/1
    canvas_width = $("#myCanvas").width();      // TILFØJET D. 10/1
    ratio = (canvas_width / 2) / canvas_height; // TILFØJET D. 10/1


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

    // console.log('drawTriangle - top_pct: ' + top_pct + ', venstre_pct: ' + venstre_pct + ', hojre_pct: ' + hojre_pct);


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
        // radius: 100,
        radius: responsiveRadius(leftpos_px, toppos_px, 100),
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


    function responsiveRadius(leftpos_px, toppos_px, maxRadius) {

        var crosshairAjust = 0;      // Dette sikre størst mulig dragarea på mobil, men crosshair forsvider halvt ud af canvas'et hvis den trækkes til bunden af dragarea.
        // var crosshairAjust = 20;  // <---- "20" er lig radius på crosshair, hvilket gør at crosshair ikke forsvider halvt ud af canvas'et, men dragarea bliver lille på mobil...
        
        var rh = (canvas_height - toppos_px < maxRadius + crosshairAjust)? canvas_height - toppos_px - crosshairAjust : maxRadius;
        var rw = (canvas_width - leftpos_px < maxRadius + crosshairAjust)? canvas_width - leftpos_px - crosshairAjust : maxRadius;
        var r = (rh < rw)? rh : rw;

        console.log('responsiveRadius - rh: ' + rh + ', rw: ' + rw + ', r: ' + r);

        return r;
    }

    //Drag funktion herunder:
    crosshair.onMouseDrag = function(event) {

        // Udkommenteret d. 11/1-2018
        // if ($(".microhint_label_success").length > 0) {  // <---- Bugfix for at den nye opgave ikke loader ved korrekt svar og efterfølgende træk i crosshair (uden først at klikke microhint væk).
        //     $( this ).trigger('click');
        // } 
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
            areasPct.end = {civil: venstre_pct, marked: hojre_pct, stat: top_pct};
            cordEnd = [pct_height, pct_width];    // toppos, leftpos

            crosshair.bringToFront();


            dragarea.bringToFront();  // TLY ønsker at dragarea er synlig under drag. // Tilføjet d. 11/1-2018


        } else {
            // DEN ØNSKEDE FUNKTION ER DER; MEN KASTER ER ERROR..!
            crosshair.onMouseDrag.off();

        }
    }

    // Hvis afstanden er under 40  - er bevægelsen ikke tydelig nok og dermed svær at teste på: 
    crosshair.onMouseUp = function(event) {

        // tjeksvar2();

        if (streg.length > 40) {
            
            tjeksvar2();

            // tjeksvar();
            
        } else {
            crosshairfeedback("<p>Du skal ændre modellen mere drastisk for at afgive et svar</p>");
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
        UserMsgBox('body', '<h1>Den universelle model</h1> <div class="textImg col-xs-12 col-sm-6"><img class="img-responsive msbox_pic" src="img/universel.png"></div> <p>Denne velfærdsmodel er udbredt i de skandinaviske lande. Ideologisk er den tættest på en socialdemokratisk tankegang. Når modellen karakteriseres som universel, så skyldes det, at alle har rettigheder og pligter. Det første betyder at alle har ret til fx gratis uddannelse, sundhed og folkepension, og det sidste, at alle har pligt til at betale skat - også arbejdsløse og studerende.</p><h4>Statens rolle</h4><p>Staten spiller den væsentligste rolle i omfordelingen af velfærdsgoder, og der sker en høj omfordeling fra økonomisk velstillede til mindre velstillede. Modellen er skattefinansieret, og de mest velstillede betaler mest i skat. Det kaldes også for progressiv beskatning. Dermed forsøger modellen at udligne de største økonomiske forskelle, og den stræber efter at skabe lige muligheder for alle i samfundet. For eksempel har alle garanteret et socialt sikkerhedsnet.</p><h4>Markedets rolle</h4><p>Markedets rolle er ikke så betydningsfuld, men markedet kan supplere den offentlige velfærd ved at tilbyde privatforsikringer eller udbyde fx private børnehaver og skoler. Disse supplerer eller konkurrerer med dele af den offentlige velfærd. Mange af de private institutioner modtager en vis økonomisk støtte fra staten.</p><h4>Civilsamfundets rolle</h4><p>Civilsamfundets rolle er ikke så betydningsfuld, men på udvalgte områder. Fx er udbetaling af kontanthjælp ændret fra at være individuelt tildelt til i dag at være baseret på gensidig forsørgerpligt. Også frivillige organisationer som Kirkens Korshær kan hjælpe/supplere den offentlige velfærd i forhold til folk, der er i absolut nød. Frivillige foreninger kan stå for besøgsvennetjenester til ensomme, de kan udføre et arbejde i idrætsforeninger osv. Mange af de frivillige organisationer modtager en vis økonomiske støtte fra staten.</p><h4>Modellens udvikling</h4><p>Den danske universelle velfærdsmodel begyndte at blive rettighedsbaseret pga Kanslergadeforliget i 1933. Den økonomiske krise synliggjorde at arbejdsløshed og fattigdom skyldtes samfundsmæssige forhold. Modellen blev især videreudbygget på baggrund af den økonomiske højkonjunktur i 1960-erne. Kvinderne begyndte for alvor at indtage arbejdsmarkedet. Den ændrede familiestruktur med begge familier på arbejdsmarkedet skabte bl.a. behov for børnepasning og ældrepleje - opgaver som tidligere var familiens ansvar. Sammenlignet med de fleste andre lande i verden er den offentlige sektor i Danmark meget stor og med mange ansatte.</p><p>Igennem de senere år er modellen blevet mere behovsreguleret. Det vil sige at personer, der skønnes ikke at have behov for en ydelse, mister retten til at modtage denne. For eksempel kan mere velstillede familier ikke længere modtage en børnecheck. Dermed er modellen i dag mindre universel end tidligere. Flere principper fra den korporative og residuale model er indført.</p><h4>En børnefamilie i Danmark</h4><p>En typisk børnefamilie i Danmark vil have børn, der går i en offentlig vuggestue, børnehave (begge med en mindre brugerbetaling) eller folkeskole - og videre frem i en offentlig uddannelsesinstitution og modtager SU. Kvinders erhvervsfrekvens er næsten lige så høj som mændenes. Begge forældre arbejder. De betaler relativt en høj skat, men har modsat lave privatudgifter til bl.a. børnenes institutioner og sundhed. Når familien har brug for at gå til lægen eller komme på hospitalet er dette gratis, og de modtager dagpenge i perioder med arbejdsløshed. Den ældste datter er begyndt et frivilligt arbejde som besøgsven hos en ensom pensionist. </p>');

    } else if (indeks == 1) {
        model = "Residual";
        //drawTriangle(.3, .4);
        //draw_draggable();

        // UserMsgBox("body", "<div class='col-xs-12 usrMsg_content_container'><h3>" + model + " vælfærdsmodel</h3><p class='broedtxt'>" + broedtxt + "</p><h3>Eks</h3><div class='col-xs-6'>" + broedtxt + "</div><div class='col-xs-6'><img class='img-responsive msbox_pic' src='img/trekant_dummy.png'></div></div>");  // Udkommenteret af THAN d. 04-01-2018
        UserMsgBox('body', '<h1>Den residuale model</h1> <div class="textImg col-xs-12 col-sm-6"><img class="img-responsive msbox_pic" src="img/liberal.png"></div> <p>Denne velfærdsmodel er udbredt i USA, men også England, Irland og Australien har ladet sig inspirere af modellen. Ideologisk er den tættest på liberalismen. Residual betyder "resterende" eller "tilbageblevne". Det er altså den såkaldte restgruppe eller de svageste i samfundet, der er berettiget til at modtage offentlig velfærd.</p><h4>Statens rolle</h4><p>Statens rolle er begrænset og kun personer som er uarbejdsdygtige på grund af sygdom eller handicap har ret til offentlig hjælp. Men kun i det omfang familien ikke kan klare forsørgelsen. Dermed sker der en lav omfordeling af goderne, og modellen har ikke til hensigt at forhindre ulighed. Dette skyldes, at ulighed af liberalisterne ses som en nødvendig drivkraft i samfundet. Skatten er derfor lav, og staten skal holde sig fra opgaver som markedet og borgerne selv kan løse.</p><h4>Markedets rolle</h4><p>I denne model spiller markedet den væsentligste rolle i fordelingen af velfærd. Derfor er skatten lav, men den enkelte kan have høje udgifter til private børnehaver, skoler og til andre private uddannelser. Modellen er stærkt individorienteret, idet det er op til borgeren selv at sammensætte sine velfærdsordninger via private forsikringer, så de passer til egne individuelle behov. Afhængig af indkomst vil den enkelte have forskellige muligheder for at købe en ringere eller en bedre forsikring. Fx vil meget velstillede kunne forsikre sig ind på de bedste hospitaler.</p><h4>Civilsamfundets rolle</h4><p>Civilsamfundet kommer i nogen grad til at spille en rolle, idet dem, der ikke har nogen privatforsikring, ofte må søge støtte i civilsamfundet, da de offentlige ydelser ofte er utilstrækkelige. De civile eller frivillige organisationer står fx for uddeling af mad og tøj. I USA er det udbredt at borgere donerer til civilsamfundet.</p><h4>Børnefamilie i USA</h4><p>En typisk børnefamilie i USA vil helst have, at deres børn går i private institutioner, da kvaliteten er betydeligt højere end i de offentlige. Skatten er ikke så høj, men da udgiften til de private institutioner kan være betydelig, vælger en del familier, at (typisk) moderen går hjemme og passer børnene de første år. Familien er også privatforsikret mod sygdom, dog ikke på de bedste hospitaler, men niveauet er højere end på de offentlige hospitaler. Begge forældre er også forsikret mod arbejdsløshed, men de har endnu ikke råd til at spare op til pensionen. Dette håber forældrene at få råd til, når børnene er flyttet hjemmefra og ikke længere udgør en betydelig udgift. Moren og den ældste datter udfører hver søndag socialt frivilligt arbejde i den lokale baptistkirke, hvor de hjælper med at uddele mad og tøj til folk i nød. </p>');

    } else if (indeks == 2) {
        model = "Selektiv";
        //drawTriangle(.47, .5);
        //draw_draggable();

        // UserMsgBox("body", "<div class='col-xs-12 usrMsg_content_container'><h3>" + model + " vælfærdsmodel</h3><p class='broedtxt'>" + broedtxt + "</p><h3>Eks</h3><div class='col-xs-6'>" + broedtxt + "</div><div class='col-xs-6'><img class='img-responsive msbox_pic' src='img/trekant_dummy.png'></div></div>");  // Udkommenteret af THAN d. 04-01-2018 
        UserMsgBox('body', '<h1>Den korporative/selektive model </h1><div class="textImg col-xs-12 col-sm-6"><img class="img-responsive msbox_pic" src="img/konservativ.png"></div><p>Denne velfærdsmodel er udbredt i lande som Tyskland, Frankrig og Østrig. Derfor kaldes den også for den Centraleuropæiske model. Ideologisk er den tættest på konservatismen. Når modellen betegnes som "korporativ", så skyldes det, at både arbejdsgiver, lønmodtager, men også ofte staten, i fællesskab indbetaler til obligatoriske forsikringsordninger. Dermed forsikres hele familien mod fyring og sygdom. Når modellen betegnes som "selektiv", så henvises der til, at de obligatoriske forsikringsordninger giver social sikkerhed til de "udvalgte grupper" med fast tilknytning til arbejdsmarkedet.</p><p>Det konservative aspekt ved modellen ses netop ved, at familien spiller en central rolle i tildelingen af velfærdsrettigheder, og ved at modellen ikke har til hensigt at udligne sociale forskelle men at sikre familiens økonomiske status, idet forsikringsdækningen vokser med indkomsten. Omfordelingen mellem de bedrestillede og de dårligt stillede er moderat. Tildelingen af velfærd er således baseret på hele familien – ikke på individet som i den universelle og residuale model.</p><h4>Statens rolle</h4><p>Staten spiller en begrænset rolle. Den yder tilskud til de obligatoriske forsikringsordninger til personer med fast tilknytning til arbejdsmarkedet. Desuden yder staten offentlig velfærd til personer, der står udenfor arbejdsmarkedet og som ikke får hjælp af civilsamfundet.</p><h4>Markedets rolle</h4><p>Markedet har i nogen grad en rolle, idet det løser borgeres behov for velfærd gennem forsikringsordninger. Dette gøres specielt for borgere, der er fast tilknyttet arbejdsmarkedet. Borgere, der ikke har råd til at købe forsikringer, må søge hjælp i civilsamfundet eller staten.</p><h4>Civilsamfundets rolle</h4><p>Civilsamfundet spiller en betydelig rolle. Det er først og fremmest familien, der skal løse problemerne ved velfærdstab, fx er der gensidig forsørgerpligt, hvis kun den ene part er på arbejdsmarkedet. Kan dette ikke lade sig gøre, så er det velgørende organisationer, kirken og eventuelt staten, der påtager sig rollen. Dette kaldes også for subsidiaritetsprincippet eller nærhedsprincippet. Dette går ud på, at problemer skal løses så tæt på borgeren som muligt. Dermed spiller tilknytning til arbejdsmarkedet og civilsamfundet en fremtrædende rolle i lande med denne konservative velfærdsmodel. Borgere med ingen eller ringe tilknytning til arbejdsmarkedet, og som ikke kan hjælpes af civilsamfundet/familien, kan opleve en ringe grad af velfærd.</p><h4>En børnefamilie i Tyskland</h4><p>En typisk børnefamilie i Tyskland vil forsøge at få deres børn i private uddannelsesinstitutioner, da disse har en højere kvalitet end de offentlige. Skatten er ikke så høj, men familien har relativt høje udgifter til de obligatoriske virksomhedsforsikringer og udgifter til de private uddannelsesinstitutioner. Derfor vælger (typisk) moren at gå hjemme og passe børnene i deres første leveår. Faren har en gennemsnitsindkomst og har dermed obligatoriske forsikringer, der betyder at hele familien har adgang til privathospitaler på mellemniveau. Familien har også en obligatorisk pensionsopsparing på mellemniveau. Familien bruger en del af ugens timer på at tage sig af bedsteforældrene. Når moren har overskud hjælper hun til i en katolsk kirke, der uddeler mad til personer uden arbejde. </p>');
    }

    // UserMsgBox("body", "<div class='col-xs-12 usrMsg_content_container'><h3>" + model + " vælfærdsmodel</h3><p class='broedtxt'>" + broedtxt + "</p><h3>Eks</h3><div class='col-xs-6'>" + broedtxt + "</div><div class='col-xs-6'><img class='img-responsive msbox_pic' src='img/trekant_dummy.png'></div></div>");  // Udkommenteret af THAN d. 04-01-2018

});


$(".btn_sektor").click(function() {
    var indeks = $(this).index();
    console.log('btn_sektor - indeks: ' + indeks);
    
    if (indeks == 1) {
        UserMsgBox('body', '<h2>Stat</h2><p>Staten varetager en stor del af serviceydelserne og omfordelingen i det danske samfund. Det gælder fx i den offentlige sektor i forhold til sundhed, uddannelse og social sikkerhed. Den offentlige sektor bliver finansieret via skatter og afgifter.</p> <p>Centrale aktører i staten er regering, folketinget, kommunalbestyrelser og regioner. I staten bliver love og regler vedtaget via politiske beslutninger. De politiske beslutninger bliver afgjort af partier og andre aktørers magt og holdninger. Ofte bliver fordelingen af velfærdsydelser reguleret af rettigheder og pligter.</p>');

    } else if (indeks == 2) {
        UserMsgBox('body', '<h2>Marked</h2>Markedet er den arena, hvor varer og tjenesteydelser bliver handlet. Virksomheder og forbrugere er de væsentligste aktører og den væsentligste drivkraft er at tjene penge og at købe produkter og serviceydelser. Private virksomheder producerer også fx uddannelse, sundhed og forsikringer. Alt omregnes til pengeværdier og markedsmekanismen (udbud og efterspørgsel) er med til at sætte prisen.  ');

    } else if (indeks == 3) {
        UserMsgBox('body', '<h2>Civilsamfund</h2>Civilsamfundet omfatter familien, netværk, frivillige foreninger og ikke-statslige fællesskaber og organisationer. Hvis civilsamfundet er afgørende for produktion og fordeling af velfærdsgoder, er det derfor i høj grad styret af følelser fx kærlighed, venskab, solidaritet eller moral, altså uformelle værdier og normer.');
    }

    // UserMsgBox("body", "<div class='col-xs-12 usrMsg_content_container'><h3>" + model + " vælfærdsmodel</h3><p class='broedtxt'>" + broedtxt + "</p><h3>Eks</h3><div class='col-xs-6'>" + broedtxt + "</div><div class='col-xs-6'><img class='img-responsive msbox_pic' src='img/trekant_dummy.png'></div></div>");  // Udkommenteret af THAN d. 04-01-2018

});


$(document).on('click touchend', ".microhint", function(event) {  // TLY ønsker sig multiple microhints - her fjernes de et efter et.
    $(this).fadeOut(400).remove();
});



/*=====  End Sektion der er klik på modelknapperne Section comment block  ======*/



/*=============================================================================
=            Generer et microhint der lægger sig under crosshairet            =
=============================================================================*/

function crosshairfeedback(html) {

    microhint($(".btn_sektor"), html, true, '#000'); // + "<div class='btn btn-primary btn-sm btn-ok'>OK</div>");

    console.log($("#myCanvas").offset().left);

    var mh_left = crosshair.position.x + $("#myCanvas").offset().left - $(".microhint").width() / 2 - 10;
    var mh_top = crosshair.position.y + $("#myCanvas").offset().top + 40;

    $(".microhint").css("left", mh_left).css("top", mh_top);

    $(".microhint").click(function() {
        poseQuestion(runde, opgavetype);
    });

}

/*=====  End of Generer et microhint der lægger sig under crosshairet  ======*/




// function tjeksvar() {
//     //console.log("PCT: " + top_pct);

//     var korrekt_svar = jsonData.spm_tiltag[runde].korrekt_svar;
//     var svarmargin = 6;
//     var statsvar = false;
//     var civilsvar = false;
//     var markedssvar = false;


//     console.log("KS: " + korrekt_svar[0] + "," + top_pct + "SCOPE: " + (korrekt_svar[0] + svarmargin) + " - " + (korrekt_svar[0] - svarmargin));

//     if (top_pct > (korrekt_svar[0] - svarmargin) && top_pct < (korrekt_svar[0] + svarmargin)) {
//         statsvar = true;
//         //console.log("statsvar = true;");

//     }
//     if (venstre_pct > (korrekt_svar[1] - svarmargin) && venstre_pct < (korrekt_svar[1] + svarmargin)) {
//         civilsvar = true;
//         //console.log("civilsvar = true;");

//     }
//     if (hojre_pct > (korrekt_svar[2] - svarmargin) && hojre_pct < (korrekt_svar[2] + svarmargin)) {
//         markedssvar = true;
//         //console.log("markedssvar = true;");
//     }


//     console.log("tjeksvar: top_pct , korrekt_svar[0]" + top_pct + "," + (korrekt_svar[0]) + "venstre_pct , korrekt_svar[1]" + venstre_pct + "," + (korrekt_svar[1]) + "hojre_pct , korrekt_svar[2]" + hojre_pct + "," + (korrekt_svar[2]));

//     statdifference = top_pct - universel_values[0];
//     civildifference = venstre_pct - universel_values[1];
//     markedsdifference = hojre_pct - universel_values[2];

//     // Generer en passende feedback streng: 
//     if (statdifference < -3) {
//         var statsstring = "svækkes"
//     } else if (statdifference > 3) {
//         var statsstring = "styrkes"
//     } else {
//         var statsstring = "er konstant"
//     }

//     if (civildifference < -3) {
//         var civilstring = "svækkes"
//     } else if (civildifference > 3) {
//         var civilstring = "styrkes"
//     } else {
//         var civilstring = "er konstant"
//     }

//     if (markedsdifference < -3) {
//         var markedsstring = "svækkes"
//     } else if (markedsdifference > 3) {
//         var markedsstring = "styrkes"
//     } else {
//         var markedsstring = "er konstant"
//     }


//     //console.log(statsvar + ", " + civilsvar + "," + markedssvar);
//     //console.log("statdifference: " + statdifference + "civildifference: " + civildifference + "markedsdifference: " + markedsdifference);

//     var systemfeedback = "Du har svaret, at staten " + statsstring + ", civilsamfundet <b>" + civilstring + " </b>og markedet " + markedsstring + ".";
    

//     if (statsvar == true && civilsvar == true && markedssvar == true) {

//         //console.log("Vi er indenfor skiven");
//         crosshairfeedback("<div class='microhint_label_success'>Dit svar er korrekt! </div>" + systemfeedback + "<br/> Modellen bevæger sig i en " + jsonData.spm_tiltag[runde].retning + " retning.");
//         runde++;
//         $('.success').html(runde);
//     } else {
//         ++attempt;
//         $('.attempt').html(attempt);
//         crosshairfeedback("<div class='microhint_label_danger'>Forkert</div><p>" + systemfeedback + "</p>");
//     }
// };


function tjeksvar2() { 

    var tolerance = 30;  // Tolerance på 20 grader. FR ønsker denne sat til 30 grader efter test d. 11/1-2018
    var tolerance_ambiguous = 45;  // Denne vinkel på 45 grader giver et interval på 45 - 30 = 15 grader til, hver side hvor kursisten får en speciel fejlbesked om at deres svar ikke er "tydeligt nok". 
    
    // var svarVinkel = posAngle(null, null);
    var posAngleObj = posAngle(null, null);
    var svarVinkel = posAngleObj.svarVinkel;
    var m = posAngleObj.msg_obj;
    var c = posAngleObj.msg_compass;

    studerendeHarSvaretKorrekt = false;
    // studerendeHarIkkeSvaretTilstraekkeligtKorrekt = false;   // Tilføjet d. 30/5-2018. Afklar med FR før kode tages i brug.

    var svarVinkler = jsonData.spm_tiltag[runde].korrekt_svar_ny;
    for (var v in svarVinkler) {
        if ((svarVinkler[v]-tolerance <= svarVinkel) && (svarVinkel < svarVinkler[v]+tolerance)) {
            studerendeHarSvaretKorrekt = true;
            break;
        }

        // if ((svarVinkler[v]-tolerance_ambiguous < svarVinkel) && (svarVinkel < svarVinkler[v]+tolerance_ambiguous)) {  // Tilføjet d. 30/5-2018. Afklar med FR før kode tages i brug.
        //     studerendeHarIkkeSvaretTilstraekkeligtKorrekt = true;
        //     break;
        // }
    }

    console.log('tjeksvar2 - runde: ' + runde + ', svarVinkel: ' + svarVinkel + ', svarVinkler: ' + svarVinkler );

    if (studerendeHarSvaretKorrekt) {
        console.log('tjeksvar2 - TRUE');
        // crosshairfeedback("<div class='microhint_label_success'>Dit svar er korrekt! </div>" + jsonData.spm_tiltag[runde].feedback_korrekt + '<span class="btn btn-lg btn-primary btn-goOn">GÅ VIDERE</span>');          // UdKommenteret d. 11/1-2018
        UserMsgBox("body", '<h3>Du har svaret <span class="label label-success">Korrekt!</span> </h3>' + jsonData.spm_tiltag[runde].feedback_korrekt + '<span class="btn btn-lg btn-primary btn-goOn">GÅ VIDERE</span>');   // Tilføjet d. 11/1-2018
        project.activeLayer.removeChildren();   // Tilføjet d. 11/1-2018 - Reset trekanten
        drawTriangle(.75, .43);                 // Tilføjet d. 11/1-2018 - Reset trekanten
        areasPct.start = {civil: venstre_pct, marked: hojre_pct, stat: top_pct};
        draw_draggable();                       // Tilføjet d. 11/1-2018 - Reset trekanten

        runde++;
        $('.success').html(runde);

        // poseQuestion(runde, opgavetype);

        if (runde >= jsonData.spm_tiltag.length) {   // Tilføjet d. 11/1-2018 -  Check for at se om det er den sidste opgave...
            $('.MsgBox_bgr').addClass('MsgBox_goToFeedback');
            $('#UserMsgBox').addClass('MsgBox_goToFeedback');

            $('.btn-goOn').html('Læs mere om modellerne');
        } else {
            $('.MsgBox_bgr').addClass('MsgBox_nextQuestion');
            $('#UserMsgBox').addClass('MsgBox_nextQuestion');
        }

    } else {
        console.log('tjeksvar2 - FALSE');
        // if (studerendeHarIkkeSvaretTilstraekkeligtKorrekt) {   // Tilføjet d. 30/5-2018. Afklar med FR før kode tages i brug.
        //     crosshairfeedback("<div class='microhint_label_danger'>Forkert XXX</div>"  + jsonData.spm_tiltag[runde].feedback_forkert);
        // } else {
            // crosshairfeedback("<div class='microhint_label_danger'>Forkert</div>"  + jsonData.spm_tiltag[runde].feedback_forkert);  // OLD
            // crosshairfeedback("<div class='microhint_label_danger'>Forkert</div>"  + jsonData.spm_tiltag[runde].feedback_forkert + '<p><i class="hintClass">Hint: du har trukket cirklen i '+c+'lig retning, dvs. gjordt arealet af civilsamfundet '+m.civil+', markedet '+m.marked+' og staten '+m.stat+'. '+jsonData.spm_tiltag[runde].hint_retning+'</i></p>');     // NEW
            crosshairfeedback('<div class="microhint_label_danger">Forkert</div> Hint: du har trukket cirklen i '+c+'lig retning, dvs. gjort arealet af civilsamfundet '+m.civil+', markedet '+m.marked+' og staten '+m.stat+'. '+jsonData.spm_tiltag[runde].hint_retning);  // Tilføjet d. 3/5-2018. FR ønsker dette hint i stedet for generel feedback fra JSON.
        // }
    }
    ++attempt;
    $('.attempt').html(attempt);

}




$(document).on('click', ".MsgBox_goToFeedback", function(event) {     // Tilføjet d. 11/1-2018 
    $('.MsgBox_bgr').remove();  // Fjern den gamle userMsgBox
    UserMsgBox_xclick('body', jsonData.userInterface.slutfeedback);
    $('.MsgBox_bgr').hide().fadeIn(400);
});

$(document).on('click', ".MsgBox_nextQuestion", function(event) {   // Tilføjet d. 11/1-2018 da TLY ønsker fadeIn på opgavespørgsmålet, således at kursisten rette sin opmærksomhed her!
    $(".opgTekst").fadeOut(400, function(){  // Tilføjet d. 12/1-2018 TLY ønsker fadeOut for understregning af kursistfokus.
        poseQuestion(runde, opgavetype);
        $(".opgTekst").hide().fadeIn(1000);
    });
});



// Funktion der returnere antal grader regnet med nulpunkt i klokken 3 position, og regnes positiv med urets retning, lige som i paper.js. 
// Årsag til at paper.js ikke er anvendt til at beregne vinklen, er at paper til tider angiver en vinkel positiv (med uret) andre gange negativ (mod uret).
function posAngle(Dx, Dy) {
    var Dx = cordEnd[1]-cordStart[1];  // X - NOTE: OMVENDT IFT ARRAY-INDEX!
    var Dy = cordEnd[0]-cordStart[0];  // Y - NOTE: OMVENDT IFT ARRAY-INDEX!

    console.log('\nposAngle - Dx: ' + Dx + ', Dy: ' + Dy );

    var a = Math.atan(Math.abs(Dy)/Math.abs(Dx))*180/Math.PI;   // Absolut vinkel i grader
    console.log('posAngle - ax 1: ' + a);

    var msg_compass;
    var msg_obj;

    // Beregninger af vinkler:
    // =======================
    if ((Dx>0) && (Dy>0)) { a = a; }        // Syd-Øst
    if ((Dx<0) && (Dy>0)) { a = 180 - a; }  // Syd-Vest 
    if ((Dx<0) && (Dy<0)) { a = 180 + a; }  // Nord-vest
    if ((Dx>0) && (Dy<0)) { a = 360-a; }    // Nord-Øst
    if ((Dx<0) && (Dy==0)){ a = 180; }      // Øst
    if ((Dx==0) && (Dy<0)){ a = 270; }      // Nord

    // Beregninger af kardinal-retning som cirklen er trukket:  (retning er opdelt i 8 "kardinal-retninger": øst (0 grader), syd-øst (45 grader), syd (90 grader), syd-vest (135 grader), osv osv)
    // =======================================================
    var minVal = 361; // Største værdi.
    var minValAngle = null;
    for (var i = 0; i <= 8; i++) {   
        if (Math.abs(45*i - a) < minVal) {  // 45*i ---> 0, 45, 90, 135, 180, 225, 270, 315, 360.  NOTE:  360 = 0 <------ VIGTIGT!
            minVal = Math.abs(45*i - a);
            minValAngle = 45*i;
        }
    }

    console.log('posAngle 1 - FINAL - a : ' + a + ', minVal: ' + minVal + ', minValAngle: ' + minValAngle);
    minValAngle = (minValAngle==360)?0:minValAngle;  // NOTE: 0 = 360 korrigering!

    console.log('posAngle 2 - FINAL - a : ' + a + ', minVal: ' + minVal + ', minValAngle: ' + minValAngle);

    console.log('posAngle - msg_compass: ' + msg_compass);
    console.log('posAngle - msg_obj: ' + JSON.stringify(msg_obj));

    console.log('posAngle - areasPct: ' + JSON.stringify(areasPct));
    console.log('posAngle - areaDiff - civil: ' + String((areasPct.end.civil-areasPct.start.civil)) + ', marked: ' + String((areasPct.end.marked-areasPct.start.marked)) + ', stat: ' + String((areasPct.end.stat-areasPct.start.stat)));
    
    console.log('posAngle - drawTriangle - top_pct: ' + top_pct + ', venstre_pct: ' + venstre_pct + ', hojre_pct: ' + hojre_pct);

    // Beskeder til kursisten:
    // =======================
    if (minValAngle == 0)   {msg_compass = 'øst';      msg_obj = {civil: 'større', marked: 'mindre', stat: 'uændret'};}
    if (minValAngle == 45)  {msg_compass = 'syd-øst';  msg_obj = {civil: 'uændret', marked: 'mindre', stat: 'større'};}
    if (minValAngle == 90)  {msg_compass = 'syd';      msg_obj = {civil: 'mindre', marked: 'mindre', stat: 'større'};}
    if (minValAngle == 135) {msg_compass = 'syd-vest'; msg_obj = {civil: 'mindre', marked: 'uændret', stat: 'større'};}
    if (minValAngle == 180) {msg_compass = 'vest';     msg_obj = {civil: 'mindre', marked: 'større', stat: 'uændret'};}
    if (minValAngle == 225) {msg_compass = 'nord-vest';msg_obj = {civil: 'uændret', marked: 'større', stat: 'mindre'};}
    if (minValAngle == 270) {msg_compass = 'nord';     msg_obj = {civil: 'større', marked: 'større', stat: 'mindre'};}
    if (minValAngle == 315) {msg_compass = 'nord-øst'; msg_obj = {civil: 'større', marked: 'uændret', stat: 'mindre'};}

    return {svarVinkel: a, msg_compass: msg_compass, msg_obj: msg_obj};
}


function calcAreaDiffs(){
    var A_top = 1.732050808/4*toppos;
}



