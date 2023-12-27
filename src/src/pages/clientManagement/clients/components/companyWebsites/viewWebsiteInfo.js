import React, { Component } from 'react'

class ViewWebsiteInfo extends Component {
  state = {
    textEmpty: '--',
  }

  render() {
    const { textEmpty } = this.state
    const { websiteInformation } = this.props
    return (websiteInformation || []).map(item => (
      <React.Fragment key={item}>
        <div className="website">
          <span>
            <img src="resources/images/website.png" alt="website" />
          </span>
          <span className="websiteTitle">{!item ? textEmpty : item}</span>
        </div>
      </React.Fragment>
    ))
  }
}

export default ViewWebsiteInfo
