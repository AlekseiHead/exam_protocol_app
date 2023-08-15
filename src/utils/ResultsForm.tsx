import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import ResultsFromComponent from '@components/ResultsFormComponent';

import IExaminationResults from '@services/MedicalExamination';
import MedicalExaminationService from '@services/MedicalExamination';

//const medicalExaminationService = new MedicalExaminationService();

const ResultsForm = ({
  medicalExaminationService,
}: {
  medicalExaminationService: MedicalExaminationService;
}) => {
  const [examinationResult, setExaminationResult] = useState<
    IExaminationResults
  >({
    dicom_id: 0,
    body_part_examined: '',
    type_of_nodule: '',
    size_of_finding: 0,
    volume: 0,
    benign_signs: '',
    lung_rads: '',
    additional_inf: '',
    additional_inf_1: '',
    expert_required: false,
    second_report: '',
    expert_report: '',
  });

  useEffect(() => {
    const fetchExaminationResult = async () => {
      const currentMedicalExamination = await medicalExaminationService.read();
      setExaminationResult(currentMedicalExamination);
    };
    fetchExaminationResult();
  }, []);

  /*useEffect(() => {
    const readData = async () => {
      const currentMedicalExamination = await medicalExaminationService.read();
      if (currentMedicalExamination) {
        try {
          const { ...examinationResult } = (JSON.stringify(
            currentMedicalExamination
          ) as unknown) as IExaminationResults;
          setExaminationResult({ ...examinationResult });
        } catch (error) {
          console.log(error);
        }
      }
    };
    readData();
  }, [medicalExaminationService]);

  /*useEffect(() => {
    const currentMedicalExamination = medicalExaminationService
      .read()
      .then(() => {
        setExaminationResult(currentMedicalExamination);
      });
  }, []);*/
  return <ResultsFromComponent {...examinationResult} />;
};

export default ResultsForm;
ResultsForm.propTypes = {
  onClose: PropTypes.func,
};
