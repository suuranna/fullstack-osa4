const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes).reduce((p, c) => p + c, 0)
    return likes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return NaN
    }
    const likes = blogs.map(blog => blog.likes)
    const max = Math.max(...likes)
    var blog = {}

    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes === max) {
            blog = blogs[i]
        }
    }
    return blog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}
