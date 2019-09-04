import { Story, notes, configs } from '../src/lib/story'
import StarRating from '../components/html/rating'

const ratingStory = new Story('Rating').addMetas([configs()])

ratingStory.addChapter(
  'StarRating with all default values',
  story => {
    let rating = new StarRating(story);
  },
  [
    notes('StarRating should show the stars as per default values i.e horizontally with fillcolor yellow and without strokes. The bounding box of stars should be always square.')
  ]
)

ratingStory.addChapter(
  'StarRating without REQUIRED HTML Element',
  story => {
    let rating = new StarRating("story");
  },
  [
    notes('Error message should be shown saying missing or having garbage values for HTML Element where to append the stars')
  ]
)

ratingStory.addChapter(
  'StarRating with specified height and width values as number and update height only',
  story => {
    let rating = new StarRating(story,{
      "height": 400,
      "width": 400
    });
    setTimeout(function(){
      rating.update({
        "height": 600
      });
    }, 3000);
  },
  [
    notes('Initially should show 5 stars with svg of specified height and width and then update height only')
  ]
)

ratingStory.addChapter(
  'StarRating with specified height and width values less than 10',
  story => {
    let rating = new StarRating(story,{
      "height": 5,
      "width": 5
    });
  },
  [
    notes('Should show an error message and set height and width to default')
  ]
)

ratingStory.addChapter(
  'StarRating with specified height and width values in % and update both',
  story => {
    let rating = new StarRating(story, {
        "height": "400%", 
        "width": "400%"
      });
    setTimeout(function(){
      rating.update({
        "width": 800, 
        "height": 600
      });
    }, 3000);
  },
  [
    notes('Initially should show 5 stars with svg of specified height and width and then update height and width')
  ]
)

ratingStory.addChapter(
  'StarRating with specified height and width values in px then update width with garbage',
  story => {
    let rating = new StarRating(story, {
      "width": "400px", 
      "height":"400px"
    });
    setTimeout(function(){
      rating.update({
        "width": "garbage",
        "height": undefined
      });
    }, 3000);
  },
  [
    notes('Initially should show 5 stars with svg of specified height and width and then should show a error')
  ]
)

ratingStory.addChapter(
  'Rating using default number of stars and updating rating',
  story => {
    let rating = new StarRating(story, {
      "width": "1200", 
      "height": 600, 
      "rating": 2.69
    });
    setTimeout(function(){
      rating.update({
        "rating":4.5, 
        "stars": 10
      });
    }, 3000);
  },
  [
    notes('Initially should show 5 stars visualize 2.69/5 first and after 3s 4.5/10')
  ]
)

ratingStory.addChapter(
  'rating in default 5 stars in default height width and update',
  story => {
    let rating = new StarRating(story, {
      "rating": 2.69
    });
    setTimeout(function(){
      rating.update({
        "rating":4.5
      });
    }, 3000);
  },
  [
    notes('Initially should show 5 stars visualize 2.69/5 first and after 3s 4.5/5')
  ]
)

ratingStory.addChapter(
  'Variable number of stars and negative or garbage value in rating on update',
  story => {
    let rating = new StarRating(story, {
      "width": 1200, 
      "height": 600, 
      "rating": 7.6, 
      "stars": 8
    });
    setTimeout(function(){
      rating.update({
        "stars": 20
      });
      setTimeout(function(){
        rating.update({
          "rating": -1, 
          "stars": 20
        });
      }, 3000);
    }, 3000);
  },
  [
    notes('Initially should show 8 stars visualizing 7.6/8, after 3s no of stars should be 20 and after 6s should say error')
  ]
)

ratingStory.addChapter(
  'rating is greater than number of stars',
  story => {
    let rating = new StarRating(story, {
      "width": 1200, 
      "height": 600, 
      "rating": 12, 
      "stars": 10
    });
  },
  [
    notes('Should show error notifying rating is greater than no of stars and stop execution')
  ]
)

ratingStory.addChapter(
  'number of stars in negative',
  story => {
    let rating = new StarRating(story, {
      "width": 1200, 
      "height": 600, 
      "rating": 0, 
      "stars": -10
    });
  },
  [
    notes('Should show error notifying no of stars is negative and stop execution')
  ]
)

//IMPORTANT
ratingStory.addChapter(
  'On update prevention check other attributes changes',
  story => {
    let rating = new StarRating(story, {
      "width": 1200, 
      "height": 600, 
    });

    setTimeout(function(){
      rating.update({
        "width": 1400,
        "height": 600,
        "rating": 10.2,
        "stars": 5
      })
    }, 3000);
  },
  [
    notes('First it should visualize 5/5 rating then raise error after 3s but do not update width and height')
  ]
)

ratingStory.addChapter(
  'Checking zero rating',
  story => {
    let rating = new StarRating(story, { 
      "rating": 0 
    });
  },
  [
    notes('Should visualize 0/5')
  ]
)

ratingStory.addChapter(
  'number of stars is garbage',
  story => {
    let rating = new StarRating(story,{
      "stars":"garbage"
    });
  },
  [
    notes('Should show error notifying no of stars must be numeric value but execute with default rating 5/5 inside default svg size')
  ]
)

ratingStory.addChapter(
  'Only number of stars is given',
  story => {
    let rating = new StarRating(story,{
      "stars": 10
    });
  },
  [
    notes('Should visualize 10/10 rating')
  ]
)

ratingStory.addChapter(
  'StarRating orientation initially left-to-right then updating',
  story => {
    let rating = new StarRating(story, {
      "width": 1200, 
      "height": 600, 
      "rating": 4.5, 
      "stars": 5,
      "orientation": "left-to-right"
    });
    setTimeout(function(){
      rating.update({
        "orientation": "right-to-left"
      });
        
      setTimeout(function(){
        rating.update({
          "orientation": "garbage"
        });
      }, 3000);

    }, 3000);
  },
  [
    notes('Initially should visualize 4.5/5 horizontally and orientation should be left-to-right after 3s orientation should be right-to-left and after 6s it should show error but remain in prevous state')
  ]
)

ratingStory.addChapter(
  'StarRating orientation bottom-to-top',
  story => {
    let rating = new StarRating(story,{
      "rating": 4.5,
      "orientation": "bottom-to-top"
    });
  },
  [
    notes('Should visualize 4.5/5 vertically and fill flow should be bottom to up')
  ]
)

ratingStory.addChapter(
  'StarRating orientation top-to-bottom',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "orientation": "top-to-bottom"
    });
  },
  [
    notes('Should visualize 4.5/5 vertically and fill flow should be top to bottom')
  ]
)

ratingStory.addChapter(
  'StarRating orientation initially left-to-right then updating',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "rated": {

      },
      "nonrated": {

      }
    });
  },
  [
    notes('Should visualize 4.5/5 with default')
  ]
)
export default ratingStory
