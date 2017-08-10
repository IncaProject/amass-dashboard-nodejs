const express = require('express');

const mysql = require('mysql');

const router = express.Router();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'eyt56q2w3er',
  database: 'amass_refactor',
});

router.get('/job/:sys/count_by_tool', (req, res) => {
  if (req.params.sys !== 'cipres' && req.params.sys !== 'nsg') {
    console.info('wrong url');
    return;
  }

  const sql =
    `SELECT TOOL_NAME AS name, count(*) AS num ` +
    `FROM amass_refactor.amass_source_gateway_${req.params.sys} ` +
    `GROUP BY TOOL_NAME ` +
    `ORDER BY TOOL_NAME`;
  console.info(sql);
  pool.query(sql, (err, rows) => {
    if (err) throw err;

    const result = [];
    for (let i = 0; i < rows.length; i += 1) {
      result.push([rows[i].name, rows[i].num]);
    }
    res.send(JSON.stringify(result));
  });
});

router.get('/job/:sys/count_by_turnaround_time', (req, res) => {
  if (req.params.sys !== 'cipres' && req.params.sys !== 'nsg') {
    console.info('wrong url');
    return;
  }

  const sql =
    `SELECT  ` +
    `ROUND(TIMESTAMPDIFF(HOUR, USER_SUBMIT_DATE, TERMINATE_DATE) / 10) * 10 AS turnaround,  ` +
    `count(*) AS num  ` +
    `FROM amass_refactor.amass_source_gateway_${req.params.sys} ` +
    `WHERE NOT TERMINATE_DATE is NULL ` +
    `GROUP BY TURNAROUND ` +
    `ORDER BY TURNAROUND `;
  console.info(sql);
  pool.query(sql, (err, rows) => {
    if (err) throw err;
    const result = [];
    for (let i = 0; i < rows.length; i += 1) {
      result.push([rows[i].turnaround, rows[i].num]);
    }
    res.send(JSON.stringify(result));
  });
});

router.get('/job/:sys/count_by_resource', (req, res) => {
  if (req.params.sys !== 'cipres' && req.params.sys !== 'nsg') {
    console.info('wrong url');
    return;
  }

  const sql =
    `SELECT RESOURCE as name, count(*) as num ` +
    `FROM amass_refactor.amass_source_gateway_${req.params.sys} ` +
    `GROUP BY RESOURCE ` +
    `ORDER BY RESOURCE`;
  console.info(sql);
  pool.query(sql, (err, rows) => {
    if (err) throw err;
    const result = [];
    for (let i = 0; i < rows.length; i += 1) {
      result.push([rows[i].name, rows[i].num]);
    }
    res.send(JSON.stringify(result));
  });
});

router.get('/job/:sys/finished_failed_by_resource', (req, res) => {
  if (req.params.sys !== 'cipres' && req.params.sys !== 'nsg') {
    console.info('wrong url');
    return;
  }

  const sql =
    `SELECT RESOURCE as name, isnull(ERROR_MSG) as err, count(*) as num ` +
    `FROM amass_refactor.amass_source_gateway_${req.params.sys} ` +
    `GROUP BY RESOURCE, isnull(ERROR_MSG) ` +
    `ORDER BY RESOURCE, isnull(ERROR_MSG)`;
  console.info(sql);
  pool.query(sql, (err, rows) => {
    if (err) throw err;
    const result = [];
    for (let i = 0; i < rows.length; i += 1) {
      result.push([rows[i].name, rows[i].err, rows[i].num]);
    }
    res.send(JSON.stringify(result));
  });
});

router.get('/job/:sys/count_by_user', (req, res) => {
  if (req.params.sys !== 'cipres' && req.params.sys !== 'nsg') {
    console.info('wrong url');
    return;
  }

  const sql =
    `SELECT USERNAME AS name, count(*) AS num ` +
    `FROM amass_refactor.amass_source_gateway_${req.params.sys} ` +
    `GROUP BY USERNAME ` +
    `HAVING num > ${req.params.sys === 'cipres' ? 50 : 10} ` +
    `ORDER BY binary(USERNAME)`;
  console.info(sql);
  pool.query(sql, (err, rows) => {
    if (err) throw err;

    const result = [];
    for (let i = 0; i < rows.length; i += 1) {
      result.push([rows[i].name, rows[i].num]);
    }
    res.send(JSON.stringify(result));
  });
});

router.get('/job/:sys/finished_failed_by_user', (req, res) => {
  if (req.params.sys !== 'cipres' && req.params.sys !== 'nsg') {
    console.info('wrong url');
    return;
  }

  const sql =
    `SELECT USERNAME AS name, isnull(ERROR_MSG) as err, count(*) as num ` +
    `FROM amass_refactor.amass_source_gateway_${req.params.sys} ` +
    `WHERE USERNAME IN ` +
    `    (SELECT USERNAME AS name ` +
    `       FROM amass_refactor.amass_source_gateway_${req.params.sys} ` +
    `     GROUP BY USERNAME HAVING count(*)>${req.params.sys === 'cipres'? 50 : 10} )` +
    `GROUP BY USERNAME, isnull(ERROR_MSG) ` +
    `ORDER BY binary(USERNAME), isnull(ERROR_MSG)`;
  console.info(sql);
  pool.query(sql, (err, rows) => {
    if (err) throw err;
    const result = [];
    for (let i = 0; i < rows.length; i += 1) {
      if (i < rows.length - 1 && rows[i].name === rows[i + 1].name) {
        // has finished and failed
        result.push([rows[i].name, rows[i].err, rows[i].num]);
        result.push([rows[i + 1].name, rows[i + 1].err, rows[i + 1].num]);
        i += 1;
      } else if (rows[i].err === 0) {
        // has failed only
        result.push([rows[i].name, rows[i].err, rows[i].num]);
        result.push([rows[i].name, 1, 0]);
      } else {
        // has finished only
        result.push([rows[i].name, 0, 0]);
        result.push([rows[i].name, rows[i].err, rows[i].num]);
      }
    }
    res.send(JSON.stringify(result));
  });
});

router.get('/job/:sys/finished_failed_by_tool', (req, res) => {
  if (req.params.sys !== 'cipres' && req.params.sys !== 'nsg') {
    console.info('wrong url');
    return;
  }

  const sql =
    `SELECT TOOL_NAME AS name, isnull(ERROR_MSG) as err, count(*) AS num ` +
    `FROM amass_refactor.amass_source_gateway_${req.params.sys}  ` +
    `GROUP BY TOOL_NAME, isnull(ERROR_MSG) ` +
    `ORDER BY TOOL_NAME, isnull(ERROR_MSG)`;
  console.info(sql);
  pool.query(sql, (err, rows) => {
    if (err) throw err;
    const result = [];
    for (let i = 0; i < rows.length; i += 1) {
      if (i < rows.length - 1 && rows[i].name === rows[i + 1].name) {
        // has finished and failed
        result.push([rows[i].name, rows[i].err, rows[i].num]);
        result.push([rows[i + 1].name, rows[i + 1].err, rows[i + 1].num]);
        i += 1;
      } else if (rows[i].err === 0) {
        // has failed only
        result.push([rows[i].name, rows[i].err, rows[i].num]);
        result.push([rows[i].name, 1, 0]);
      } else {
        // has finished only
        result.push([rows[i].name, 0, 0]);
        result.push([rows[i].name, rows[i].err, rows[i].num]);
      }
    }
    res.send(JSON.stringify(result));
  });
});

router.get('/job/:sys/finished_failed_by_turnaround_time', (req, res) => {
  if (req.params.sys !== 'cipres' && req.params.sys !== 'nsg') {
    console.info('wrong url');
    return;
  }

  const sql =
    `SELECT (ROUND(TIMESTAMPDIFF(HOUR, USER_SUBMIT_DATE, TERMINATE_DATE) / 10) * 10) AS turnaround,  isnull(ERROR_MSG) as err, count(*) AS num ` +
    `FROM amass_refactor.amass_source_gateway_${req.params.sys} ` +
    `WHERE NOT TERMINATE_DATE is NULL ` +
    `GROUP BY TURNAROUND, isnull(ERROR_MSG) ` +
    `ORDER BY TURNAROUND, isnull(ERROR_MSG)`;
  console.info(sql);
  pool.query(sql, (err, rows) => {
    if (err) throw err;
    const result = [];
    for (let i = 0; i < rows.length; i += 1) {
      if (
        i < rows.length - 1 &&
        rows[i].turnaround === rows[i + 1].turnaround
      ) {
        // has finished and failed
        result.push([rows[i].turnaround, rows[i].err, rows[i].num]);
        result.push([rows[i + 1].turnaround, rows[i + 1].err, rows[i + 1].num]);
        i += 1;
      } else if (rows[i].err === 0) {
        // has failed only
        result.push([rows[i].turnaround, rows[i].err, rows[i].num]);
        result.push([rows[i].turnaround, 1, 0]);
      } else {
        // has finished only
        result.push([rows[i].turnaround, 0, 0]);
        result.push([rows[i].turnaround, rows[i].err, rows[i].num]);
      }
    }
    res.send(JSON.stringify(result));
  });
});

router.get('/job/:sys/new_data_alert', (req, res) => {
  if (req.params.sys !== 'cipres' && req.params.sys !== 'nsg') {
    console.info('wrong url');
    return;
  }

  console.info(`new data ${req.params.sys}`);
  const io = req.app.get('socketio');
  io.send(req.params.sys);
  res.send('');
});

module.exports = router;
