export default function EmailContent({ email }) {
  return email && <iframe title="Email content" src="#" srcDoc={email.Content.Body} frameBorder="0"></iframe>;
}
