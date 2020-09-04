const express = require('express')

const router = express.Router()
const Post = require('../models/Post')

const path = require('path')

const Category = require('../models/Category')
const User = require('../models/User')

router.get('/new',(req, res) =>{
    Category.find({}).sort({$natural:-1}).then(categories =>{
        if (req.session.userId){
            return  res.render('site/addpost',{categories:categories.map((categories => {
                    const cate = categories.toJSON();
                    return cate

                }))})
        }

        res.redirect('/users/login')
    })

})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", (req, res) =>{
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Post.find({ "title": regex }).populate({path:'author', model:User}).sort({$natural:-1}).then(posts =>{
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
}})

router.get('/:id',async (req, res) =>{

    try{
        const post = await Post.findById(req.params.id).populate({path:'author', model:User})
        //console.log("post", post)
        return res.render('site/single', {post: post.toJSON()})
    }catch(error){
       // console.log(error)
        return res.redirect("/not-found")
    }

})




router.post('/test',(req, res) =>{
    let post_image = req.files.post_image
    let auth_image = req.files.auth_image
    const postImageName = post_image.name.replace(/\s/g, "_")
    const autImage = auth_image.name.replace(/\s/g, "_")
    //console.log(postImageName)
    post_image.mv(path.resolve(__dirname,'../public/images/postimages',postImageName))
    auth_image.mv(path.resolve(__dirname,'../public/images/postimages',autImage))


    Post.create({
        ...req.body,
        post_image:`/images/postimages/${postImageName}`,
        auth_image:`/images/postimages/${autImage}`,
        author: req.session.userId
    }, )
        req.session.sessionFlash = {
            type:'alert alert-succes',
            message:'Post Başarılı Bir Şekilde Kaydedildi'
        }

    res.redirect('/blog')
})


module.exports = router
