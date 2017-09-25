import _ from 'underscore';

export function generate(lessonQuestionData, studentSessionData, modifications) {
  return [];
}

export function generateConceptResult(questionData, studentSubmission) {
  return {
    concept_uid: 'lessons-placeholder',
    question_type: 'lessons-slide',
    metadata: {
      correct: 1,
      directions: questionData.prompt,
      prompt: questionData.prompt,
      answer: studentSubmission.data,
      attemptNumber: 1,
    },
  };
}

export function generateConceptResultForQuestion(questionData, studentSubmissions) {
  return _.mapObject(studentSubmissions, (submission, studentID) => generateConceptResult(questionData, submission));
}

export function generateConceptResultsForAllQuestions(questionsData, studentSubmissionsData) {
  return _.mapObject(studentSubmissionsData, (questionSubmissions, questionID) => {
    return generateConceptResultForQuestion(questionsData[questionID].data.play, questionSubmissions);
  })
}