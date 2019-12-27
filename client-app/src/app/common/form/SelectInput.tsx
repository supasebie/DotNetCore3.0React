import React from 'react';
import { Form, Label, FormFieldProps, Select } from 'semantic-ui-react';
import { FieldRenderProps } from 'react-final-form';

interface IProps
  extends FieldRenderProps<string, HTMLSelectElement>,
    FormFieldProps {}

const SelectInput: React.FC<IProps> = ({
  input,
  width,
  options,
  placeholder,
  meta: { touched, error }
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <Select
        value={input.value}
        placeholder={placeholder}
        options={options}
        onChange={(e, data) => input.onChange(data.value)}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default SelectInput;
