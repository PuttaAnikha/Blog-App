import exp from 'express'
import { verifyToken } from '../middlewares/VerifyToken.js'
import { ArticleModel } from '../models/articleModel.js'
export const userApp=exp.Router()

//read articles of all the authors
userApp.get("/articles", verifyToken("USER", "AUTHOR"), async (req, res) => {
  //read articles
  const articleList = await ArticleModel.find({ isArticleActive: true }).populate("author", "firstName lastName profileImageUrl");
  //send res
  res.status(200).json({ message: "articles", payload: articleList });
});

//read single article by id
userApp.get("/article/:id", verifyToken("USER", "AUTHOR"), async (req, res) => {
  const { id } = req.params;
  const article = await ArticleModel.findOne({ _id: id })
    .populate("author", "firstName lastName email profileImageUrl")
    .populate("comments.user", "firstName lastName email profileImageUrl");
  
  if (!article) {
    return res.status(404).json({ message: "article not found", error: "Article not found" });
  }
  res.status(200).json({ message: "article", payload: article });
});

//add comment to an article

userApp.put("/articles", verifyToken("USER", "AUTHOR"), async (req, res) => {
   //get body from req
   const {articleId,comment}=req.body
   //check article is present
   const articleDocument=await ArticleModel.findOne({_id:articleId,isArticleActive:true})
   //if article not found
   if(!articleDocument){
      return res.status(404).json({message:"article not found", error: "Article not found"})
   }
   //if object found get user id
   const userId=req.user?.id;
   //add comment to comments array of articleDocument
   articleDocument.comments.push({user:userId,comment:comment})
   //save the document
   await articleDocument.save()
   
   // Re-populate and send
   const updatedArticle = await ArticleModel.findById(articleId)
    .populate("author", "firstName lastName email profileImageUrl")
    .populate("comments.user", "firstName lastName email profileImageUrl");

   //send response
   res.status(200).json({message:"comment added successfully",payload:updatedArticle})
})
