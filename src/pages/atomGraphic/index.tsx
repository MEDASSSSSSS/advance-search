import { Graph, Cell, Shape, Markup } from '@antv/x6';
import { useEffect, useState } from 'react';
import styles from './index.less';
import TemplateNode from './Library/templateNode';
import ExpandChidrenPort from './Library/expandChidrenPort';
import PropertyPort from './Library/propertyPort';
import '@antv/x6-react-shape';
import ReactDOM from 'react-dom';
import { LINE_HEIGHT, NODE_BASE_HEIGHT, NODE_WIDTH } from './Library/util';
import testData from './testData.json';
import GraphicContext from './context';
import {useLocalReducer} from './store/useLocalReducer';
import CustomPropertyModal from './Library/customPropertyModal';

Graph.registerPortLayout(
  'propertyPortPosition',
  (portsPositionArgs) => {
    return portsPositionArgs.map((_, index) => {
      return {
        position: {
          x: 0,
          y: (index + 1) * LINE_HEIGHT,
        },
        angle: 0,
      };
    });
  },
  true,
);

function getBaseNodeOption(options?: any) {
  return {
    shape: 'react-shape',
    portMarkup: [Markup.getForeignObjectMarkup()],
    ports: {
      groups: {
        expandChildren: {
          position: [0,0],
          attrs: {
            fo: {
              width: 10,
              height: 10,
              x: 5,
              y: 5,
            },
          },
        },
        propertyPort: {
          attrs: {
            fo: {
              width: 300,
              height: LINE_HEIGHT,
            },
          },
          position: 'propertyPortPosition',
        },
      },
    },
    ...(options || {}),
  };
}

export default function AtomGraphic() {
    const [state, useDispatch] = useLocalReducer();
    // const [graph, setGraph] = useState<any>(null);
  useEffect(() => {
    const graph = new Graph({
      container: document.getElementById('atom-container')!,
      grid: true,
      onPortRendered(args) {
        const selectors = args.contentSelectors;
        const container = selectors && selectors.foContent;
        const {
          port: { group },
        } = args;
        if (container) {
          switch (group) {
            case 'expandChildren':
              ReactDOM.render(
                <ExpandChidrenPort className="my-port" {...args} />,
                container,
              );
              return;
            case 'propertyPort':
              ReactDOM.render(
                <PropertyPort {...args} graph={graph} />,
                container,
              );
              return;
          }
          return;
        }
        return args.contentContainer;
      },
    });
    useDispatch('common', {graph})
    // setGraph(graph);

    Promise.resolve(testData).then((data) => {
      const cells: Cell[] = [];
      const item = data[0];
      if (item.shape === 'edge') {
        // cells.push(graph.createEdge(item))
      } else {
        const {
          shape,
          width,
          position,
          ports,
          properties,
          chidrenNodeIds,
          ...rest
        } = item;
        const items = properties?.map((property) => ({
          id: `${item.id}-${property.code}`,
          group: 'propertyPort',
          attrs: {
            data: {
              name: property.name,
              type: property.type,
            },
          },
        })) || [] as any[];
        if (chidrenNodeIds?.length) {
          items.unshift(
            {
              id: `${item.id}-expandChildren`,
              group: 'expandChildren',
            },
          );
        }
        const baseReactItem = getBaseNodeOption({
            component:(
                <TemplateNode
                  data={{ shape, width, position, ...rest }}
                  graph={graph}
                />
              ),
            width: NODE_WIDTH,
            height: NODE_BASE_HEIGHT + properties?.length * LINE_HEIGHT
        });
        baseReactItem.ports.items = items;
        cells.push(graph.addNode(baseReactItem));
      }
      graph.resetCells(cells);
      graph.zoomToFit({ padding: 10, maxScale: 1 });
    });
  }, []);
  console.log('Graphic render', state, useDispatch);
  
  return (
      <GraphicContext.Provider value={{state, useDispatch}}>
        <div className={styles.wrapper}>
            <div
                id="atom-container"
                style={{ minWidth: '100%', minHeight: '100%' }}
                className={styles['atom-container']}
            ></div>
        </div>
        <TemplateNode
            data={{label:'test child',id:'testId' }}
            node={{ports:{items:[]},id:'testNodeId'}}
            graph={state.common.graph}
        />
        <CustomPropertyModal/>
     </GraphicContext.Provider>
    
  );
}
