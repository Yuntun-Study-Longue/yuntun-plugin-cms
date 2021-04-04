import React, {Component} from 'react';
import Breadcrumb from 'sub-antd/lib/breadcrumb';

import './navigator.scss';

export default class Navigator extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className='navigator'>
                    <Breadcrumb separator=">>">
                        {this.props.paths.map((item,i)=>{
                            if(i==this.props.paths.length-1){
                                return <Breadcrumb.Item key={i}  className="current-path">{item.name}</Breadcrumb.Item>
                            }else{
                                if(item.url){
                                    return <Breadcrumb.Item key={i} href={item.url}>{item.name}</Breadcrumb.Item>;
                                }else{
                                    return <Breadcrumb.Item key={i} href="javascript:void(0)">{item.name}</Breadcrumb.Item>;
                                }
                            }
                        })} 
                    </Breadcrumb>
            </div>
        );
    }
}
