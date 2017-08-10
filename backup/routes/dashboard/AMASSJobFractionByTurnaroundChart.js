/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import ReactHighcharts from 'react-highcharts';

class AMASSJobFractionByTurnaroundChart extends React.Component {
  static propTypes = {
    sys: PropTypes.string.isRequired,
    charts: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    if (props.sys === 'cipres') {
      this.state = {
        posts: [
          [0, 0, 2472],
          [0, 1, 47552],
          [10, 0, 292],
          [10, 1, 6377],
          [20, 0, 311],
          [20, 1, 2587],
          [30, 0, 123],
          [30, 1, 1262],
          [40, 0, 71],
          [40, 1, 980],
          [50, 0, 121],
          [50, 1, 768],
          [60, 0, 22],
          [60, 1, 452],
          [70, 0, 21],
          [70, 1, 382],
          [80, 0, 23],
          [80, 1, 278],
          [90, 0, 25],
          [90, 1, 178],
          [100, 0, 45],
          [100, 1, 274],
          [110, 0, 17],
          [110, 1, 148],
          [120, 0, 26],
          [120, 1, 164],
          [130, 0, 5],
          [130, 1, 95],
          [140, 0, 20],
          [140, 1, 87],
          [150, 0, 18],
          [150, 1, 97],
          [160, 0, 9],
          [160, 1, 51],
          [170, 0, 58],
          [170, 1, 1431],
          [180, 0, 0],
          [180, 1, 3],
          [190, 0, 1],
          [190, 1, 3],
          [200, 0, 0],
          [200, 1, 2],
          [210, 0, 0],
          [210, 1, 2],
          [220, 0, 0],
          [220, 1, 1],
          [240, 0, 0],
          [240, 1, 1],
        ],
      };
    } else {
      this.state = {
        posts: [
          [0, 0, 155],
          [0, 1, 1531],
          [10, 0, 102],
          [10, 1, 483],
          [20, 0, 3],
          [20, 1, 43],
          [30, 0, 0],
          [30, 1, 21],
          [40, 0, 0],
          [40, 1, 3],
          [50, 0, 0],
          [50, 1, 48],
          [60, 0, 0],
          [60, 1, 3],
          [70, 0, 0],
          [70, 1, 1],
        ],
      };
    }

    this.props.charts.push(this);
  }

  componentDidMount() {
    const that = this;
    fetch(
      `http://localhost:3000/amass/job/${that.props.sys}/finished_failed_by_turnaround_time`)
      .then(res => res.text())
      .then(body => that.setState({ posts: JSON.parse(body) }));
  }

  render() {
    const categories = [];
    for (let i = 0; i < this.state.posts.length; i += 2) {
      if (!categories.includes(this.state.posts[i][0])) {
        categories.push(this.state.posts[i][0]);
      }
    }

    const failed = [];
    for (let i = 0; i < this.state.posts.length; i += 2) {
      failed.push(this.state.posts[i][2]);
    }

    const finished = [];
    for (let i = 0; i < this.state.posts.length; i += 2) {
      finished.push(this.state.posts[i + 1][2]);
    }

    const config = {
      chart: {
        type: 'column',
      },
      title: {
        text: `Finished/Failed Jobs by Turnaround Time for ${this.props.sys.toUpperCase()}`,
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
          text: 'Turnaround Time',
        },
        labels: {
          rotation: -45,
          style: {
            fontWeight: 'bold',
            fontSize: '8pt',
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
            fontWeight: 'normal',
            fontSize: '6pt',
            color: 'lightgrey',
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
          data: failed,
          color: 'lightgrey',
        },
        {
          name: 'Finished',
          data: finished,
        },
      ],
    };

    return React.createElement(ReactHighcharts, { config });
  }
}

export default AMASSJobFractionByTurnaroundChart;
