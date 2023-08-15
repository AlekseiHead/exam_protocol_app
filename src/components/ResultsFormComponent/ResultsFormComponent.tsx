import React, {
  useCallback,
  useEffect,
  useState,
  createRef,
  useRef,
  ChangeEvent,
	FormEvent,
} from 'react';

import './styles.css';

import {
  Typography,
  Input,
  Tooltip,
  IconButton,
  Icon,
  Select,
  InputLabelWrapper,
  Button,
  CheckBox,
  Table,
  Modal,
} from '../..';

import { IExaminationResults } from '@services/MedicalExamination/examinationResults';
import useLocalStorage  from '@services/LocalStorage';
import MedicalExaminationService from '@services/MedicalExamination';

import { array, func } from 'prop-types';
import { useModal } from '../../contextProviders';

const TYPE_OF_NODULE = [
  {
    value: 'Солидный',
    label: 'Солидный',
  },
  {
    value: 'Частично солидный',
    label: 'Частично солидный',
  },
  {
    value: '«Матовое стекло»',
    label: '«Матовое стекло»',
  },
];

const LUNG_POSITION = [
  {
    value: 'Правое легкое',
    label: 'Правое легкое',
  },
  {
    value: 'Левое легкое',
    label: 'Левое легкое',
  },
];

const TYPE_OF_BENING_SIGNS = [
  {
    value: 'Нет',
    label: 'Нет',
  },
  {
    value: 'Кальцинация',
    label: 'Кальцинация',
  },
  {
    value: 'Жир',
    label: 'Жир',
  },
  {
    value: 'Внутрилегочный лимфоузел',
    label: 'Внутрилегочный лимфоузел',
  },
];

const TYPE_OF_LUNG_RADS = [
  {
    value: '0 Неполная (неопределенная)',
    label: '0 Неполная (неопределенная)',
  },
  {
    value: '1 Негативная: нет узелков в легких',
    label: '1 Негативная: нет узелков в легких',
  },
  {
    value: '1 Негативная: узелок(и) со специфическими обызвествлениями',
    label: '1 Негативная: узелок(и) со специфическими обызвествлениями',
  },
  {
    value: '2 Доброкачественные изменения: перифиссуральные узелок(и)',
    label: '2 Доброкачественные изменения: перифиссуральные узелок(и)',
  },
  {
    value: '2 Доброкачественные изменения: солидный узелок(и)',
    label: '2 Доброкачественные изменения: солидный узелок(и)',
  },
  {
    value: '2 Доброкачественные изменения: частично солидный узелок(и)',
    label: '2 Доброкачественные изменения: частично солидный узелок(и)',
  },
  {
    value: '2 Доброкачественные изменения: не солидный узелок(и) (GGN)',
    label: '2 Доброкачественные изменения: не солидный узелок(и) (GGN)',
  },
  {
    value: '3 Вероятно доброкачественные: солидный узелок(и)',
    label: '3 Вероятно доброкачественные: солидный узелок(и)',
  },
  {
    value: '3 Вероятно доброкачественные: частично солидный узелок(и)',
    label: '3 Вероятно доброкачественные: частично солидный узелок(и)',
  },
  {
    value: '3 Вероятно доброкачественные: не солидный узелок(и)(GGN)',
    label: '3 Вероятно доброкачественные: не солидный узелок(и)(GGN)',
  },
  {
    value: '4A Подозрительные: солидный узелок(и)',
    label: '4A Подозрительные: солидный узелок(и)',
  },
  {
    value: '4A Подозрительные: частично солидный узелок(и)',
    label: '4A Подозрительные: частично солидный узелок(и)',
  },
  {
    value: '4B Очень подозрительные: 	солидный узелок(и)',
    label: '4B Очень подозрительные: 	солидный узелок(и)',
  },
  {
    value: '4B Очень подозрительные: частично солидный узелок(и)',
    label: '4B Очень подозрительные: частично солидный узелок(и)',
  },
  {
    value: '4X Очень подозрительные',
    label: '4X Очень подозрительные',
  },
  {
    value: 'S Другие',
    label: 'S Другие',
  },
];

const TYPE_OF_ADDITIONAL_INF = [
  {
    value: 'Нет',
    label: 'Нет',
  },
  {
    value: 'Эмфизема',
    label: 'Эмфизема',
  },
  {
    value: 'Буллы',
    label: 'Буллы',
  },
  {
    value: 'Центральное образование',
    label: 'Центральное образование',
  },
  {
    value: 'Обтурационный ателектаз',
    label: 'Обтурационный ателектаз',
  },
  {
    value: 'Участки «матового стекла»',
    label: 'Участки «матового стекла»',
  },
  {
    value: 'Участки консолидации',
    label: 'Участки консолидации',
  },
  {
    value: 'Признаки туберкулеза',
    label: 'Признаки туберкулеза',
  },
  {
    value: 'Полость в легком',
    label: 'Полость в легком',
  },
  {
    value: 'Признаки мицетомы',
    label: 'Признаки мицетомы',
  },
  {
    value: 'Множественные кисты',
    label: 'Множественные кисты',
  },
  {
    value: 'Ретенционная киста',
    label: 'Ретенционная киста',
  },
  {
    value: 'Диссеминированный процесс',
    label: 'Диссеминированный процесс',
  },
  {
    value: 'Симптом «дерева в почках»',
    label: 'Симптом «дерева в почках»',
  },
  {
    value: 'Центрилобулярные очаги',
    label: 'Центрилобулярные очаги',
  },
  {
    value: 'Типичная ОИП',
    label: 'Типичная ОИП',
  },
  {
    value: 'Интерстициальные неуточненные изменения с фиброзированием',
    label: 'Интерстициальные неуточненные изменения с фиброзированием',
  },
  {
    value: 'Интерстициальные изменения неуточненные',
    label: 'Интерстициальные изменения неуточненные',
  },
  {
    value: 'Бронхоэктазы',
    label: 'Бронхоэктазы',
  },
  {
    value: 'Признаки венозного застоя',
    label: 'Признаки венозного застоя',
  },
  {
    value: 'Гидроторакс',
    label: 'Гидроторакс',
  },
  {
    value: 'Пневмоторакс',
    label: 'Пневмоторакс',
  },
  {
    value: 'Плевральные бляшки',
    label: 'Плевральные бляшки',
  },
  {
    value: 'Образования плевры',
    label: 'Образования плевры',
  },
  {
    value: 'Внтригрудная лимфаденопатия',
    label: 'Внтригрудная лимфаденопатия',
  },
  {
    value: 'Образование средостения',
    label: 'Образование средостения',
  },
  {
    value: 'ГПОД',
    label: 'ГПОД',
  },
  {
    value: 'Кальцинация коронарных артерий',
    label: 'Кальцинация коронарных артерий',
  },
  {
    value: 'Аневризма аорты',
    label: 'Аневризма аорты',
  },
  {
    value: 'Расширение легочных артерий',
    label: 'Расширение легочных артерий',
  },
  {
    value: 'Гидроперикард',
    label: 'Гидроперикард',
  },
  {
    value: 'Узлы щитовидной железы',
    label: 'Узлы щитовидной железы',
  },
  {
    value: 'Образование молочной железы',
    label: 'Образование молочной железы',
  },
  {
    value: 'Образование надпочечников',
    label: 'Образование надпочечников',
  },
  {
    value: 'Образования печени',
    label: 'Образования печени',
  },
];

const RESULTS_OF_REVIEW = [
  {
    value: 'Совпадение',
    label: 'Совпадение',
  },
  {
    value: 'Присуствуют разночтения',
    label: 'Присуствуют разночтения',
  },
];

const REASONS_FOR_DIFFERENCE = [
  {
    value: 'Пропущен очаг/очаги',
    label: 'Пропущен очаг/очаги',
  },
  {
    value: 'Разночтения размеров более 1 мм',
    label: 'Разночтения размеров более 1 мм',
  },
  {
    value: 'Пропущена дополнительная находка',
    label: 'Пропущена дополнительная находка',
  },
];
//Функция отправки даннных
const sendData = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${URL}, статус ошибки ${response}`);
  }
  return await response.json();
};
const ResultsFromComponent: React.FC<IExaminationResults> = ({
  additional_inf,
  additional_inf_1,
  benign_signs,
  body_part_examined,
  dicom_id,
  expert_report,
  expert_required,
  lung_rads,
  second_report,
  size_of_finding,
  type_of_nodule,
  volume,
}) => {
  //localStorage.getItem('formSendData');
  //Закрытие по кнопке Close
  const { hide } = useModal();
  const handleClose = () => {
    hide();
  };

  //INPUTS
  const [AdditionalInf1, setAdditionalInf1] = useState(['']);

  //SELECTS
  const [lungRads, setLungRads] = useLocalStorage('lungRads', ['']);
  const [lungPosition, setLungPosition] = useState(['']);
  const [beningType, setBeningType] = useState(['']);
  const [noduleType, setNoduleType] = useState(['']);
  const [additionalInf, setAdditionalInf] = useState(['']);
  const [resultsRewiew, setResultsRewiew] = useState(['']);
  const [reasonDiff, setReasonDiff] = useState(['']);

  //CHECKBOX
  const [expertRequired, setExpertRequired] = useState(false);

  //HANDLECHANGE

  //additionalInf
  const handleChange = value => {
    //console.log('value:', value);
    setAdditionalInf(value);
  };

  //Добавление и удаление очага
  const [formFields, setFormFields] = useLocalStorage('formFields', [
    {
      lung_position: '',
      type_of_nodule: '',
      size_of_finding: '',
      volume: '',
      benign_signs: '',
      local: '',
    },
  ]);
  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };
  const handleSelectChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const data = [...formFields];
    if (event.target.tagName === 'SELECT') {
      data[index][event.target.name] =
        event.target.value[event.target.value].value;
    } else {
      data[index][event.target.name] = event.target.value;
    }
    setFormFields(data);
  };

  //lungPosition Работает
  const handleLungPositionChange = selectedOption => {
    setLungPosition(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };
  const addFields = () => {
    const object = {
      lung_position: '',
      type_of_nodule: '',
      size_of_finding: '',
      volume: '',
      benign_signs: '',
      local: '',
    };
    setFormFields([...formFields, object]);
  };
  const removeFields = index => {
    const data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  //Дублируемый submit для отправки данных динамической формы
  const submit = e => {
    e.preventDefault();
    console.log(`Объект:`, formFields);
    const postForm = JSON.stringify(formFields);
    console.log(`json в postForm:`, postForm);
    const max = 20000;
    const smid = Math.floor(Math.random() * max);
    /*sendData(
      'http://93.100.197.241:5088/sql',
      `INSERT INTO testReport(report_id,radiologist_id,therapist_id, patient_id,research_id, body_of_report) VALUES (${smid}, 126645561,126645561, 10277315, 1, '${postForm}' )`
    );*/
  };

  //Отправка всей формы ТЕСТ

  const [state, setState] = useState<IExaminationResults>({
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

  const onFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value: typeof state[keyof typeof state] = event.target.value;
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    }
    setState({ ...state, [event.target.id]: value });
  };
  //Основная отправка

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.clear();
    console.log(objectToSend);
    console.log(Object.assign(result, formFields));
    alert('Данные были отправлены');
    handleClose();
    //console.log(JSON.stringify(objectToSend));
    const max = 20000;
    const smid = Math.floor(Math.random() * max);
    sendData(
      'http://93.100.197.241:5088/sql',
      `INSERT INTO testReport(report_id,radiologist_id,therapist_id, patient_id,research_id, body_of_report) VALUES (${smid}, 126645561,126645561, 10277315, 1, '${objectToSend}' )`
    );
  };

  //Добавление свойств в объект
  const formData = new FormData();
  formData.append('lung_rads', `${lungRads}`);
  formData.append('additional_inf', `${additionalInf}`);
  formData.append('additional_inf_1', `${AdditionalInf1}`);
  formData.append('expert_required', `${expertRequired}`);
  formData.append('second_report', `${resultsRewiew}`);
  formData.append('expert_report', `${reasonDiff}`);

  const result = Object.fromEntries(
    [...formData].map(([key, value]) => [
      key,
      key === 'lung_rads' ? +value : value,
    ])
  );
  const objectToSend = JSON.stringify(Object.assign(result, formFields));
  const handleSubmit = () => {
    //localStorage.setItem('formSendData', objectToSend);
  };

  return (
    <div className="pb-20">
      <form className="form" id="form" onSubmit={onSubmit}>
        <div className="add-remove-element" hidden={false}>
          {formFields.map((form, index) => {
            return (
              <div
                key={index}
                className="p-4 my-3 rounded bg-secondary-dark border-secondary-primary"
              >
                <table className="w-full text-white">
                  <tbody>
                    <tr>
                      <td>
                        <div className="my-1 text-xl font-bold underline">
                          Очаг № {index + 1}
                        </div>
                      </td>
                    </tr>
                    <tr className="lung-position__choice">
                      <td>
                        <label htmlFor="lung_position">
                          Выберите положение легкого:
                        </label>
                        <Select
                          id="lung_position"
                          className="lung-position text-white mb-2"
                          isClearable={false}
                          value={lungPosition}
                          onChange={value => {
                            setLungPosition([value.value]);
                          }}
                          options={LUNG_POSITION}
                          placeholder="Выберите элемент"
                        />
                      </td>
                    </tr>
                    <tr className="number__of-nodule">
                      <td>
                        <label htmlFor="local">Локализация очага:</label>
                        <Input
                          type="text"
                          id="local"
                          name="local"
                          className="mb-2"
                          label={undefined}
                          value={form.local}
                          onChange={event => handleFormChange(event, index)}
                          onFocus={undefined}
                          autoFocus={undefined}
                          onKeyPress={undefined}
                          onKeyDown={undefined}
                          readOnly={undefined}
                          disabled={false}
                        />
                      </td>
                    </tr>
                    <tr className="type__of-nodule">
                      <td>
                        <label htmlFor="type_of_nodule">Тип очага:</label>
                        <Select
                          id="type_of_nodule"
                          className="text-white mb-2"
                          isClearable={false}
                          value={noduleType}
                          onChange={value => {
                            setNoduleType([value.value]);
                          }}
                          options={TYPE_OF_NODULE}
                          placeholder="Выберите элемент"
                        />
                      </td>
                    </tr>
                    <tr className="size__of-finding">
                      <td>
                        <label htmlFor="size_of_finding">
                          Размер очага в мм:
                        </label>
                        <Input
                          type="text"
                          id="size_of_finding"
                          name="size_of_finding"
                          className="text-white mb-2"
                          label={undefined}
                          value={form.size_of_finding}
                          onChange={event => handleFormChange(event, index)}
                          onFocus={undefined}
                          autoFocus={undefined}
                          onKeyPress={undefined}
                          onKeyDown={undefined}
                          readOnly={undefined}
                          disabled={undefined}
                        />
                      </td>
                    </tr>
                    <tr className="volume__of-nodule">
                      <td>
                        <label htmlFor="volume">
                          Объём в мм<sup>3</sup>:
                        </label>
                        <Input
                          type="text"
                          id="volume"
                          name="volume"
                          className="text-white mb-2"
                          label={undefined}
                          value={form.volume}
                          onChange={event => handleFormChange(event, index)}
                          onFocus={undefined}
                          autoFocus={undefined}
                          onKeyPress={undefined}
                          onKeyDown={undefined}
                          readOnly={undefined}
                          disabled={undefined}
                        />
                      </td>
                    </tr>
                    <tr className="bening__signs">
                      <td>
                        <label htmlFor="benign_signs">
                          Признаки доброкачественности:
                        </label>
                        <Select
                          id="benign_signs"
                          className="text-white mb-2"
                          isClearable={false}
                          value={beningType}
                          onChange={value => {
                            setBeningType([value.value]);
                          }}
                          options={TYPE_OF_BENING_SIGNS}
                          placeholder="Выберите элемент"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Button
                  onClick={() => removeFields(index)}
                  variant="outlined"
                  size="initial"
                  color="black"
                  border="secondary"
                  className="p-2"
                  startIcon={undefined}
                  endIcon={undefined}
                  name={undefined}
                >
                  Удалить очаг
                </Button>
              </div>
            );
          })}
          <Button
            onClick={addFields}
            className="flex justify-end my-3 ml-4"
            startIcon={undefined}
            endIcon={undefined}
            name={undefined}
            color="primary"
          >
            Добавить очаг
          </Button>
        </div>
        <div>
          <table className="w-full text-white">
            <tbody>
              <tr className="lung__rads-11">
                <td>
                  <label>Категория Lung-RADS 1.1: </label>
                  <Select
                    id="lung_rads"
                    className="mb-2"
                    isClearable={false}
                    value={lungRads}
                    onChange={value => {
                      setLungRads([value.value]);
                    }}
                    options={TYPE_OF_LUNG_RADS}
                    placeholder="Выберите элемент"
                  ></Select>
                </td>
              </tr>
              <tr className="additional__inf">
                <td>
                  <label>Дополнительные находки (S): </label>
                  <Select
                    isMulti={true}
                    id="additional_inf"
                    className="mb-2"
                    isClearable={true}
                    value={additionalInf}
                    onChange={handleChange}
                    options={TYPE_OF_ADDITIONAL_INF}
                    placeholder="Выберите элемент"
                  />
                </td>
              </tr>
              <tr className="additional__inf-1">
                <td>
                  <label>Другие дополнительные находки (S): </label>
                  <Input
                    id="additional_inf_1"
                    className="mb-2"
                    label={undefined}
                    value={AdditionalInf1}
                    onChange={e => setAdditionalInf1(e.target.value)}
                    onFocus={undefined}
                    autoFocus={undefined}
                    onKeyPress={undefined}
                    onKeyDown={undefined}
                    readOnly={undefined}
                    disabled={undefined}
                  ></Input>
                </td>
              </tr>
              <tr className="flex justify-center p-4 rounded bg-secondary-dark border-secondary-primary">
                <th>
                  <label htmlFor="">
                    <input
                      id="expert-required"
                      type="checkbox"
                      className="expert-required"
                      checked={expertRequired}
                      onChange={event =>
                        setExpertRequired(event.target.checked)
                      }
                    ></input>
                    Необходимость экспертного анализа:
                  </label>
                </th>
              </tr>
              <tr className="results__second-review">
                <td colSpan={2}>
                  <label htmlFor="second_report">
                    Результаты второго пересмотра:{' '}
                  </label>
                  <Select
                    id="second_report"
                    className="mb-1"
                    isClearable={false}
                    value={resultsRewiew}
                    onChange={value => {
                      setResultsRewiew([value.value]);
                      //console.log(value);
                    }}
                    options={RESULTS_OF_REVIEW}
                    placeholder="Выберите элемент"
                  />
                </td>
              </tr>
              <tr className="reason__difference">
                <td colSpan={2}>
                  <label htmlFor="expert_report">Причины разночтения: </label>
                  <Select
                    id="expert_report"
                    className="mb-2"
                    isClearable={false}
                    value={reasonDiff}
                    onChange={value => {
                      setReasonDiff([value.value]);
                      //console.log(value);
                    }}
                    options={REASONS_FOR_DIFFERENCE}
                    placeholder="Выберите элемент"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
      <div className="flex justify-end">
        <Button
          data-cy="cancel-btn"
          variant="outlined"
          size="initial"
          color="black"
          border="secondary"
          className="p-2"
          onClick={handleClose}
          startIcon={undefined}
          endIcon={undefined}
          name={undefined}
        >
          {'Закрыть'}
        </Button>
        <Button
          className="ml-2"
          onClick={onSubmit}
          color="primary"
          data-cy="download-btn"
          startIcon={undefined}
          endIcon={undefined}
          name={undefined}
        >
          {'Отправить'}
        </Button>
        {/*<Button
          className="ml-2"
          onClick={submit}
          color="secondary"
          data-cy="download-btn"
          startIcon={undefined}
          endIcon={undefined}
          name={undefined}
        >
          {'Сохранить'}
                  </Button>*/}
        <Button
          className="ml-2"
          onClick={handleSubmit}
          color="secondary"
          data-cy="download-btn"
          startIcon={undefined}
          endIcon={undefined}
          name={undefined}
        >
          {'Сохранить'}
        </Button>
      </div>
    </div>
  );
};

export default ResultsFromComponent;
