export const documentVersion = text => {
    if(text=='0'){
      return <div title='基线1.0'>基线1.0</div>;
    }
    else if(text=='1'){
      return <div title='基线2.0'>基线2.0</div>;
    }
    else if(text=='2'){
        return <div title='基线3.0'>基线3.0</div>;
      }
}
export const securityLevel = text => {
    if(text=='0'){
      return <div title='非M'>非M</div>;
    }
    else if(text=='1'){
      return <div title='JM'>JM</div>;
    }
    else if(text=='2'){
        return <div title='MM'>MM</div>;
     }
}
