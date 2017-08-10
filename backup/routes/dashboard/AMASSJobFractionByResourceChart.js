/* eslint react/prop-types: 0 */
import React from 'react';
import ReactHighcharts from 'react-highcharts';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';

class AMASSJobFractionByResourceChart extends React.Component {
  static propTypes = {
    sys: PropTypes.string.isRequired,
    charts: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    if (props.sys === 'cipres') {
      this.state = {
        posts: [
          ['comet', 0, 3105],
          ['comet', 1, 45016],
          ['gordon', 0, 1187],
          ['gordon', 1, 18159],
        ],
      };
    } else {
      this.state = {
        posts: [
          ['comet', 0, 422],
          ['comet', 1, 1970],
          ['stampede', 0, 48],
          ['stampede', 1, 163],
        ],
      };
    }

    this.props.charts.push(this);
  }

  componentDidMount() {
    const that = this;
    fetch(
      `http://localhost:3000/amass/job/${that.props.sys}/finished_failed_by_resource`)
      .then(res => res.text())
      .then(body => that.setState({posts: JSON.parse(body)}));
  }

  render() {
    const categories = [];
    for (let i = 0; i < this.state.posts.length; i += 1) {
      if (!categories.includes(this.state.posts[i][0])) {
        categories.push(this.state.posts[i][0]);
      }
    }

    const config = {
      chart: {
        type: 'column',
      },
      title: {
        text: `Finished/Failed Jobs by Resources for ${this.props.sys.toUpperCase()}`,
        style: {
          fontFamily: 'sans-serif',
          fontSize: '12pt',
          fontWeight: 'normal',
          color: 'black',
        },
      },
      xAxis: {
        categories,
        title: {
          text: 'Resources',
        },
        labels: {
          rotation: 0,
          style: {
            fontWeight: 'normal',
            color: 'darkgreen',
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Fractions of Finished/Failed Jobs',
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'gray',
          },
        },
        labels: {
          rotation: 0,
          style: {
            fontWeight: 'normal',
            color: 'darkgreen',
          },
        },
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false,
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
            color: 'white',
          },
        },
      },
      series: [
        {
          name: 'Failed',
          data: [this.state.posts[0][2], this.state.posts[2][2]],
          color: 'lightgrey',
        },
        {
          name: 'Finished',
          data: [this.state.posts[1][2], this.state.posts[3][2]],
        },
      ],
    };

    return React.createElement(ReactHighcharts, {config});
  }
}

export default AMASSJobFractionByResourceChart;
