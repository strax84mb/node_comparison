function commentToDto(comment) {
    return {
        id: comment.id,
        userId: comment.userId,
        cityId: comment.cityId,
        text: comment.text,
        updatedAt: comment.updatedAt,
        createdAt: comment.createdAt,
    };
}

module.exports = {
    commentToDto: commentToDto,
};