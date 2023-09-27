import { nanoid } from "nanoid";
import { db } from "./db.js";

export const createQuestion = async (questionData, quizId) => {
  const questionId = nanoid();

  const questionItem = {
    quizId: quizId,
    questionId: questionId,
    question: questionData.question,
    answer: questionData.answer,
    latitude: 59.270266,
    longitude: 15.186384,
  };

  const questionParams = {
    TableName: "Questions",
    Item: questionItem,
  };

  await db.put(questionParams).promise();
};

export const getQuiz = async (quizId) => {
  try {
    const params = {
      TableName: "Quizzes",
      Key: {
        quizId: quizId,
      },
    };

    const result = await db.get(params).promise();
    return result;
  } catch (error) {
    let message =
      error?.details?.message || error?.message || "Something went wrong";
    return sendResponse(400, { error: message });
  }
};
