/**jQuery library to animate images in a continuous (infinite) loop - scrolling left across a page--needs imageArray to be set !! <NOTE TO ME> create a php function to set the imageArray put a set function in here? maybe

TO DO: 
- write function to set divs to appropriate css (see clouds.css) checkcss(){}
- allows you to reuse looping() when updating divs after a cloud has been drawn
- find a way to evenly disperse images within the target div margin-auto? http://stackoverflow.com/questions/7245018/how-to-evenly-distribute-elements-in-a-div-next-to-each-other use table-display 
- change population of second div logic (initiate page) to fully populate the length of the imageArray minus what was already loaded in the first div 
**/

(function($){
	$(function() {
			$(window).load(function(){
				
				//note: change these globals to objects.
				var win_width = $(window).width(); //holds the width of the browser window
				var div1_width = 0; //holds width of first animated series (gap fill)
				var div2_width = 0; //holds width of second animated series - remaining images
				var ani1_duration = 0; //holds animation length in seconds*1000 (for millisec)
				var ani2_duration = 0;
				var ani_interval = 0; //holds the animation duration for looping (Timeout)
				var ani1_width = 0; // twice window width (first animation travel distance)
				var ani2_width = 0;
				var div1_first_run = true; 
				var div2_first_run = true; 
				var px_rate = 120; //# pixels the animation should travel per second

				//holds the images to be displayed	
				var imageArray = [];
				
				//function dynamically populates imageArray based on files in "images" folder and displays the images scrolling - to only display the images and manually populate imageArray, use initiatepage()
				function popimageArray(){
					$.getJSON("get_images.php", function(data){
						for (var i = 2; i < data.length; i++) {
								imageArray[i-2] = "images/"+data[i]; 
							};						
						initiatepage("#images1", "#images2", imageArray);
					});
				}
				popimageArray();

				//appends an image to any given target div
				function imagedisplay(targetdiv, imagelist) {
					$(targetdiv).append('<img src="'+imagelist[0]+'">');
				}

				//loops through imageArray and appends each image to a given target div - maintains first un-used image at position [0] in the array
				//to use: targetdiv is the id value "#somediv" && imagelist is an array of images to be appended to the div "imageArray" 
				function looping(targetdiv, imagelist){
						var newvalue = imagelist[0];
						imagelist.shift();
						imagelist.push(newvalue);
						imagedisplay(targetdiv, imagelist);
				}

				//checks if the width of an image-populated div is greater than the width of the window 
				function checkwidth(targetdiv){
					var imgcount = $(targetdiv + ' img').length;
					if ((imgcount * 200) < (win_width-199)){
						return true;
					}
					else {
						return false;
					}
				}

				//function to update width and animation duration variables	
				//NOTE: Consider moving animation duration vars out of here 
				function update_vars(div1, div2){
					console.log("Updating Variables");
					div1_width = $(div1).width(); //should be just < or = win_width
					div2_width = $(div2).width();
					win_width = $(window).width();
					
					//first animation calculations
					ani1_width = win_width*2; //first animation travel distance
					ani1_duration = (ani1_width/px_rate)*2000; 
					console.log("first div duration: "+ani1_duration);

					//second animation calculations
					ani2_width = div2_width+win_width;
					ani2_duration = (ani2_width/px_rate)*2000;
					console.log("second div duration: "+ani2_duration); 

					var ani_interval = ani2_duration + ani1_duration/2;
					console.log("animation interval"+ani_interval);
				}

				//sets the "left" property of the target div to reset location 
				function reset_div (targetdiv){
					targetdiv = $(targetdiv);
					targetdiv.css("left", win_width);
				}

				function apply_animations(div1, div2){
					update_vars(div1, div2);
					animatediv1(div1, div2);
				}

				function animatediv1(target1, target2){
						console.log("animation 1 underway");
						console.log($(target1).css("left"));
						$(target1).animate({left : ["-="+ani1_width, "linear"]},
							{
								queue: true,
								duration: ani1_duration,
								step: function(value_left){
									console.log($(target1).css("left"));
									if(value_left < 1){
										if(div1_first_run){
											div1_first_run = false;
											animatediv2(target1, target2);	
										};
									};
								},
								complete: function(){
									console.log("ani1 complete");
									reset_div(target1);
									div1_first_run = true; 
									console.log($(target1).css("left"));
								}
							});
					}

				function animatediv2(target1, target2){
						goal_left = win_width - div2_width;
						$(target2).animate({left : ["-="+ani2_width, "linear"]},
							{
							queue: true,
							duration: ani2_duration, 
							step: function(target_left){
								console.log("div 2 left: "+target_left);
								console.log("left goal: "+goal_left);
								if(target_left < goal_left){
									console.log("goal 1!");
									if(div2_first_run){
										console.log("goal 2!");
										div2_first_run = false;
										animatediv1(target1, target2);
									};
								};
							},	
							complete: function(){
								console.log("ani2 complete!");
								reset_div(target2);
								div2_first_run = true;
								console.log($(target2).css("left"));
								}
							});
					}



				}**/

				function initiatepage(content1, content2, imagelist){
					reset_div(content1);
					reset_div(content2);
					var widthcheck = checkwidth(content1);

					do {
						looping(content1, imagelist);
						widthcheck = checkwidth(content1);
					} while (widthcheck == true);

					var widthcheck2 = checkwidth(content2);
				
					var div1content = $(content1).children();
					console.log("1st div content: "+div1content);
					console.log("1st div length: "+div1content.length);
					var lengthdiff = imagelist.length - div1content.length;

					for (var i = 0; i < lengthdiff; i++) {
						looping(content2, imagelist);
					};

					apply_animations(content1, content2);

					/**setInterval(function(){
						console.log(ani_interval);
						apply_animations(content1, content2);
						}
						, 12000);**/
					}
			});
});
}(jQuery));				
