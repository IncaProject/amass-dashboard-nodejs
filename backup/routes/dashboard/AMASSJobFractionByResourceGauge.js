/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
import SolidGauge from 'highcharts-solid-gauge';
import Highcharts from 'highcharts';

class AMASSJobFractionByResourceGauge extends React.Component {
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
      .then(body => that.setState({ posts: JSON.parse(body) }));
  }

  render() {
    HighchartsMore(ReactHighcharts.Highcharts);
    SolidGauge(ReactHighcharts.Highcharts);

    const categories = [];
    for (let i = 0; i < this.state.posts.length; i += 1) {
      if (!categories.includes(this.state.posts[i][0])) {
        categories.push(this.state.posts[i][0]);
      }
    }

    const data1 =
      Math.round(
        this.state.posts[1][2] /
          (this.state.posts[0][2] + this.state.posts[1][2]) * 10000) / 100;
    const data2 =
      Math.round(
        this.state.posts[3][2] /
          (this.state.posts[2][2] + this.state.posts[3][2]) * 10000) / 100;

    const config = {
      chart: {
        type: 'solidgauge',
        marginTop: 50,
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
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
          fontSize: '16px',
        },
        pointFormat:
          '    {series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function(labelWidth) {
          return {
            x: 250 - labelWidth / 2,
            y: 160,
          };
        },
      },
      legend: {
        labelFormatter: function() {
          if (this.name === 'comet') {
            return '<span style="text-weight:bold;color:' + Highcharts.getOptions().colors[0] + '">' + this.name + ' ' + this.data[0].y + '%</span> ';
          } else {
            return '<span style="text-weight:bold;color:' + Highcharts.getOptions().colors[2] + '">' + this.name + ' ' + this.data[0].y + '%</span> ';
          }
        },
        symbolWidth: 0,
      },
      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [
          {
            // Track for Comet
            outerRadius: '112%',
            innerRadius: '88%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
            borderWidth: 0,
          },
          {
            // Track for Gordon
            outerRadius: '87%',
            innerRadius: '63%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.3).get(),
            borderWidth: 0,
          },
        ],
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: [],
      },

      plotOptions: {
        solidgauge: {
          borderWidth: '34px',
          dataLabels: {
            enabled: false,
          },
          linecap: 'round',
          stickyTracking: false,
        },
      },

      series: [
        {
          name: categories[0],
          borderColor: Highcharts.getOptions().colors[0],
          data: [
            {
              color: Highcharts.getOptions().colors[0],
              radius: '100%',
              innerRadius: '100%',
              y: data1,
            },
          ],
          showInLegend: true,
        },
        {
          name: categories[1],
          borderColor: Highcharts.getOptions().colors[2],
          data: [
            {
              color: Highcharts.getOptions().colors[2],
              radius: '75%',
              innerRadius: '75%',
              y: data2,
            },
          ],
          showInLegend: true,
        },
      ],
    };

    return React.createElement(ReactHighcharts, { config });
  }
}

export default AMASSJobFractionByResourceGauge;
