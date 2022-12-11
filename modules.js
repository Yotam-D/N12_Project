//gets Titles Array and returns html string with organized titles
const createMessage = (TitlesArray) => {
    let html = `<h1>חדשות היום:</h1> <br>`;
    TitlesArray.forEach((element,ind) => {
        html += `<a key=${ind} href=${element.href} >${element.title}</a><br></br><br></br> ` 
    }); 
    return html;
}

//remove string operators from string
const editString = (string) => {
	return string.replace(/(\r\n|\n|\r|\t)/gm, "");  
};


module.exports = {createMessage, editString};


