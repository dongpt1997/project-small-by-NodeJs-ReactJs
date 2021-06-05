const express = require('express')
const verifyToken = require('../middleware/auth')
const router = express.Router()

const Post = require('../models/Post')

router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body
    console.log(title);
    if (!title) return res.status(400).json({ success: false, message: 'Khong de trong title' })

    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('http://') ? url : `http://${url}`,
            status: status || 'To Learn',
            user: req.userId
        })
        console.log(newPost);
        await newPost.save()
        return res.json({ success: true, message: 'Happy learning', post: newPost })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'internal server fail' })
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {

        const posts = await Post.find({ user: req.userId }).populate('user', ['username'])
        res.json({ success: true, posts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'internal server fail' })
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body
    if (!title) return res.status(400).json({ success: false, message: 'Khong de trong title' })

    try {
        let updatePost = {
            title,
            description: description || '',
            url: (url.startsWith('http://') ? url : `http://${url}`) || '',
            status: status || 'To Learn',
        }
        const postUpdateCondition = { _id: req.params.id, user: req.userId }

        updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatePost, { new: true })

        //check
        if (!updatePost)
            return res.status(401).json({ success: false, message: 'khong the update' })
        res.json({ success: true, message: 'update thanh cong', updatePost })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'internal server fail' })
    }
})

//delete post
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id, user: req.userId }
        const deletePost = await Post.findOneAndDelete(postDeleteCondition)

        if (!deletePost)
            return res.status(401).json({ success: false, message: 'khong the delete' })

        res.json({ success: true, message: 'delete thanh cong', post: deletePost })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'internal server fail' })
    }
})
module.exports = router