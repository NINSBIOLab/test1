export default function UserRole() {
  let userData;
  fetch("http://localhost:5000/users")
    .then(res => res.json())
    .then(data => {
      userData = data
    })

  return userData;
}
