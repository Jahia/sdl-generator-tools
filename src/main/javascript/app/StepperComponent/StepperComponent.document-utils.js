const copyToClipBoard = content => {
    const element = document.createElement('textarea');
    element.value = content;
    element.setAttribute('readonly', '');
    element.style.position = 'absolute';
    element.style.left = '-9999px';

    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
};

const downloadFile = (content, fileName) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});

    element.href = URL.createObjectURL(file);
    element.download = fileName;
    element.target = '_self';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export {
    copyToClipBoard,
    downloadFile
};
