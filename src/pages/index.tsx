import { useEffect } from 'react';
import styles from './index.less';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import CamundaModdleExtension from 'camunda-bpmn-moddle/lib';
import CamundaModdle from 'camunda-bpmn-moddle/resources/camunda';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import BpmnPropertiesPanelModule from 'bpmn-js-properties-panel/lib';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

const diagramXML = require('../../public/test.txt').default;

export default function IndexPage() {
  const initBpmn = async (viewer: any) => {
    if (!viewer) return;

    try {
      const { warnings } = await viewer.importXML('');
      console.log('rendered');
    } catch (err) {
      console.log('error rendering', err);
    }
  };

  useEffect(() => {
    // const viewer = new BpmnModeler({
    //   container: '.tmp-bpmn-container',
    //   keyboard: {
    //     bindTo: document,
    //   },
    //   additionalModules: [BpmnPropertiesPanelModule, propertiesProviderModule],
    //   moddleExtensions: {
    //     camunda: CamundaModdle,
    //   },
    //   propertiesPanel: {
    //     parent: '.tmp-bpmn-properties-container',
    //   },
    // });

    // initBpmn(viewer);
    // return () => {
    //   viewer.detach();
    // };
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={`tmp-bpmn-container ${styles.bpmnContainer}`}>test bpmn</div>
      <div
        className={`tmp-bpmn-properties-container ${styles.propertiesContainer}`}
      ></div>
    </div>
  );
}
