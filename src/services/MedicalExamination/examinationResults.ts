export interface IExaminationResults {
  //Локализация очага
  dicom_id: number;
  body_part_examined: string;

  //Тип очага
  type_of_nodule: string;

  //Размер очага
  size_of_finding: number;

  //Объем очага в мм.куб
  volume: number;

  //Признаки доброкачественности
  benign_signs: string;

  //Категория Lung-RADS
  lung_rads: string;

  //Дополнительные находки
  additional_inf: string;

  //Другие дополнительные находки
  additional_inf_1: string;

  //Нужность экспертного анализа
  expert_required: boolean;

  //Результаты второго пересмотра
  second_report: string;

  //Причины разночтения
  expert_report: string;
}
