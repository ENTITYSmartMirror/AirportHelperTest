

/* global Module */



/* MMM-ImageSlideshow.js

 * 

 * Magic Mirror

 * Module: MMM-ImageSlideshow

 * 

 * Magic Mirror By Michael Teeuw http://michaelteeuw.nl

 * MIT Licensed.

 * 

 * Module MMM-ImageSlideshow By Adam Moses http://adammoses.com

 * MIT Licensed.

 */

 
var FirstAirport1F;

Module.register("FirstAirport-1F", {

	// Default module config.

	defaults: {

        // an array of strings, each is a path to a directory with images

        imagePaths: [ 'modules/MMM-ImageSlideshow/exampleImages' ],

        // the speed at which to switch between images, in milliseconds

		slideshowSpeed: 10 * 50,

        // if zero do nothing, otherwise set width to a pixel value

        fixedImageWidth: 0,

        // if zero do nothing, otherwise set height to a pixel value        

        fixedImageHeight: 0,

        // if true randomize image order, otherwise do alphabetical

        randomizeImageOrder: false,

        // if true combine all images in all the paths

        // if false each path with be viewed seperately in the order listed

        treatAllPathsAsOne: false,

	// if true reload the image list after each iteration

	reloadImageList: true,

        // if true, all images will be made grayscale, otherwise as they are

        makeImagesGrayscale: false,

        // list of valid file extensions, seperated by commas

        validImageFileExtensions: 'bmp,jpg,gif,png',

		// a delay timer after all images have been shown, to wait to restart (in ms)

		delayUntilRestart: 0,

		a:0,

	},

    // load function

	start: function () {
		FirstAirport1F = this;
        // add identifier to the config

        this.config.identifier = this.identifier;

        // ensure file extensions are lower case

        this.config.validImageFileExtensions = this.config.validImageFileExtensions.toLowerCase();

        // set no error

		this.errorMessage = null;

        if (this.config.imagePaths.length == 0) {

			this.errorMessage = "MMM-ImageSlideshow: Missing required parameter."

        }

        else {

            // create an empty image list

            this.imageList = [];

            // set beginning image index to -1, as it will auto increment on start

            this.imageIndex = -1;

            // ask helper function to get the image list

            console.log("MMM-ImageSlideshow sending socket notification");

            this.sendSocketNotification('IMAGESLIDESHOW_REGISTER_CONFIG', this.config);

			// do one update time to clear the html

			this.updateDom();

			// set a blank timer

			this.interval = null;

			this.loaded = false;

        }

	},

	// Define required scripts.

	getStyles: function() {

        // the css contains the make grayscale code

		return ["imageslideshow.css"];

	},    

	// the socket handler

	socketNotificationReceived: function(notification, payload) {

                console.log("MMM-ImageSlideshow recieved a socket notification: " + notification);

		// if an update was received

		if (notification === "IMAGESLIDESHOW_FILELIST") {

			// check this is for this module based on the woeid

			if (payload.identifier === this.identifier)

			{

				// extract new list

				var newImageList = payload.imageList;

				

				// check if anything has changed. return if not.

				if (newImageList.length == this.imageList.length) {

					var unchanged = true;

					for (var i = 0 ; i < newImageList.length; i++) {

						unchanged = this.imageList[i] == newImageList[i];

						if (!unchanged)

							break;

					}

					if (unchanged)

						return;

				}

				// set the image list

				this.imageList = payload.imageList;

                // if image list actually contains images

                // set loaded flag to true and update dom

                if (this.imageList.length > 0 && !this.loaded) {

                    this.loaded = true;

                    this.updateDom();

					// set the timer schedule to the slideshow speed			

					var self = this;

					this.interval = setInterval(function() {

						self.updateDom();

						}, this.config.slideshowSpeed);					

                }

			}

		}

    },    

	// Override dom generator.

	getDom: function () {

		var wrapper = document.createElement("div");

        // if an error, say so (currently no errors can occur)

        if (this.errorMessage != null) {

            wrapper.innerHTML = this.errorMessage;

        }

        // if no errors

        else {

            // if the image list has been loaded

            if (this.loaded === true) {

				// if was delayed until restart, reset index reset timer

				if (this.imageIndex == -2) {

					this.imageIndex = -1;

					clearInterval(this.interval);

					var self = this;

					this.interval = setInterval(function() {

						self.updateDom(0);

						}, this.config.slideshowSpeed);						

				}				

                // iterate the image list index

                this.imageIndex += 1;

				// set flag to show stuff

				var showSomething = true;

                // if exceeded the size of the list, go back to zero

                if (this.imageIndex == this.imageList.length) {

                                       // console.log("MMM-ImageSlideshow sending reload request");

				       // reload image list at end of iteration, if config option set

                                       if (this.config.reloadImageList) 

                                           this.sendSocketNotification('IMAGESLIDESHOW_RELOAD_FILELIST', this.config);



					// if delay after last image, set to wait

					if (this.config.delayUntilRestart > 0) {

						this.imageIndex = -2;

						wrapper.innerHTML = "&nbsp;";

						showSomething = false;

						clearInterval(this.interval);

						var self = this;

						this.interval = setInterval(function() {

							self.updateDom(0);

							}, this.config.delayUntilRestart);									

					}

					// if not reset index

					else

						this.imageIndex = 0;

				}

				if (showSomething) {

					// create the image dom bit

					var image = document.createElement("img");
					image.id="imgid";
					// if set to make grayscale, flag the class set in the .css file
					image.addEventListener("click", () => {
						console.log(" image click !!!!!");
						this.config.a=3;
						FirstAirport1F.sendNotification("BEFOREIMAGECLICK");
                                              });
					
					
					if (this.config.makeImagesGrayscale)

						image.className = "desaturate";

					// create an empty string

					var styleString = '';

					// if width or height or non-zero, add them to the style string

					if (this.config.fixedImageWidth != 0)

						styleString += 'width:' + this.config.fixedImageWidth + 'px;';

					if (this.config.fixedImageHeight != 0)

						styleString += 'height:' + this.config.fixedImageHeight + 'px;';

					// if style string has antyhing, set it

					if (styleString != '')

						image.style = styleString;

					// set the image location
					/*
					image.addEventListener("click", () => {
					  
					  console.log(" click success !");
					  this.config.a==1;
							
					}) 
					*/					
					
					if(this.config.a==0){
					image.src = this.imageList[1];
					
					}
					if(this.config.a==1){
						image.src = this.imageList[this.imageList.length-1];
						}
					if(this.config.a==2){
						image.src = this.imageList[this.imageList.length-2];
						}
					if(this.config.a==3){
						image.src = this.imageList[2];
						}
					// ad the image to the dom
					//var elem = document.getElementById("imageclick")
					
					
					wrapper.appendChild(image);					

				}

            }

            else {

                // if no data loaded yet, empty html

                wrapper.innerHTML = "&nbsp;";

            }

        }
		
        // return the dom

		return wrapper;

	},
	notificationReceived: function(notification, payload) {
		Log.info(this.name + " - received notification: " + notification);
		if(notification === "Modules All Change"){
			//console.log("this a ", this.config.a)
			this.hide()

		}
		/*
		if(notification === "BEFOREIMAGE"){
			//console.log("this a ", this.config.a)
			this.config.a=1;
		}
		if(notification === "setDefault"){
			//console.log("this a ", this.config.a)
			this.config.a=0;
		}
		if(notification === "AFTERIMAGE"){
			//console.log("this a ", this.config.a)
			this.config.a=2;
		}
		if(notification === "LOADINGBEFORE"){
			//console.log("this a ", this.config.a)
			this.config.a=3;
		}
		*/
/*
		if(notification === "LOADINGAFTER"){
			console.log("this a ", this.config.a)
			this.config.a=3;

		}
*/
	}

});