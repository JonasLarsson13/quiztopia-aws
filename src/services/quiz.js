import { nanoid } from "nanoid";
import { db } from "./db.js";

export const createQuestion = async (questionData, quizId) => {
  const questionId = nanoid();

  const questionItem = {
    quizId: quizId,
    questionId: questionId,
    question: questionData.question,
    answer: questionData.answer,
  };

  const questionParams = {
    TableName: "Questions",
    Item: questionItem,
  };

  await db.put(questionParams).promise();
};
