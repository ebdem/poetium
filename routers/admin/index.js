const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')
const Post = require('../../models/Post')
const path = require('path')


router.get('/',(req, res) => {
    res.render('admin/index')
})

router.get('/categories',(req, res) => {

    Category.find({}).sort({$natural:-1}).then(categories => {
        // console.log(categories)
        res.render('admin/categories', {categories:categories.map((categories,index) =>{
            const cat = categories.toJSON()
                return cat
            })})
    })
})

router.post('/categories',(req, res) => {
     Category.create(req.body,(error, category) =>{
         if (!error) {
             res.redirect('categories')

         }
     })
})

router.delete('/categories/:id',(req, res) => {

        Category.remove({_id : req.params.id}).then(() => {
            res.redirect('/admin/categories')
        })
})

router.get('/posts',(req, res) => {

    const {kind} = req.query;

    Post.find({...(kind && {kind})}).sort({$natural:-1}).then(posts => {

        Category.find({}).sort({$natural:-1}).then(categories => {
            res.render('admin/posts', {posts: posts.map((post,index) => {
                    const temp = post.toObject();
                    //temp.imagePosition = index % 2 === 0 ? "last": "first";
                    return temp
                }),categories:categories.map((categories) =>{
                    const cate = categories.toJSON();
                    return cate
                })})
        })
    })



})

router.delete('/posts/:id',(req, res) => {

    Post.remove({_id : req.params.id}).then(() => {
        res.redirect('/admin/posts')
    })
})


router.get('/posts/edit/:id',(req, res) => {

    Post.findOne({_id: req.params.id}).then(post => {
        Category.find({}).then(categories =>{
            res.render('admin/editpost',{post:post.toJSON(),
            categories:categories.map((categories) =>{
                const cate = categories.toJSON();
                return cate

            })})
        })
    })
})

router.put('/posts/:id', (req, res) =>{
    let post_image = req.files.post_image
    let auth_image = req.files.auth_image
    const postImageName = post_image.name.replace(/\s/g, "_")
    const autImage = auth_image.name.replace(/\s/g, "_")
    //console.log(postImageName)
    post_image.mv(path.resolve(__dirname,'../../public/images/postimages',postImageName))
    auth_image.mv(path.resolve(__dirname,'../../public/images/postimages',autImage))

    Post.findOne({_id: req.params.id}).then(post =>{
        post.title = req.body.title
        post.content = req.body.content
        post.date = req.body.date
        post.kind = req.body.kind
        post.post_image = `/images/postimages/${postImageName}`
        post.auth = req.body.auth
        post.author_des = req.body.author_des


        post.save().then(post =>{
            res.redirect('/admin/posts')
        })
    })
})

module.exports = router
