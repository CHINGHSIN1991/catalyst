
export function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, state: any, setState: (state: any) => void) {
  // console.log({ ...state, [e.target.name]: e.target.value });
  setState({ ...state, [e.target.name]: e.target.value })
}