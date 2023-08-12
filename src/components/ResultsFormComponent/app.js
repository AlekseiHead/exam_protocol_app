('use strict');

const fs = require('fs');
const pg = require('pg');

//Тестовые данные
const testData = {
  dicom_id: 1,
  body_part_examined: '',
  type_of_nodule: 'Солидный',
  size_of_finding: 12,
  volume: 345,
  benign_signs: 'Внутрилегочный лимфоузел',
  lung_rads: 'Тест lung_rads',
  additional_inf: 'Эмфизема',
  additional_inf_1: 'Тест additional_inf_1',
  expert_required: true,
  second_report: 'Совпадение',
  expert_report: 'Пропущена дополнительная находка',
};
const testData2 = JSON.stringify(testData);
//Работающий код по отправке в бд через команду node app.js
const config = {
  connectionString:
    'postgres://user1:alphabeta@rc1b-9sba4xr2nq7sbujs.mdb.yandexcloud.net:6432/xrayimaging',
  ssl: {
    rejectUnauthorized: true,
    ca: fs
      .readFileSync('C:/1Projects/test/Viewers/sertificate/CA.pem')
      .toString(),
  },
};

const conn = new pg.Client(config);

conn.connect(err => {
  if (err) throw err;
});
//Положить в функцию
conn.query(
  "INSERT INTO testReport(report_id,radiologist_id,therapist_id, patient_id,research_id, body_of_report) VALUES ($1, $2, $3, $4, $5, '$6')",
  [9, 126645561, 126645561, 10277315, 1, testData2],
  (err, q) => {
    if (err) throw err;
    console.log(q.rows[0]);
    conn.end();
  }
);
