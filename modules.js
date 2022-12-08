//gets Titles Array and returns html with the Titles organized
const createMessage = (TitlesArray) => {
    let html = ``;
    // console.log(TitlesArray);
    TitlesArray.forEach((element,ind) => {
        console.log(element);
        html += `<h2 key=${ind}>${element}</h2><br></br> ` 
    }); 
    console.log(html);
    return html;
}

const editString = (string) => {
	return string.replace(/(\r\n|\n|\r|\t)/gm, "");  //remove string operations
};


module.exports = {createMessage, editString};


