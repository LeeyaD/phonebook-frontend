import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ContactForm = ({ createContact }) => {
  const navigate = useNavigate()
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addContact = (event) => {
    event.preventDefault()

    createContact({
      name: newName,
      number: newNumber,
    })

    navigate('/contacts')
  }

  return (
    <div className='formDiv'>
      <h2>Add a new contact</h2>

      <form onSubmit={addContact}>
        <div>
          name: <input id='name' value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input id='number' value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm