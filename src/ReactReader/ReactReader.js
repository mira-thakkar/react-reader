import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Swipeable from 'react-swipeable'
import {EpubView} from '..'
import defaultStyles from './style'

class TocItem extends PureComponent {
  setLocation = () => {
    this.props.setLocation(this.props.href)
  }
  render () {
    const {label, styles} = this.props
    return (
      <button onClick={this.setLocation} style={styles}>{label}</button>
    )
  }
}

TocItem.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  setLocation: PropTypes.func,
  styles: PropTypes.object
}

class ReactReader extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      expanedToc: false,
      toc: false
    }
  }
  toggleToc = () => {
    this.setState({
      expanedToc: !this.state.expanedToc
    })
  }

  next = () => {
    this.refs.reader.nextPage()
  }

  prev = () => {
    this.refs.reader.prevPage()
  }

  onTocChange = (toc) => {
    const {tocChanged} = this.props
    this.setState({
      toc: toc
    }, () => tocChanged && tocChanged(toc))
  }

  renderToc () {
    const {toc} = this.state
    const {styles} = this.props
    return (
      <div style={styles.tocArea}>
        <div style={styles.toc}>
          {toc.map((item, i) =>
            <TocItem key={item.href} {...item} setLocation={this.setLocation} styles={styles.tocAreaButton} />
          )}
        </div>
      </div>
    )
  }

  setLocation = (loc) => {
    const {locationChanged} = this.props
    this.setState({
    }, () => locationChanged && locationChanged(loc))
  }

  renderTocToggle () {
    const {expanedToc} = this.state
    const {styles} = this.props
    return (
      <button style={Object.assign({}, styles.tocButton, expanedToc ? styles.tocButtonExpaned : {})} onClick={this.toggleToc}>
        <span style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop)} />
        <span style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom)} />
      </button>
    )
  }

  render () {
    const {url, title, showToc, loadingView, epubOptions, styles, getRendition, locationChanged, location, swipeable} = this.props
    const {toc, expanedToc} = this.state
    return (
      <div style={styles.container}>
        <div style={Object.assign({}, styles.readerArea, expanedToc ? styles.containerExpaned : {})}>
          {showToc && this.renderTocToggle()}
          <div style={styles.titleArea}>{title}</div>
          <Swipeable
            onSwipedRight={this.prev}
            onSwipedLeft={this.next}
            trackMouse
          >
            <div style={styles.reader}>
              <EpubView
                ref='reader'
                url={url}
                location={location}
                loadingView={loadingView}
                tocChanged={this.onTocChange}
                locationChanged={locationChanged}
                epubOptions={epubOptions}
                getRendition={getRendition}
              />
              {swipeable && <div style={styles.swipeWrapper} />}
            </div>
          </Swipeable>
          <button style={Object.assign({}, styles.arrow, styles.prev)} onClick={this.prev}>‹</button>
          <button style={Object.assign({}, styles.arrow, styles.next)} onClick={this.next}>›</button>
        </div>
        {showToc && toc && this.renderToc()}
      </div>
    )
  }
}

ReactReader.defaultProps = {
  loadingView: <div style={defaultStyles.loadingView}>Loading…</div>,
  locationChanged: null,
  tocChanged: null,
  showToc: true,
  styles: defaultStyles
}

ReactReader.propTypes = {
  title: PropTypes.string,
  loadingView: PropTypes.element,
  url: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(ArrayBuffer)
  ]),
  showToc: PropTypes.bool,
  location: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object,
  epubOptions: PropTypes.object,
  getRendition: PropTypes.func,
  swipeable: PropTypes.bool
}

export default ReactReader
