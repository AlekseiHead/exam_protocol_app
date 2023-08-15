import { CommandsManager } from '../../classes';
import { ExtensionManager } from '../../extensions';
import { PubSubService } from '../_shared/pubSubServiceInterface';
import { IExaminationResults } from './examinationResults';

const EVENTS = {};

class MedicalExaminationService extends PubSubService {
  public static REGISTRATION = {
    name: 'medicalExaminationService',
    altName: 'MedicalExaminationService',
    create: ({ commandsManager }) => {
      return new MedicalExaminationService(commandsManager);
    },
  };
  _commandsManager: CommandsManager;
  extensionManager: ExtensionManager;
  static write: any;

  constructor(commandsManager: CommandsManager) {
    super(EVENTS);
    this._commandsManager = commandsManager;
  }

  public init(extensionManager: ExtensionManager): void {
    this.extensionManager = extensionManager;
  }

  async read() {
    const examinationResult: IExaminationResults = {
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
    };
    return examinationResult;
  }

  async write(examinationResult: IExaminationResults) {
    const URL = 'https://jsonplaceholder.typicode.com/posts';
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examinationResult),
    });
    if (!response.ok) {
      throw new Error(`Ошибка по адесу ${URL}, статус ошибки ${response}`);
    }
    return await response.json();
  }
  /* async function sendDataToServer(data) {
    const url = 'https://example.com/api/data';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to send data to server.');
      }
    } catch (error) {
      console.error(error);
    }
  } */
}

console.log('Успех:', JSON.stringify(JSON));

export default MedicalExaminationService;
