function prepareSearchEngineContent (el) {
    let excludeTags = ["script", "style", "button"];
    let title = "";
    let description = "";

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = el;
    el = tempDiv;
    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            description += node.textContent.trim() + " ";
        } else if (node.nodeType === Node.ELEMENT_NODE && !excludeTags.includes(node.tagName.toLowerCase())) {
            if (node.tagName.toLowerCase().startsWith("h") && !description.trim()) {
                title = node.textContent.trim();
            }
            node.childNodes.forEach(child => traverse(child));
        }
    }
    traverse(el);

    if (!title) {
        title = description.substring(0, 40);
    }
    // remove extra spaces and rating characters
    title = title.replace(/★/g, "").replace(/\s+/g, " ").trim();
    description = description.replace(/★/g, "").replace(/\s+/g, " ").trim();
    return { title, description };
}
