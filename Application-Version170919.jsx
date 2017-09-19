

var strtRulerUnits = app.preferences.rulerUnits; // store default ruler units
app.preferences.rulerUnits = Units.PIXELS; // change units to PIXEL



//Open a document
if (app.documents.length == 0) {


	//Initial message
	var message = "Start of the Watermark Script" + "\r\r"
	message += " 1 - Please select the output folder to store computed image" + "\r\r"
	message += " 2 - Please select the watermark image" + "\r\r"
	message += " 3 - Please select the images you want to process" + "\r\r"
	alert( message )

	//Select the outputfolder
	var outputFolder = Folder.selectDialog("Select a folder for the output files")

	//Select the Watermark Image
	alert( "Select Watermark to use" )
	var fileWater= app.openDialog();	
	if(fileWater[0]){ //if you have chosen an image
		var DefaultWatermark =fileWater[0].fsName	//get the name of the Watermarkfile
	}
	


	//Select the images to process
	alert( "Select images to process" )
	var file = app.openDialog();//opens dialog,choose one image



	//Loop to apply the processing on each images
	for (var i = 0; i<file.length; i++){
		app.load(file[i]); //load it into documents
		docRef= app.activeDocument; //prepare your image layer as active document
		//get max size before switching into percent
		var borderSize = (Math.max(app.activeDocument.height,app.activeDocument.width))
		borderSize = borderSize *10/100



		//resize
		docRef.resizeCanvas( app.activeDocument.width + borderSize,app.activeDocument.height + borderSize ) //+10%


		//Add Watermark

		var fileWatermark = app.open(new File(DefaultWatermark));

		//Prepare the Watermark File for resizing before coping it onto the Opened image.
		var backFile= app.activeDocument; //prepare your image layer as active document
		app.preferences.rulerUnits = Units.PERCENT; // change units to percent
		backFile.resizeImage(docRef.width*10,docRef.height*10); //resize image into given size i.e 640x480
		backFile.selection.selectAll();
		backFile.selection.copy(); //copy image into clipboard
		backFile.close(SaveOptions.DONOTSAVECHANGES); //close image without saving changes
		docRef.paste(); //paste selection into your document
		docRef.layers[0].name = "Watermark"; //set your layer's name


		//Resize Watermark
		app.preferences.rulerUnits = Units.PIXELS; // change units to PIXEL
		// unit as pixels for computation 
		var Layer_Width = docRef.layers[0].bounds[2]-docRef.layers[0].bounds[0]; //Grab the width
		var Layer_Height = docRef.layers[0].bounds[3]-docRef.layers[0].bounds[1]; //Grab the height

		var Coef_Height = parseInt((borderSize/2) / Layer_Height * 100)

		app.preferences.rulerUnits = Units.PERCENT; // change units to percent

		docRef.layers[0].resize(Coef_Height, Coef_Height,AnchorPosition.TOPLEFT) //should work with unit as percent /!\


		app.preferences.rulerUnits = Units.PIXELS; // change units to PIXEL
		//Creation of translation vectors

		var vecteur_x = docRef.layers[1].bounds[0] - docRef.layers[0].bounds[0] //layer 1 = "background" = original image
		var vecteur_y = docRef.layers[1].bounds[1] - docRef.layers[0].bounds[1]
		//translation
		var margin = 10
		docRef.layers[0].translate(vecteur_x + margin , vecteur_y + margin) // +10 for margin


		//Save
		jpgFile = new File( outputFolder + "/" + activeDocument.name)
		jpgSaveOptions = new JPEGSaveOptions()
		jpgSaveOptions.embedColorProfile = true
		jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE
		jpgSaveOptions.matte = MatteType.NONE
		jpgSaveOptions.quality = 12	//12 = best quality
		app.activeDocument.saveAs(jpgFile, jpgSaveOptions, true,
				Extension.LOWERCASE)

				app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); //close image without saving changes since it has already been saved
	} //End of FOR loop







}


