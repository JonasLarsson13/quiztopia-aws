export const validateAuthInputs = (body, isLogin) => {
  const letterPattern = /^[A-Za-zåäöÅÄÖ]+$/;

  if (!body?.username) {
    return "Username is required";
  }

  if (
    body?.username.length < 2 ||
    body?.username.length > 26 ||
    !letterPattern.test(body?.username)
  ) {
    return "Username must be between 2 and 26 characters and contain only letters";
  }

  const minLength = 8;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const digitRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+{}[\]|\:";'<>?,./]/;

  if (body?.password.length < minLength) {
    return "Password is too short, it must be at least 8 characters";
  }

  if (!isLogin) {
    if (
      !uppercaseRegex.test(body?.password) ||
      !lowercaseRegex.test(body?.password) ||
      !digitRegex.test(body?.password) ||
      !specialCharRegex.test(body?.password)
    ) {
      return (
        "Password must meet the following criteria:\n" +
        "- Minimum length of 8 characters\n" +
        "- At least one uppercase letter\n" +
        "- At least one lowercase letter\n" +
        "- At least one digit\n" +
        "- At least one special character (!@#$%^&*()_+{}[]|:\";'<>?,./)"
      );
    }
  }

  return null;
};

export const validateQuizName = (name) => {
  if (!name) return "A quiz name is required";

  if (name.length < 2 || name.length > 30) {
    return "Quiz name must be between 2 and 30 characters";
  }

  return null;
};

export const validateQuestion = (input) => {
  if (!input.question) return "A question is required";
  if (input.question.length < 2 || input.question.length > 100) {
    return "Question must be between 2 and 100 characters";
  }

  if (!input.answer) return "A answer is required";
  if (input.answer.length < 1 || input.answer.length > 100) {
    return "Answer must be between 1 and 100 characters";
  }

  return null;
};

export const validatePoints = (points) => {
  if (!points || typeof points !== "number")
    return "You must insert points in numbers";
};
