var base_url = "http://www.auctioncrawl.com/showingfeedback_action/";
//var base_url = "http://localhost/he_android_feedback/he_mobile_app_actions/";
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var timestamp = 0;
var signin = false;
var uploadSuccess = true;

var app = {
    BASE_URL : "http://www.auctioncrawl.com/showingfeedback_action/",

    // Application Constructor
    initialize: function() {
        console.log("console log init");
        this.bindEvents();
        //this.initFastClick();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
//    initFastClick : function() {
//        window.addEventListener('load', function() {
//            FastClick.attach(document.body);
//        }, false);
//    },
    // Phonegap is now ready...
    onDeviceReady: function() {
		navigator.splashscreen.hide();
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        console.log("device ready, start making you custom calls!");
        // Start adding your code here....
	    document.addEventListener("backbutton", function() {
			if ($.mobile.activePage.attr('id') == "home") {
				navigator.app.exitApp();
			} else {
				navigator.app.backHistory();
			}
	    }, false);
    }

};


function sleep(millis, callback) {
    setTimeout(function()
            { callback(); }
    , millis);
}

function just_sleep(){
    console.log("Sleeeping.");
};

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the base64-encoded image data
  // console.log(imageData);
  
  var d = new Date().getTime();
  $('#photo_container').append('<div id="imgdiv_'+d+'" class="photosarrdiv" ><center><img id="image_'+d+'" src="" class="photosarr" /></center><div class="ui-grid-solo"><a href="#" class="ui-btn ui-icon-delete ui-btn-icon-left ui-mini"  onclick="removePhoto('+d+')">Remove Photo</a></div></div>');
  
  var largeImage = document.getElementById('image_'+d);
  //largeImage.style.display = 'block';
  largeImage.src = "data:image/jpeg;base64," + imageData;
  
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  var d = new Date().getTime();
  $('#photo_container').append('<div id="imgdiv_'+d+'" class="photosarrdiv" ><center><img id="image_'+d+'" src="" class="photosarr" /></center><div class="ui-grid-solo"><a href="#" class="ui-btn ui-icon-delete ui-btn-icon-left ui-mini"  onclick="removePhoto('+d+')">Remove Photo</a></div></div>');
  
  var largeImage = document.getElementById('image_'+d);
  //largeImage.style.display = 'block';
  largeImage.src = imageURI; 
  
  
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 80,
	destinationType: destinationType.FILE_URI });
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
	destinationType: destinationType.DATA_URL });
}

function removePhoto(id){
	$('#imgdiv_'+id).remove();
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
	destinationType: destinationType.FILE_URI,
	sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}



function uploadPhoto() {
	//selected photo URI is in the src attribute (we set this on getPhoto)
	//var imageURI = document.getElementById('largeImage').getAttribute("src");
	var imageURI = '';
	if ( $( ".photosarr" ).length ) {
		
		$( "#post_button" ).attr('disabled','disabled');
		
		//$( "#msgPopupDiv p" ).html("Please wait while uploading photos...");
		//$( "#msgPopupDiv" ).popup( "open",{positionTo:'window', history: false } );
		$( "#post_button" ).attr('disabled','disabled');

		$.mobile.loading('show', {
			text: "Uploading Photos...",
			textVisible: true,
			theme: 'b',
			textonly: false
		});
		
		$('.photosarr').each(function(index, element) {
			imageURI = $(element).attr('src');
			uploadFile(imageURI);
		});
		
		$( "#post_button" ).removeAttr('disabled');
		//$( "#msgPopupDiv" ).popup( "close")
	}
	
	
}

function uploadFile(imageURI){


	console.log(imageURI);
	if (!imageURI) {
		alert('Please select an image first.');
		return;
	}

	var formData = $('#frm_form_data').serializeArray();
	//set upload options
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType = "image/jpeg";


	options.params = {
	   'single_unit_id': $('#single_unit_id').val(),
	   'timestamp': timestamp
	   //'data':formData
	 }
	
	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI("http://www.auctioncrawl.com/showingfeedback_action/upload.php"), win, fail, options);

}

function win(r) {
	uploadSuccess = true;
	$.mobile.loading('hide');
	$( "#post_button" ).removeAttr('disabled');
	//$('#photo_container').append("<div>Sent = " + r.bytesSent + "</div>");
	//$('#photo_container').append("<div>Response = " + r.response + "</div>");
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	//alert("Response =" + r.response);
	console.log("Sent = " + r.bytesSent);
}

function fail(error) {
	uploadSuccess = false;
	//alert("An error has occurred: Code = " + error.code);
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
}


/************************End Photo Functions*******************************************/
function signout(){
	var logLength = localStorage.length; //how many items are in the database starting with zero
	if(localStorage.length > 0){
		localStorage.removeItem('localdata');
	}
	signin = false;
	setTimeout(function () {
		$(':mobile-pagecontainer').pagecontainer('change', '#loginScreen', {
			transition: 'fade',
			changeHash: false,
			
			showLoadMsg: true
		});
	}, 1000);
	
  
}
	
function login(){

}	


function loadAgentForm()
{
	console.log('loadAgentForm');
	$( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
		var $ul = $( this ),
			$input = $( data.input ),
			value = $input.val(),
			html = "";
		$ul.html( "" );
		if ( value && value.length > 0 ) {
			//$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			//$('#form_preloader').show();
			
			$.mobile.loading( 'show', {
				text: "Loading...",
				textVisible: true,
				theme: 'b',
				textonly: false
			});
			
			$ul.listview( "refresh" );
			$.ajax({
				url: base_url + "ajax_get_property_address.php",
				dataType: "jsonp",
				jsonp: "jsoncallback",
				crossDomain: true,
				data: {
					q: $input.val()
				}
			})
			.then( function ( response ) {
				
				$.mobile.loading( 'hide');
				//$('#form_preloader').hide();
				$.each( response, function ( i, val ) {
					html += "<li onClick='getAddress(this)'; ><a href='javascript: void(0)'>" + val + "</a></li>";
				});
				$ul.html( html );
				$ul.listview( "refresh" );
				$ul.trigger( "updatelayout");
			});
		}
	});
	
}

function postFeedback(){
	
	//var formData = $('#frm_form_data').serialize();
	var formData = 'timestamp='+timestamp+'&agent_password='+$('#agent_password').val();
	
	//$('#form_preloader').show();	
	$.mobile.loading( 'show', {
		text: "Submiting...",
		textVisible: true,
		theme: 'b',
		textonly: false
	});	
	
	$.ajax({
		type : "POST",
		url: base_url + "ajax_post_feedback.php",
		dataType : "jsonp", 
		data : formData,
		jsonp: "jsoncallback",
		crossDomain: true,
		success : function( response )
		{
			//$('#form_preloader').hide();
			$.mobile.loading('hide');
			if(response.success == 'yes') 
			{
				//resetFeedbackForm();
				
				setTimeout(function () {
					$(':mobile-pagecontainer').pagecontainer('change', '#thanksScreen', {
						transition: 'fade',
						changeHash: false,
						
						showLoadMsg: true
					});
				}, 1000);				
				//$('#agentFormScreen').slideUp('slow');
				//setTimeout( function( ) { $('#thanksScreen').slideDown('slow'); }, 1000); 
				//$('#pdf_link').html("<p>For view your feedback PDF, <a href='"+response.pdf_link+"' target='_blank' >click here <img src='images/pdf.png' ></a></p>");
				
				//setTimeout( function( ) { $('#thanksScreen').slideUp('slow') }, 3000);
				//$('#agentFormScreen').fadeIn('slow');
				
			}else{
				
				$.mobile.loading( 'show', {
					text: "Error in data posting!<br>"+response.success,
					textVisible: true,
					theme: 'b',
					textonly: true
				});				
				$('#form_data_msg').html('Error in data posting!');     
				$('#form_data_msg').fadeIn( "slow", function() {
					setTimeout( function( ) { $.mobile.loading('show'); }, 2000); 	
				});
			}
		}
	});	
	
	timestamp = 0;	
}

function submitFormData(){
//function submitFormInit(){


}	


//function submitFormData(callback){
//	
//	//uploadPhoto();
//	/*****************************************/
//	//selected photo URI is in the src attribute (we set this on getPhoto)
//	//var imageURI = document.getElementById('largeImage').getAttribute("src");
//
//	/****************************************/
//	sleep(5000,just_sleep());
//
//   
//	if(typeof callback == "function") 
//	callback();
//}

	
function loadSplashScreen(){
	$('#splashScreen').slideDown( "slow", function() {
    	setTimeout( function( ) { loadHomeScreen(); }, 2000); 	
  	});
}
	
function loadHomeScreen(){
	clear_form();
	setTimeout(function () {
		$(':mobile-pagecontainer').pagecontainer('change', '#loginScreen', {
			transition: 'fade',
			changeHash: false,
			
			showLoadMsg: true
		});
	}, 1000);	

}

	
function getAddress( obj ) {
	var address = $(obj).find('a').html();
	$( "#property_address" ).val( address );  
	$("#autocomplete li" ).addClass('ui-screen-hidden');
	getPropertyAddressUnits( address );
}


function checkPropertyUnits( obj ) {
	 	$('#multi_units_block').fadeOut('slow');
}
function getPropertyAddressUnits( address ){
	
	//$('#form_preloader').show();	
	
	$.mobile.loading( 'show', {
		text: "",
		textVisible: true,
		theme: 'b',
		textonly: false
	});	
	html = "";
	$.ajax({
		type : "POST",
		url: base_url + "ajax_get_property_address_units.php",
		dataType : "jsonp", 
		data : 'address=' + address,
		jsonp: "jsoncallback",
		crossDomain: true,
		success : function( response )
		{
			//$('#form_preloader').hide();
			$.mobile.loading('hide');
			
			if(response.count > 1) {
				
				$('#multi_units_block').fadeIn('slow');
				$("#multi_unit_id option:eq(1)").remove().end();
				
				$.each( response.abbreviation, function ( i, val ) {
					$("#multi_unit_id").append($("<option></option>").attr("value", response.unit_id[i]).text(val));
				});
				
				$("#multi_unit_id").attr("required","");
				
				$('#single_unit_id').val(" ");
				$('#unit_abbreviation').val(" ");
				$('#unit_type').val('multi');
			}
			else{
				$("#multi_unit_id").removeAttr("required");
				$('#multi_units_block').fadeOut('slow');
				$('#single_unit_id').val(response.unit_id);
				$('#unit_abbreviation').val(response.abbreviation);
				$('#unit_type').val('single');
			}
			
			$('#building_id').val(response.building_id);
		}
	});
}	

function resetFeedbackForm(){
	$('#single_unit_id').val("");
	$('#unit_abbreviation').val("");
	$('#unit_type').val("");
	$('#building_id').val("");
	$("#multi_unit_id option:eq(1)").remove().end();
	$("#multi_unit_id").removeAttr("required");
	$('#property_address').val("");
	$('#property_address').attr('placeholder','Property address');
	$('#general_feedback').val("");
	$('#general_feedback').attr('placeholder','General Feedback');
	$('#condition_feedback').val("");
	$('#condition_feedback').attr('placeholder','Condition Feedback');
	$('#recommended_rent_rate').val("");
	$('#recommended_rent_rate').attr('placeholder','Recommended Rent Rate');
}

function closeThanksScreen(){
	

	clear_form();
	setTimeout(function () {
		$(':mobile-pagecontainer').pagecontainer('change', '#dashBoard', {
			transition: 'fade',
			changeHash: false,
			showLoadMsg: true
		});
	}, 1000);


	//$('#thanksScreen').slideUp('slow');

//	setTimeout( function( ) { 
//		$('#agentFormScreen').slideDown('slow');
//	}, 1000); 
}

function clear_form(){
	$('#frm_form_data').find("input[type=text], input[type=number], textarea").val("");
	
	if($('.photosarrdiv').length){
		$('.photosarrdiv').each(function(index, element) {
			$(element).remove();
		});
	}
	
	$('#pdf_link').html('');
	$('#photo_container').html('');	
}

$( "#loginScreen" ).on( "pageinit", function() {
	
	$( "#frm_login" ).validate({
		rules: {
			email_address: {
				required: true
			},
			user_password: {
				required: true
			}
		},
		errorPlacement: function( error, element ) {
			error.insertAfter( element.parent());
			//error.insertAfter(element);
		},
		submitHandler: function( form ) {
			
		var formData = $('#frm_login').serialize();
	
	
		$.mobile.loading( 'show', {
			text: "Submiting...",
			textVisible: true,
			theme: 'b',
			textonly: false
		});
		//$('#login_preloader').show();	
		$.ajax({
			type : "POST",
			url: base_url + "ajax_login_verification.php",
			dataType : "jsonp", 
			data : formData,
			jsonp: "jsoncallback",
			crossDomain: true,
			success : function( response )
			{
				//$('#login_preloader').hide();
				$.mobile.loading( 'hide');
				
				if(response.success == 'yes') 
				{
					signin = true;
					if (typeof(localStorage) == 'undefined' ) {
						alert('Your browser does not support localStorage. Try upgrading.');
					} else {
						if($('#remember_me').is(":checked")){
							var values = new Array();
							var name = response.agent_name;
							var email = response.agent_email;
							var password = response.agent_password;
							
							
							values.push(name);
							values.push(email);
							values.push(password);
					 
							if (name != "" && email != "" && password != "") {
								try {
									localStorage.setItem('localdata', values.join(';'));
								} catch (e) {
									if (e == QUOTA_EXCEEDED_ERR) {
										alert('Quota exceeded!');
									}
								}
							} else {
								alert("All fields are required.");
							}
						}
					
					}				
					
					setTimeout(function () {
						$(':mobile-pagecontainer').pagecontainer('change', '#dashBoard', {
							transition: 'fade',
							changeHash: false,
							
							showLoadMsg: true
						});
					}, 1000);
					
					//$('#loginScreen').slideUp('slow');
					//setTimeout( function(){ $('#agentFormScreen').slideDown('slow');}, 1000 );
					//loadAgentForm();
					$('#agent_name').val(response.agent_name);
					$('#agent_email').val(response.agent_email);
					$('#agent_password').val(response.agent_password);
					return true;
				}
				else
				{
					$('#login_msg').html('Please Provide Correct Login Information!');
					$('#login_msg').fadeIn( "slow", function() {
						setTimeout( function( ) { $('#login_msg').fadeOut('slow') }, 2000); 	
					});
				}
			}
		});		
			
		}
	});
});	


$( "#agentFormScreen" ).on( "pageinit", function() {
	
	$( "#frm_form_data" ).validate({
		rules: {
			property_address: {
				required: true
			},
			recommended_rent_rate: {
				required: true
			}
		},
		errorPlacement: function( error, element ) {
			error.insertAfter( element.parent());
			//error.insertAfter(element);
		},
		submitHandler: function( form ) {
			

			if(timestamp == 0){
				timestamp = new Date().getTime();		
				$('#timestamp').val(timestamp);
			}
			
			if($('#unit_type').val() == 'multi') {
				var multi_unit_abbreviation = $("#multi_unit_id option:selected").text();
				$('#unit_abbreviation').val(multi_unit_abbreviation);	
			}
			

				
			var formData = $('#frm_form_data').serialize();
			
			//$('#form_preloader').show();	
			$.mobile.loading( 'show', {
				text: "Submiting...",
				textVisible: true,
				theme: 'b',
				textonly: false
			});	
			
			$.ajax({
				type : "POST",
				url: base_url + "ajax_post_form_data_new.php",
				dataType : "jsonp", 
				data : formData,
				jsonp: "jsoncallback",
				crossDomain: true,
				success : function( response )
				{
					//$('#form_preloader').hide();
					$.mobile.loading('hide');
					if(response.success == 'yes') 
					{
						//resetFeedbackForm();
						
						setTimeout(function () {
							$(':mobile-pagecontainer').pagecontainer('change', '#agentUpload', {
								transition: 'fade',
								changeHash: false,
								
								showLoadMsg: true
							});
						}, 1000);				
						//$('#agentFormScreen').slideUp('slow');
						//setTimeout( function( ) { $('#thanksScreen').slideDown('slow'); }, 1000); 
						//$('#pdf_link').html("<p>For view your feedback PDF, <a href='"+response.pdf_link+"' target='_blank' >click here <img src='images/pdf.png' ></a></p>");
						
						//setTimeout( function( ) { $('#thanksScreen').slideUp('slow') }, 3000);
						//$('#agentFormScreen').fadeIn('slow');
						
					}else{
						
						$.mobile.loading( 'show', {
							text: "Error in data posting!<br>"+response.success,
							textVisible: true,
							theme: 'b',
							textonly: true
						});				
						$('#form_data_msg').html('Error in data posting!');     
						$('#form_data_msg').fadeIn( "slow", function() {
							setTimeout( function( ) { $.mobile.loading('show'); }, 2000); 	
						});
					}
				}
			});
		

			
			
		}
	});
});	


$(document).ready(function()
{
	
	document.body.style.display  = 'block';
    var i = 0;
    var logLength = localStorage.length; //how many items are in the database starting with zero

	var selected_screen = $( ":mobile-pagecontainer" ).pagecontainer( "getActivePage" )[0].id;
	
	if(signin == false && selected_screen != 'loginScreen'){
		setTimeout(function () {
			$(':mobile-pagecontainer').pagecontainer('change', '#loginScreen', {
				transition: 'fade',
				changeHash: false,
				
				showLoadMsg: true
			});
		}, 1000);
	}

 	if(localStorage.length > 0){
        var values = localStorage.getItem('localdata');
        values = values.split(";"); //create an array of the values
		
        var name = values[0];
        var email = values[1];
        var password = values[2];

		$('#agent_name').val(name);
		$('#agent_email').val(email);
		$('#agent_password').val(password);		


		setTimeout(function () {
			$(':mobile-pagecontainer').pagecontainer('change', '#dashBoard', {
				transition: 'fade',
				changeHash: false,
				
				showLoadMsg: true
			});
		}, 1000);

		//$('#loginScreen').slideUp('slow');
		//setTimeout( function(){ $('#agentFormScreen').slideDown('slow');}, 1000 );
		//loadAgentForm();
		
		
	}




/*$( "#loginScreen").on( "pageinit", function() {
	$( "form" ).validate({
		rules: {
			email_address: {
				required: true
			},
			user_password: {
				required: true
			}
		},
		errorPlacement: function( error, element ) {
			//error.insertAfter( element.parent());
			error.insertAfter(element);
		}
	});
});*/



});

