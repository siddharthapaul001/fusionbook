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
    notes('Horizontal rating showing stars horizontally')
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
    notes('Vertical rating showing stars vertically')
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
    notes('It should show the strokes but with a warning')
  ]
)

export default ratingStory
