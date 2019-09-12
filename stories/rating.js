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
    let rating = new StarRating(story, {
      "height": 400,
      "width": 400
    });
    setTimeout(function () {
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
  'StarRating with specified height and width values less than 20',
  story => {
    let rating = new StarRating(story, {
      "height": 5,
      "width": 5
    });
  },
  [
    notes('Should show an error message and set height and width to default')
  ]
)

ratingStory.addChapter(
  'Minimum value of width and height',
  story => {
    let rating = new StarRating(story, {
      "height": 20,
      "width": 20,
      "stars": 1
    });
  },
  [
    notes('Should show 1/1 star')
  ]
)

ratingStory.addChapter(
  'StarRating with specified height and width values in % and update both',
  story => {
    let rating = new StarRating(story, {
      "height": "400%",
      "width": "400%"
    });
    setTimeout(function () {
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
      "height": "400px"
    });
    setTimeout(function () {
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
    setTimeout(function () {
      rating.update({
        "rating": 4.5,
        "stars": 10
      });
    }, 3000);
  },
  [
    notes('Initially should show 5 stars visualize 2.69/5 first and after 3s 4.5/10')
  ]
)

ratingStory.addChapter(
  'rating 2.69 in default 5 stars in default height width and update rating to 4.5',
  story => {
    let rating = new StarRating(story, {
      "rating": 2.69
    });
    setTimeout(function () {
      rating.update({
        "rating": 4.5
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
    setTimeout(function () {
      rating.update({
        "stars": 20
      });
      setTimeout(function () {
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
  'vital rating update 10/10 then 15/15 always full fill when rating not provided',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "stars": 10
    });

    setTimeout(function () {
      rating.update({
        "stars": 15
      });
    }, 3000);
  },
  [
    notes('First it should visualize 10/10 rating then it should visualize 15/15 NOT 10/15')
  ]
)


//IMPORTANT
ratingStory.addChapter(
  'vital rating update 10/10 then 10/15',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "rating": "10",
      "stars": 10
    });

    setTimeout(function () {
      rating.update({
        "stars": 15
      });
    }, 3000);
  },
  [
    notes('First it should visualize 10/10 rating then it should visualize 15/15 NOT 10/15')
  ]
)

//IMPORTANT
ratingStory.addChapter(
  'vital rating update 9.6/10 then error',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "stars": 10,
      "rating": 9.6
    });

    setTimeout(function () {
      rating.update({
        "stars": 5
      });
    }, 3000);
  },
  [
    notes('First it should visualize 9.6/10 rating then it should give an error as 9.6/5 is not possible')
  ]
)

//IMPORTANT
ratingStory.addChapter(
  'vital rating update 10/10 to 5/5. It should not give error',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "stars": 10
    });

    setTimeout(function () {
      rating.update({
        "stars": 5
      });
    }, 3000);
  },
  [
    notes('First it should visualize 10/10 rating then it should visualize 5/5 rating')
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

    setTimeout(function () {
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

//CONFUSING TO USER
ratingStory.addChapter(
  'Check stroke-width attribute without style attributes',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "stroke-width": '5',
      'rating': 8.8,
      'stars': 9
    });
  },
  [
    notes('It should visualize 8.8/9 rating stroke-width: 5px with default styles i.e stroke color none(not visible) so give a warning')
  ]
)

ratingStory.addChapter(
  'Check stroke-with attribute with style attributes',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "stroke-width": '5',
      "ratedStroke": "#000",
      "nonratedStroke": "#ff0"
    });
  },
  [
    notes('It should visualize 5/5 rating stroke-width: 5px with combined-styles as-> rated: yellow-black, nonrated: grey-red')
  ]
)

ratingStory.addChapter(
  'Check large stroke-with',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "stroke-width": '100',
      "ratedStroke": "#000",
      "nonratedStroke": "#ff0"
    });
  },
  [
    notes('It should visualize 5/5 rating without strokes but raise a error as stroke-with is not managable')
  ]
)

ratingStory.addChapter(
  'Check stroke-width in negative',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "stroke-width": -5,
      "ratedFill": "#ff0",
      "ratedStroke": "#000",
      "nonratedFill": "#fff",
      "nonratedStroke": "#ff0"
    });
  },
  [
    notes('It should visualize 5/5 rating skipping stroke-width: -5 and raise an error notifying nagative stroke width')
  ]
)

//IMPORTANT
ratingStory.addChapter(
  'On update prevention check other attributes changes',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "ratedFill": "#f00",
      "ratedStroke": "#000",
      "nonratedFill": "#ddd",
      "nonratedStroke": "#ff0"
    });

    setTimeout(function () {
      rating.update({
        "rating": 10.2,
        "stars": 5,
        "ratedFill": "#000",
        "ratedStroke": "#f00",
        "nonratedFill": "#ddd",
        "nonratedStroke": "#ff0"
      });

      setTimeout(function () {
        rating.update({
          "rating": 3,
          "stars": 5
        })
      }, 3000);
    }, 3000);
  },
  [
    notes('First it should visualize 5/5 rating then raise error after 3s but do not update other attributes and rollback to prevous. In next update after 6s it should take fill and stroke from creation i.e. rated: red-black nonrated:grey-yellow')
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
    let rating = new StarRating(story, {
      "stars": "garbage"
    });
  },
  [
    notes('Should show error notifying no of stars must be numeric value but execute with default rating 5/5 inside default svg size')
  ]
)

ratingStory.addChapter(
  'Only number of stars is given',
  story => {
    let rating = new StarRating(story, {
      "stars": 10
    });
  },
  [
    notes('Should visualize 10/10 rating')
  ]
)

ratingStory.addChapter(
  'StarRating orientation initially left-to-right then updating to right-to-left',
  story => {
    let rating = new StarRating(story, {
      "width": 1200,
      "height": 600,
      "rating": 4.5,
      "stars": 5,
      "orientation": "left-to-right"
    });
    setTimeout(function () {
      rating.update({
        "orientation": "right-to-left"
      });
    }, 3000);
  },
  [
    notes('Initially should visualize 4.5/5 horizontally and orientation should be left-to-right after 3s orientation should be right-to-left')
  ]
)

ratingStory.addChapter(
  'StarRating orientation bottom-to-top',
  story => {
    let rating = new StarRating(story, {
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
  'StarRating orientation top-to-bottom alignItems start',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "orientation": "top-to-bottom",
      "alignItems": "start"
    });
  },
  [
    notes('Should visualize 4.5/5 vertically and fill flow should be top to bottom rating should be left align')
  ]
)


ratingStory.addChapter(
  'StarRating orientation top-to-bottom alignItems end then updating to R2L-end and then R2L-start',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "orientation": "top-to-bottom",
      "alignItems": "end"
    });

    setTimeout(function () {
      rating.update({
        "orientation": "right-to-left",
        "alignItems": "end"
      });

      setTimeout(function () {
        rating.update({
          "orientation": "right-to-left",
          "alignItems": "start"
        })
      }, 3000);
    }, 3000);
  },
  [
    notes('Should visualize 4.5/5 vertically and fill flow should be top to bottom rating should be right align after 3s it should be horizontal and bottom align after 6s horizontal top align')
  ]
)

// ratingStory.addChapter(
//   'StarRating with empty styles inside rated and unrated',
//   story => {
//     let rating = new StarRating(story, {
//       "rating": 4.5,
//       "rated": {

//       },
//       "nonrated": {

//       }
//     });
//   },
//   [
//     notes('Should visualize 4.5/5 with default')
//   ]
// )

ratingStory.addChapter(
  'StarRating fill red hex code',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "ratedFill": "#f00"
    });
  },
  [
    notes('Should visualize 4.5/5 with rated fill color red')
  ]
)

ratingStory.addChapter(
  'Rated fill in RGB',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "ratedFill": "rgb(255,0,0)"
    });
  },
  [
    notes('Rated fill of rating 4.5/5 should have rated fill color red')
  ]
)

ratingStory.addChapter(
  'Rated fill in RGB garbage and then update to string blue',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "ratedFill": "rgb(xyz,0,0)"
    });
    setTimeout(function () {
      rating.update({
        "ratedFill": "blue"
      });
    }, 3000);
  },
  [
    notes('Rated fill of rating 4.5/5 should have rated fill color red and after 3s fill blue')
  ]
)

ratingStory.addChapter(
  'Nonrated fill color',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "nonratedFill": "#00f"
    });
  },
  [
    notes('Should visualize 4.5/5 with default fill color for rated but nonrated fill is blue')
  ]
)

ratingStory.addChapter(
  'Justify content space-evenly',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "space-evenly",
      "height": 100,
      "width": 1200
    });
  },
  [
    notes('Should visualize 5/5 rating stars strethed to whole width with defaults')
  ]
)

ratingStory.addChapter(
  'Justify content center',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "center",
      "height": 100,
      "width": 1200
    });
  },
  [
    notes('Should visualize 5/5 rating stars at center of whole width with defaults')
  ]
)

ratingStory.addChapter(
  'Justify content start',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "start",
      "height": 100,
      "width": 1200
    });
  },
  [
    notes('Should visualize 5/5 rating from left')
  ]
)

ratingStory.addChapter(
  'Justify content end',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "end",
      "height": 100,
      "width": 1200
    });
  },
  [
    notes('Should visualize 5/5 rating at right side')
  ]
)

ratingStory.addChapter(
  'Justify content space-evenly with orientation bottom-to-top',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "space-evenly",
      "orientation": "bottom-to-top",
      "height": 1200,
      "width": 100
    });
  },
  [
    notes('Should visualize 5/5 rating taking the whole width and fill flow from bottom')
  ]
)

ratingStory.addChapter(
  'Justify content end with orientation top-to-bottom',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "end",
      "orientation": "top-to-bottom",
      "height": 1200,
      "width": 100
    });
  },
  [
    notes('Should visualize 5/5 rating vertically but alignment from bottom')
  ]
)

ratingStory.addChapter(
  'padding of 5',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "center",
      "height": 100,
      "width": 1200,
      "padding": 5
    });
  },
  [
    notes('Should visualize 5/5 rating at center horizontally with padding 5')
  ]
)

ratingStory.addChapter(
  'padding < 1 or negative',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "center",
      "height": 100,
      "width": 1200,
      "padding": 0
    });
  },
  [
    notes('Should visualize 5/5 rating taking default padding 2 and raise an error')
  ]
)


ratingStory.addChapter(
  'large padding',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "center",
      "height": 100,
      "width": 1200,
      "padding": 100
    });
  },
  [
    notes('Should visualize 5/5 rating taking default padding 2 and raise error notifying non-managable padding')
  ]
)

//THE COMPLETE ONE
ratingStory.addChapter(
  'All attributes are provided and valid',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "space-evenly",
      "orientation": "top-to-bottom",
      "alignItems": "center",
      "height": 1200,
      "width": 100,
      "padding": 4,
      "stroke-width": 5,
      "ratedFill": "#f00",
      "ratedStroke": "#000",
      "nonratedFill": "#00f",
      "nonratedStroke": "#f00",
      "rating": 8.6,
      "stars": 10
    });
  },
  [
    notes('Should visualize 8.6/10 rating vertically with exenly spaced')
  ]
)

//THE COMPLETE TWO
ratingStory.addChapter(
  'Check prettyness when stroke width and padding is at highest limit',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "space-evenly",
      "orientation": "top-to-bottom",
      "alignItems": "end",
      "height": 1200,
      "width": 100,
      "padding": 10,
      "stroke-width": 10,
      "ratedFill": "#f00",
      "ratedStroke": "#000",
      "nonratedFill": "#00f",
      "nonratedStroke": "#f00",
      "rating": 8.6,
      "stars": 10
    });
  },
  [
    notes('Should visualize 8.6/10 rating vertically with evenly spaced. Though align items end but should not have effect')
  ]
)

//THE COMPLETE garbage
ratingStory.addChapter(
  'Check all garbage values except rating and stars',
  story => {
    let rating = new StarRating(story, {
      "justifyContent": "garbage",
      "orientation": "garbage",
      "alignItems": "garbage",
      "height": "garbage",
      "width": "garbage",
      "padding": "garbage",
      "stroke-width": "ddd",
      "ratedFill": "#garbage",
      "ratedStroke": "#garbage",
      "nonratedFill": "#garbage",
      "nonratedStroke": "#garbage",
      "rating": 1.45,
      "stars": 3
    });
  },
  [
    notes('Should visualize 1.45/3 with all defaults')
  ]
)

ratingStory.addChapter(
  'Padding / stroke should be reset to default',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "stars": 5,
      "stroke-width": 5,
      "padding": 5,
      "ratedStroke": "#000",
      "nonratedStroke": "#aaa"
    });
    setTimeout(function () {
      rating.update({
        "height": 400,
        "width": 100
      });
    }, 3000);
  },
  [
    notes('Should visualize two cases but for update it should remove stroke / padding')
  ]
)

//STRESS TESTING
ratingStory.addChapter(
  'Stress Testing',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "stars": 5
    }),
      T = 1, startTime = ((new Date()).getTime() * 1), time = 0;
    while (time < 100) {
      rating.update({
        "rating": (4.5 + T) % 5,
        "stars": 5
      });
      time = ((new Date()).getTime() * 1) - startTime;
      T++;
    }
    console.log(T + ' tests in ' + time + 'ms');
  },
  [
    notes('Should visualize rating update and log no of tests done in 100ms')
  ]
)

//STRESS TESTING
ratingStory.addChapter(
  'Stress Testing on layout update',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "stars": 5
    }),
      T = 1, startTime = ((new Date()).getTime() * 1), time = 0;
    while (time < 100) {
      rating.update({
        "width": 400 + T * 100,
        "rating": 4.5 + T,
        "stars": 5 + T,
      });
      time = ((new Date()).getTime() * 1) - startTime;
      T++;
    }
    console.log(T + ' tests in ' + time + 'ms');
  },
  [
    notes('Should visualize rating update and log no of tests done in 100ms')
  ]
)

//TESTS FOR ASYNC
ratingStory.addChapter(
  'callback testing',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "stars": 5
    });


    rating.onUpdate = function (currentConfig) {
      console.log(currentConfig);
    }

    rating.onDraw = function () {
      console.log('Drawing :)');
    }

    setTimeout(function () {
      rating.update({
        "rating": 4.78,
        "stars": 5
      });
    }, 3000);
  },
  [
    notes('Should visualize 4.5/5, log Drawing :) and after 3s it should log current config and then Drawing :)')
  ]
)

ratingStory.addChapter(
  'garbage in callback testing',
  story => {
    let rating = new StarRating(story, {
      "rating": 4.5,
      "stars": 5
    });


    rating.onUpdate = [];

    rating.onDraw = { "garbage": 0 }

    rating.update({
      "rating": 4.5,
      "stars": 5
    });
  },
  [
    notes('Should show an error message and visualize 4.5/5')
  ]
)


ratingStory.addChapter(
  'update rating from server SSE',
  story => {
    let timeElapsed = 0, startTime = (new Date() * 1), updateCalled = 0, drawCalled = 0,
      rating = new StarRating(story, {
        "rating": 4.5,
        "stars": 5
      });

    rating.onUpdate = function (currentConfig) {
      updateCalled++;
    }

    rating.onDraw = function () {
      drawCalled++;
    }

    var source = new EventSource('http://192.168.2.71:3000/teststarrating');
    source.onmessage = function (msg) {
      if (msg.data < 0) {
        //end
        timeElapsed = (new Date() * 1) - startTime;
        console.log('Completed in ' + timeElapsed + 'ms. _draw() called: ' + drawCalled + 'times. update() called: ' + updateCalled + ' times');
        source.close();
      } else {
        rating.update({
          "rating": msg.data,
        });
      }
    }

  },
  [
    notes('Should show an error message and visualize 4.5/5')
  ]
)

export default ratingStory
