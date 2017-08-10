/* eslint react/prop-types: 0 */
import React from 'react';
import ReactHighcharts from 'react-highcharts';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';

class AMASSJobFractionByToolChart extends React.Component {
  static propTypes = {
    sys: PropTypes.string.isRequired,
    charts: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    if (props.sys === 'cipres') {
      this.state = {
        posts: [
          ['BEAST2_XSEDE', 0, 484],
          ['BEAST2_XSEDE', 1, 4717],
          ['BEAST_TG', 0, 1335],
          ['BEAST_TG', 1, 11370],
          ['DPPDIV', 0, 7],
          ['DPPDIV', 1, 45],
          ['FASTTREE_XSEDE', 0, 8],
          ['FASTTREE_XSEDE', 1, 288],
          ['GARLI2_TGB', 0, 62],
          ['GARLI2_TGB', 1, 1024],
          ['JMODELTEST2_XSEDE', 0, 113],
          ['JMODELTEST2_XSEDE', 1, 2804],
          ['MAFFT_TG', 0, 21],
          ['MAFFT_TG', 1, 1246],
          ['MIGRATEN_XSEDE', 0, 129],
          ['MIGRATEN_XSEDE', 1, 1285],
          ['MRBAYES_321RESTARTBETA', 0, 32],
          ['MRBAYES_321RESTARTBETA', 1, 451],
          ['MRBAYES_XSEDE', 0, 1014],
          ['MRBAYES_XSEDE', 1, 13613],
          ['RAXMLHPC2BB', 0, 273],
          ['RAXMLHPC2BB', 1, 7458],
          ['RAXMLHPC2_TGB', 0, 581],
          ['RAXMLHPC2_TGB', 1, 14552],
          ['RAXMLHPC2_WORKFLOW', 0, 24],
          ['RAXMLHPC2_WORKFLOW', 1, 446],
          ['RAXMLHPC8_XSEDE', 0, 209],
          ['RAXMLHPC8_XSEDE', 1, 3876],
        ],
      };
    } else {
      this.state = {
        posts: [
          ['BLUEPYOPT_TG', 0, 0],
          ['BLUEPYOPT_TG', 1, 9],
          ['BRIAN_STAMP', 0, 9],
          ['BRIAN_STAMP', 1, 1],
          ['BRIAN_TG', 0, 32],
          ['BRIAN_TG', 1, 184],
          ['CPIPELINE_TG', 0, 1],
          ['CPIPELINE_TG', 1, 0],
          ['FREESURF_TG', 0, 9],
          ['FREESURF_TG', 1, 232],
          ['NEST_PY_STAMP', 0, 1],
          ['NEST_PY_STAMP', 1, 5],
          ['NEST_PY_TG', 0, 0],
          ['NEST_PY_TG', 1, 10],
          ['NEURON73_PY_STAMP', 0, 7],
          ['NEURON73_PY_STAMP', 1, 20],
          ['NEURON73_PY_TG', 0, 3],
          ['NEURON73_PY_TG', 1, 1],
          ['NEURON73_STAMP', 0, 23],
          ['NEURON73_STAMP', 1, 129],
          ['NEURON73_TG', 0, 165],
          ['NEURON73_TG', 1, 789],
          ['NEURON74_PY_TG', 0, 161],
          ['NEURON74_PY_TG', 1, 496],
          ['NEURON74_TG', 0, 13],
          ['NEURON74_TG', 1, 74],
          ['PGENESIS_STAMP', 0, 2],
          ['PGENESIS_STAMP', 1, 3],
          ['PGENESIS_TG', 0, 3],
          ['PGENESIS_TG', 1, 2],
          ['PY_STAMP', 0, 6],
          ['PY_STAMP', 1, 5],
          ['PY_TG', 0, 35],
          ['PY_TG', 1, 173],
        ],
      };
    }

    this.props.charts.push(this);
  }

  componentDidMount() {
    const that = this;
    fetch(
      `http://localhost:3000/amass/job/${that.props.sys}/finished_failed_by_tool`)
      .then(res => res.text())
      .then(body => that.setState({ posts: JSON.parse(body) }));
  }

  render() {
    const categories = [];
    for (let i = 0; i < this.state.posts.length; i += 1) {
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
        text: `Finished/Failed Jobs by Tools for ${this.props.sys.toUpperCase()}`,
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
          text: 'Tools',
        },
        labels: {
          rotation: -45,
          style: {
            fontWeight: 'normal',
            fontSize: '7pt',
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
          enabled: false,
          style: {
            fontWeight: 'normal',
            fontSize: 8,
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
          color: 'lightgrey'
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

export default AMASSJobFractionByToolChart;
