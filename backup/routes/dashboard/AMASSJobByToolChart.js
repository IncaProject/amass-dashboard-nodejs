/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import AnyChart from 'anychart-react';
import fetch from 'node-fetch';

class AMASSJobByToolChart extends React.Component {
  static propTypes = {
    sys: PropTypes.string.isRequired,
    charts: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    if (props.sys === 'cipres') {
      this.state = {
        posts: [
          ['BEAST2_XSEDE', 5201],
          ['BEAST_TG', 12705],
          ['DPPDIV', 52],
          ['FASTTREE_XSEDE', 296],
          ['GARLI2_TGB', 1086],
          ['JMODELTEST2_XSEDE', 2917],
          ['MAFFT_TG', 1267],
          ['MIGRATEN_XSEDE', 1414],
          ['MRBAYES_321RESTARTBETA', 483],
          ['MRBAYES_XSEDE', 14627],
          ['RAXMLHPC2BB', 7731],
          ['RAXMLHPC2_TGB', 15133],
          ['RAXMLHPC2_WORKFLOW', 470],
          ['RAXMLHPC8_XSEDE', 4085],
        ],
      };
    } else {
      this.state = {
        posts: [
          ['BLUEPYOPT_TG', 9],
          ['BRIAN_STAMP', 10],
          ['BRIAN_TG', 216],
          ['CPIPELINE_TG', 1],
          ['FREESURF_TG', 241],
          ['NEST_PY_STAMP', 6],
          ['NEST_PY_TG', 10],
          ['NEURON73_PY_STAMP', 27],
          ['NEURON73_PY_TG', 4],
          ['NEURON73_STAMP', 152],
          ['NEURON73_TG', 954],
          ['NEURON74_PY_TG', 657],
          ['NEURON74_TG', 87],
          ['PGENESIS_STAMP', 5],
          ['PGENESIS_TG', 5],
          ['PY_STAMP', 11],
          ['PY_TG', 208],
        ],
      };
    }

    this.props.charts.push(this);
  }

  componentDidMount() {
    const that = this;
    fetch(`http://localhost:3000/amass/job/${that.props.sys}/count_by_tool`)
      .then(res => res.text())
      .then(body => that.setState({ posts: JSON.parse(body) }));
  }

  render() {
    const complexSettings = {
      id: `tool${this.props.sys}`,
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
        text: `Jobs by Tools for ${this.props.sys.toUpperCase()}`,
        padding: 7,
        fontFamily: 'sans-serif',
        fontColor: 'black',
      },
      xAxis: [
        {
          title: 'Tools',
          labels: {
            fontColor: 'darkgreen',
            fontSize: 9,
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

export default AMASSJobByToolChart;
