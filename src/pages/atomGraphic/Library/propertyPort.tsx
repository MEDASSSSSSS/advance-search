import React from 'react';
import { ReactShape } from '@antv/x6-react-shape';
import { Node, Markup } from '@antv/x6';
import styles from './propertyPort.less';
import { PlusSquareOutlined } from '@ant-design/icons';
import TemplateNode from './templateNode';
import { LINE_HEIGHT } from './util';

const testData = ['a_number', 'b_interge', 'c_boolean', 'd_object'];

export default class PropertyPort extends React.Component<{
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
      if (node.hasChanged('data')) {
        return true;
      }
    }
    return false;
  }
  render() {
    const {
      port: { attrs, id: portId },
      node,
      graph,
      ...rest
    } = this.props as any;
    return (
      <div className={styles.propertyPortBox}>
        <PlusSquareOutlined
          onClick={() => {
            const newNode = graph.addNode({
              height: 156,
              width: 300,
              shape: 'react-shape',
              component: (
                <TemplateNode
                  data={{
                    properties: [{ name: 'test', type: 'testType' }],
                    label: '复杂对象',
                  }}
                  graph={graph}
                />
              ),
              portMarkup: [Markup.getForeignObjectMarkup()],
              ports: {
                groups: {
                  propertyPort: {
                    attrs: {
                      fo: {
                        width: 300,
                        height: LINE_HEIGHT,
                        // magnet: 'true',
                      },
                    },
                    position: 'propertyPortPosition',
                  },
                },
              },
            });
            newNode.addPorts(
              testData.map((ele, index) => {
                const portData = ele.split('_');
                return {
                  id: `${newNode.id}-${index + 1}`,
                  group: 'propertyPort',
                  attrs: { data: { name: portData[0], type: portData[1] } },
                };
              }),
            );
            graph.addEdge({
              shape: 'edge', // 指定使用何种图形，默认值为 'edge',
              source: {
                cell: node,
                port: portId,
                anchor: {
                  name: 'midSide',
                  args: {
                    direction: 'H',
                    rotate: true,
                  },
                },
                connectionPoint: {
                  name: 'boundary',
                },
              },
              target: {
                cell: newNode,
                anchor: { name: 'nodeCenter' },
              },
            });
          }}
          className={styles.toggleBtn}
        />
        <div className={styles.name}>{attrs?.data.name}</div>
        <div className={styles.type}>{attrs?.data.type}</div>
      </div>
    );
  }
}
