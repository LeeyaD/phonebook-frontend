import { useNavigate } from 'react-router-dom'

function Contact({ contact, handleDelete }) {
  const navigate = useNavigate()

  const deleteContact = (event) => {
    handleDelete(event)
    navigate('/contacts')
  }


  return (
    <div className="contact">
      {contact?.name} {contact?.number}
      <button onClick={deleteContact} data-id={contact?.id}>delete</button>
    </div>
  )
}

export default Contact