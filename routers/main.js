const express = require('express')

const router = express.Router()

const Post = require('../models/Post')
const Category = require('../models/Category')
const User = require('../models/User')



router.get('/',(req, res) =>{
    res.render('site/index')
})

// router.get('/admin',(req, res) =>{
//     res.render('admin/index')
// })


// router.get('/about',(req, res) =>{
//     res.render('site/about')
// })

router.get('/contact',(req, res) =>{
    res.render('site/contact')
})

router.get('/blog',(req, res) =>{
    const {kind} = req.query;

    Post.find({...(kind && {kind})}).sort({$natural:-1}).then(posts => {

        Category.aggregate([
            {
                '$lookup': {
                    'from': 'posts',
                    'localField': 'name',
                    'foreignField': 'kind',
                    'as': 'posts'
                }
            }, {
                '$project': {
                    '_id': 0,
                    'name': 1,
                    'num_of_posts': {
                        '$size': '$posts'
                    }
                }
            }, {
                '$sort': {
                    'num_of_posts': -1
                }
            }
        ]).then(categories => {

            res.render('site/blog', {posts: posts.map((post,index) => {
                    const temp = post.toObject();
                    temp.imagePosition = index % 2 === 0 ? "last": "first";
                    return temp
                }),categories:categories.map((categories) =>{
                    return categories
                })})
        })
    })



})





router.get('/not-found', (req, res)=>{
    res.render('site/not-found')
})




module.exports = router
