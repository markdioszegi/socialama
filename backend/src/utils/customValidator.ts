export const validateUsername = (username: string) => {
  if (username.length < 3 || username.length > 32) return false
  return /^[a-zA-Z0-9]*$/.exec(username)
}
