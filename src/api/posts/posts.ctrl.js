import Post from '../../models/post';

export const list = (req, res) => {
  Post.find()
    .exec()
    .then(posts => {
      res.send(posts);
    })
    .catch(() => {
      res.send(500);
    });
};

export const write = (req, res) => {
  const { title, body } = req.body;
  const post = new Post({
    title,
    body,
  });

  post
    .save()
    .then(() => {
      res.send(post);
    })
    .catch(() => {
      res.send(500);
    });
};
