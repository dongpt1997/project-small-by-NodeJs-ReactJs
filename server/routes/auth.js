const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user)
            return res.status(400).json({ success: false, message: 'user not found' })
        res.json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// router.get('/', (req, res) => res.send('Route User'))
//dang ky
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Vui lòng không để trống' })
    try {
        //check da ton tai user trong database chua
        const user = await User.findOne({ username })
        if (user)
            return res.status(400).json({ success: false, message: 'Tài khoản đã tồn tại' })

        //ma hoa mat khau
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({ username, password: hashedPassword })
        await newUser.save()

        //return token
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)
        return res.json({ success: true, message: 'dang ky thanh cong', accessToken })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'internal server fail' })
    }
})

//login
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' })
    try {
        //kiem tra user
        const user = await User.findOne({ username })
        if (!user)
            return res.status(400).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' })
        //kiem tra mat khau
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid)
            return res.status(400).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' })
        //return token
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)
        return res.json({ success: true, message: 'dang nhap thanh cong', accessToken })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'internal server fail' })
    }
})
module.exports = router