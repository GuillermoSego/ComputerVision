#target photoshop

// Configuración para evitar preguntas sobre el perfil de color
app.displayDialogs = DialogModes.NO;
preferences.rulerUnits = Units.PIXELS;

var inputFolder = Folder.selectDialog("Selecciona la carpeta con las imágenes");
var outputFolder = Folder.selectDialog("Selecciona la carpeta de salida");

if (inputFolder != null && outputFolder != null) {
    var files = inputFolder.getFiles(/\.(jpg|jpeg|png)$/i);

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var doc = open(file);

        // Asignar perfil de color automáticamente
        doc.convertProfile('sRGB IEC61966-2.1', Intent.PERCEPTUAL, true, true);

        // Aplicar la acción "Eliminar fondo" del conjunto "Acciones por defecto"
        app.doAction("Eliminar fondo", "Acciones por defecto");

        // Crear una nueva capa debajo de la capa actual y rellenar con negro
        var blackColor = new SolidColor();
        blackColor.rgb.red = 0;
        blackColor.rgb.green = 0;
        blackColor.rgb.blue = 0;

        var newLayer = doc.artLayers.add();
        newLayer.name = "Fondo Negro";
        doc.activeLayer = newLayer;
        doc.selection.selectAll();
        doc.selection.fill(blackColor);
        newLayer.move(doc.artLayers[doc.artLayers.length - 1], ElementPlacement.PLACEBEFORE);

        // Combinar las capas
        doc.mergeVisibleLayers();

        // Guardar la imagen en la carpeta de salida en formato JPEG con calidad ajustada
        var saveFile = new File(outputFolder + "/" + file.name.replace(/\.[^\.]+$/, '.jpg'));
        var jpegOptions = new JPEGSaveOptions();
        jpegOptions.quality = 8; // Ajustar la calidad de 0 a 12 para reducir el tamaño del archivo
        doc.saveAs(saveFile, jpegOptions, true, Extension.LOWERCASE);

        doc.close(SaveOptions.DONOTSAVECHANGES);
    }

    alert("Proceso completado!");
} else {
    alert("Se canceló la selección de carpetas.");
}
