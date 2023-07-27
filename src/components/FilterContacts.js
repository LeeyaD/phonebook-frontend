function FilterContacts({ state, eventHandler }) {
  return (
    <div>
      filter shown with <input value={state} onChange={eventHandler}/>
    </div>
  )
}

export default FilterContacts