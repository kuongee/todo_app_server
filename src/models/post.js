import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
});

const Post = mongoose.model('Post', PostSchema);
export default Post;
