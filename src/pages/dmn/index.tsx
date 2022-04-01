import { useEffect, useRef } from 'react';
import styles from './index.less';
// import BpmnModeler from 'bpmn-js/lib/Modeler';
// import CamundaModdleExtension from 'camunda-bpmn-moddle/lib';
// import CamundaModdle from 'camunda-bpmn-moddle/resources/camunda';
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
// import BpmnPropertiesPanelModule from 'bpmn-js-properties-panel/lib';
import DmnModeler from 'dmn-js/lib/Modeler';
import 'dmn-js/dist/assets/diagram-js.css';
import 'dmn-js/dist/assets/dmn-js-drd.css';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-decision-table-controls.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn.css';
import translate from './customTranslate';
import diagramXML from '../../../public/diagram.txt';

const CLASS_NAMES = {
  drd: 'dmn-icon-lasso-tool',
  decisionTable: 'dmn-icon-decision-table',
  literalExpression: 'dmn-icon-literal-expression'
} as any;

export default function IndexPage() {
  const tabsRef = useRef();
  const initDmn = async (viewer: any) => {
    if (!viewer) return;
    console.log('test',viewer);
    try {
      const { warnings } = await viewer.importXML('');
      console.log('rendered');
    } catch (err) {
      console.log('error rendering', err);
    }
  };

  useEffect(() => {
    const dmnModeler = new DmnModeler({
      container: '#canvas',
      literalExpression:{
        additionalModules: [
          translate
        ]
      },
      'decisionTable':{
        additionalModules: [
          translate
        ]
      },
      'drd':{
        additionalModules: [
          translate
        ]
      }
      
    });
    dmnModeler.on('views.changed', function(event) {
      console.log('views.changed')

      // get views from event
      const { views, activeView } = event;

      // clear tabs
      // tabsRef?.current?.empty();

      // create a new tab for each view
      views.forEach(function(v: any, idx) {

        const className = CLASS_NAMES[v.type];

        const tab = 
          <div className={`tab ${ v === activeView ? 'active' : ''}`} data-id={`${idx}`}>
            <span className={`${ className }`}></span>
            {v.element.name || v.element.id}
          </div>
       ;

        // tabsRef?.current?.append(tab);
      });
    });
    initDmn(dmnModeler)
    return () =>{
      dmnModeler.detach();
    }
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.dmnContainer} id='canvas'>test dmn</div>
      <div className="editor-tabs" ref={tabsRef}></div>
      {/* <div
        className={`tmp-cmn-properties-container ${styles.propertiesContainer}`}
      ></div> */}
    </div>
  );
}
