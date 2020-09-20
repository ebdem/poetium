const moment = require('moment')

module.exports = {
    pagination: (options) => {
        let outputHTML = '';
        if (options.hash.current === 1) {
            outputHTML += `<a class=" disabled">&laquo;</a>`

        }else{
            outputHTML += `<a href="?page=" >&laquo;</a>`

        }

        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 3 : 1)

        if (i !== 1) {
            outputHTML += `<a class="disabled " href="?page=${options.hash.pages}">...</a>`

        }

        for (; i <= (Number(options.hash.current) + 3 ) && i <= options.hash.pages; i++){
            if (i === options.hash.current) {
                outputHTML += `<a class="active">${i}</a>`

            }
            else {
                outputHTML += `<a  href="?page=${i}">${i}</a>`
            }

            if (i === Number(options.hash.current) + 3 && i < options.hash.pages) {
                outputHTML += `<a class="disabled " >...</a>`

            }

        }
        if (options.hash.current === options.hash.pages) {
            outputHTML += `<a class="disabled">&raquo;</a>`

        }
        else {
            outputHTML += `<a href="?page=${options.hash.pages}">&raquo;</a>`

        }



        return outputHTML



    }
}
