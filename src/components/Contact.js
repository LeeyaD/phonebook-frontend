function Contact({ contact, handleDelete }) {
  return (
    <li className="contact">
      {contact.name} {contact.number}
      <button onClick={handleDelete} data-id={contact.id}>delete</button>
    </li>
  )
}

export default Contact