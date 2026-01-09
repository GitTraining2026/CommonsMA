imageUpload =
{
    dialogOpen: false,
    onFileChanged: function () {},
    element: null,
   initializeWidget : function(parentNode, widgetModel)
    {
        parentNode.innerHTML = "<input id=\"hidden-file\" type=\"file\">";
        function encodeImageFileAsURL(element) {
            var file = element.srcElement.files[0];
            var reader = new FileReader();
            reader.onloadend = function() {
              imageUpload.onFileChanged(reader.result);
              kony.print(reader.result);
            }
            reader.readAsDataURL(file);
          }
        
        imageUpload.fileElement = document.getElementById("hidden-file");
        imageUpload.fileElement.addEventListener(
            'change',
            encodeImageFileAsURL.bind(this),
            false
         );
    },
    modelChange : function(widgetModel, propertyChanged, propertyValue)
    {
		if (propertyChanged === "onBase64GeneratedListener") {
            onFileChanged = propertyValue;
        }
        if (propertyChanged === "openDialog" && propertyValue === true) {
            imageUpload.fileElement.click();
        }
    },

	
}