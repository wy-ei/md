import marked from "marked";

let renderer = new marked.Renderer();

renderer.list = function (text) {
    console.log(text);
    return '<div class="list">' + text + '</div>';
}


renderer.listitem = function (text, level) {
    console.log(text);
    return '<p class="list-item">' + text + '</p>';
}


let markdownToHTML = (markdown) => {
    console.log('haha')
    return marked(markdown);
}

export default markdownToHTML;