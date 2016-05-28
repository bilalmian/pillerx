$(document).ready(function(){






	$('#hide').hide();

	$('#loginButton').click(function() {
	   $('#hide').toggle();
	   $('.frontButtons').hide();
	});
	$('#backButton').click(function(){
		$('.frontButtons').toggle();
		$('#hide').hide();
	})


// modal
		
//*******************************************************
		/*
		Modals being triggered here. Each button has a 'mod' attribute, which is the ID of the modal it corresponds to
		*/

		$('.modal-trigger').on('click', function(){
			var which = $(this).attr('mod');
			$(which).openModal({
				complete: function(){console.log('closing!!')
								$('form').find('input[type=text], input[type=checkbox], textarea').val('');
								$('select').material_select();
								// $("#interList").html('');
								// $("#interList").html('<h4>Interactions have been found between:</h4>');
								}
			});

	
//*******************************************************
//NEW PRESCRIPTION ADD MODAL
			//I Have an if/else if statement here because each of the modals require different things; for example, the add prescrip. one requires that we initate the datepicker, and has the post request to the proper route. 
			if ($(this).attr('data-value') == 2){
				$('select').material_select();
				 $('.datepicker').pickadate({
				 		formatSubmit: 'dd-mm-yyyy',
	    				selectMonths: true, // Creates a dropdown to control month
	    				selectYears: 15 // Creates a dropdown of 15 years to control year
	  				});
				 //this is that stupid fix to that duplicating submit thing
					$('#medForm').unbind('submit').bind('submit', function(event){
				 		event.preventDefault();
				 		console.log('clicked');
				 		$.post('/prescription', {
				 			med_name: $("#med_name").val(),
				 			dose: $("#dose").val(),
				 			tOd: $("#tOd").val(),
				 			filled: $("#filled").val(),
				 			length: $("#length").val(),
				 			refLeft: $("#refLeft").val(),
				 			doc: $("#doc").val(),
				 			pharm: $("#pharm").val(),
				 			directions: $("#directions").val(),
				 			notes: $("#notes").val(),
				 		}, function(data, textStatus, xhr) {

				 			console.log(data);

				 			var name= caps(data.medname);
				 			console.log(name)
				 			// var dot= data.time_of_day;

				 			// var times =[];
				 			// if (dot.indexOf('1')>-1){times.push("Morning")};
				 			// if(dot.indexOf('2')>-1){times.push("Midday")};
				 			// if(dot.indexOf('3')>-1){times.push("Evening")};
				 			// var time = times.toString();
				 			
				 			
				 				// $("#medField").append("<li><div class='collapsible-header'><p class='center'>"+data.medname+"</p></div><div class='collapsible-body'><span>Take in the: "+data.time_of_day+"</span><span>Directions: "+data.directions+"</span><span>Refills left: "+data.refills+"</span><span>Dose: "+data.dose+"</span><span>From Doctor "+data.prescribing_doctor+"</span><span>Take With Food</span><a class='btn-floating btn-large waves-effect waves-light red gone' data-value='"+data.id+"'><i class='material-icons'>thumb_down</i></a></div></li>")

				 				$("#medField").append("<li id='"+data.id+"'><div class='collapsible-header'><p class='center'>"+name+"</p></div><div class='collapsible-body'><p>Take in the: "+data.time_of_day+"</p><p>Directions: "+data.directions+"</p><p>Refills left: "+data.refills+"</p><p>Dose: "+data.dose+"</p><p>From Doctor "+data.prescribing_doctor+"</p><p>Take With Food</p><p><a class='btn-floating btn-small waves-effect waves-light red gone right' data-value='"+data.id+"'><i class='material-icons'>thumb_down</i></a></p></div></li>");


				 			
				 		});
				 	});

		
//*******************************************************
//USER LOGIN MODAL

			}else if($(this).attr('data-value') == 3){
				//this is for the login modal. we might have to make another else if for any other modal that comes up...

				$("#login").unbind('submit').bind('submit', function(event){
					$("#modal3").closeModal()
					event.preventDefault();
					console.log('login clicked');
					$.post('/login', {
						logEmail: $("#logEmail").val(),
						logPass: $("#logPass").val(),
					}, function(data, textStatus, xhr){
						
					})
				})
			}else if($(this).attr('data-value')==4){
				console.log("hit!")
				$.post('/printall', function(data, textStatus, xhr) {
					console.log(data)
					for(var i=0; i<data.length; i++){
						$("#docList").append(
							"<p class='center'>"+data[i].prescribing_doctor+"</p>")


					}
				});

			}else if($(this).attr('data-value')==6){
				checkInteractions()
			}			
		});
var answer;


		function checkInteractions(){
			
			$.post('/check', function(data, textStatus, xhr) {
				console.log("got back from checking route")
				
				var problems = [];
				
				var presentMeds = [];
				for(var l=0; l<data.length; l++){
					presentMeds.push(data[l])
				};
				

			console.log(presentMeds);
			startAjax(presentMeds);

			});


		};

		function startAjax(array){
			console.log("got to start AJax");
			console.log(array);
			var getarray = [],
			i, len;

			for(i=0, len=array.length; i<len; i+=1){
				getarray.push(runAjax(array[i], array));
			};

			$.when.apply($, getarray).done(function(){
				console.log("we got done");

			});
		}
		


		function runAjax(r, array){
			console.log(r);
			jQuery.ajax({
			    url: "https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=" + r.rxuid,
			    success: function(result){
			    			console.log("wehitit");
			    			console.log(r);
			    			console.log(array);
			    			getCases(result, r, array);
						},
			})

		}


		function getCases(response, presents, array){

			console.log("went to sort")
			console.log("response: " + response);
			console.log("presents: " + presents);
			console.log("array: "+ array);
			var cases = [];
			var problems =[];
			for(var i=0; i<response.interactionTypeGroup[0].interactionType[0].interactionPair.length;i++){
				var otherRX = response.interactionTypeGroup[0].interactionType[0].interactionPair[i].interactionConcept[1].minConceptItem.rxcui;
				var otherRXname = response.interactionTypeGroup[0].interactionType[0].interactionPair[i].interactionConcept[1].minConceptItem.name;
				var otherRXeffects = response.interactionTypeGroup[0].interactionType[0].interactionPair[i].description;
				
				var crase = {
						rxcui: otherRX,
						name: otherRXname,
						effect: otherRXeffects}		
				cases.push(crase)
			};
			var problems2 = [];
			for(var j=0; j<cases.length; j++){

				var here = cases[j];
				for(var k=0; k<array.length; k++){
					if(array[k].rxuid == here.rxcui){
						problems2.push(here);
					}
				}
			};
			for (var m=0; m< problems2.length; m++){
				

				var med2 = presents;
				var problem = {
							mednameOne: med2.medname,
							medcodeOne: med2.rxuid,
							mednameTwo: problems2[m].name,
							medcodeTwo: problems2[m].rxcui,
							effect: problems2[m].effect
						};
				problems.push(problem)
			}

			debugger;
			console.log("Here are the problems:")
			console.log(problems);

			for(var z= 0; z<problems.length; z++){
				$("#interList").append("<p>"+problems[z].mednameOne+" interacts with "+problems[z].mednameTwo+" because "+problems[z].effect+"</p")
			}
			

		};










		// 		for(var i=0; i<presentMeds.length; i++){
		// 		    jQuery.ajax({
		// 		        url: "https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=" + presentMeds[i].rxuid,
		// 		        async: false,
		// 		        success: function (result) {
		// 		        	console.log(result);

		// 						var cases = getCases(result);
		// 						var problems2 = [];
		// 						for(var j=0; j<cases.length; j++){
		// 							var here = cases[j];
		// 							for(var k=0; k<presentMeds.length; k++){
		// 								if(presentMeds[k].rxuid == here.rxcui){
		// 									problems2.push(here);
		// 								}
		// 							}
		// 						};
		// 						for (var m=0; m< problems2.length; m++){
		// 							var med2 = presentMeds[i];
		// 							var problem = {
		// 										mednameOne: med2.medname,
		// 										medcodeOne: med2.rxuid,
		// 										mednameTwo: problems2[m].name,
		// 										medcodeTwo: problems2[m].rxcui,
		// 										effect: problems2[m].effect
		// 									};
		// 							problems.push(problem)
		// 						}					
		// 			    },			        	
		// 	    	});
		// 		};								
		// 	interactionsData(problems);
		// 	});
		// };

//sorts api json response blah blah

		// function getCases(response){
		// 	console.log("went to sort")
		// 	var cases = [];
		// 	for(var i=0; i<response.interactionTypeGroup[0].interactionType[0].interactionPair.length;i++){
		// 		var otherRX = response.interactionTypeGroup[0].interactionType[0].interactionPair[i].interactionConcept[1].minConceptItem.rxcui;
		// 		var otherRXname = response.interactionTypeGroup[0].interactionType[0].interactionPair[i].interactionConcept[1].minConceptItem.name;
		// 		var otherRXeffects = response.interactionTypeGroup[0].interactionType[0].interactionPair[i].description;
				
		// 		var crase = {
		// 				rxcui: otherRX,
		// 				name: otherRXname,
		// 				effect: otherRXeffects}		
		// 		cases.push(crase)
		// 	};
		// 	return cases;	
		// };
		

//this is where we get an array of objects, each of which contains the two interacting drugs present in the user's db and the effect that mixing them has. This is from where we program the alerts, etc.


		
//*******************************************************



  $('.button-collapse').sideNav({
      menuWidth: 240, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor

        
    });
   $('.collapsible').collapsible();
	

	var userI;

	$.post('/getinfo', function(data, textStatus, xhr) {
		
		getYou(data);
	});
	// $.post('/printall')
	function getYou(data){
		console.log("got u")
		userI = data;
		console.log(data)
		console.log(userI)

	};

	$.post('printall', function(data, textStatus, xhr) {
		 console.log(data);
		 for(var i=0; i<data.length; i++){

		 	var name= caps(data[i].medname);
		 	console.log(name)

		 	var times =[];
		 	if (data[i].time_of_day.indexOf(1)>-1){times.push("Morning")};
		 	if(data[i].time_of_day.indexOf(2)>-1){times.push("Midday")};
		 	if(data[i].time_of_day.indexOf(3)>-1){times.push("Evening")};
		 	var time = times.toString();
		 	console.log(time)


		 	$("#medField").append("<li id='"+data[i].id+"'><div class='collapsible-header'><p class='center'>"+name+"</p></div><div class='collapsible-body'><p>Take in the: "+time+"</p><p>Directions: "+data[i].directions+"</p><p>Refills left: "+data[i].refills+"</p><p>Dose: "+data[i].dose+"</p><p>From Doctor "+data[i].prescribing_doctor+"</p><p>Take With Food</p><p><a class='btn-floating btn-small waves-effect waves-light red gone right' data-value='"+data[i].id+"'><i class='material-icons'>thumb_down</i></a></p></div></li>");







		 }
		


	});

	$("#medField").on('click','.gone', function(){
			var id = $(this).data('value');
			$.post('/deletemed/'+id, function(data, textStatus, xhr) {
				console.log('it gone');
			});
			clearIt(id);
		});
//after delete, clears prescription from dashboard
		function clearIt(id){
			var cid= id;
			$("#medField").find("#"+cid).html('');
		}

	function caps(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}




});





//if//



 //if//
        




	

