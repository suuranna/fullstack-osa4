const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const testhelper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(testhelper.initialBlogs[0])
    await blogObject.save()

    for (let i = 1; i < testhelper.initialBlogs.length; i++) {
        blogObject = new Blog(testhelper.initialBlogs[i])
        await blogObject.save()
    }
})

test('right amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(testhelper.initialBlogs.length)
})


test('a blog can be added ', async () => {
  const newBlog = {
    _id: '5a422aa71b54a676234d6666',
    title: 'Go To Statement Considered Harmful 2',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = await testhelper.getBlogs()
  expect(blogs).toHaveLength(testhelper.initialBlogs.length + 1)

  const blogTitles = blogs.map(blog => blog.title)
  expect(blogTitles).toContain(
    'Go To Statement Considered Harmful 2'
  )
})

test('a blog can be deleted', async () => {
    var blogs = await testhelper.getBlogs()
    var deletedBlog = blogs[0]

    await api.delete(`/api/blogs/${deletedBlog.id}`) 

    var blogsAtTheEnd = await testhelper.getBlogs()
    expect(blogsAtTheEnd).toHaveLength(testhelper.initialBlogs.length -1)
    expect(blogsAtTheEnd.map(blog => blog.title)).not.toContain(deletedBlog.title)
})

test('a not existing blog cannot be deleted', async () => {
    await api.delete(`/api/blogs/1`) 

    var blogsAtTheEnd = await testhelper.getBlogs()
    expect(blogsAtTheEnd).toHaveLength(testhelper.initialBlogs.length)
})

afterAll(() => {
    mongoose.connection.close()
})