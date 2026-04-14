import exp from 'express'
export const adminApp = exp.Router()
import { UserModel } from '../models/userModel.js'
import { ArticleModel } from '../models/articleModel.js'
import { verifyToken } from '../middlewares/VerifyToken.js'

// GET all users and authors
adminApp.get('/users', verifyToken('ADMIN'), async (req, res) => {
  try {
    const usersAndAuthors = await UserModel.find(
      { role: { $in: ['USER', 'AUTHOR'] } },
      { password: 0 }
    ).lean();

    console.log(`[AdminAPI] GET /users — found ${usersAndAuthors.length} accounts`);
    res.status(200).json({ message: 'Users and authors found', payload: usersAndAuthors });
  } catch (err) {
    console.error('[AdminAPI] Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// PATCH toggle user/author active status
adminApp.patch('/user-status', verifyToken('ADMIN'), async (req, res) => {
  try {
    let { email, isUserActive } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (typeof isUserActive !== 'boolean') {
      return res.status(400).json({ message: 'isUserActive must be a boolean' });
    }

    email = email.trim().toLowerCase();

    const userOrAuthor = await UserModel.findOne({
      email,
      role: { $in: ['USER', 'AUTHOR'] }
    });

    if (!userOrAuthor) {
      return res.status(404).json({ message: 'User/Author not found' });
    }

    userOrAuthor.isUserActive = isUserActive;
    await userOrAuthor.save();

    // If the user/author is deactivated and they are an AUTHOR,
    // also deactivate all their articles
    if (!isUserActive && userOrAuthor.role === 'AUTHOR') {
      await ArticleModel.updateMany(
        { author: userOrAuthor._id },
        { $set: { isArticleActive: false } }
      );
      console.log(`[AdminAPI] Deactivated all articles for author: ${email}`);
    }

    // If the user/author is reactivated and they are an AUTHOR,
    // restore all their articles
    if (isUserActive && userOrAuthor.role === 'AUTHOR') {
      await ArticleModel.updateMany(
        { author: userOrAuthor._id },
        { $set: { isArticleActive: true } }
      );
      console.log(`[AdminAPI] Restored all articles for author: ${email}`);
    }

    console.log(`[AdminAPI] Status for ${email} set to: ${isUserActive}`);
    res.status(200).json({
      message: `User ${isUserActive ? 'activated' : 'deactivated'} successfully`,
      payload: { email: userOrAuthor.email, isUserActive: userOrAuthor.isUserActive }
    });
  } catch (err) {
    console.error('[AdminAPI] Error updating user status:', err);
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
});

// DELETE permanently remove a user/author and their articles
adminApp.delete('/user-delete', verifyToken('ADMIN'), async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    email = email.trim().toLowerCase();

    const userOrAuthor = await UserModel.findOne({
      email,
      role: { $in: ['USER', 'AUTHOR'] }
    });

    if (!userOrAuthor) {
      return res.status(404).json({ message: 'User/Author not found' });
    }

    // If author, delete all their articles first
    if (userOrAuthor.role === 'AUTHOR') {
      const result = await ArticleModel.deleteMany({ author: userOrAuthor._id });
      console.log(`[AdminAPI] Deleted ${result.deletedCount} articles for author: ${email}`);
    }

    // Now delete the user
    await UserModel.findByIdAndDelete(userOrAuthor._id);

    console.log(`[AdminAPI] Permanently deleted user: ${email}`);
    res.status(200).json({
      message: `User ${email} permanently deleted`,
      payload: { email }
    });
  } catch (err) {
    console.error('[AdminAPI] Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});