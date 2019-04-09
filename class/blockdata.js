const be = require('blockexplorer');

function getBlock(index) {
    be.blockIndex(index)
        .then(ret => be.block(JSON.parse(ret).blockHash))
        .then(ret => console.log(ret))
}

(function theLoop (i) {
    setTimeout(function () {
        getBlock(i);
        i++;
        if (i < 3) theLoop(i);
    }, 3000);
})(0);
