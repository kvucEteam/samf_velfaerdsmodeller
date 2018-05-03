
//#########################################################################################################################
// 										NY KODE TIL SAMFUNDSFAG
//#########################################################################################################################

// OPGAVER I DETTE OBJEKT:
// =======================
// + Lav boks under cards med info btns fra ATOs velfærdstrekant --> unserMsgBox åbner med tekster fra FR
// + Grå labels med sort tekst omkring "stat", "marked" og "civilsamfund" i dropzones


// OPGAVER I ATOs VELFÆRDSTREKANT:
// ===============================
// Tilret info-glyph-icons med passende margin.
// Udvid aktionsradius for "slideren"
// Sæt en farve (med mere opacity) i "slideren" der forbliver konstant ved interaktion med "slideren"
// Fade "slideren" ud under feedback, og tilbage igen ved næste opgave.


// VISNINGSITE:
// ============
// + Opret dran-n-drop udgaven af velfærdstrekanten som opjekt. (HUSK: flyt filer til den egentlige velfærdstrekant)
// + Indsæt about-tekster fra FR


// TREKANT SE: - https://upload.wikimedia.org/wikipedia/commons/6/61/Pink_Fire.svg
// <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="270px" height="240px" viewBox="0 0 270 240" enable-background="new 0 0 270 240" xml:space="preserve">
// <polygon fill="#FF9FCF" points="5,235 135,10 265,235 "/>
// </svg>


function organizeCardPile(parentContainer, hideAboveNo, marginTop) {  // <------- "marginTop" is currently not in use....
	var margin = 30;
	console.log('organizeCardPile - parentContainer: ' + parentContainer);
	$( parentContainer+" .card" ).each(function( index, element ) {
		margin -= (index <= hideAboveNo)? 5 : 0;
		index += (parentContainer.indexOf('cardPile') !== -1)? $( parentContainer+" .card" ).length : 0 ;  // This makes sure that the z-index of the #cardPile is alway higher than th dropzones.
		
		// $(element).css({"position": "absolute", "top": String(margin)+'px', "left": String(margin)+'px', "z-index": index, "margin-top": marginTop+'%'});
		var pcOffset = $(parentContainer).offset();
		var pcPosition = $(parentContainer).position();
		console.log('organizeCardPile - pcOffset: ' + JSON.stringify(pcOffset));
		console.log('organizeCardPile - pcPosition: ' + JSON.stringify(pcPosition));
		// $(element).css({"position": "absolute", "top": String(margin+pcPosition.top)+'px', "left": String(margin+10)+'px', "z-index": index, "margin-top": marginTop+'%'});
		
		// $(element).css({"position": "absolute", "top": String(margin+0)+'px', "left": String(margin+10)+'px', "z-index": index});  	// COMMENTED OUT 04-12-2017
		$(element).css({"position": "absolute", "top": String(margin+5)+'px', "left": String(margin+25)+'px', "z-index": index});		// ADDED 04-12-2017
		
	}); 
}

// organizeCardPile_inDropzone(parentContainer) {
// 	$( parentContainer+" .card" ).each(function( index, element ) {
// 	$(element).css({"position": "absolute", "top": String(margin+5)+'px', "left": String(margin+25)+'px', "z-index": index});
// }


// This function sets a id in each card which is used to id the card
function setCardId() {
	console.log('\nsetCardId - CALLED');
	var cardId = 0;
	for (var n in jsonData.category) {
		for (var k in jsonData.category[n].question) {
			jsonData.category[n].question[k].cardId = cardId;
			++cardId;
		}
	}
	console.log('setCardId - jsonData: ' + JSON.stringify(jsonData, null, 4));
}


// function makeCardPile(categoryNum, randomize){   // COMMENTED OUT d. 04-12-2017
function makeCardPile(){  							// ADDED d. 04-12-2017


	// var JD = jsonData.category[categoryNum];		// COMMENTED OUT d. 04-12-2017
	// var questionObj = JD.question;		 		// COMMENTED OUT d. 04-12-2017

	console.log('makeCardPile - jsonData.useQuestionsFromCategory: ' + jsonData.useQuestionsFromCategory);		// ADDED d. 04-12-2017
	var questionArr = [];   																					// ADDED d. 04-12-2017
	for (var n in jsonData.useQuestionsFromCategory) {
		questionArr = questionArr.concat(jsonData.category[jsonData.useQuestionsFromCategory[n]].question);
	}
	console.log('makeCardPile - questionArr: ' + JSON.stringify(questionArr, null, 4));							// ADDED d. 04-12-2017

	var questionObj = questionArr;																				// ADDED d. 04-12-2017


	console.log('makeCardPile - questionObj 1: ' + JSON.stringify(questionObj, null, 4));

	questionObj = (jsonData.randomizeCards)? ShuffelArray(questionObj) : questionObj;  // This randomizes the questionObj array 	// ADDED d. 04-12-2017

	window.numOfQuestions = questionObj.length;

	console.log('makeCardPile - questionObj 2: ' + JSON.stringify(questionObj, null, 4));
	// console.log('questionObj 2: ' + JSON.stringify(subQuestions));

	var HTML = '';
	for (var n in questionObj) {
		// HTML += '<div id="card_'+n+'" class="card">'+draggableCardTypes(questionObj[n])+'</div>';
		// HTML += '<div id="card_'+n+'" class="card '+dropzoneAcceptance(questionObj[n])+'">'+draggableCardTypes(questionObj[n])+'</div>'; // COMMENTED OUT 30/11-2017
		HTML += '<div id="card_'+questionObj[n].cardId+'" class="card '+dropzoneAcceptance(questionObj[n])+'">'+showAnswer(questionObj[n])+draggableCardTypes(questionObj[n])+'</div>';    // ADDED 30/11-2017
		// if (n == 3) break;
	}
	return HTML;
}	

function ShuffelArray(ItemArray){
    var NumOfItems = ItemArray.length;
    var NewArray = ItemArray.slice();  // Copy the array...
    var Item2; var TempItem1; var TempItem2;
    for (var Item1 = 0; Item1 < NumOfItems; Item1++) {
        Item2 = Math.floor( Math.random() * NumOfItems);
        TempItem1 = NewArray[Item1];
        TempItem2 = NewArray[Item2];
        NewArray[Item2] = TempItem1;
        NewArray[Item1] = TempItem2;
    }
    return NewArray;
}

// ((showAnswer_bool)? '<span class="answer">'++'</span>' : '')
function showAnswer(qObj) {
	var HTML = '';
	if (showAnswer_bool) {
		HTML += '<span class="answer"> ('; 
			for (var n in qObj.correctDropzoneNum) {
				HTML += jsonData.dropzone[qObj.correctDropzoneNum[n]].heading + ((parseInt(n)+1 < qObj.correctDropzoneNum.length)? ', ' : ')');
			}
		HTML += '</span>';
	}
	return HTML;
}


function dropzoneAcceptance(qObj) {
	var HTML = '';
	// for (var n in qObj.correctDropzoneNum) {
	for (var i = 0; i < qObj.correctDropzoneNum.length; i++) {
		HTML += jsonData.dropzone[qObj.correctDropzoneNum[i]].attr.id + ((i+1 < qObj.correctDropzoneNum.length)? ' ': '' );
	}
	console.log('dropzoneAcceptance - HTML: ' + HTML);

	return HTML;
}


function setDropzoneEvents() {
	console.log('\nsetDropzoneEvents - CALLED');

	// for (var n in jsonData.dropzone) {
	for (var n = 1; n < jsonData.dropzone.length; n++) {
		console.log('setDropzoneEvents - n: ' + n);
		if (jsonData.dropzone[n].num == parseInt(n)){
			console.log('setDropzoneEvents - A0 - "."+jsonData.dropzone[n].attr.id: ' + "."+jsonData.dropzone[n].attr.id);
			$( "#"+jsonData.dropzone[n].attr.id ).droppable({
				accept: ("."+jsonData.dropzone[n].attr.id),
				drop: function(event, ui) {
					console.log('card - DROP - '+$(this).attr('id'));
					window.dropZoneObj = $(this);
					eObj.isCurrentDraggableDropped = true;
				},
				over: function( event, ui ) {
					console.log('droppable - over - ui.position.top: ' + ui.position.top + ', ui.position.left: ' + ui.position.left);
					window.dropZoneObj_over = $(this);	
				}
			});
		} else {
			alert('"num" i jsonData.dropzone skal passe med den nul-indexeret position - dvs. "num": 0 på den første plads, "num": 1 på den anden plads osv.');
		}
	}
}


function draggableCardTypes(cObj) {
	console.log('\ndraggableCardTypes - CALLED - cObj: ' + JSON.stringify(cObj));

    var HTML = '';
    switch (cObj.type) {
        case 'text':
            console.log('draggableCardTypes - A0');
            HTML += makeTextCard(cObj.text);
            break;
        case 'img':
            console.log('draggableCardTypes - A1');
            HTML += makeImgCard(cObj.img);
            break;
        case 'card':
            console.log('draggableCardTypes - A2');
            HTML += makeCard(cObj.card);
            break;
        default:
            console.log('draggableCardTypes - A3');
            // alert('ERROR');
    }

    return HTML;
}


function makeTextCard(cObj) {
    console.log('\nmakeTextCard - CALLED - cObj: ' + JSON.stringify(cObj));

    var HTML = '';
    HTML += '<div ' + ((cObj.hasOwnProperty('attr')) ? generateAttrStr(cObj.attr) : '') + '>';
    HTML += 	(cObj.hasOwnProperty('text'))? cObj.text : '';
    HTML += '</div>';

    return HTML;
}


function makeImgCard(cObj) {
    console.log('\nmakeCard - CALLED - cObj: ' + JSON.stringify(cObj));

    var HTML = '';
    HTML += '<div ' + ((cObj.hasOwnProperty('attr')) ? generateAttrStr(cObj.attr) : '') + '>';
    HTML += 	'<div class="imgContainer">';
    HTML += 		(cObj.hasOwnProperty('imgSrc') ? '<img class="img-responsive" src="' + cObj.imgSrc + '">' : '');
    HTML += 	'</div>';
    HTML += '</div>';

    return HTML;
}


function makeCard(cObj) {
    console.log('\nmakeCard - CALLED - cObj: ' + JSON.stringify(cObj));

    var HTML = '';
    HTML += '<div ' + ((cObj.hasOwnProperty('attr')) ? generateAttrStr(cObj.attr) : '') + '>';
    HTML += 	'<div class="imgContainer">';
    HTML += 		(cObj.hasOwnProperty('imgSrc') ? '<img class="img-responsive" src="' + cObj.imgSrc + '">' : '');
    HTML += 	'</div>';
    HTML += 	'<div class="objText">';
    HTML += 		((cObj.hasOwnProperty('header')) ? '<h4>' + cObj.header + '</h4>' : '');
    HTML += 		((cObj.hasOwnProperty('text')) ? '<p>' + cObj.text + '</p>' : '');
    HTML += 		((cObj.hasOwnProperty('btnText')) ? '<span class="btn_ghost btn_ghost_noStyle btn btn-primary">' + cObj.btnText + '</span>' : '');
    HTML += 		'<div class="Clear"></div>';
    HTML += 	'</div>';
    HTML += '</div>';

    return HTML;
}


function generateAttrStr(attrObj) {
    console.log('\ngenerateAttrStr - CALLED - attrObj: ' + JSON.stringify(attrObj));

    var HTML = '';
    var keyArr = Object.keys(attrObj);
    for (var n in keyArr) {
        if (typeof(attrObj[keyArr[n]]) !== 'undefined') {
            HTML += keyArr[n] + '="' + attrObj[keyArr[n]] + '" '; 
        }
    }

    HTML = HTML.trim();
    console.log('generateAttrStr - HTML: _' + HTML + '_');

    return HTML;
}


// IMPORTANT: Class "draggable" (and NOT clases: "ui-draggable", "ui-draggable-handle" and "ui-draggable-dragging") makes all the problems of cloning from ouside and into a droppable.
function SimpleClone(TargetSelector) {
    var Clone = $(TargetSelector).clone().removeClass("draggable").css({
        // 'position': 'absolute',
        'position': 'relative',
        'top': 'auto',
        'left': 'auto',
        'z-index': '0',
        // 'height': '83%',

        // 'height': '55%', // <---- NEW   		// COMMENTED OUT 12/1-2018
        // 'height': '35%', // <---- NEW      		// ADDED 12/1-2018   -->  Fixer dette problemet i win 7 edge + 10???
        'height': '40%', // <---- NEW      		// ADDED 3/5-2018   -->  Fixer dette problemet i win 7 edge + 10???
        // 'margin-bottom': '20%',  // <---- NEW   // ADDED 12/1-2018   -->  Fixer dette problemet i win 7 edge + 10??? + Dette virker OK!
        'margin-bottom': '15%',  // <---- NEW   // ADDED 3/5-2018   -->  Fixer dette problemet i win 7 edge + 10??? + Dette virker OK!

        'width': '35%'    // <---- NEW
    }); // This is necessary for cloning inside the droppable to work properly!!!
    // Clone = Clone.removeAttr("id").removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging"); // This just cleans the attributes so the DOM-element looks nicer.
    Clone = Clone.removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging"); // This just cleans the attributes so the DOM-element looks nicer.
    // Clone = Clone.addClass("Clone");
    return Clone;
}



function template() {

	var HTML = '';
	HTML += '<h1>'+jsonData.heading+'</h1>';
	// HTML += (jsonData.hasOwnProperty('instruction') && (jsonData.instruction!==''))? instruction(jsonData.instruction) : '';
	HTML += (jsonData.hasOwnProperty('instruction') && (jsonData.instruction!==''))? instruction_noLines(jsonData.instruction) : '';
	HTML += (jsonData.hasOwnProperty('explanation') && (jsonData.explanation!==''))? explanation(jsonData.explanation) : '';
	HTML += '<div class="Clear"></div>';
	HTML += '<div id="cardContainer">';
	HTML += '</div>';

	var numOfEnlementsInRow = 2;
	// var numOfEnlementsInRow = 3;

	var numOfRows = Math.ceil(jsonData.dropzone.length/numOfEnlementsInRow);
	var modulus = jsonData.dropzone.length%numOfEnlementsInRow;
	console.log("template - numOfRows: " + numOfRows + ", modulus: " + modulus);

	HTML += '<div id="cardPileWrap" class="col-xs-12 col-md-4">';
	HTML += 	'<div '+generateAttrStr(jsonData.dropzone[0].attr)+'>'+makeCardPile()+' &nbsp; </div>';
	HTML += 	'<div class="infoContainer hidden-xs hidden-sm">';
	HTML += 		'<span class="btn_stat btnInfo btn btn-default"> Stat <span class="glyphicon glyphicon-info-sign"></span></span>';
	HTML += 		'<span class="btn_civilsamfund btnInfo btn btn-default"> Civilsamfund <span class="glyphicon glyphicon-info-sign"></span></span>';
	HTML += 		'<span class="btn_marked btnInfo btn btn-default"> Marked <span class="glyphicon glyphicon-info-sign"></span></span>';
	HTML += 	'</div>';
	HTML += '</div>'; 	 // ADDED d. 04-12-2017	

	HTML += '<div id="triangleAndDropzoneContainer" class="col-xs-12 col-md-8">';

		HTML += '<div id="triangleContainer">';
		// HTML += 	'<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 270 240" enable-background="new 0 0 270 240" xml:space="preserve">';
		// HTML += 		'<polygon fill="#FF9FCF" points="5,235 135,10 265,235 "/>';
		// HTML += 	'</svg>';
		HTML += '<img class="img-responsive" src="img/triangle.svg">';
		HTML += '</div>';

		HTML += '<div id="dropzoneContainer">';
		console.log("template - jsonData.dropzone.length: "+jsonData.dropzone.length);
		
		

		for (var n = 0; n < numOfRows; n++) {
			console.log("template - n : "+n);
			HTML += '<div class="dropzoneRow '+n+'">';
			for (var k = n*numOfEnlementsInRow; k < n*numOfEnlementsInRow + ((n+1 < numOfRows)? numOfEnlementsInRow : ((modulus == 0)? numOfEnlementsInRow : modulus)); k++) {
				console.log("template - k : "+k);
				if (k == 0) {
					// HTML += '<div id="cardPileWrap"><div '+generateAttrStr(jsonData.dropzone[k].attr)+'>'+makeCardPile(0, false)+' &nbsp; </div></div>';  // COMMENTED OUT d. 04-12-2017
					// HTML += '<div id="cardPileWrap"><div '+generateAttrStr(jsonData.dropzone[k].attr)+'>'+makeCardPile()+' &nbsp; </div></div>'; 	 // ADDED d. 04-12-2017
				} else {
					HTML += '<div class="dropzoneWrap">';
					// HTML += 	'<h3'+((jsonData.dropzone[k].hasOwnProperty('headingId'))? ' id="'+jsonData.dropzone[k].headingId+'"' : '' )+' class="dropzoneHeading"><span>'+jsonData.dropzone[k].heading+'</span></h3>';
					HTML += 	'<div '+generateAttrStr(jsonData.dropzone[k].attr)+'> <span class="centerText">'+((jsonData.dropzone[k].hasOwnProperty('defaultText') && jsonData.dropzone[k].defaultText!='')? jsonData.dropzone[k].defaultText : '')+'</span></div>';
					// HTML += 	'<div '+generateAttrStr(jsonData.dropzone[k].attr)+'><div class="dropzoneContent"> <span class="centerText">'+((jsonData.dropzone[k].hasOwnProperty('defaultText') && jsonData.dropzone[k].defaultText!='')? jsonData.dropzone[k].defaultText : '')+'</span></div></div>';
					HTML += '</div>';
				}
			}
			HTML += '</div>';
		}
		HTML += '</div>';  // END #dropzoneContainer
	HTML += '</div>';  // END #triangleAndDropzoneContainer

	HTML += 	'<div class="infoContainer hidden-md hidden-lg marginTop_20px">';
	HTML += 		'<span class="btn_stat btnInfo btn btn-default"> Stat <span class="glyphicon glyphicon-info-sign"></span></span>';
	HTML += 		'<span class="btn_civilsamfund btnInfo btn btn-default"> Civilsamfund <span class="glyphicon glyphicon-info-sign"></span></span>';
	HTML += 		'<span class="btn_marked btnInfo btn btn-default"> Marked <span class="glyphicon glyphicon-info-sign"></span></span>';
	HTML += 	'</div>';

	console.log('template - HTML: ' + HTML);
	return HTML;
}

function template2() {

	// var windowHeight = $(window).height();				
	// var dropzoneWrapHeight = $('.dropzoneWrap').height();	
	// var dropzonePercentHeight = (dropzoneWrapHeight/windowHeight)*100;
	// console.log('template2 - windowHeight: ' + windowHeight + ', dropzoneWrapHeight: ' + dropzoneWrapHeight + ', dropzonePercentHeight: ' + dropzonePercentHeight);

	// $('#cardPile').append('<div id="microhint_target"> &nbsp; </div>');
	// // microhint($('#microhint_target'), '<div class="microhint_label_success">Flot</div> Du kan nu læse sætningerne i deres oprindelige sammenhæng.', false, '#000');  
	// microhint($('#microhint_target'), '<div class="microhint_label_success">Flot</div> Du kan nu læse sætningerne i deres oprindelige sammenhæng.', false, '#000');
	// $('.microhint').hide().fadeIn(600);

	// $(".dropzone" ).each(function( index, element ) { 
	//     $(element).fadeOut(600, function(){

	//     	var btnText = jsonData.dropzone[index+1].view2_btnText;
	//     	var btnRef = jsonData.dropzone[index+1].view2_btnRef;
	//     	console.log('template2 - index: ' + index + ', btnText: ' + btnText);
	//     	// $(element).after('<span class="centerBtn btn btn-info" data-btnRef="'+btnRef+'">'+btnText+'</span>');
	//     	$(element).after('<span class="centerBtn btn btn-primary" data-btnRef="'+btnRef+'">'+btnText+'</span>');
	//     	$('.centerBtn').fadeIn(600);
	//     	$(this).remove();

	//     	// $('.dropzoneWrap').css({'height': dropzonePercentHeight+'%'});  // Procent virker ikke
	//     	$('.dropzoneWrap').height(dropzoneWrapHeight);  // 
	//     });
	// });

	// window.ajustDropzoneHeight = true;

	UserMsgBox_xclick('body', '<h1>Godt arbejde - læs nu lidt mere om velfærdsopgaver og velfærdstrekanten</h1><p>Billederne viser, at den samme velfærdsopgave, fx børnepasning, uddannelse eller social sikkerhed, kan varetages af både staten, markedet eller civilsamfundet. </p><p>Det er politiske beslutninger, der afgør, hvordan de forskellige velfærdsopgaver bliver finansieret og varetaget, og dermed hvilken rolle den enkelte sektor spiller. Det kan gøre en stor forskel om fx undervisning af børn bliver varetaget af folkeskoler (staten), privatskoler (markedet) eller i hjemmet (civilsamfundet).</p><p>En politisk beslutning kan betyde, at en velfærdsopgave helt eller delvist kan flyttes fra den ene sektor til den anden, med konsekvenser for borgeren. Det er blandt andet det, de politiske ideologier handler om. Hvor og hvordan man mener, at en velfærdsopgave skal varetages og finansieres.</p><p>Eksempelvis mener liberalister, at individet og markedet kan og skal spille en større rolle. Konservative mener familien og civilsamfundet skal spille en større rolle. Og socialister mener typisk at fællesskaber og staten skal spille en større rolle.</p> <div id="tryQuizAgain" class="btn btn-primary">Prøv quiz igen</div>');
}

// The content of this function is only active when the function "template2()""
function ajustDropzoneHeight_template2() {
	console.log('ajustDropzoneHeight_template2 - CALLED');

	if ((typeof(ajustDropzoneHeight)!=='undefined') && (typeof(runOnce)==='undefined')) {
		window.runOnce = true;
		window.dropzoneWrapHeight = $('.dropzoneWrap').height();
		window.dropzoneWrapWidth = $('.dropzoneWrap').width();
		window.dropzoneWrapRatio = dropzoneWrapHeight/dropzoneWrapWidth;
	}

	if (typeof(dropzoneWrapHeight)!=='undefined') {
		var TdropzoneWrapHeight = dropzoneWrapRatio*$('.dropzoneWrap').width();
		console.log('ajustDropzoneHeight_template2 - TdropzoneWrapHeight: ' + TdropzoneWrapHeight);
		$('.dropzoneWrap').height(TdropzoneWrapHeight);
	}
}


// PRECEDENS REGL: "induviduel feedback" > "generel feedback"
function giveFeedback(cardId, feedbackType) {
	console.log('\ngiveFeedback - CALLED - cardId: ' + cardId);

	var feedbackText = '';
	for (var n in jsonData.category) {
		for (var k in jsonData.category[n].question) {
			var TqObj = jsonData.category[n].question[k];
			if (cardId == TqObj.cardId) {
				if (TqObj.hasOwnProperty('feedback')) {
					if ((feedbackType == 'posetive') && (TqObj.feedback.hasOwnProperty('posetive'))) {
						feedbackText = TqObj.feedback.posetive;
					} else {

					}
					if ((feedbackType == 'negative') && (TqObj.feedback.hasOwnProperty('negative'))) {
						feedbackText = TqObj.feedback.negative;
					} 
				} 
			}
		}
	}
	console.log('setCardId - jsonData: ' + JSON.stringify(jsonData, null, 4));

}

// This function is from "fys_symbol/symbol.js"
function isDropZoneUnderDraggable(dropZoneArr, draggableId){

	// The following code calculates the midpoint of a draggable entity:
	// =================================================================
	var draggable_width = $('#'+draggableId).width();
	draggable_width += parseInt($('#'+draggableId).css('padding-left').replace('px', '')) + parseInt($('#'+draggableId).css('padding-right').replace('px', ''));
	// draggable_width += parseInt($('#'+draggableId).css('margin-left').replace('px', '')) + parseInt($('#'+draggableId).css('margin-right').replace('px', ''));  // <--- Margin commeted out since it is not visible, and therefore "oftsets" the calculated center towards the bottom!

	var draggable_height = $('#'+draggableId).height();
	draggable_height += parseInt($('#'+draggableId).css('padding-top').replace('px', '')) + parseInt($('#'+draggableId).css('padding-bottom').replace('px', ''));
	// draggable_height += parseInt($('#'+draggableId).css('margin-top').replace('px', '')) + parseInt($('#'+draggableId).css('margin-bottom').replace('px', ''));  // <--- Margin commeted out since it is not visible, and therefore "oftsets" the calculated center towards the bottom!
	console.log('isDropZoneUnderDraggable - draggable_width: ' + draggable_width + ', draggable_height: ' + draggable_height);

	console.log('isDropZoneUnderDraggable - draggableOffset: ' + JSON.stringify(eObj.draggableOffset));  // <----- NOTE: eObj.draggableOffset is set in the "drag" event below.
	var draggable_center_left = eObj.draggableOffset.left + draggable_width/2;   // <----- NOTE: eObj.draggableOffset is set in the "drag" event below.
	var draggable_center_top = eObj.draggableOffset.top + draggable_height/2;    // <----- NOTE: eObj.draggableOffset is set in the "drag" event below.
	console.log('isDropZoneUnderDraggable - draggable_center_left: ' + draggable_center_left + ', draggable_center_top: ' + draggable_center_top + ', text: ' + $('#'+draggableId).text());
	

	// The following code determines wether the dropped entity is inside or outside a dropzone:
	// ========================================================================================
	for (var n in dropZoneArr){
		var dropzone_pos = $(dropZoneArr[n]).offset();
		var dropzone_width = $(dropZoneArr[n]).width();
		// var dropzone_height = $(dropZoneArr[n]).height();     // COMMENTED OUT 04-12-2017 - For some strange reason, this does not work ...?
		var dropzone_height = parseInt($(dropZoneArr[n]).css( "height" ).replace('px', '')); // ADDED 04-12-2017 - This works...

		console.log('isDropZoneUnderDraggable - '+dropZoneArr[n]+' - dropzone_width: ' + dropzone_width + ', dropzone_height: ' + dropzone_height );
		console.log('isDropZoneUnderDraggable - '+dropZoneArr[n]+' - upperLeftCorner - left: ' + dropzone_pos.left + ', top: ' + dropzone_pos.top );
		console.log('isDropZoneUnderDraggable - '+dropZoneArr[n]+' - lowerRightCorner - left: ' + String(dropzone_pos.left + dropzone_width) + ', top: ' +String(dropzone_pos.top + dropzone_height) );

		if ((dropzone_pos.left <= draggable_center_left) && (draggable_center_left <= dropzone_pos.left + dropzone_width) && 
			(dropzone_pos.top <= draggable_center_top) && (draggable_center_top <= dropzone_pos.top + dropzone_height)) {

			return {insideDropzone: true, dropZone: dropZoneArr[n], dropped: eObj.isCurrentDraggableDropped};
		} 
	}

	return {insideDropzone: false, dropZone: null, dropped: eObj.isCurrentDraggableDropped};
}

function make_scoreCounter() {
	return '<div class="score_container_wrap"><div class="score_container"><span class="scoreText">Korrekte svar: </span><span class="QuestionCounter QuestionTask"><span class="success">0</span> ud af '+numOfQuestions+'</span> <span class="scoreText"> Forsøg: </span><span class="ErrorCount QuestionTask attempt">0</span></div><div class="Clear"></div></div>';
}


function update_scoreCounter(dObj) {
	
	console.log('update_scoreCounter - dObj 1: ' + JSON.stringify(dObj));
	if ((dObj.dropped)){
		console.log('update_scoreCounter - A0');
		++eObj.success;
		++eObj.attempt;
	}
	if ((dObj.insideDropzone) && (!dObj.dropped)) {
		console.log('update_scoreCounter - A1');
		++eObj.attempt;
	}
	console.log('update_scoreCounter - dObj 2: ' + JSON.stringify(dObj));

	$('.success').html(eObj.success);
	$('.attempt').html(eObj.attempt);
}



// $(document).on('click touchend', ".centerBtn", function(event) {
// 	var btnRef = $(this).attr('data-btnRef');
// 	console.log('\ncenterBtn - CLICK - btnRef: ' + btnRef);
// 	$('.microhint').remove();
// 	// UserMsgBox("body", '<div id="userMsgBox_text"></div>');       // Steen ønsker at klik på userMsgBox ikke lukker userMsgBox'en.
// 	UserMsgBox_xclick("body", '<div id="userMsgBox_text"></div>');
// 	$('.MsgBox_bgr').hide().fadeIn(600);
// 	$('#userMsgBox_text').html($(btnRef).html());
// });

$(document).on('click touchend', ".btn_stat", function(event) {
	UserMsgBox_xclick("body", '<h2>Stat</h2><p>Staten varetager en stor del af serviceydelserne og omfordelingen i det danske samfund. Det gælder fx i den offentlige sektor i forhold til sundhed, uddannelse og social sikkerhed. Den offentlige sektor bliver finansieret via skatter og afgifter.</p> <p>Centrale aktører i staten er regering, folketinget, kommunalbestyrelser og regioner. I staten bliver love og regler vedtaget via politiske beslutninger. De politiske beslutninger bliver afgjort af partier og andre aktørers magt og holdninger. Ofte bliver fordelingen af velfærdsydelser reguleret af rettigheder og pligter.</p>');
});

$(document).on('click touchend', ".btn_civilsamfund", function(event) {
	UserMsgBox_xclick("body", '<h2>Civilsamfund</h2>Civilsamfundet omfatter familien, netværk, frivillige foreninger og ikke-statslige fællesskaber og organisationer. Hvis civilsamfundet er afgørende for produktion og fordeling af velfærdsgoder, er det derfor i høj grad styret af følelser fx kærlighed, venskab, solidaritet eller moral, altså uformelle værdier og normer.');
});

$(document).on('click touchend', ".btn_marked", function(event) {
	UserMsgBox_xclick("body", '<h2>Marked</h2>Markedet er den arena, hvor varer og tjenesteydelser bliver handlet. Virksomheder og forbrugere er de væsentligste aktører og den væsentligste drivkraft er at tjene penge og at købe produkter og serviceydelser. Private virksomheder producerer også fx uddannelse, sundhed og forsikringer. Alt omregnes til pengeværdier og markedsmekanismen (udbud og efterspørgsel) er med til at sætte prisen.  ');
});


$(document).on('click touchend', "#tryQuizAgain", function(event) {
	location.reload();
});

// IE 11 (edge) på windows 7 på KVUC havde problemer med anvendelse global regex med variabel search/replace i august 2017. 
// Derfor er denne funktion lavet uden global regex med variabel search/replace. 
function globalReplace(str, strSearch, strReplace) {
    console.log('wiki - globalReplace - str 1: ' + str);
    var pos = str.indexOf(strSearch);
    while (pos !== -1) {
        str = str.substring(0, pos) + strReplace + str.substring(pos+strSearch.length);
        pos = str.indexOf(strSearch, pos+strReplace.length);
    }
    console.log('wiki - globalReplace - str 2: ' + str);
}
var testStr = 'abcdefg_abcdefg_abcdefg';
globalReplace(testStr, 'abc', '123');


function resizeElements(selector, ratio) {
	$( selector ).each(function( index, element ) {
		$( element ).height($( element ).width()*ratio);
	});
}


function ajustMobileView() {
	if (bootstrapcolObj[bootstrapBreakpointSize] <= bootstrapcolObj['sm']) {
		console.log('ajustMobileView - detectBootstrapBreakpoints - bootstrap: XS');
		$('.card').addClass('card_mobile');
		$('#cardPile').addClass('cardPile_mobile');
		$('.infoContainer').addClass('infoContainer_mobile');
		$('.btnInfo').addClass('btnInfo_mobile');
		$('.score_container').addClass('score_container_mobile');
	} else {
		$('.card').removeClass('card_mobile');
		$('#cardPile').removeClass('cardPile_mobile');
		$('.infoContainer').removeClass('infoContainer_mobile');
		$('.btnInfo').removeClass('btnInfo_mobile');
		$('.score_container').removeClass('score_container_mobile');
	}
}


function detectBootstrapBreakpoints(){
    if (typeof(bootstrapBreakpointSize) === 'undefined') {
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize defined.');
        window.bootstrapBreakpointSize = null;
        window.bootstrapcolObj = {xs:0,sm:1,md:2,lg:3};
    }

    $(document).ready(function() {
        console.log('detectBootstrapBreakpoints - document.ready.');
        $('body').append('<div id="bootstrapBreakpointWrapper"> <span class="visible-xs-block"> </span> <span class="visible-sm-block"></span> <span class="visible-md-block"> </span> <span class="visible-lg-block"> </span> </div>');
        bootstrapBreakpointSize = $( "#bootstrapBreakpointWrapper>span:visible" ).prop('class').split('-')[1];
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize: ' + bootstrapBreakpointSize);
    });

    $(window).on('resize', function () {
        console.log('detectBootstrapBreakpoints - window.resize.');
        bootstrapBreakpointSize = $( "#bootstrapBreakpointWrapper>span:visible" ).prop('class').split('-')[1];
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize: ' + bootstrapBreakpointSize + ', typeof(bootstrapBreakpointSize): ' + typeof(bootstrapBreakpointSize));
    });
}


function resizeImg() {
	// $().width();
}


detectBootstrapBreakpoints();  // This function call has to be here, due to the use of $(document).ready() and $(window).resize() inside the function.




$(window).resize(function() {
	ajustDropzoneHeight_template2();

	resizeElements('.dropzone', 0.88);  // 0.78
	ajustMobileView();
});


$(document).ready(function() {
	window.showAnswer_bool = false;		// if "true" the answers will be shown in each card.
	window.dropZoneObj = null;
	window.dropZoneObj_over = null;
	window.eObj = {
		success: 0, 
		attempt: 0 
	};
	setCardId();
	$('#interface').html(template());
	organizeCardPile('#cardPile',5, 10);
	setDropzoneEvents();
	enable_audio();

	$('#interface').append(make_scoreCounter());

	resizeElements('.dropzone', 0.88);  // 0.78
	ajustMobileView();


	$( ".card" ).draggable({
		revert: function(valid) {

			var id = $(this).attr('id');
			console.log('card - REVERT - id: ' + id);

			// var id = parseInt($(this).prop('id'));   // <------- MARK (#3a#) - IMPORTANT: This is beter than (#3b#)
			//console.log('setEventHandlers - revert - id: ' + id);

			var dropZoneArr = [];
			for (var n in jsonData.dropzone) {
				if (parseInt(n)!=0) {
					dropZoneArr.push('#'+jsonData.dropzone[n].attr.id);
				}
			}
			console.log('card - REVERT - dropZoneArr: ' + JSON.stringify(dropZoneArr));

            var dropObj = isDropZoneUnderDraggable(dropZoneArr, id);
            console.log('card - REVERT - dropObj: ' + JSON.stringify(dropObj));

            update_scoreCounter(dropObj);

			// console.log('card - dropZoneObj_over: ' + JSON.stringify(dropZoneObj_over));

			// ATO found the following if-else construct, that solves the error-sound issue. It is a good (but undocumented) way of triggering "events" on drop / not-drop.
			// SEE:   http://jamesallardice.com/run-a-callback-function-when-a-jquery-ui-draggable-widget-reverts/
	        if(valid) {
	            console.log("Dropped in a valid location");
	            correct_sound();

	            // {insideDropzone: false, dropZone: null, dropped: eObj.isCurrentDraggableDropped};
	            // $('#'+id).css({'background-color': '#F00'});
	            var parent = $('#'+id).closest('.dropzoneHeading').prop('id'); //  css('background-color');
	            // var Tid = $('.dropzoneHeading', parent).prop('id');
	            console.log('card - REVERT - parent: ' + parent);
	            // $('#'+id).css();


	        }
	        else {
	         console.log("Dropped in a invalid location");
	         	error_sound();
	        }
	        return !valid;
	    },
		start: function(event, ui) {
			console.log('card - START');
			window.topPos = $(this).css('top');

			eObj.isCurrentDraggableDropped = false;
            eObj.idOfCurrentDraggable = $(this).prop('id');
		},
		stop: function(event, ui) {
			console.log('card - STOP');

			// console.log('card - dropZoneObj: ' + JSON.stringify(dropZoneObj));

			if (dropZoneObj !== null){ // If student answer is correct...
				var dropId = $(dropZoneObj).prop('id');
				console.log('card - dropId: ' + dropId);

				$(dropZoneObj).append(SimpleClone($(this)).addClass("Clone"));  // Append the cloned card to dropzone
				$(this).remove();												// Remove the original card
				// organizeCardPile('#'+dropId, 5, 0);
				
				// if (dropId == 'wasteBin') {
				// 	$('.glyphicons-bin').css({'opacity':'0'});
				// 	$( '.glyphicons-bin' ).animate({ opacity: 1}, 1000);
				// 	$( '#'+dropId+' .card' ).last().animate({ opacity: 0.40}, 1000);
				// } 

				var id = $(this).attr('id');
				var tag = dropZoneObj.prev();
				var bgColor = $('span', tag).css('background-color');
	            console.log('card - REVERT - bgColor: ' + bgColor);
	            $('#'+id).animate({'background-color': bgColor}, 500); 


				dropZoneObj = null;  // Reset dropZoneObj...

				// console.log('card - CORRECT ');
				// correct_sound(); 


			} 
			else {  // If student answer is wrong...

				console.log('card - ERROR ');
				// error_sound();				// <------ Does not work on mobile devices - see the solution ATO found above. 
				$(this).css({'top': topPos});   // This is done to make Internet Explore 11 understand that it needs på place the card back to its original position.
			}

			if ($('#cardPile .card').length == 0) {
				console.log('step_2_template - INIT');

				// alert('RUN TEMPLATE 2');
				setTimeout(function() {
					template2();
				}, 1000);
			}

		},
		drag: function(event, ui) {
			console.log('card - DRAG');

			var id = $(this).prop('id');
            var pos = $(this).position();
            var off = $(this).offset();
            console.log('entity - DRAG - id: ' + id + ', pos: ' + JSON.stringify(pos) + ', offset: ' + JSON.stringify(off));

            eObj.draggableOffset = off;

            eObj.draggablePos_end = $(this).offset();
		}
	});

	// template2();


	$('#interface').after('<div id="log"></div>');

});



