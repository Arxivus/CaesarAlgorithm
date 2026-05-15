export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '400px',
    boxShadow: 'none',
    border: '1px solid black',
    fontSize: '16px',
    '&:hover': {
        border: '1px solid rgb(210, 159, 96)'
    }, 
    borderRadius: '8px'
  }),

  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.width || '400px',
    borderColor: state.isFocused 
    ? '2px solid rgb(210, 159, 96)' 
    : state.isSelected ? '1px solid rgb(210, 159, 96)': '1px solid rgb(210, 159, 96)',
  }),
  
  option: (provided, state) => ({
    ...provided,
    color: 'black',
    fontSize: '16px',
    backgroundColor: state.isSelected
      ? 'white'           
      : state.isFocused
      ? 'rgb(239, 173, 32)'   
      : 'white',        
  })
};