function categoryId(postBody) {
    const maxAllowedCharacter =8

    if (postBody.length > maxAllowedCharacter){
        return postBody.substring(0, maxAllowedCharacter) + "..."
    }
    return postBody
}

module.exports = { categoryId: categoryId};
