import { Link } from 'react-router-dom';

export default function EmailSummary({ email, onEmailClick }) {
  return (
    <Link className="email-summary" to={'/' + email.ID} onClick={onEmailClick(email)}>
      <span>{email.Content.Headers.Subject[0]}</span>
      <br />
      <span>{email.Content.Headers.To[0]}</span>
    </Link>
  );
}
