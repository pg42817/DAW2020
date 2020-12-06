function showImage(name, type){
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg']

    if(validImageTypes.includes(type))
        var ficheiro = '<img src="/fileStore/' + name + '" width="80%"/>'
    else 
        var ficheiro = '<p>' + name + ', ' + type + '<p>'
    
    var fileObj = $(`
        <div class="w3-row w3-margin">
            <div class="w3-col s6">
                ${ficheiro}
            </div>
            <div class="w3-col s6 w3-border">
                <p>Filename: ${name}</p>
                <p>Mimetype: ${type}</p>
            </div>
        </div>
    `)

    var download = $('<div><a href="/files/download/' + name + '">Download</a></div>')
    $('#display').empty()
    $('#display').append(fileObj,download)
    $('#display').modal()
}


function addForm(){
    $('#multi').append(
        `<div class="w3-row w3-marin-bottom">
        <div class="w3-col s3">
            <label class="w3-text-teal">Select File</label>
        </div>
        <div class="w3-col s9 w3-border">
            <input class="w3-input w3-border w3-light-grey" type="file" name="myFiles">
        </div>
    </div>`)
}