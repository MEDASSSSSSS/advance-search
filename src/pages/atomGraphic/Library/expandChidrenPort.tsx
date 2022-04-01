import React from "react";
import { ReactShape } from '@antv/x6-react-shape';
import styles from './expandChidrenPort.less';

export default class ExpandChidrenPort extends React.Component<{ node?: ReactShape; data: any; graph: any }> {
    constructor(props){
        super(props);
        
    }   
    shouldComponentUpdate() {
        const node = this.props.node
        if (node) {
          if (node.hasChanged('data')) {
            return true
          }
        }
        return false
      }
    render(){
        return (<div className={styles.icon}>
           +
        </div>)
    }
}