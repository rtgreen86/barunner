export const getPropertyByName = (props, propertyName, defaultValue) => props.find(prop => prop.name === propertyName) || defaultValue;

export const getPropertyValueByName = (props, propertyName, defaultValue) => getPropertyByName(props, propertyName, { value: defaultValue}).value;