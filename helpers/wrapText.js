function wrapText(postBody) {
    const maxAllowedCharacter =100

    if (postBody.length > maxAllowedCharacter){
        return postBody.substring(0, maxAllowedCharacter) + "..."
    }
    return postBody
}

module.exports = { wrapText: wrapText};
