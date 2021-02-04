import React, {Component, PropTypes} from 'react';
import RichTextEditor from 'react-rte';

 class AppRitchTextEditor extends Component {

  static propTypes = {
    onChange: ()=>{}
  };

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value === '' ? RichTextEditor.createEmptyValue() : RichTextEditor.createValueFromString(this.props.defaultValue, 'html'),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.state.value.toString('html')) {
      this.setState({
        defaultValue: nextProps.defaultValue ?
          RichTextEditor.createValueFromString(nextProps.defaultValue, 'html') :
          RichTextEditor.createEmptyValue()
      })

      if(nextProps.isLoadHtmlBody){
        this.setState({
          value: nextProps.defaultValue ?
            RichTextEditor.createValueFromString(nextProps.defaultValue, 'html') :
            RichTextEditor.createEmptyValue()
        })
      }
    }
  }

  

  


  state = {
    value: RichTextEditor.createEmptyValue()
    
  }

  onChange = (value) => {
    this.setState({value});
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(
        value.toString('html')
      );
    }
  };

  render () {
    return (
      <RichTextEditor
        value={this.state.value}
        defaultValue={this.state.defaultValue}
        onChange={this.onChange}
      />
    );
  }
}

export default AppRitchTextEditor;