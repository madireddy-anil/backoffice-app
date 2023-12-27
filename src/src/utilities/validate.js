export default function validate(type, value) {
  switch (type) {
    case 'PASSWORD_REPEAT':
      if (value.password === value.confirmPassword) {
        return {
          isValid: true,
          message: '',
        }
      }
      return {
        isValid: false,
        message: 'Password does not match',
      }

    default:
      return {
        isValid: true,
      }
  }
}
