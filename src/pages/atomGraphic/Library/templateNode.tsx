import React from 'react';
import { ReactShape } from '@antv/x6-react-shape';
import styles from './templateNode.less';
import { Button } from 'antd';
import { LINE_HEIGHT } from './util';
import GraphicContext from '../context';

export default class TemplateNode extends React.Component<{
  node?: ReactShape;
  data: any;
  graph: any;
}> {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate() {
    const node = this.props.node;
    if (node) {
      if (node.hasChanged && node.hasChanged('ports')) {
        return true;
      }
    }

    return false;
  }
  render() {
    const { label, id } = this.props.data || {};
    const { ports, id: nodeId } = this.props.node || {};
    console.log('render',label, this.context,);

    return (
      <GraphicContext.Consumer>
        {value => (<>
          <div className={styles.nodeBox}>
            <div className={styles.titleBox}>{label}</div>
            <ul className={styles.portsList}>
              {ports.items
                .filter((ele) => ele.group === 'propertyPort')
                ?.map((port: any) => (
                  <li key={port.id} className={styles.propertyLi}>
                    {/* <div className={styles.name}>{port.attrs?.portNameLabel.text}</div>
                      <div className={styles.type}>{port.attrs?.portTypeLabel.text}</div> */}
                  </li>
                ))}
            </ul>
            <Button
              onClick={() => {
                console.log('click context', value);
                
                const curPropertyPorts = this.props.node?.getPortsByGroup(
                  'propertyPort',
                );
                this.props.node.addPort({
                  id: `${id ? id : nodeId}-${curPropertyPorts?.length + 1 || 0}`,
                  group: 'propertyPort',
                  attrs: {
                    data: { name: 'testName', type: 'testType' },
                  },
                });
                const size = this.props.node?.getProp<number>('size') || {};
                const { height } = size || ({} as any);
                this.props.node?.setProp('size', {
                  ...size,
                  height: height + LINE_HEIGHT,
                });
              }}
            >
              添加自定义属性
            </Button>
          </div>
        </>)}
      </GraphicContext.Consumer>
      
    );
  }
}

TemplateNode.contextType  = GraphicContext
