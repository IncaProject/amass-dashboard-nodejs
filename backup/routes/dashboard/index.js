import React from 'react';
import io from 'socket.io-client';
import Layout from '../../components/Layout';
import AMASSJobByToolChart from './AMASSJobByToolChart';
import AMASSJobByTurnaroundTimeChart from './AMASSJobByTurnaroundTimeChart';
import AMASSJobByResourceChart from './AMASSJobByResourceChart';
import AMASSJobByUserChart from './AMASSJobByUserChart';
import AMASSJobFractionByToolChart from './AMASSJobFractionByToolChart';
import AMASSJobFractionByTurnaroundChart from './AMASSJobFractionByTurnaroundChart';
import AMASSJobFractionByResourceChart from './AMASSJobFractionByResourceChart';
import AMASSJobFractionByUserChart from './AMASSJobFractionByUserChart';
import AMASSJobFractionByResourceGauge from './AMASSJobFractionByResourceGauge';

const cipresCharts = [];
const nsgCharts = [];

const socket = io.connect('http://localhost:3000');
socket.on('message', data => {
  console.info(`receive message: ${data}`);
  if (data === 'cipres') {
    for (let i = 0; i < cipresCharts.length; i += 1) {
      cipresCharts[i].componentDidMount();
    }
  } else {
    for (let i = 0; i < nsgCharts.length; i += 1) {
      nsgCharts[i].componentDidMount();
    }
  }
});

const amassChartStyle = {
  height: 400,
  width: 500,
  padding: 10,
  margin: 10,
  backgroundColor: '#fff',
  filter: 'drop-shadow(0px 0px 5px #666)',
  WebkitFilter: 'drop-shadow(0px 0px 5px #666)',
};

const amassLargeChartStyle = {
  height: 400,
  width: 1045,
  padding: 10,
  margin: 10,
  backgroundColor: '#fff',
  overflow: 'scroll',
  filter: 'drop-shadow(0px 0px 5px #666)',
  WebkitFilter: 'drop-shadow(0px 0px 5px #666)',
};

function action() {
  return {
    chunks: ['dashboard'],
    title: 'Dashboard',
    component: (
      <Layout>
        <center>
          <table>
            <tbody>
              <tr>
                <td colSpan="2">
                  <div id="banner">
                    <div className="loader" />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart1" style={{ width: 500, height: 400 }}>
                      <AMASSJobByToolChart sys="cipres" charts={cipresCharts} />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart2" style={{ width: 500, height: 400 }}>
                      <AMASSJobByToolChart sys="nsg" charts={nsgCharts} />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart3" style={{ width: 500, height: 400 }}>
                      <AMASSJobByTurnaroundTimeChart
                        sys="cipres"
                        charts={cipresCharts}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart4" style={{ width: 500, height: 400 }}>
                      <AMASSJobByTurnaroundTimeChart
                        sys="nsg"
                        charts={nsgCharts}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart5" style={{ width: 500, height: 400 }}>
                      <AMASSJobByResourceChart
                        sys="cipres"
                        charts={cipresCharts}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart6" style={{ width: 500, height: 400 }}>
                      <AMASSJobByResourceChart sys="nsg" charts={nsgCharts} />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart7" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByResourceGauge
                        sys="cipres"
                        charts={cipresCharts}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart8" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByResourceGauge
                        sys="nsg"
                        charts={nsgCharts}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <div style={amassLargeChartStyle}>
                    <div id="chart9" style={{ width: 500, height: 400 }}>
                      <AMASSJobByUserChart sys="cipres" charts={cipresCharts} />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <div style={amassLargeChartStyle}>
                    <div id="chart11" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByUserChart
                        sys="cipres"
                        charts={cipresCharts}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart13" style={{ width: 500, height: 400 }}>
                      <AMASSJobByUserChart sys="nsg" charts={nsgCharts} />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart14" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByUserChart
                        sys="nsg"
                        charts={nsgCharts}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart15" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByResourceChart
                        sys="cipres"
                        charts={cipresCharts}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart16" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByResourceChart
                        sys="nsg"
                        charts={nsgCharts}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart17" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByToolChart
                        sys="cipres"
                        charts={cipresCharts}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart18" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByToolChart
                        sys="nsg"
                        charts={nsgCharts}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart19" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByTurnaroundChart
                        sys="cipres"
                        charts={cipresCharts}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={amassChartStyle}>
                    <div id="chart20" style={{ width: 500, height: 400 }}>
                      <AMASSJobFractionByTurnaroundChart
                        sys="nsg"
                        charts={nsgCharts}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </center>
      </Layout>
    ),
  };
}

export default action;
