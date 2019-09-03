import { Story, notes, configs } from '../src/lib/story'
import createStar from '../components/html/rating'

const ratingStory = new Story('Rating').addMetas([configs()])

ratingStory.addChapter(
  'Horizontal rating',
  story => {
    createStar(story, "1200px", "600px", 4, 5, {
      "direction": "row",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('Horizontal rating showing stars horizontally')
  ]
)

ratingStory.addChapter(
  'Vertical rating',
  story => {
    createStar(story, "1200px", "600px", 4, 5, {
      "direction": "column",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('Vertical rating showing stars vertically')
  ]
)

ratingStory.addChapter(
  'Horizontal fractional rating',
  story => {
    createStar(story, "1200px", "600px", 4.69, 5, {
      "direction": "row",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('Horizontal rating showing stars horizontally rating in fraction')
  ]
)

ratingStory.addChapter(
  'Vertical fractional rating',
  story => {
    createStar(story, "1200px", "600px", 4.69, 5, {
      "direction": "column",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('Vertical rating showing stars vertically rating in fraction')
  ]
)

ratingStory.addChapter(
  'width and height in percentage',
  story => {
    createStar(story, "1200%", "600px", 4, 5, {
      "direction": "row",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('Horizontal rating showing stars horizontally where width is in %')
  ]
)

ratingStory.addChapter(
  'Justify Content streach testing',
  story => {
    createStar(story, "1200px", "100px", 4, 5, {
      "direction": "row",
      "justify-content": "streach",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('Horizontal rating showing stars automatic adjust space between stars')
  ]
)


ratingStory.addChapter(
  'Justify Content center testing',
  story => {
    createStar(story, "1200px", "100px", 4, 5, {
      "direction": "row",
      "justify-content": "center",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('Horizontal rating showing stars center with required space only')
  ]
)

ratingStory.addChapter(
  'large stroke-width testing',
  story => {
    createStar(story, "1200px", "600px", 4, 5, {
      "direction": "row",
      "stroke-width": "400px",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('It should write error on console for large stroke width value')
  ]
)


ratingStory.addChapter(
  'simple stroke-width',
  story => {
    createStar(story, "1200px", "600px", 4, 5, {
      "direction": "row",
      "stroke-width": "10px",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('It should show the rating stars with strokes of 10px')
  ]
)

ratingStory.addChapter(
  'stroke-width with fractional rating',
  story => {
    createStar(story, "1200px", "600px", 4.5, 5, {
      "direction": "row",
      "stroke-width": "10px",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('It should show the strokes but with a warning')
  ]
)

ratingStory.addChapter(
  'User may put garbages anywhere',
  story => {
    createStar(story, "random", "600px", 4.5, 5, {
      "direction": "row",
      "stroke-width": "10px",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('Error messages on breacking rules')
  ]
)

ratingStory.addChapter(
  'direction missing',
  story => {
    createStar(story, "1200px", "600px", 4.5, 5, {
      "stroke-width": "10px",
      "rated": {
          "fill": "#ff0",
          "stroke": "#000"
      },
      "nonrated": {
          "fill": "#ddd",
          "stroke": "#f00"
      }
    })
  },
  [
    notes('It should show an error message telling direction must be row or column')
  ]
)

ratingStory.addChapter(
  'auto styling on missing styling attributes',
  story => {
    createStar(story, "1200px", "600px", 4.5, 5, {
      "direction": "row"
    })
  },
  [
    notes('It should be colored as per defaults')
  ]
)

ratingStory.addChapter(
  'auto styling on missing nonrated field',
  story => {
    createStar(story, "1200px", "600px", 4.5, 5, {
      "direction": "row",
      "rated": {
        "fill": "#f00"
      }
    })
  },
  [
    notes('It should be colored as per defaults')
  ]
)

ratingStory.addChapter(
  'Error on garbage or no value of dom element',
  story => {
    createStar("story", "1200px", "600px", 4.5, 5, {
      "direction": "row",
      "rated": {
        "fill": "#f00"
      }
    })
  },
  [
    notes('It should show error on garbage or no value of dom element')
  ]
)

ratingStory.addChapter(
  'Error on garbage or missing rating value',
  story => {
    createStar(story, "1200px", "600px", undefined, 5, {
      "direction": "row",
      "rated": {
        "fill": "#f00"
      }
    })
  },
  [
    notes('It should show error on missing or garbage value of rating')
  ]
)


ratingStory.addChapter(
  'Error on rating gt no of stars',
  story => {
    createStar(story, "1200px", "600px", 7.8, 5, {
      "direction": "row",
      "rated": {
        "fill": "#f00"
      }
    })
  },
  [
    notes('It should show error on value of rating greater than no of stars')
  ]
)

ratingStory.addChapter(
  'Error on garbage or missing no of stars',
  story => {
    createStar(story, "1200px", "600px", 4.5, undefined, {
      "direction": "row",
      "rated": {
        "fill": "#f00"
      }
    })
  },
  [
    notes('It should show error on missing or garbage value of no of stars')
  ]
)

ratingStory.addChapter(
  'variable no of stars',
  story => {
    createStar(story, "1200px", "100px", 4.5, 10, {
      "direction": "row",
      "stroke-width": "5px",
      "rated":{
        "fill": "#000",
        "stroke": "#f00"
      },
      "nonrated": {
        "stroke": "#aaa"
      }
    })
  },
  [
    notes('It should show required no of stars')
  ]
)
//Not implemented completely
ratingStory.addChapter(
  'large no of stars ',
  story => {
    createStar(story, "1200", "600", 4.5, 10, {
      "direction": "column",
      "rated":{
        "fill": "#000"
      }
    })
  },
  [
    notes('It should show an error')
  ]
)
export default ratingStory
