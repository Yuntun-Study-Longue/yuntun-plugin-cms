export default [
    {
    title: 'ID',
    width:80,
    dataIndex: 'identifier',
    render: (text, record, index) => {
      if(!record.id){
        return <div id={'subhead-'+record.subhead}></div>;
      }
      return <div title={text+'-'+record.rownum}>{text+'-'+record.rownum}
        <span id={'subhead-'+record.subhead}></span>
      </div>
    }
  }, 
  {
    title: '',
    width:8,
    dataIndex: 'id',
    className:'status-td',
    render: (text, record, index) => {
      // if(this.props.changeDataId.indexOf(record.subhead)>-1){
      //   return <div className="status unsaved"></div>
      // }
      return <div className="status saved"></div>
    }
  }, 
  {
    title: '内容',
    width:710,
    dataIndex: 'content',
    render: (text, record, index) => {
      if(!record.id){
        return <div></div>;
      }
      let num=record.nodeType!=2?record.subhead+' ':'';
      return <div className="table-edit">
        {
          this.state.editTd==='content-'+index && record.nodeType!=2
          &&
          <div style={{ paddingLeft:(num.length*6+5)+'px'}}>
            <span style={{ position:'absolute',left:'8px',top:'5px',lineHeight:'28px'}}>{num}</span>
            <Input value={text || ''} 
          className="show-edit"
          onChange={(e)=>{this.inputChange(e.target.value,index,'content')}}
          ref={r=>this['content'+index+'Ref']=r}
          />
          </div>
        }
        {
          this.state.editTd!='content-'+index && record.nodeType!=2 &&
          <div title={text}>{num+(text || '')}</div>
        }
        {
          record.nodeType==2 &&
          <div className="edit-content" style={{'width':this.state.contW+'px'}} dangerouslySetInnerHTML={{ __html: record.body }}></div>
        }
        
        { this.state.editTd!='content-'+index && record.nodeType!=2 && <span className="icon-edit show-edit"
         onClick={this.showEdit.bind(this,index,'content','input')}></span>}

         { eidtWin==null && record.nodeType==2 && <span className="icon-edit show-edit"
         onClick={this.showWordEdit.bind(this,index,'content')}></span>}
          
      </div>;
    }
  }, 
  {
    title: '是否是需求',
    width:100,
    dataIndex: 'demandStatus',
    render: (text, record, index) => {
      if(!record.id){
        return <div></div>;
      }
      return <div className="table-edit">
        {
          this.state.editTd=='demandStatus-'+index
          ?
            <div className="show-edit">
              <Select
            value={text+''}
            style={{ width: 80 }}
            onChange={(val)=>{this.isDemandChange(val,index,'demandStatus')}}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
          </div>
          :
          <div title={text}>{text=='1'?'是':'否'}</div>
        }
        { this.state.editTd!='demandStatus-'+index 
        && 
        <span className="icon-edit show-edit"
        onClick={this.showEdit.bind(this,index,'demandStatus','select')}></span>}
      </div>;
    }
  },
  {
    title: '需求编号',
    width:100,
    dataIndex: 'requirementNumber',
    render: (text, record, index) => {
      if(!record.id){
        return <div></div>;
      }
      return <div title={text}>{record.demandStatus=='1'?text:''}</div>;
    }
  },
  {
    title: '编写说明',
    width:350,
    dataIndex: 'describe',
    render: (text, record, index) => {
      if(!record.id){
        return <div></div>;
      }
      return <div className="table-edit">
      {
        this.state.editTd=='describe-'+index
        ?
        <div>
          <Input value={text} type="textarea"
        className="describe-textarea show-edit"
        onChange={(e)=>{this.inputChange(e.target.value,index,'describe')}}
        ref={r=>this['describe'+index+'Ref']=r}
        />
        </div>
        :
        <div title={text}>{text}</div>
      }
      
      { this.state.editTd!='describe-'+index && <span className="icon-edit show-edit"
       onClick={this.showEdit.bind(this,index,'describe','input')}></span>}
    </div>;
    }
  },
  {
    title: '验证方法',
    width:150,
    dataIndex: 'validMethod',
    onFilter:(value, record)=>{
      let arr=[];
        for(let i=0;i<this.state.methodArr.length;i++){
          if(value.indexOf(this.state.methodArr[i].key)){
            arr.push(this.state.methodArr[i].label);
          }
        }
        return arr.join('，');
    },
    render: (text, record, index) => {
      if(!record.id){
        return <div></div>;
      }
      let label=this.getLabel(text);
      
      return <div className="table-edit">
        {
          this.state.editTd=='validMethod-'+index
          ?
            <div className="show-edit">
              <Select
            defaultValue=""
            value={text?text.split(','):undefined}
            multiple
            style={{ width: 130 }}
            onChange={(val)=>{this.multipleSelectChange(val,index,'validMethod')}}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {
              this.state.methodArr.map((item)=>{
              return <Option key={item.key} value={item.key}>{item.label}</Option>
              })
            }

          </Select>
          </div>
          :
          <div title={label}>{label}</div>
        }
        { this.state.editTd!='validMethod-'+index 
        && 
        <span className="icon-edit show-edit"
        onClick={this.showEdit.bind(this,index,'validMethod','select')}></span>}
      </div>;
    }
  },
  {
    title: '是否生成摘要',
    width:100,
    dataIndex: 'summaryStatus',
    render: (text, record, index) => {
      if(!record.id){
        return <div></div>;
      }
      return <div className="table-edit">
        {
          this.state.editTd=='summaryStatus-'+index
          ?
            <div className="show-edit">
              <Select
            value={text+''}
            style={{ width: 80 }}
            onChange={(val)=>{this.inputChange(val,index,'summaryStatus')}}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option key="1">是</Option>
            <Option key="0">否</Option>
          </Select>
          </div>
          :
          <div title={text}>{text=='1'?'是':'否'}</div>
        }
        { this.state.editTd!='summaryStatus-'+index 
        && 
        <span className="icon-edit show-edit"
        onClick={this.showEdit.bind(this,index,'summaryStatus','select')}></span>}
      </div>;
    }
  }
]