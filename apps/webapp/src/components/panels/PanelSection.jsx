import React from 'react';
import Style from './PanelSection.module.css';

import IconButton from 'src/components/IconButton';
import TinyDownIcon from 'src/assets/icons/tiny-down.svg';
import TinyUpIcon from 'src/assets/icons/tiny-up.svg';

class PanelSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: props.initial || false,
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    this.setState((prev, props) => {
      return { open: !prev.open };
    });
  }

  /** @override */
  componentDidUpdate() {
    if (this.state.open && this.props.disabled) {
      this.setState({ open: false });
    }
  }

  /** @override */
  render() {
    const title = this.props.title;
    const isOpen = !title || this.state.open;
    const isDisabled =
      this.props.disabled || React.Children.count(this.props.children) <= 0;
    return (
      <section
        id={this.props.id}
        className={Style.section_container + ' ' + this.props.className}
        style={this.props.style}>
        {title &&
          <IconButton
            className={Style.section_header}
            title={title}
            disabled={isDisabled}
            onClick={this.onClick}>
            {!isOpen ? <TinyDownIcon /> : <TinyUpIcon />}
          </IconButton>}
        <div
          className={
            Style.section_content_container +
            (isOpen ? ' open ' : '')
          }>
          <div className={Style.section_content}>{this.props.children}</div>
        </div>
      </section>
    );
  }
}

export default PanelSection;
