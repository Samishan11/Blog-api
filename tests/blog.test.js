//  use the path of your model
const Blog = require('../models/blogModel');
const mongoose = require('mongoose');
// use the new name of the database
const url = 'mongodb://127.0.0.1:27017/Test_database';
beforeAll(async () => {
 await mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
 });
});
afterAll(async () => {
 await mongoose.connection.close();
});
describe('Blog Schema test', () => {


// // the code below is for insert testing
//  it('Add Blog and test', () => {
//  const blog = {
//  title: 'Mount Everest',
//  description: 'Top of the world',
//  catagory:'Mountain'
//  };
//  return Blog.create(blog)
//  .then((res) => {
//  expect(res.title).toEqual('Mount Everest');
//  });
//  });

// //  update blog testing 
// it('to test the update', async () => {
//  return Blog.findOneAndUpdate({_id :'62112b9ca6e144c463862d9c'}, 
// {$set : {title:'Everest'}})
// .then((res) => {
// expect(res.title).toEqual('Mount Everest');
//  })
// });

// the code below is for delete testing
it('deleting blog testing', async () => {
    const status = await Blog.deleteMany();
    expect(status.ok);
   });

 
})
