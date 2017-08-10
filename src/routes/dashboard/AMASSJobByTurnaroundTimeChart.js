/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import AnyChart from 'anychart-react';
import fetch from 'node-fetch';

class AMASSJobByTurnaroundTimeChart extends React.Component {
  static propTypes = {
    sys: PropTypes.string.isRequired,
    charts: PropTypes.array.isRequired,
  };
  constructor(props) {
    super(props);

    if (props.sys === 'cipres') {
      this.state = {
        posts: [
          [0, 50024],
          [10, 6669],
          [20, 2898],
          [30, 1385],
          [40, 1051],
          [50, 889],
          [60, 474],
          [70, 403],
          [80, 301],
          [90, 203],
          [100, 319],
          [110, 165],
          [120, 190],
          [130, 100],
          [140, 107],
          [150, 115],
          [160, 60],
          [170, 1489],
          [180, 3],
          [190, 4],
          [200, 2],
          [210, 2],
          [220, 1],
          [240, 1],
        ],
      };
    } else {
      this.state = {
        posts: [
          [0, 1686],
          [10, 585],
          [20, 46],
          [30, 21],
          [40, 3],
          [50, 48],
          [60, 3],
          [70, 1],
        ],
      };
    }
    this.props.charts.push(this);
  }

  componentDidMount() {
    const that = this;
    fetch(
      `http://localhost:3000/amass/job/${that.props.sys}/count_by_turnaround_time`)
      .then(res => res.text())
      .then(body => that.setState({ posts: JSON.parse(body) }));
  }

  render() {
    const complexSettings = {
      id: `turnaround${this.props.sys}`,
      width: 500,
      height: 400,
      type: 'column3d',
      data: this.state.posts,
      tooltip: {
        format: '{%Value}',
        offsetY: 5,
        positionMode: 'point',
        enabled: true,
      },
      title: {
        text: `Jobs by Turnaround Time for ${this.props.sys.toUpperCase()}`,
        padding: 7,
        fontFamily: 'sans-serif',
        fontColor: 'black',
      },
      xAxis: [
        {
          title: 'Turnaround Time (hours)',
          labels: {
            fontColor: 'darkgreen',
            fontSize: 12,
            fontFamily: 'Courier',
            rotation: 90,
          },
        },
      ],
      yAxis: [
        {
          title: 'Number of Jobs',
          labels: {
            fontColor: 'darkgreen',
          },
        },
      ],
      legend: false,
    };

    return <AnyChart {...complexSettings} />;
  }
}

export default AMASSJobByTurnaroundTimeChart;
