import { Router } from "express";
import { addComment, getComments } from '../controllers/comment.controller'
import verifyJWT from '../middlewares/auth.middleware'

const router = Router()

router.use(verifyJWT)

router.get('/addComment', addComment)

export default router