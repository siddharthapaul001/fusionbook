import { Story, notes, configs } from '../src/lib/story'
import createStar from '../components/html/rating'

const ratingStory = new Story('Rating').addMetas([configs()])

ratingStory.addChapter(
  'Horizontal rating',
  story => {
    createStar(story, "400px", "100px", 'row', {
        "fill": "#ff0",
        "stroke": "#000"
    })
  },
  [
    notes('Horizontal rating showing stars horizontally')
  ]
)

ratingStory.addChapter(
  'Vertical rating',
  story => {
    createStar(story, "400px", "100px", 'column', {
        "fill": "#ff0",
        "stroke": "#000"
    })
  },
  [
    notes('Vertical rating showing stars vertically')
  ]
)

ratingStory.addChapter(
  'width and height in percentage',
  story => {
    createStar(story, "400%", "100%", 'row', {
        "fill": "#ff0",
        "stroke": "#000"
    })
  },
  [
    notes('Horizontal rating showing stars horizontally where width is in %')
  ]
)

ratingStory.addChapter(
  'Justify Content streach testing',
  story => {
    createStar(story, "1000px", "100px", 'row', {
        "fill": "#ff0",
        "stroke": "#000",
        "justify-content": "streach"
    })
  },
  [
    notes('Horizontal rating showing stars automatic adjust space between stars')
  ]
)


ratingStory.addChapter(
  'Justify Content center testing',
  story => {
    createStar(story, "1000px", "100px", 'row', {
        "fill": "#ff0",
        "stroke": "#000",
        "justify-content": "center"
    })
  },
  [
    notes('Horizontal rating showing stars center with required space only')
  ]
)

ratingStory.addChapter(
  'stroke-width testing',
  story => {
    createStar(story, "1000px", "400px", 'row', {
        "fill": "#ff0",
        "stroke": "#000",
        "stroke-width": "80px"
    })
  },
  [
    notes('Horizontal rating showing stars horizontally where width is in %')
  ]
)

export default ratingStory
