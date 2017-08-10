/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import AnyChart from 'anychart-react';
import fetch from 'node-fetch';

class AMASSJobByResourceChart extends React.Component {
  static propTypes = {
    sys: PropTypes.string.isRequired,
    charts: PropTypes.array.isRequired,
  };
  constructor(props) {
    super(props);

    if (props.sys === 'cipres') {
      this.state = {
        posts: [['comet', 48121], ['gordon', 19346]],
      };
    } else {
      this.state = {
        posts: [['comet', 2392], ['stampede', 211]],
      };
    }

    this.props.charts.push(this);
  }

  componentDidMount() {
    const that = this;
    fetch(`http://localhost:3000/amass/job/${that.props.sys}/count_by_resource`)
      .then(res => res.text())
      .then(body => that.setState({ posts: JSON.parse(body) }));
  }

  render() {
    const complexSettings = {
      id: `resource${this.props.sys}`,
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
        text: `Jobs by Resources for ${this.props.sys.toUpperCase()}`,
        padding: 7,
        fontFamily: 'sans-serif',
        fontColor: 'black',
      },
      xAxis: [
        {
          title: 'Resources',
          labels: {
            fontColor: 'darkgreen',
            fontSize: 12,
            fontFamily: 'Courier',
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

export default AMASSJobByResourceChart;
