import React from 'react';

export default class Square extends React.Component {
    render() {
      let color = 'black';
      if (this.props.value === 'X') {
        color = '#000080';
      } else if (this.props.value === 'O'){
        color = '#b22222';
      }
      return (
        <button className="square" onClick={this.props.onClick}>
          <font color={color}>{this.props.value}</font>
        </button>
      );
    }
  }
 