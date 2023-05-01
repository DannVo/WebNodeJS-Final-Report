exports.fileTypes = {
    '': 'Folder',
    '.doc': 'Microsoft Office Word',
    '.docx': 'Microsoft Office Word',
    '.zip': 'Compress File',
    '.rar': 'Compress RAR File',
    '.txt': 'Text Document',
    '.exe': 'Excutable File',
    '.jpg': 'JPEG Image',
    '.png': 'PNG Image',
    '.mp4': 'MP4 Video',
    '.pdf': 'PDF Document ',
    '.pptx': 'Microsoft Powerpoint',
}

exports.fileIcons = {
    '': '<i class="fa fa-folder"></i>',
    '.doc': '<i class="fas fa-file-alt"></i>',
    '.docx': '<i class="fas fa-file-alt"></i>',
    '.zip': '<i class="fas fa-file-archive"></i>',
    '.rar': '<i class="fas fa-file-archive"></i>',
    '.txt': '<i class="fas fa-file-alt"></i>',
    '.exe': '<i class="fas fa-file-code"></i>',
    '.jpg': '<i class="fas fa-file-image"></i>',
    '.png': '<i class="fas fa-file-image"></i>',
    '.mp4': '<i class="fas fa-file-video"></i>',
    '.pdf': '<i class="fas fa-file-pdf"></i> ',
    '.pptx': '<i class="fas fa-file-powerpoint"></i>',
}

exports.byte2Size = function(byte){
    const kilobyte = byte/1024
    const megabyte = byte/1024
    if(megabyte>1){
        return `${megabyte.toFixed(2)} MB`
    }else if(kilobyte>1){
        return `${kilobyte.toFixed(2)} KB`
    }else{
        return `${kilobyte.toFixed(2)} Byte`
    }
}
