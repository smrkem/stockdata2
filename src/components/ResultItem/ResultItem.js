import React from 'react'
import './ResultItem.css'

class ResultItem extends React.Component {

  render() {
    let item = this.props.item
    let paragraphs = item.contents.paragraphs.map((par,ind) => {
      return <p key={ind}>{ par }</p>
    })
    return (
      <div className="result-item">
        <p>
          <strong>Date: </strong>
          <span>{ item.published }</span>
          <br />
          <strong>Link: </strong>
          <span>
            <a href={ item.link } target='_blank'>{ item.link}</a>
          </span>
        </p>

        <div className={ `item-cat cat-${item.category}` }>
          <div className="cat-label">{ item.category }</div>
          <div className="cat-actions">
            <button className="spam-button"
              onClick={() => this.props.setItemCategory(item, "spam") }>
                SPAM
            </button>
            <button className="good-button"
              onClick={() => this.props.setItemCategory(item, "good") }>
                GOOD
            </button>
            <button className="trash-button"
              onClick={() => this.props.setItemCategory(item, "trash") }>
                DISCARD
            </button>
          </div>
        </div>

        <div className={(item.category != 'uncategorized' ? 'collapsed ':'') + "post-contents"}>
          <h4 className="post-title">{ item.contents.title }</h4>
          { paragraphs }
        </div>
      </div>
    )
  }
}

export default ResultItem
