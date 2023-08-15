import React, { useEffect, useState } from 'react';
import {
  Enums,
  getEnabledElement,
  getOrCreateCanvas,
  StackViewport,
  VolumeViewport,
} from '@cornerstonejs/core';
import { ToolGroupManager } from '@cornerstonejs/tools';
import PropTypes from 'prop-types';
import { ResultsFromComponent } from '@ohif/ui';

import { getEnabledElement as OHIFgetEnabledElement } from '../state';
import { IExaminationResults } from 'platform/core/src/services/MedicalExaminationService/examinationResults';
import MedicalExaminationService from 'platform/core/src/services/MedicalExaminationService';

const MINIMUM_SIZE = 100;
const DEFAULT_SIZE = 512;
const MAX_TEXTURE_SIZE = 10000;
const VIEWPORT_ID = 'cornerstone-viewport-download-form';

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
